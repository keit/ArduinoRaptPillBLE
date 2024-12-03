import { queryApi } from "../InfluxApi";
import { InfluxDbData } from "../InfluxDbData";
import * as fs from "fs";

export async function GET(req) {
  const bucket = fs
    .readFileSync("/run/secrets/influxdb2-admin-bucket", "utf8")
    .trim();

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r._measurement == "controller_data")
      |> filter(fn: (r) => r._field == "currentTemp" or r._field == "currentGravity")
      |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
      |> yield(name: "mean")
  `;

  const data: InfluxDbData[] = [];

  return new Promise((resolve, reject) => {
    queryApi().queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        data.push({
          time: o._time,
          value: o._value,
          field: o._field,
        });
      },
      error(error) {
        console.error("Error querying InfluxDB:", error);
        reject(
          new Response(JSON.stringify({ error: "Failed to query InfluxDB" }), {
            status: 500,
          }),
        );
      },
      complete() {
        resolve(new Response(JSON.stringify(data), { status: 200 }));
      },
    });
  });
}
