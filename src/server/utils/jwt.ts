import jwt from "jsonwebtoken";

import type { SignOptions } from "jsonwebtoken";
import type { PrivateKeys, PublicKeys } from "../config/default";

// generate encoded token
export const signJwt = (
  payload: { sub?: string },
  key: PrivateKeys,
  options: SignOptions = {}
) => {
  const privateKey = Buffer.from(key, "base64").toString("ascii");
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

// decode token
export const verifyJwt = <T>(token: string, key: PublicKeys): T | null => {
  try {
    const publicKey = Buffer.from(key, "base64").toString("ascii");
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};
