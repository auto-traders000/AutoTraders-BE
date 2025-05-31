var random = require('random-string-alphanumeric-generator');
const { OTP_LENGTH }=require('../config/email.constants');

const generateOTP = () => {
    const otp_code = random.randomNumber(OTP_LENGTH);
    const expirationTime = addMinutesToDate(new Date(),1);

    return {otp_code, expirationTime};
};

module.exports.checkOTPExpiry = (otp_expiry_time) => {
    if(new Date().getTime()<=parseInt(otp_expiry_time))
        return true;

    return false;
};


function addMinutesToDate(date, minutes) {
    return (date.getTime() + (minutes * 60 * 1000));
}

module.exports = generateOTP;