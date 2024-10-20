const clientService = require("../services/clientService");

const getAllClients = async (req, res) => {
    try {
        const clients = await clientService.getAllClients();
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
};

const createClient = async (req, res) => {
    try {
        const { dni, lastName, middleName, firstNames, phone } = req.body;
        const newClient = await clientService.createClient({ dni, lastName, middleName, firstNames, phone });
        res.status(201).json(newClient);
    } catch (error) {
        console.error('Error registering client:', error);
        res.status(400).json({ error: error.message });
    }
};

const getClientByDni = async (req, res) => {
    try {
        const { dni } = req.params;
        const client = await clientService.getClientByDni(dni);
        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(404).json({ error: error.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const { dni } = req.params;
        const updatedClient = await clientService.updateClient(dni, req.body);
        res.json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(400).json({ error: error.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { dni } = req.params;
        await clientService.deleteClient(dni);
        res.status(200).json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(404).json({ error: error.message });
    }
};

module.exports = { getAllClients, createClient, getClientByDni, updateClient, deleteClient };
