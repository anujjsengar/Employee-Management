import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';  // Import jwt
// import User from '../models/User.js';
import Admin from '../../models/Admin.js'
// import RegisterEmail from './Email-Generator/RegisterEmail.js';
// const bcrypt = require('bcrypt');
const AdminLogin = async (req, res) => {
    const JWT_KEY = "jwtSecretKeyanujjsengar";   // Move to env file in production
    // const hashPassword = async (password) => {
    //         const saltRounds = 10;  
    //         const hashed = await bcrypt.hash(password, saltRounds);
    //         console.log(`Hashed Password: ${hashed}`);
    // };
    // const sendEmail = async (email_details) =>{
    //     const email_info =await RegisterEmail(
    //         email_details.email,
    //         "Registration Information",
    //         email_password.password,
    //         "<h1>Thankyou for Registration</h1>"
    //     )
    //     console.log(email_info);
    // }
    try {
        console.log("Attempting login...");

        const { email, password, role } = req.body;
        // console.log(email);
        // console.log(password);
        // Check if the user exists
        const user = await Admin.findOne({ email });
        // console.log(user.email);
        // console.log(user.password)
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ success: false, error: "User not found" });
        }

        console.log(`User found: ${user.email}`);
        console.log(user.role);
        console.log(user.password);
        console.log(password);
        const hashpass=password;
        // Compare passwords
        // const isMatch = await compare(password, user.password);
        // console.log(isMatch);
        if (!(hashpass===user.password) || !(role===user.role)) {
            console.log("Incorrect password");
            return res.status(401).json({ success: false, error: "Wrong password" });
        }

        console.log("Password matched");

        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            JWT_KEY,
            { expiresIn: "1m" }
        );

        console.log("Token generated successfully");

        // Send response with token and user info
        return res.status(200).json({
            success: true,
            user: { _id: user._id, name: user.name, role: user.role },
            token
        });

    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};
export default AdminLogin;
