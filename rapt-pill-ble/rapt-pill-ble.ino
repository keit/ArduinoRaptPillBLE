#include "WiFiS3.h"
#include "IPAddress.h"
#include <ArduinoJson.h>
#include <ArduinoBLE.h>
#include <WebSocketsClient.h>

#include "arduino_secrets.h"
#include "ControllerData.h"
#include "DataUploader.h"

#define POWER 7
#define HEATER_ON_LED 0
#define HEATER_OFF_LED 3

// WiFi credentials
const char* ssid = SECRET_SSID;
const char* password = SECRET_PASS;

WebSocketsClient webSocket;

// RAPT Pill's BLE address can be reliably calculated
// by taking the the MAC address used for registration and adding 2 on the last octet.
const String broadcasterAddress = RAPT_PILL_BLE_MAC_ADDRESS;  // MAC address for BLE.

ControllerData ctrlData;

void setup() {
  delay(1000); // 1 second delay to give time initialization after upload.
  Serial.begin(9600);

  pinMode(HEATER_ON_LED, OUTPUT);
  pinMode(HEATER_OFF_LED, OUTPUT);
  pinMode(POWER, OUTPUT);

  initCtrlData(ctrlData);

  connectToWiFi();

  // Start the HTTP server
  // server.begin();

    // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy module failed!");

    while (1);
  }

  Serial.println("Bluetooth® Low Energy Central scan callback");

  // set the discovered event handle
  BLE.setEventHandler(BLEDiscovered, bleCentralDiscoverHandler);

  // start scanning for peripheral
  BLE.scanForAddress(broadcasterAddress, false);

   // Connect to WebSocket server
  webSocket.begin(DATA_LOGGER_SERVER, DATA_LOGGER_SERVER_PORT);  // Adjust the path if necessary
  webSocket.onEvent(webSocketEvent);  // Bind the event handler

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket Disconnected");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket Connected");
      // Send a message once connected
      break;
    case WStype_TEXT: {
      Serial.println("WebSocket received mesaage");
      // Process incoming message (e.g., new threshold)
      String message = String((char*)payload);

      StaticJsonDocument<100> doc;
      // Parse the JSON string
      deserializeJson(doc, message);
      float newThreshold = doc["temperatureThreshold"];

      updateHeaterThreshold(ctrlData, newThreshold);
      uploadData(ctrlData);
      switchPower(ctrlData.heaterStatus);
      updateMemorySize(ctrlData);
      break;
    }
    default:
      Serial.println("WebSocket received something");
      break;
  }
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
  Serial.print("Connected to WiFi! ");
  Serial.println(WiFi.localIP());
}

void checkWiFi() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Reconnecting to WiFi...");
        WiFi.disconnect();
        WiFi.begin(ssid, password);
        while (WiFi.status() != WL_CONNECTED) {
            delay(1000);
            Serial.print(".");
        }
        Serial.println("Reconnected to WiFi.");
    }
}


void switchPower(bool heaterStatus) {
  if (heaterStatus) {
    heaterOn();
  }
  else {
    heaterOff();
  }
}

void heaterOn() {
  Serial.println("tuon ON heater");
  digitalWrite(POWER, HIGH);
  digitalWrite(HEATER_ON_LED, HIGH);
  digitalWrite(HEATER_OFF_LED, LOW);
}

void heaterOff() {
  Serial.println("tuon OFF heater");
  digitalWrite(POWER, LOW);
  digitalWrite(HEATER_ON_LED, LOW);
  digitalWrite(HEATER_OFF_LED, HIGH);
}

void bleCentralDiscoverHandler(BLEDevice peripheral) {
  if (peripheral.hasManufacturerData()) {
    int len = peripheral.manufacturerDataLength();
    uint8_t manufactureData[len];
    peripheral.manufacturerData(manufactureData, len);

    if (parseRaptPillDataV2(manufactureData, len, ctrlData)) {
      uploadData(ctrlData);
      switchPower(ctrlData.heaterStatus);
      updateMemorySize(ctrlData);
    } else {
      Serial.println("Failed to parse RAPT Pill data");
    }
  }
}

void loop() {
  checkWiFi();

  webSocket.loop();
  BLE.poll();
}
