import crypto from "crypto";
import bcrypt from "bcrypt";

export class Secret {
  secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = Buffer.from(secretKey, "hex")
      .subarray(0, 16)
      .toString("hex");
  }

  encrypt<T extends object>(data: T) {
    const value = JSON.stringify(data);
    const iv = crypto.randomBytes(8).toString("hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", this.secretKey, iv);
    let encrypted = cipher.update(value, "utf8", "base64");
    encrypted += cipher.final("base64");

    return Buffer.from([iv, encrypted].join("|")).toString("base64");
  }

  decrypt<T>(value: string) {
    value = Buffer.from(value, "base64").toString("utf-8");

    const [iv, hash] = value.split("|");
    const decipher = crypto.createDecipheriv("aes-256-cbc", this.secretKey, iv);
    let decrypted = decipher.update(hash, "base64", "utf-8");
    decrypted += decipher.final("utf-8");
    return JSON.parse(decrypted) as T;
  }

  hash<T extends object>(data: T, salt = 16) {
    const value = JSON.stringify(data);
    return bcrypt.hash(value, salt);
  }

  verifyHash(hash: string, plain: string) {
    return bcrypt.compare(hash, plain);
  }
}
