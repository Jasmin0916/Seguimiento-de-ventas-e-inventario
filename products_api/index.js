const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { productModel } = require('./models');
const port = 8080;

const uri = "mongodb+srv://nodeJS:NodeJS4321@cluster0.wr9ipqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
    process.exit(1); // Termina el proceso si no se puede conectar a MongoDB
});

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.get('/', (req, res) => {
    res.send("I am alive Producto");
});

// Listar todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Registrar un nuevo producto
app.post('/products', async (req, res) => {
    try {
        const { name, salePrice, purchasePrice, quantity, productType } = req.body;

        const newProduct = new productModel({
            name,
            salePrice,
            purchasePrice,
            quantity,
            productType
        });

        const data = await newProduct.save();
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ error: 'Error al registrar el producto' });
    }
});

// Obtener un producto por ID
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Actualizar la cantidad de un producto
app.put('/products/:id', async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await productModel.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(400).json({ error: 'Error al eliminar el producto' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
