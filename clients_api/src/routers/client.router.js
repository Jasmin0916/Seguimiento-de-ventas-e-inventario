const { Router } = require("express");
const { getClient, createClient, getClientById, updateClient, deleteClient } = require("../controllers/client.controller");
const { authenticateToken, verifyRole } = require("../middleware/authMiddleware");

const router = Router();

router.get("/clients", authenticateToken, verifyRole(['admin', 'employee']), getClient);
router.post("/clients", authenticateToken, verifyRole(['admin', 'employee']), createClient);
router.get("/clients/:dni", authenticateToken, verifyRole(['admin', 'employee']), getClientById);
router.put("/clients/:dni", authenticateToken, verifyRole(['admin', 'employee']), updateClient);
router.delete("/clients/:dni", authenticateToken, verifyRole(['admin']), deleteClient);

module.exports = router;
 