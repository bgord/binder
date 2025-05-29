import * as bg from "@bgord/node";
import z from "zod/v4";

const EnvironmentSchema = z
  .object({
    PORT: bg.Schema.Port,
    LOGS_LEVEL: bg.Schema.LogLevel,
    TZ: bg.Schema.TimezoneUTC,
    BASIC_AUTH_USERNAME: bg.Schema.BasicAuthUsername,
    BASIC_AUTH_PASSWORD: bg.Schema.BasicAuthPassword,
  })
  .strip();

export const Env = new bg.EnvironmentValidator<z.infer<typeof EnvironmentSchema>>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
