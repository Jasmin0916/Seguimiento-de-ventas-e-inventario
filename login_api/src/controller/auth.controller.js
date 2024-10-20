const employeeAuthService = require("../services/employeeAuthService");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await employeeAuthService.login(email, password);
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).json({ error: error.message });
    }
};

module.exports = { login };
