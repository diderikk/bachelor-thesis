import { CreateIssuerParams } from "../../src/interfaces/issuers/create.interface";
import issuerHandler from "../../src/pages/api/v1/issuers";
import { sign } from "../../src/pages/utils/jwt";
import { testClient } from "../utils/test-client";

const request = testClient(issuerHandler);

describe("/issuers", () => {
  it("should return error when token is invalid", async () => {
    const body = {
      issuer: {
        issuerName: "Test",
        url: "https://example.com",
        did: "did:key:123",
      } as CreateIssuerParams,
      token: "bad token",
    };
    await request
      .post("/issuers")
      .send(body)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Invalid token");
      })
      .catch((e) => console.log(e));
  });
  it("should return error when token is expired", async () => {
    const body = {
      issuer: {
        issuerName: "Test",
        url: "https://example.com",
        did: "did:key:123",
      } as CreateIssuerParams,
      token:
        "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTA4ODU5NTQsImV4cCI6MTY1MDg4NTk1NSwiaXNzIjoiaXJpcyJ9" +
        ".bK-Y0dGFvZ3_ov4eSh-WlPcfTDX6hqRzVSiFluXb5s3BFs4uhVmQxzrNScnisyrKViKITJuJr1x1xocKSdSQbA",
    };

    await request
      .post("/issuers")
      .send(body)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Invalid token");
      })
      .catch((e) => console.log(e));
  });
  it("should return error when token is missing", async () => {
    const body = {
      issuer: {
        issuerName: "Test",
        url: "https://example.com",
        did: "did:key:123",
      } as CreateIssuerParams,
      token: "",
    };

    await request
      .post("/issuers")
      .send(body)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0].param).toBe("token");
      })
      .catch((e) => console.log(e));
  });
  it("should return error when name is missing", async () => {
    const body = {
      issuer: {
        issuerName: "",
        url: "https://example.com",
        did: "did:key:123",
      } as CreateIssuerParams,
      token: "token",
    };

    await request
      .post("/issuers")
      .send(body)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0].param).toBe("issuer.issuerName");
      })
      .catch((e) => console.log(e));
  });
  it("should return error when url is missing", async () => {
    const body = {
      issuer: {
        issuerName: "Test",
        url: "",
        did: "did:key:123",
      } as CreateIssuerParams,
      token: "token",
    };

    await request
      .post("/issuers")
      .send(body)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0].param).toBe("issuer.url");
      })
      .catch((e) => console.log(e));
  });
  it("should return error when DID is missing", async () => {
    const body = {
      issuer: {
        issuerName: "Test",
        url: "https://example.com",
        did: "",
      } as CreateIssuerParams,
      token: "token",
    };

    await request
      .post("/issuers")
      .send(body)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0].param).toBe("issuer.did");
      })
      .catch((e) => console.log(e));
  });
});
