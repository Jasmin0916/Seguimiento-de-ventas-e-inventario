const { saleModel } = require('../models/sale.model');

// Función para generar un nuevo ID de boleta
const generateReceiptId = async () => {
    try {
        // Buscar el último ID de boleta en la base de datos
        const lastSale = await saleModel.findOne().sort({ receiptId: -1 }).exec();
        let receiptCounter = 0;

        if (lastSale) {
            // Extraer el número del último ID
            const lastReceiptId = lastSale.receiptId;
            const lastCounter = parseInt(lastReceiptId.substring(4), 10);
            receiptCounter = lastCounter;
        }

        receiptCounter += 1;
        return `BOL-${receiptCounter.toString().padStart(9, '0')}`;
    } catch (error) {
        console.error('Error generating receipt ID:', error);
        throw new Error('Error al generar el ID de boleta');
    }
};

module.exports = { generateReceiptId };
