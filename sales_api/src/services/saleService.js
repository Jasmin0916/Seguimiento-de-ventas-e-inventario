const { saleModel } = require("../models/sale.model");
const { generateReceiptId } = require('../services/receiptService');
const productService = require('../services/productService');
const clientService = require('../services/clientService');
const employeeService = require('../services/employeeService');

class SaleService {
    async getAllSales() {
        return await saleModel.find({});
    }

    async createSale({ products, clientDni, receiptType }, employeeId, authToken) {
        const employee = await employeeService.getEmployeeById(employeeId, authToken);
        this.validateEmployee(employee);
        const clientInfo = await this.getClientInfo(clientDni, receiptType, authToken);

        let total = 0;
        const saleProducts = await this.validateProducts(products, total, authToken);
        
        const receiptId = await generateReceiptId();
        const newSale = this.createSaleDocument(receiptId, receiptType, saleProducts, clientInfo, total, employee);
        const savedSale = await newSale.save();

        await this.updateProductQuantities(saleProducts, authToken);
        return savedSale;
    }

    async getSaleById(id) {
        const sale = await saleModel.findById(id);
        if (!sale) throw new Error('Venta no encontrada');
        return sale;
    }

    async updateSale(id, { products, clientDni, receiptType }, employeeId, authToken) {
        const sale = await this.getSaleById(id);
        const clientInfo = await this.getClientInfo(clientDni, receiptType, authToken);

        let total = 0;
        const saleProducts = await this.validateProducts(products, total, authToken, sale.products);

        sale.receiptType = receiptType;
        sale.products = saleProducts;
        sale.client = clientInfo;
        sale.total = total;

        const updatedSale = await sale.save();
        await this.updateProductQuantities(saleProducts, authToken, sale.products);
        return updatedSale;
    }

    async deleteSale(id, authToken) {
        const sale = await this.getSaleById(id);
        await saleModel.findByIdAndDelete(id);
        await this.updateProductQuantitiesOnDelete(sale.products, authToken);
    }

    validateEmployee(employee) {
        if (!employee || !employee.firstName || !employee.lastName) {
            throw new Error('Información del empleado no válida');
        }
    }

    async getClientInfo(clientDni, receiptType, authToken) {
        let clientFirstName = '';
        let clientLastName = '';
        let clientDocument = clientDni;

        if (receiptType === 'DNI') {
            const client = await clientService.getClientByDni(clientDni, authToken);
            if (!client) {
                throw new Error('Cliente no encontrado, registre el cliente primero');
            }
            clientFirstName = client.firstNames;
            clientLastName = client.lastName;
        } else if (receiptType === 'Simple') {
            clientDocument = '11111111';
        } else {
            throw new Error('Tipo de boleta no válido');
        }

        return { clientDni: clientDocument, firstName: clientFirstName, lastName: clientLastName };
    }

    async validateProducts(products, total, authToken, existingProducts = []) {
        const saleProducts = [];

        for (const item of products) {
            const product = await productService.getProductById(item.productId, authToken);
            if (!product) {
                throw new Error(`Producto no encontrado: ${item.productId}`);
            }

            const existingQuantity = existingProducts.find(p => p.productId.equals(item.productId))?.quantity || 0;
            if (product.quantity + existingQuantity < item.quantity) {
                throw new Error(`Cantidad insuficiente en stock para el producto: ${product.name}`);
            }

            const subtotal = product.salePrice * item.quantity;
            total += subtotal;

            saleProducts.push({
                productId: product._id,
                quantity: item.quantity,
                name: product.name,
                salePrice: product.salePrice,
                subtotal
            });
        }

        return saleProducts;
    }

    createSaleDocument(receiptId, receiptType, saleProducts, clientInfo, total, employee) {
        return new saleModel({
            receiptId,
            receiptType,
            products: saleProducts,
            client: clientInfo,
            total,
            date: new Date(),
            employee: {
                id: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName
            }
        });
    }

    async updateProductQuantities(saleProducts, authToken, existingProducts = []) {
        await Promise.all(saleProducts.map(async (item) => {
            const product = await productService.getProductById(item.productId, authToken);
            const newQuantity = product.quantity - item.quantity + (existingProducts.find(p => p.productId.equals(item.productId))?.quantity || 0);
            await productService.updateProductQuantity(item.productId, newQuantity, authToken);
        }));
    }

    async updateProductQuantitiesOnDelete(products, authToken) {
        await Promise.all(products.map(async ({ productId, quantity }) => {
            const product = await productService.getProductById(productId, authToken);
            await productService.updateProductQuantity(productId, product.quantity + quantity, authToken);
        }));
    }
}

module.exports = new SaleService();
