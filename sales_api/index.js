const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { saleModel } = require('./models');
const { authenticateToken, verifyRole } = require('../login_api/authMiddleware'); // Asegúrate de ajustar la ruta según sea necesario
const productService = require('./services/productService');
const clientService = require('./services/clientService');
const port = 8083;

const uri = "mongodb+srv://nodeJS:NodeJS4321@cluster0.wr9ipqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
    process.exit(1);
});

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.get('/', (req, res) => {
    res.send("I am alive Sales");
});

// Función para generar un nuevo ID de boleta
let receiptCounter = 0;
const generateReceiptId = () => {
    receiptCounter += 1;
    return `BOL-${receiptCounter.toString().padStart(9, '0')}`;
};

// Registrar una nueva venta
app.post('/sales', authenticateToken, async (req, res) => {
    try {
        const { products, clientDni, receiptType } = req.body;
        const employee = req.user;

        let client = null;
        if (receiptType === 'DNI') {
            client = await clientService.getClientByDni(clientDni);
            if (!client) {
                return res.status(404).json({ error: 'Cliente no encontrado, registre el cliente primero' });
            }
        } else if (receiptType === 'Simple') {
            clientDni = '11111111';
        } else {
            return res.status(400).json({ error: 'Tipo de boleta no válido' });
        }

        let total = 0;
        let saleProducts = [];

        for (const item of products) {
            const product = await productService.getProductById(item.productId);
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

        const receiptId = generateReceiptId();

        const newSale = new saleModel({
            receiptId,
            products: saleProducts,
            clientDni,
            total,
            employee: {
                id: employee.id,
                name: employee.name,
                lastName: employee.lastName
            }
        });

        const data = await newSale.save();

        for (const item of saleProducts) {
            const product = await productService.getProductById(item.productId);
            await productService.updateProductQuantity(item.productId, product.quantity - item.quantity);
        }

        res.status(201).json(data);
    } catch (error) {
        console.error('Error registering sale:', error);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
});

// Obtener todas las ventas
app.get('/sales', authenticateToken, async (req, res) => {
    try {
        const sales = await saleModel.find({});
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
});

// Obtener una venta por ID
app.get('/sales/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await saleModel.findById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(sale);
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).json({ error: 'Error al obtener la venta' });
    }
});

// Actualizar una venta - Solo para administradores
app.put('/sales/:id', authenticateToken, verifyRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { products, clientDni, receiptType } = req.body;

        const sale = await saleModel.findById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const client = receiptType === 'DNI' ? await clientService.getClientByDni(clientDni) : null;
        if (receiptType === 'DNI' && !client) {
            return res.status(404).json({ error: 'Cliente no encontrado, registre el cliente primero' });
        }

        let total = 0;
        const saleProducts = await Promise.all(products.map(async ({ productId, quantity }) => {
            const product = await productService.getProductById(productId);
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
            const product = await productService.getProductById(productId);
            await productService.updateProductQuantity(productId, product.quantity + sale.products.find(p => p.productId.equals(productId)).quantity - quantity);
        }));

        res.json(updatedSale);
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(500).json({ error: error.message });
    }
});

// Eliminar una venta - Solo para administradores
app.delete('/sales/:id', authenticateToken, verifyRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const sale = await saleModel.findById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        await saleModel.findByIdAndDelete(id);

        await Promise.all(sale.products.map(async ({ productId, quantity }) => {
            const product = await productService.getProductById(productId);
            await productService.updateProductQuantity(productId, product.quantity + quantity);
        }));

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting sale:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
