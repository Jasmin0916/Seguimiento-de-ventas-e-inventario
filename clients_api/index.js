const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { clientModel } = require('./models');
const port = 8082;

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
    methods: ["GET", "POST"]
}));

app.get('/', (req, res) => {
    res.send("I am alive Clients");
});

// Obtener todos los clientes
app.get('/clients', async (req, res) => {
    try {
        const clients = await clientModel.find();
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
});

// Obtener un cliente por DNI
app.get('/clients/:dni', async (req, res) => {
    try {
        const { dni } = req.params;
        const client = await clientModel.findOne({ dni });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
});

// Registrar un nuevo cliente
app.post('/clients', async (req, res) => {
    try {
        const { dni, lastName, middleName, firstNames, phone } = req.body;

        // Verificar si el cliente ya está registrado
        const existingClient = await clientModel.findOne({ dni });
        if (existingClient) {
            return res.status(400).json({ error: 'Cliente ya registrado' });
        }

        // Crear el nuevo cliente
        const newClient = new clientModel({
            dni,
            lastName,
            middleName,
            firstNames,
            phone
        });

        const data = await newClient.save();
        res.status(201).json(data);
    } catch (error) {
        console.error('Error registering client:', error);
        res.status(500).json({ error: 'Error al registrar el cliente' });
    }
});

// Actualizar un cliente por DNI
app.put('/clients/:dni', async (req, res) => {
    try {
        const { dni } = req.params;
        const { lastName, middleName, firstNames, phone } = req.body;

        // Encontrar el cliente por DNI
        const client = await clientModel.findOne({ dni });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Actualizar los datos del cliente
        client.lastName = lastName || client.lastName;
        client.middleName = middleName || client.middleName;
        client.firstNames = firstNames || client.firstNames;
        client.phone = phone || client.phone;

        const updatedClient = await client.save();
        res.json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
});

// Eliminar un cliente por DNI
app.delete('/clients/:dni', async (req, res) => {
    try {
        const { dni } = req.params;
 
        // Encontrar el cliente por DNI
        const client = await clientModel.findOne({ dni });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Eliminar el cliente
        await clientModel.deleteOne({ dni });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
});


app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
