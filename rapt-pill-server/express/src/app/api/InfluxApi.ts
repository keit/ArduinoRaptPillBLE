import { InfluxDB, QueryApi } from "@influxdata/influxdb-client";
import * as fs from "fs";

export const queryApi = (): QueryApi => {
  const url = process.env.INFLUXDB_URL || "http://localhost:8086";
  const token = fs
    .readFileSync("/run/secrets/influxdb2-admin-token", "utf8")
    .trim();
  const org = fs
    .readFileSync("/run/secrets/influxdb2-admin-orgname", "utf8")
    .trim();

  const influxDB = new InfluxDB({ url, token });
  const queryApi = influxDB.getQueryApi(org);
  return queryApi;
};
