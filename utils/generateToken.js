const crypto = require('crypto');

module.exports = () => {
    const length = 6;
    const result = crypto.randomBytes(length).toString("hex");
    return result;
}