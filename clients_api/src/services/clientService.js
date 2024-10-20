const { clientModel } = require("../models/client.model");

class ClientService {
    async getAllClients() {
        try {
            return await clientModel.find();
        } catch (error) {
            throw new Error('Error al obtener los clientes');
        }
    }

    async createClient({ dni, lastName, middleName, firstNames, phone }) {
        try {
            const existingClient = await clientModel.findOne({ dni });
            if (existingClient) {
                throw new Error('Cliente ya registrado');
            }

            const newClient = new clientModel({
                dni,
                lastName,
                middleName,
                firstNames,
                phone
            });

            return await newClient.save();
        } catch (error) {
            throw new Error('Error al registrar el cliente: ' + error.message);
        }
    }

    async getClientByDni(dni) {
        try {
            const client = await clientModel.findOne({ dni });
            if (!client) {
                throw new Error('Cliente no encontrado');
            }
            return client;
        } catch (error) {
            throw new Error('Error al obtener el cliente: ' + error.message);
        }
    }

    async updateClient(dni, updateData) {
        try {
            const client = await clientModel.findOne({ dni });
            if (!client) {
                throw new Error('Cliente no encontrado');
            }

            Object.assign(client, updateData);
            return await client.save();
        } catch (error) {
            throw new Error('Error al actualizar el cliente: ' + error.message);
        }
    }

    async deleteClient(dni) {
        try {
            const client = await clientModel.findOne({ dni });
            if (!client) {
                throw new Error('Cliente no encontrado');
            }

            await clientModel.deleteOne({ dni });
        } catch (error) {
            throw new Error('Error al eliminar el cliente: ' + error.message);
        }
    }
}

module.exports = new ClientService();
