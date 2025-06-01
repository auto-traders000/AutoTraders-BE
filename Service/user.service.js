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
    static create = async (firstName, lastName, password, email) => {
        try {

            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) return false;

            const result = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password,
                },
            });

            return result || false;
        } catch (error) {
            console.log(error);
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

    static password = async (otp, password, userId) => {
        try {
            const user = await prisma.user.findFirst({
                where: { otpCode: otp },
            });

            if (!user) return false;

            const result = await prisma.user.update({
                where: { id: userId },
                data: {
                    password: password,
                    otpCode: null,
                    otpExpiry: null,
                },
            });

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