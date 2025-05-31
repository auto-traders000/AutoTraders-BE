// package import
const securePassword = require('../middlewares/auth.middleware');
// local import
const userService = require('../Service/user.service');

module.exports = class {
    static async create(req, res) {
        const { firstName, lastName, password, confirmPassword, email } = req.body;

        if (password !== confirmPassword) {
            console.error('Password and confirmPassword do not match');
            return res.status(400).json({ message: "Password and Confirm Password do not match" });
        }

        const hashedPassword = await securePassword(password);
        try {
            const result = await userService.create(firstName, lastName, hashedPassword, email);

            return res.status(200).json({ message: "Success", result });

        } catch (err) {
            return res.status(400).json({ message: "User already exists or creation failed." });
        }
    }

    static async getUser(req, res) {
        const id = req.userId;
        const result = await userService.getUserById(id);
        if (result) {
            return res.status(200).json({ message: "Success", result });
        } else {
            return res.status(400).json({ message: "User not exist.." });
        }
    }


    static async update(req, res) {
        const userId = req.userId;
        let { firstName, lastName, password, confirmPassword, email } = req.body;
        if (password && password !== confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password do not match" });
        }
        try {
            if (password) {
                password = await securePassword(password);
            }
            const result = await userService.update(userId, firstName, lastName, password, email);

            if (!result) {
                return res.status(404).json({ message: "User not found or update failed" });
            }
            return res.status(200).json({ message: "User updated successfully", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong", error: error.message });
        }
    }

    static async delete(req, res) {
        const userId = req.userId;
        const result = await userService.deleteUser(userId);
        if (result) {
            return res.status(200).json({ message: "Delete Successfully." });
        } else {
            return res.status(400).json({ message: "false" });
        }
    }

    static async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            const result = await userService.Fpasswords(email);
            if (result) {
                return res.status(200).json({ message: "OTP sent to email successfully." });
            } else {
                return res.status(404).json({ message: "Email does not exist." });
            }
        } catch (error) {
            console.error("ForgotPassword Error:", error);
            return res.status(500).json({ message: "Something went wrong.", error });
        }
    }

    static async resetPassword(req, res) {
        const userId = req.userId;
        const { otp, password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password are required." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password do not match." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        try {
            const hashedPassword = await securePassword(password);
            const result = await userService.password(otp, hashedPassword, userId);
            if (result) {
                return res.status(200).json({ message: "Password reset Successfully.", result });
            } else {
                return res.status(400).json({ message: "Password reset Failed." });
            }
        } catch (error) {
            return res.status(500).json({ message: "Something went wrong.", error });
        }
    }


    static async login(req, res) {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        if (result) {
            return res.status(200).json({ message: "Login Successfully.", result });
        } else {
            return res.status(400).json({ message: "Login failed." });
        }
    }
}