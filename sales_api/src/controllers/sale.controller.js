const { saleModel } = require("../models/sale.model");
const { generateReceiptId } = require('../services/receiptService');
const productService = require('../services/productService');
const clientService = require('../services/clientService');
const employeeService = require('../services/employeeService');

// Obtener todas las ventas
const getSale = async (req, res) => {
    try {
        const sales = await saleModel.find({});
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
};

// Registrar una nueva venta
const createSale = async (req, res) => {
    try {
        const { products, clientDni, receiptType } = req.body;
        const token = req.headers['authorization']?.split(' ')[1];
        const employee = await employeeService.getEmployeeById(req.user.id, token);

        if (!employee || !employee.firstName || !employee.lastName) {
            return res.status(400).json({ error: 'Información del empleado no válida' });
        }

        let client = null;
        let clientFirstName = '';
        let clientLastName = '';

        if (receiptType === 'DNI') {
            client = await clientService.getClientByDni(clientDni, token);
            if (!client) {
                return res.status(404).json({ error: 'Cliente no encontrado, registre el cliente primero' });
            }
            clientFirstName = client.firstNames;
            clientLastName = client.lastName;
        } else if (receiptType === 'Simple') {
            clientDni = '11111111';
        } else {
            return res.status(400).json({ error: 'Tipo de boleta no válido' });
        }

        let total = 0;
        let saleProducts = [];

        for (const item of products) {
            const product = await productService.getProductById(item.productId, token);
            if (!product) {
                return res.status(404).json({ error: `Producto no encontrado: ${item.productId}` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ error: `Cantidad insuficiente en stock para el producto: ${product.name}` });
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

        const receiptId = await generateReceiptId();

        const newSale = new saleModel({
            receiptId,
            products: saleProducts,
            client: {
                clientDni,
                firstName: clientFirstName,
                lastName: clientLastName
            },
            total,
            date: new Date(),
            employee: {
                id: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName
            }
        });

        const data = await newSale.save();

        // Actualizar las cantidades de productos
        for (const item of saleProducts) {
            const product = await productService.getProductById(item.productId, token);
            await productService.updateProductQuantity(item.productId, product.quantity - item.quantity, token);
        }

        res.status(201).json(data);
    } catch (error) {
        console.error('Error registering sale:', error);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
}

// Obtener una venta por ID
const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await saleModel.findById(id);

        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        res.status(200).json(sale);
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).json({ error: 'Error al obtener la venta' });
    }
};

// Actualizar una venta - Solo para administradores
const updatedSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { products, clientDni, receiptType } = req.body;

        const sale = await saleModel.findById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const token = req.headers['authorization']?.split(' ')[1];
        const client = receiptType === 'DNI' ? await clientService.getClientByDni(clientDni, token) : null;
        if (receiptType === 'DNI' && !client) {
            return res.status(404).json({ error: 'Cliente no encontrado, registre el cliente primero' });
        }

        let total = 0;
        const saleProducts = await Promise.all(products.map(async ({ productId, quantity }) => {
            const product = await productService.getProductById(productId, token);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            if (product.quantity + sale.products.find(p => p.productId.equals(productId)).quantity < quantity) {
                throw new Error('Cantidad insuficiente en stock');
            }
            const subtotal = product.salePrice * quantity;
            total += subtotal;
            return {
                productId,
                quantity,
                name: product.name,
                salePrice: product.salePrice,
                subtotal
            };
        }));

        sale.products = saleProducts;
        sale.clientDni = clientDni || '11111111';
        sale.total = total;

        const updatedSale = await sale.save();

        await Promise.all(products.map(async ({ productId, quantity }) => {
            const product = await productService.getProductById(productId, token);
            await productService.updateProductQuantity(productId, product.quantity + sale.products.find(p => p.productId.equals(productId)).quantity - quantity, token);
        }));

        res.json(updatedSale);
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una venta - Solo para administradores
const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;

        const sale = await saleModel.findById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        await saleModel.findByIdAndDelete(id);

        const token = req.headers['authorization']?.split(' ')[1];
        await Promise.all(sale.products.map(async ({ productId, quantity }) => {
            const product = await productService.getProductById(productId, token);
            await productService.updateProductQuantity(productId, product.quantity + quantity, token);
        }));

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting sale:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSale, createSale, getSaleById, updatedSale, deleteSale };
