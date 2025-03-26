/* eslint-disable */
const winston = require("winston");
const winstonTcp = require("winston-tcp");

const logstashHost = "64.226.106.170";
const logstashPort = 50000;

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winstonTcp({
      host: logstashHost,
      port: logstashPort,
    }),
  ],
});
