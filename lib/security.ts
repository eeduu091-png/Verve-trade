import crypto from "node:crypto";

const algorithm = "aes-256-gcm";

function getKey() {
  const raw = process.env.MT5_CREDENTIAL_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("MT5_CREDENTIAL_ENCRYPTION_KEY is required");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("MT5_CREDENTIAL_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  }
  return key;
}

export function encryptSecret(plainText: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${authTag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function verifyWorkerSignature(body: string, signature: string | null) {
  const secret = process.env.APP_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
