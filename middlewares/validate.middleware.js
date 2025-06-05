const joi = require("joi");

const validation = joi.object({
    fullName: joi.string().min(3).max(25).trim(true).required(),
    email: joi.string().email().trim(true).required(),
	phoneNumber: joi.string().min(3).max(25).trim(true).required(),
    password: joi.string().min(8).trim(true).required(),
	confirmPassword: joi.string().min(8).trim(true).required()
.default([]),
    is_active: joi.boolean().default(true),
});



const userValidation = async (req, res, next) => {
	const payload = {
		fullName: req.body.fullName,
		email: req.body.email,
		phoneNumber: req.body.phoneNumber,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		is_active: req.body.is_active,
	};

	const { error } = validation.validate(payload);
	if (error) {
		res.status(406);
		return res.json(
			"Error"
		);
	}
	if (payload.password!==payload.confirmPassword) {
		res.status(406);
		return res.json(
			"Password is incorrect"
		);
	} 
	else {
		next();
	}
};
module.exports = userValidation;