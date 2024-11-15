const crypto = require("crypto");

const secretKey = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPT_PASS || "f0rmbpjs2025")
    .digest("base64")
    .substr(0, 32);
const algorithm = "aes-256-cbc"; // Encryption algorithm

exports.decryptPassword = (encryptedPassword, iv) => {
    try {
        const ivBuffer = Buffer.from(iv, "hex");
        const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
        let decrypted = decipher.update(encryptedPassword, "hex", "utf-8");
        decrypted += decipher.final("utf-8");
        return decrypted;
    } catch (error) {
        return "invalid";
    }
};

exports.splitToken = (token) => {
    let currentToken = token;
    currentToken = currentToken.split("|");
    currentToken = this.decryptPassword(currentToken[0], currentToken[1]);
    return currentToken === "invalid" ? "invalid" : currentToken.split("|");
};

exports.splitTokenMobile = (token) => {
    let currentToken = token;
    return currentToken.split("|");
};

exports.splitPassword = (password) => {
    let decryptedPassword = password.split("|");
    decryptedPassword = this.decryptPassword(
        decryptedPassword[0],
        decryptedPassword[1]
    );

    return decryptedPassword === "invalid" ? "invalid" : decryptedPassword;
};

exports.encrypt = (password) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    let encrypted = cipher.update(password, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return {
        iv: iv.toString("hex"), // Store IV in hex format
        encryptedData: encrypted, // Encrypted password in hex format
    };
};
