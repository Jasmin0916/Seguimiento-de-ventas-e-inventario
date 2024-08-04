const { clientModel } = require("../models/client.model");

// Listar todos los cliente
const getClient = async (req, res) => {
    try {
        const clients = await clientModel.find();
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
};
// Registrar un nuevo cliente
const createClient = async (req, res) => {
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
};
// Obtener un cliente por ID
const getClientById = async (req, res) => {
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
};
// Actualizar cliente
const updateClient = async (req, res) => {
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
};
// Eliminar un cliente 
const deleteClient = async (req, res) => {
    try {
        const { dni } = req.params;

        // Encontrar el cliente por DNI
        const client = await clientModel.findOne({ dni });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Eliminar el cliente
        await clientModel.deleteOne({ dni });
        res.status(200).json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
};

module.exports = { getClient, createClient, getClientById, updateClient, deleteClient };