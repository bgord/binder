import * as bgb from "@bgord/bun";
import * as bgn from "@bgord/node";
import { basicAuth } from "hono/basic-auth";
import { HTTPException } from "hono/http-exception";
import type { TimingVariables } from "hono/timing";
import { Env } from "./env";

export * from "./env";
export * from "./logger";

export const requestTimeoutError = new HTTPException(408, {
  message: "request_timeout_error",
});

export type Variables = TimingVariables &
  bgb.TimeZoneOffsetVariables &
  bgb.ContextVariables &
  bgb.EtagVariables;

export const BODY_LIMIT_MAX_SIZE = new bgn.Size({
  value: 128,
  unit: bgn.SizeUnit.kB,
}).toBytes();

export const BasicAuthShield = basicAuth({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});

export const prerequisites = [
  new bgn.PrerequisitePort({ label: "port", port: Env.PORT }),
  new bgn.PrerequisiteTimezoneUTC({ label: "timezone", timezone: Env.TZ }),
  new bgn.PrerequisiteRAM({
    label: "RAM",
    enabled: Env.type !== bgn.Schema.NodeEnvironmentEnum.local,
    minimum: new bgn.Size({ unit: bgn.SizeUnit.MB, value: 128 }),
  }),
  new bgn.PrerequisiteSpace({
    label: "disk-space",
    minimum: new bgn.Size({ unit: bgn.SizeUnit.MB, value: 512 }),
  }),
  new bgn.PrerequisiteNode({
    label: "node",
    version: bgn.PackageVersion.fromStringWithV("v24.1.0"),
  }),
  new bgn.PrerequisiteBun({
    label: "bun",
    version: bgn.PackageVersion.fromString("1.2.15"),
    current: Bun.version,
  }),
  new bgn.PrerequisiteMemory({
    label: "memory-consumption",
    maximum: new bgn.Size({ value: 300, unit: bgn.SizeUnit.MB }),
  }),
];

export const healthcheck = [
  new bgn.PrerequisiteSelf({ label: "self" }),
  new bgn.PrerequisiteOutsideConnectivity({ label: "outside-connectivity" }),
  ...prerequisites.filter((prerequisite) => prerequisite.config.label !== "port"),
];
