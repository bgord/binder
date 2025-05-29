import * as bgb from "@bgord/bun";
import * as bgn from "@bgord/node";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timeout } from "hono/timeout";
import { timing } from "hono/timing";
import * as App from "./app";
import * as infra from "./infra";

type Env = {
  Variables: infra.Variables;
  startup: bgn.Stopwatch;
};

const server = new Hono<Env>();

server.use(secureHeaders());
server.use(bodyLimit({ maxSize: infra.BODY_LIMIT_MAX_SIZE }));
server.use(bgb.ApiVersion.attach);
server.use(cors({ origin: "*" }));
server.use(requestId());
server.use(bgb.TimeZoneOffset.attach);
server.use(bgb.Context.attach);
server.use(bgb.WeakETagExtractor.attach);
server.use(bgb.ETagExtractor.attach);
server.use(bgb.HttpLogger.build(infra.logger));
server.use(timing());

const startup = new bgn.Stopwatch();

// Healthcheck =================
server.get(
  "/healthcheck",
  bgb.rateLimitShield(bgn.Time.Seconds(5)),
  timeout(bgn.Time.Seconds(15).ms, infra.requestTimeoutError),
  infra.BasicAuthShield,
  ...bgb.Healthcheck.build(infra.healthcheck),
);
// =============================

server.onError(App.Routes.ErrorHandler.handle);

export { server, startup };
