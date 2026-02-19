import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "tunflex-auth-secret-change-in-production"
);
const COOKIE_NAME = "auth-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

export interface SessionPayload {
  userId: number;
  email: string;
  exp: number;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
}

/** Server-only: get current user from cookie (for layouts/pages). Returns null if not logged in. */
export async function getSessionUser(): Promise<User | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  const { query } = await import("@/lib/db");
  const rows = await query<{ id: number; email: string; name: string | null; role: string }[]>(
    "SELECT id, email, name, role FROM users WHERE id = ? LIMIT 1",
    [payload.userId]
  );
  const user = Array.isArray(rows) ? rows[0] : null;
  return user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null;
}
