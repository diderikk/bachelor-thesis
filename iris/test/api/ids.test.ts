import { CreateIDParams } from "../../src/interfaces/ids/create.interface";
import idsUserHandler from "../../src/pages/api/v1/ids";
import { testClient } from "../utils/test-client";

const request = testClient(idsUserHandler);

describe("/ids", () => {
  it("should add an ID to the blockchain and return hash", async () => {
    const body = {
      documentDid: "testDocumentDid",
      issuerDid: "testIssuerDid",
      holderDid: "testHolderDid",
      expirationDate: "testExpirationDate",
    } as CreateIDParams;
    await request
      .post("/ids")
      .send(body)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty("blockHash");
        expect(res.body).toHaveProperty("publicKey");
      })
      .catch(e => console.log(e));
  }, 100000);
  it("should return error when holderDid parameter is wrong type", async () => {
    const body = {
      documentDid: "testDocumentDid2",
      issuerDid: "testIssuerDid2",
      holderDid: 123,
      expirationDate: "testExpirationDate2",
    };

    await request
      .post("/ids")
      .send(body)
      .then((res) => {
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0].param).toBe("holderDid");
      })
      .catch(e => console.log(e));
  }, 50000);
  it("should return error when documentDid parameter is wrong type", async () => {
    const body = {
      documentDid: 123,
      issuerDid: "testIssuerDid2",
      holderDid: "testHolderDid2",
      expirationDate: "testExpirationDate2",
    };

    await request
      .post("/ids")
      .send(body)
      .then((res) => {
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0].param).toBe("documentDid");
      })
      .catch(e => console.log(e));
  }, 50000);
  it("should return error when issuerDid parameter is wrong type", async () => {
    const body = {
      documentDid: "testDocumentDid2",
      issuerDid: 123,
      holderDid: "testHolderDid2",
      expirationDate: "testExpirationDate2",
    };

    await request
      .post("/ids")
      .send(body)
      .then((res) => {
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0].param).toBe("issuerDid");
      })
      .catch(e => console.log(e));
  }, 50000);
  it("should return error when expirationDate parameter is wrong type", async () => {
    const body = {
      documentDid: "testDocumentDid2",
      issuerDid: "testIssuerDid2",
      holderDid: "testHolderDid2",
      expirationDate: 123,
    };

    await request
      .post("/ids")
      .send(body)
      .then((res) => {
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0].param).toBe("expirationDate");
      })
      .catch(e => console.log(e));
  }, 50000);
});
