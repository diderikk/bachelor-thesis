import keyHandler from "../../src/pages/api/v1/key";
import { verify } from "../../src/pages/utils/jwt";
import { testClient } from "../utils/test-client";

const request = testClient(keyHandler);

describe("/key", () => {
  it("should return an API key", async () => {
    await request
      .get("/key")
      .auth("admin", "test", {
        type: "basic",
      })
      .send()
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveProperty("key");
        expect(response.body.key.length).toBeGreaterThan(10);
        expect(await verify(response.body.key)).toBeTruthy();
      });
  });

	it("should return unauthorized when password is wrong", async () => {
    await request
      .get("/key")
      .auth("admin", "wrong password", {
        type: "basic",
      })
      .send()
      .expect(401)
  });

	it("should return unauthorized when username is wrong", async () => {
    await request
      .get("/key")
      .auth("wrong username", "test", {
        type: "basic",
      })
      .send()
      .expect(401)
  });
});
