import { InfluxDB, QueryApi } from "@influxdata/influxdb-client";

export const queryApi = (): QueryApi => {
  const url = process.env.INFLUXDB_URL || "http://localhost:8086";
  const token = process.env.INFLUXDB_TOKEN || "your-influxdb-token";
  const org = process.env.INFLUXDB_ORG || "your-org";

  const influxDB = new InfluxDB({ url, token });
  const queryApi = influxDB.getQueryApi(org);
  return queryApi;
};
