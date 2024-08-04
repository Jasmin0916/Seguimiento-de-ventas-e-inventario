const { Router } = require("express");
const { getProduct, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/product.controller");
const { authenticateToken, verifyRole } = require("../middleware/authMiddleware");

const router = Router();

router.get("/products", authenticateToken, verifyRole(['admin', 'employee']), getProduct);
router.post("/products", authenticateToken, verifyRole(['admin', 'employee']), createProduct);
router.get("/products/:id", authenticateToken, verifyRole(['admin', 'employee']), getProductById);
router.put("/products/:id", authenticateToken, verifyRole(['admin', 'employee']), updateProduct);
router.delete("/products/:id", authenticateToken, verifyRole(['admin']), deleteProduct);

module.exports = router;
 