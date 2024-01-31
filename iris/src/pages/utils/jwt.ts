import jwt from "jsonwebtoken";

/**
 * Creates a JWT token that expires in 1 hour, signed with a secret.
 * Supposed to be used as an API key generator
 * 
 * @returns Signed JWT token
 */
export const sign = async (): Promise<string | undefined> => {
  const secret = process.env.JWT_SECRET!;
  return new Promise((resolve, reject) =>
    jwt.sign(
      {},
      secret,
      {
        algorithm: "HS512",
        expiresIn: "1h",
        issuer: "iris",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    )
  );
};

/**
 * Verifies a token, and checks that the expiration has not been tampered with
 * and signature is correct.
 * Supposed to be used to verify API keys
 * 
 * @param token JWT token
 * @returns true or false depending on validation
 */
export const verify = async (token: string): Promise<boolean> => {
  const secret = process.env.JWT_SECRET!;
  return new Promise((resolve, _reject) =>
    jwt.verify(
      token,
      secret,
      {
        algorithms: ["HS512"],
        issuer: "iris",
        maxAge: "1h",
      },
      (error, _decoded) => {
        if (error) {
          resolve(false);
        }
        resolve(true);
      }
    )
  );
};
