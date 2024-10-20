const { Router } = require("express");
const { getAllClients, createClient, getClientByDni, updateClient, deleteClient } = require("../controllers/client.controller");
const { authenticateToken, verifyRole } = require("../middleware/authMiddleware");

const router = Router();

router.get("/clients", authenticateToken, verifyRole(['admin', 'employee']), getAllClients);
router.post("/clients", authenticateToken, verifyRole(['admin', 'employee']), createClient);
router.get("/clients/:dni", authenticateToken, verifyRole(['admin', 'employee']), getClientByDni);
router.put("/clients/:dni", authenticateToken, verifyRole(['admin', 'employee']), updateClient);
router.delete("/clients/:dni", authenticateToken, verifyRole(['admin']), deleteClient);

module.exports = router;
 