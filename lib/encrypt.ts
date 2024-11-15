import crypto from "crypto";

const secretKey = crypto
  .createHash("sha256")
  .update("f0rmbpjs2025")
  .digest("base64")
  .substr(0, 32);

const algorithm = "aes-256-cbc";

export const encrypt = (password: string): { iv: string; encryptedData: string } => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(password, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
};