const crypto = require('crypto');
require("dotenv").config();

const loadSecretKey = async () => {
    try {
        const secretKey = process.env.KEY_ENCRYPT;
        return Buffer.from(secretKey, 'hex');
    } catch (error) {
        console.error('Erreur lors de la lecture de la clé secrète :', error.message);
    }
};
module.exports = {
    decrypt: async (text) => {
        const [ivString, encrypted, tagString] = text.split(':');
        const iv = Buffer.from(ivString, 'hex');
        const tag = Buffer.from(tagString, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(await loadSecretKey()), iv);
        decipher.setAuthTag(tag);
        let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    },
}