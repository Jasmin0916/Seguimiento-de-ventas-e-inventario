const {Router} = require("express");
const {getEmployee, createEmployee, getEmployeeById, updateEmployee, deleteEmployee} = require("../controllers/employee.controller");
const {authenticateToken, verifyRole} = require("../middleware/authMiddleware");

const router = Router();

router.get("/employees", authenticateToken, verifyRole('admin'), getEmployee);
router.post("/employees", authenticateToken, verifyRole('admin'), createEmployee);
router.get("/employees/:id", authenticateToken, verifyRole('admin'), getEmployeeById);
router.put("/employees/:id", authenticateToken, verifyRole('admin'), updateEmployee);
router.delete("/employees/:id", deleteEmployee);

module.exports = router; 