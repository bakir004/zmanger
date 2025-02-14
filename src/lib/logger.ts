const winston = require("winston");
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");
import dotenv from "dotenv";
dotenv.config();

const { combine, timestamp, errors, json } = winston.format;

const logtail = new Logtail(process.env.BETTERSTACK_SOURCE_TOKEN, {
  endpoint: "https://" + process.env.BETTERSTACK_INGESTING_HOST,
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [new LogtailTransport(logtail)],
});
