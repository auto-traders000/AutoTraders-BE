// package import
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// local import

module.exports = class {
    static create = async (vin, year, make, model, trim, kilometers, colour, userId) => {
        try {

            const existingUser = await prisma.vehicle.findUnique({
                where: { vin },
            });

            if (existingUser) return false;

            const result = await prisma.vehicle.create({
                data: {
                    vin, year, make, model, trim, kilometers, colour, userId
                },
            });

            return result || false;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    static update = async (vin, year, make, model, trim, kilometers, colour, userId) => {
        try {
            const existingVehicle = await prisma.vehicle.findFirst({
                where: { userId: userId },
            });

            if (!existingVehicle) return false;

            const result = await prisma.vehicle.update({
                where: { id: existingVehicle.id }, // ✅ ye unique field hai
                data: {
                    vin, year, make, model, trim, kilometers, colour,
                },
            });

            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    static delete = async (userId) => {
        try {
            // Get the vehicle record
            const vehicle = await prisma.vehicle.findFirst({
                where: { userId: userId }
            });

            if (!vehicle) return false;

            const result = await prisma.vehicle.delete({
                where: { id: vehicle.id }
            });

            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

}