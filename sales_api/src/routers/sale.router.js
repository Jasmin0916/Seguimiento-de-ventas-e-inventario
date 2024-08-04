const { Router } = require("express");
const { getSale, createSale, getSaleById, updatedSale, deleteSale } = require("../controllers/sale.controller");
const { authenticateToken, verifyRole } = require("../middleware/authMiddleware");

const router = Router();

router.get("/sales", authenticateToken, verifyRole(['admin', 'employee']), getSale);
router.post("/sales", authenticateToken, verifyRole(['admin', 'employee']), createSale);
router.get("/sales/:id", authenticateToken, verifyRole(['admin', 'employee']), getSaleById)
router.put("/sales/:id", authenticateToken, verifyRole('admin'), updatedSale);
router.delete("/sales/:id", authenticateToken, verifyRole('admin'), deleteSale);

module.exports = router;