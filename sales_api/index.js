const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { saleModel } = require('./models');
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

// Registrar una nueva venta
app.post('/sales', async (req, res) => {
    try {
        let { productId, quantity, clientDni, receiptType } = req.body;
        
        // Verificar el tipo de boleta
        if (receiptType === 'DNI') {
            // Buscar cliente por DNI
            const client = await clientService.getClientByDni(clientDni);
            if (!client) {
                return res.status(404).json({ error: 'Cliente no encontrado, registre el cliente primero' });
            }
            // Datos del cliente para la boleta
            console.log(`Datos del cliente: Nombres: ${client.firstNames}, Apellidos: ${client.lastName}, Celular: ${client.phone}`);
        } else if (receiptType === 'Simple') {
            // Para boleta simple, se asigna un DNI automático
            clientDni = '11111111';
            console.log(`Boleta simple con DNI: ${clientDni}`);
        } else {
            return res.status(400).json({ error: 'Tipo de boleta no válido' });
        }

        // Verificar que el producto existe y tiene suficiente stock
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        if (product.quantity < quantity) {
            return res.status(400).json({ error: 'Cantidad insuficiente en stock' });
        }

        // Crear la venta
        const newSale = new saleModel({
            productId,
            quantity,
            clientDni
        });

        const data = await newSale.save();

        // Actualizar la cantidad del producto
        await productService.updateProductQuantity(productId, product.quantity - quantity);

        res.status(201).json(data);
    } catch (error) {
        console.error('Error registering sale:', error);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
});

// Obtener una venta por ID
app.get('/sales/:id', async (req, res) => {
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

// Actualizar una venta
app.put('/sales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let { productId, quantity, clientDni, receiptType } = req.body;

        const sale = await saleModel.findById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (product.quantity + sale.quantity < quantity) {
            return res.status(400).json({ error: 'Cantidad insuficiente en stock' });
        }

        if (receiptType === 'DNI') {
            const client = await clientService.getClientByDni(clientDni);
            if (!client) {
                return res.status(404).json({ error: 'Cliente no encontrado, registre el cliente primero' });
            }
            console.log(`Datos del cliente: Nombres: ${client.firstNames}, Apellidos: ${client.lastName}, Celular: ${client.phone}`);
        } else if (receiptType === 'Simple') {
            clientDni = '11111111';
            console.log(`Boleta simple con DNI: ${clientDni}`);
        } else {
            return res.status(400).json({ error: 'Tipo de boleta no válido' });
        }

        sale.productId = productId;
        sale.quantity = quantity;
        sale.clientDni = clientDni;

        const updatedSale = await sale.save();
        await productService.updateProductQuantity(productId, product.quantity + sale.quantity - quantity);

        res.json(updatedSale);
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(500).json({ error: 'Error al actualizar la venta' });
    }
});

// Eliminar una venta
app.delete('/sales/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const sale = await saleModel.findById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const product = await productService.getProductById(sale.productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await saleModel.findByIdAndDelete(id);
        await productService.updateProductQuantity(sale.productId, product.quantity + sale.quantity);

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting sale:', error);
        res.status(500).json({ error: 'Error al eliminar la venta' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
