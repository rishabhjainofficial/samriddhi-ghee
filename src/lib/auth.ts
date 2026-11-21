import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "./prisma";

export interface IAdminSessionPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

const SECRET_KEY =
  process.env.ADMIN_SESSION_SECRET ||
  "sanvrit-super-secret-key-32-chars-minimum-prod";

export async function authenticateAdmin(
  email: string,
  pass: string
): Promise<IAdminSessionPayload | null> {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!admin) return null;

  const isValid = await bcrypt.compare(pass, admin.passwordHash);
  if (!isValid) return null;

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}

export async function createSessionToken(payload: IAdminSessionPayload): Promise<string> {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 86400000 });
  const b64Data = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(b64Data)
    .digest("base64url");
  return `${b64Data}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<IAdminSessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [b64Data, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(b64Data)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const json = JSON.parse(Buffer.from(b64Data, "base64url").toString("utf-8"));
    if (json.exp && json.exp < Date.now()) {
      return null; // Expired
    }
    return {
      id: json.id,
      email: json.email,
      name: json.name,
      role: json.role,
    };
  } catch {
    return null;
  }
}
