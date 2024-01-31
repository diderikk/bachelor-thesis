import { create, invalidate, verify } from "../../src/services/ids";
import * as RPC from "../../src/services/rpc";
import { mockConnection } from "../utils/mock";
import idsUserHandler from "../../src/pages/api/v1/ids";
import { testClient } from "../utils/test-client";

jest.mock("../../src/config/anchor");
mockConnection()

const request = testClient(idsUserHandler);

const mocked = jest.spyOn(RPC, "addIdAgreement");
mocked.mockImplementation(() => {
  return new Promise((resolve, reject) =>
    resolve({
      blockHash: "blockHash",
      publicKey: "publicKey",
    }),
  );
});

const mocked2 = jest.spyOn(RPC, "invalidateIdAgreement");
mocked2.mockImplementation(() => {
  return new Promise((resolve, reject) =>
    resolve({
      blockHash: "blockHash",
      publicKey: "publicKey",
    }),
  );
});

describe("Adds ID to the blockchain", () => {
  it("should return the block hash and pubKey to confirm storage", async () => {
    const response = await create({
      documentDid: "testDocumentDid",
      issuerDid: "testIssuerDid",
      holderDid: "testHolderDid",
      expirationDate: "testExpirationDate",
    });

    expect(response).toEqual({
      blockHash: "blockHash",
      publicKey: "publicKey",
    });
  });

  it("should throw error when a parameter is empty", async () => {
    expect(async () => {
      await create({
        documentDid: "",
        issuerDid: "testIssuerDid",
        holderDid: "testHolderDid",
        expirationDate: "testExpirationDate",
      });
    }).rejects.toThrow("A parameter was empty");
  });

  it("should throw error when a parameter is empty", async () => {
    expect(async () => {
      await create({
        documentDid: "testDocumentDid",
        issuerDid: "",
        holderDid: "testHolderDid",
        expirationDate: "testExpirationDate",
      });
    }).rejects.toThrow("A parameter was empty");
  });

  it("should throw error when a parameter is empty", async () => {
    expect(async () => {
      await create({
        documentDid: "testDocumentDid",
        issuerDid: "testIssuerDid",
        holderDid: "",
        expirationDate: "testExpirationDate",
      });
    }).rejects.toThrow("A parameter was empty");
  });
});

describe("Deletes/invalidates ID", () => {
  it("should return the block hash and pubKey and valid be false to confirm invalidation", async () => {
    const response = await invalidate({
      documentDid: "testDocumentDid",
    });

    expect(response).toEqual({
      blockHash: "blockHash",
      publicKey: "publicKey",
    });

    await request
      .get("/ids/blockHash")
      .send()
      .then((res) => {
        expect(res.body).toHaveProperty("valid");
        expect(res.body.valid).toBe(false);
      })
      .catch(e => console.log(e));
  });

  it("should throw error when a parameter is empty", async () => {
    expect(async () => {
      await invalidate({
        documentDid: "",
      });
    }).rejects.toThrow("A parameter was empty");
  });
});

describe("Verifies ID", () => {
  it("should throw error when a parameter is empty", async () => {
    expect(async () => {
      await verify("");
    }).rejects.toThrow("A parameter was empty");
  });

  //TODO: More tests here
});
