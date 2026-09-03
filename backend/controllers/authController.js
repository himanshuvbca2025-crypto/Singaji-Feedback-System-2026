const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');

const adminLogin = async (req, res) => {
    try {
        const { gmail, password } = req.body;


        if (!gmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Gmail and password are required'
            });
        }

        const admin = await Admin.findOne({ gmail });

        console.log(admin);
        

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid gmail or password'
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        console.log(isPasswordMatch);
        

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid gmail or password'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Admin login successful',
            admin: {
                id: admin._id,
                username: admin.username,
                gmail: admin.gmail
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    adminLogin
};