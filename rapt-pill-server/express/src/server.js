const express = require("express");
const next = require("next");
const { WebSocketServer } = require("ws");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const server = express();
// Middleware to parse JSON body
server.use(express.json());

// Use environment variables for configuration
const url = process.env.INFLUXDB_URL;
const token = process.env.INFLUXDB_TOKEN;
const org = process.env.INFLUXDB_ORG;
const bucket = process.env.INFLUXDB_BUCKET;
const expressServerPort = process.env.EXPRESS_SERVER_PORT;

const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket, "ms", {
  flushInterval: 500,
});

const updateHeaterThreshold = (wss, temperatureThreshold) => {
  // Send the new threshold to the Arduino
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ temperatureThreshold }));
    }
  });
};

// Prepare Next.js
nextApp.prepare().then(() => {
  const httpServer = server.listen(expressServerPort, (err) => {
    if (err) throw err;
    console.log(`Server ready on http://localhost:${expressServerPort}`);
  });

  // WebSocket server on the same Express server
  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (ws) => {
    console.log(`WS Client connected ${wss.clients.size}`);

    ws.on("message", (message) => {
      console.log("WS Received message:", message);
    });

    ws.on("close", () => {
      console.log("WS Client disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  // Define any API routes first
  server.post("/pillData", (req, res) => {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ message: "invalid data" });
    }
    const point = new Point("controller_data")
      .floatField("currentTemp", data.currentTemp)
      .floatField("currentGravity", data.currentGravity)
      .booleanField("heaterStatus", data.heaterStatus)
      .floatField("heaterThreshold", data.heaterThreshold)
      .floatField("battery", data.battery)
      .intField("memory", data.memory);
    writeApi.writePoint(point);
    // Handle your API endpoint logic here (e.g., receiving data from Arduino)
    res.status(200).json({ message: "success" });
  });

  server.post("/updateThreshold", (req, res) => {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ message: "invalid data" });
    }
    updateHeaterThreshold(wss, data.newThreshold);
    res.status(200).json({ message: "Threshold updated" });
  });

  // Serve Next.js pages
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Close InfluxDB connection when the process exits
  process.on("exit", () => {
    writeApi
      .close()
      .then(() => {
        console.log("InfluxDB write API closed");
      })
      .catch((err) => {
        console.error("Error closing InfluxDB write API:", err);
      });
  });
});
