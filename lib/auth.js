import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function setTokenCookie(res, token) {
  const cookie = serialize("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8
  });
  res.setHeader("Set-Cookie", cookie);
}

export function clearTokenCookie(res) {
  const cookie = serialize("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0
  });
  res.setHeader("Set-Cookie", cookie);
}


