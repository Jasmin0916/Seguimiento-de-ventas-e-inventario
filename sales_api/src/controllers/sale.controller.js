// sales_api/src/controllers/sale.controller.js
const saleService = require("../services/saleService");

const getSale = async (req, res) => {
    try {
        const sales = await saleService.getAllSales();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSale = async (req, res) => {
    try {
        const { products, clientDni, receiptType } = req.body;
        const employeeId = req.user.id; // Suponiendo que el ID del empleado está en el token decodificado
        const token = req.headers['authorization']?.split(' ')[1];
        const newSale = await saleService.createSale({ products, clientDni, receiptType }, employeeId, token);
        res.status(201).json(newSale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await saleService.getSaleById(id);
        res.json(sale);
    } catch (error) {
        res.status(error.message === 'Venta no encontrada' ? 404 : 500).json({ error: error.message });
    }
};

const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { products, clientDni, receiptType } = req.body;
        const employeeId = req.user.id; // Suponiendo que el ID del empleado está en el token decodificado
        const token = req.headers['authorization']?.split(' ')[1];
        const updatedSale = await saleService.updateSale(id, { products, clientDni, receiptType }, employeeId, token);
        res.json(updatedSale);
    } catch (error) {
        res.status(error.message === 'Venta no encontrada' ? 404 : 400).json({ error: error.message });
    }
};

const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers['authorization']?.split(' ')[1];
        await saleService.deleteSale(id, token);
        res.status(200).json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
        res.status(error.message === 'Venta no encontrada' ? 404 : 500).json({ error: error.message });
    }
};

module.exports = { getSale, createSale, getSaleById, updateSale, deleteSale };
