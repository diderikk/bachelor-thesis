import { Program } from "@project-serum/anchor";
import { Kratos } from "../../src/interfaces/kratos/kratos";
import prisma from "../../src/config/prisma";
import { create, index } from "../../src/services/issuers";
import * as RPC from "../../src/services/rpc";
import { mockConnection } from "../utils/mock";
import { sign } from "../../src/pages/utils/jwt";

jest.mock("../../src/config/anchor");
mockConnection();

jest.spyOn(prisma.issuerAccount, "create").mockImplementation(jest.fn());

// TODO: Add return value
jest
  .spyOn(prisma.issuerAccount, "findMany")
  .mockImplementation(
    jest.fn().mockReturnValue([{ publicKey: "123" }, { publicKey: "456" }])
  );

jest.spyOn(RPC, "addIssuer").mockImplementation(() => {
  return new Promise((resolve, reject) =>
    resolve({
      blockHash: "Test",
      publicKey: "Test",
    })
  );
});

jest
  .spyOn(RPC, "fetchIssuers")
  .mockImplementation((accounts: string[], _program: Program<Kratos>) => {
    return new Promise((resolve, reject) =>
      resolve(
        accounts.map((account) => ({
          url: "UrlTest",
          publicKey: account,
        }))
      )
    );
  });

describe("Add issuer to the smart contract", () => {
  it("should return blockhash and public key", async () => {
    const token = await sign();
    const response = await create(
      {
        issuerName: "Test",
        did: "Test",
        url: "Test",
      },
      token!
    );

    expect(response).toEqual({
      blockHash: "Test",
      publicKey: "Test",
    });
  });

  it("should throw error when a parameter is empty", async () => {
    const token = await sign();

    expect(async () => {
      await create(
        {
          issuerName: "",
          did: "Test",
          url: "Test",
        },
        token!
      );
    }).rejects.toThrow("A parameter was empty");
  });

  it("should throw error when a parameter is empty", async () => {
    const token = await sign();

    expect(async () => {
      await create(
        {
          issuerName: "Test",
          did: "",
          url: "Test",
        },
        token!
      );
    }).rejects.toThrow("A parameter was empty");
  });

  it("should throw error when a parameter is empty", async () => {
    const token = await sign();

    expect(async () => {
      await create(
        {
          issuerName: "Test",
          did: "",
          url: "Test",
        },
        token!
      );
    }).rejects.toThrow("A parameter was empty");
  });
});

describe("Fetch all issuers from the smart contract", () => {
  it("should return all stored issuer", async () => {
    const issuers = await index();

    expect(issuers.length).toBe(2);
    expect(issuers).toStrictEqual([
      {
        url: "UrlTest",
        publicKey: "123",
      },
      {
        url: "UrlTest",
        publicKey: "456",
      },
    ]);
  });
});
