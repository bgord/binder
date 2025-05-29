import { describe, expect, test } from "bun:test";
import * as bgb from "@bgord/bun";
import * as infra from "../infra";
import { server } from "../server";

const ip = {
  server: {
    requestIP: () => ({ address: "127.0.0.1", family: "foo", port: "123" }),
  },
};

describe("POST /generate-pdf", () => {
  test("happy path", async () => {
    const res = await server.request("/generate-pdf", { method: "POST", body: JSON.stringify({}) }, ip);

    expect(res.status).toBe(200);
  });
});
