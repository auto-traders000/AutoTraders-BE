// package import
const vehicleService = require('../Service/vehicle.service');
// local import

module.exports = class {
    static async create(req, res) {
        const userId = req.userId;
        const { vin, year, make, model, trim, kilometers, colour } = req.body;
        try {
            const result = await vehicleService.create(vin, year, make, model, trim, kilometers, colour, userId);

            return res.status(200).json({ message: "Success", result });

        } catch (err) {
            return res.status(400).json({ message: "User already exists or creation failed." });
        }
    }

    static async update(req, res) {
        const userId = req.userId;
        const { vin, year, make, model, trim, kilometers, colour } = req.body;

        try {
            const result = await vehicleService.update(
                vin, year, make, model, trim, kilometers, colour, userId
            );

            if (result) {
                return res.status(200).json({ message: "Vehicle updated successfully", result });
            } else {
                return res.status(404).json({ message: "Vehicle not found or update failed" });
            }
        } catch (err) {
            return res.status(500).json({ message: "Something went wrong", error: err });
        }
    }


    static async delete(req, res) {
        const userId = req.userId;
        const result = await vehicleService.delete(userId);
        if (result) {
            return res.status(200).json({ message: "Delete Successfully." });
        } else {
            return res.status(400).json({ message: "false" });
        }
    }
}