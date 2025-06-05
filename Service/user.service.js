// package import 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchError = require('../utils/index');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const sendMail = require('../middlewares/email.middleware.js');
const generateOTP = require('../middlewares/otp.middleware.js');
// local import

module.exports = class {

    static otpRequest = async (email) => {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        const { otp_code, expirationTime } = generateOTP();

        if (!user) {
            await prisma.user.create({
                data: {
                    email,
                    otpCode: otp_code,
                    otpExpiry: new Date(expirationTime),
                },
            });
        } else {
            await prisma.user.update({
                where: { email },
                data: {
                    otpCode: otp_code,
                    otpExpiry: new Date(expirationTime),
                },
            });
        }

        // Send OTP via email
        const mailResult = await sendMail({
            to: email,
            OTP: otp_code,
        });

        return mailResult ? true : false;
    };

    static otpResend = async (email) => {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return false;
        }

        const { otp_code, expirationTime } = generateOTP();

        await prisma.user.update({
            where: { email },
            data: {
                otpCode: otp_code,
                otpExpiry: new Date(expirationTime),
            },
        });

        // Send OTP via email
        const mailResult = await sendMail({
            to: email,
            OTP: otp_code,
        });

        return mailResult ? true : false;
    };

    static create = async (email, otp, firstName, lastName, password) => {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            console.log("exi", existingUser);
            console.log("otp", otp);

            if (!existingUser) {
                return "User does not exist.";
            }

            if (existingUser.otpCode !== otp) {
                return "Invalid OTP code.";
            }

            if (new Date() > existingUser.otpExpiry) {
                return "OTP has expired.";
            }

            const result = await prisma.user.update({
                where: { email },
                data: {
                    firstName,
                    lastName,
                    password,
                },
            });

            console.log("result-->", result);
            return result || false;
        } catch (error) {
            console.log("exception:", error);
            return false;
        }
    };

    static getUserById = async (id) => {
        const result = await prisma.user.findUnique({
            where: { id },
        });

        if (result) return result;
        else return false;
    };


    static update = async (userId, firstName, lastName, password, email) => {
        try {
            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!existingUser) return false; // User not found

            // Update user with the new data (updateData can contain firstName, lastName, email, password etc.)
            const result = await prisma.user.update({
                where: { id: userId },
                data: { firstName, lastName, password, email }
            });

            if (result) return result;
            else return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    static deleteUser = async (userId) => {
        const result = await prisma.user.delete({
            where: { id: userId },
        });

        if (result) {
            return { result };
        } else {
            return false;
        }
    };

    static Fpasswords = async (email) => {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return false;
        }

        const { otp_code, expirationTime } = generateOTP();

        await prisma.user.update({
            where: { email },
            data: {
                otpCode: otp_code,
                otpExpiry: new Date(expirationTime),
            },
        });

        // Send OTP via email
        const mailResult = await sendMail({
            to: email,
            OTP: otp_code,
        });

        return mailResult ? true : false;
    };

    static password = async (otp, password) => {
        try {
            const user = await prisma.user.findFirst({
                where: { otpCode: otp },
            });
            if (!user) return false;

            const result = await prisma.user.update({
                data: {
                    password: password,
                    otpCode: null,
                    otpExpiry: null,
                },
            });
            console.log("-->3", result);
            if (result) return result;
            else return false;
        } catch (error) {
            return false;
        }
    };


    static loginUser = async (email, password) => {
        const result = await prisma.user.findUnique({
            where: { email },
        });

        if (!result) return false;

        const isPasswordValid = await bcrypt.compare(password, result.password);
        if (!isPasswordValid) return false;

        const token = jwt.sign(
            { id: result.id, email: result.email },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '2h' }
        );

        const refreshToken = jwt.sign(
            { id: result.id, email: result.email },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        result.token = token;
        result.refreshToken = refreshToken;

        if (result) return result;
        else return false;
    };

}