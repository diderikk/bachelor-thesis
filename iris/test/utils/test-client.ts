import dotenv from 'dotenv'
import { createServer, RequestListener } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/server/api-utils";
import request from "supertest";

export const testClient = (handler: NextApiHandler) => {
  dotenv.config()
  const listener: RequestListener = (req, res) => {
    return apiResolver(
      req,
      res,
      undefined,
      handler,
      {
        previewModeEncryptionKey: "",
        previewModeId: "",
        previewModeSigningKey: "",
      },
      true
    );
  };

  return request(createServer(listener));
};