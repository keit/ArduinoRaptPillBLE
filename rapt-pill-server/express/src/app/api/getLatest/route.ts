import { queryApi } from "../InfluxApi";
import { InfluxDbData, reduceToData } from "../InfluxDbData";

export async function GET() {
  const bucket = process.env.INFLUXDB_BUCKET || "your-bucket";

  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "controller_data")
      |> last()
  `;

  const rows: InfluxDbData[] = [];

  return new Promise((resolve, reject) => {
    queryApi().queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        rows.push({
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
        const data = reduceToData(rows);
        resolve(new Response(JSON.stringify(data), { status: 200 }));
      },
    });
  });
}
