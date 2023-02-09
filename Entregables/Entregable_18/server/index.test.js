const { expect } = require("chai");
const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const jar = new CookieJar();
const client = wrapper(
  axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8081",
    jar,
  })
);

// const instance = axios.create({
//   withCredentials: true,
//   baseURL: "http://localhost:8081",
// });

describe("startUp", function () {
  before("start up", async () => {
    try {
      const result = await client.post("/register", {
        username: "sol",
        password: "123",
      });
      expect(result.status).to.eq(200);
    } catch (error) {
      expect(error.response.status).to.eq(401);
    }
  });

  describe("verificando endpoints USER", () => {
    it("verificar post login 200 ok", async () => {
      const result = await client.post("/login", {
        username: "sol",
        password: "123",
      });
      expect(result.status).to.eq(200);
      expect(result.data.message).to.eq("exito");
      expect(result.data.user.username).to.eq("sol");
    });

    it("verificar post login 200 return User", async () => {
      const result = await client.post("/login", {
        username: "sol",
        password: "123",
      });
      expect(result.data.user.username).to.eq("sol");
    });

    it("verificar get Login OK", async () => {
      await client.post("/login", {
        username: "sol",
        password: "123",
      });
      const result = await client.get("/login");
      expect(result.status).to.eq(200);
    });

    it("verificar get LOGOUT OK", async () => {
      const result = await client.get("/logout");
      expect(result.data.status).to.eq("success");
      expect(result.status).to.eq(200);
    });

    it("verificar post register ok", async () => {
      try {
        const result = await client.post("/register", {
          username: "maxi",
          password: "123",
        });
        expect(result.status).to.eq(200);
      } catch (error) {
        expect(error.response.status).to.eq(401);
      }
    });

    it("verificar get LOGOUT OK", async () => {
      await client.post("/login", {
        username: "sol",
        password: "123",
      });
      const result = await client.get("/productos-test");
      expect(result.data.length).to.eq(6);
      expect(result.data[0]).to.include.keys("title", "price", "thumbnail");
      expect(result.status).to.eq(200);
    });
  });
});
