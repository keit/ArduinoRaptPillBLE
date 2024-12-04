# TODO

### [Configure influxdb from compose.yaml](https://docs.influxdata.com/influxdb/v2/install/use-docker-compose/)!!!!

### How to find RAPT_PILL_BLE_MAC_ADDRESS for arduino_secrets.h

# ArduinoRaptPillBLE

## Overview

**ArduinoRaptPillBLE** is a DIY project that integrates the RaptPill hydrometer and thermometer with an Arduino to enable affordable temperature control for home beer brewing. It allows real-time monitoring of fermentation data and temperature regulation via a heater pad.

---

## What is RaptPill?

[RaptPill](https://kegland.com.au/products/yellow-rapt-pill-hydrometer-thermometer-wifi-bluetooth?_pos=1&_sid=ded3c607d&_ss=r) is an IoT device designed by [KegLand](https://kegland.com.au) for beer brewing. It measures the temperature and specific gravity of [wort](https://en.wikipedia.org/wiki/Wort) during fermentation and transmits the data via Wi-Fi or Bluetooth to the [RAPT](https://rapt.io/) cloud server.

---

## Temperature Control for Fermentation

Maintaining the correct temperature is crucial for healthy fermentation. While there are commercial solutions available, this project provides a cost-effective, which might be questionable🤨, DIY approach for home brewers.

This system uses an Arduino to control a [heater pad](https://www.google.com/search?client=safari&sca_esv=b860f2b0131a04f3&q=heat+pad+for+beer+brewing&udm=2&fbs=AEQNm0Aa4sjWe7Rqy32pFwRj0UkWxyMMuf0D-HOMEpzq2zertRy7G-dme1ONMLTCBvZzSlj66tRVUwRwRekNWy3juwtxisviIDF7RlAgLgFhqXm9X3UB_OtfUlcDLZBKoSaaHfsJkJ0cbHHytKiKn2bqVb1MV_V7l_1paomhrBctDnLOBIUbLTQahANdBGpdnBUz-rjd-DsVfdFfsjKtFltujrzobCSTQA&sa=X&ved=2ahUKEwjMndq-k4CKAxUb3jgGHcdZGmEQtKgLegQIHBAB&biw=1682&bih=973&dpr=2) placed under a fermenter.

---

## How It Works

1. **RaptPill Placement:** The RaptPill is placed inside the fermenter and sends temperature and gravity readings at configurable intervals (default: 5 minutes) via Bluetooth.

2. **Arduino Integration:** The Arduino receives these readings and:

   - Turns the heater pad **on** if the temperature is below the target.
   - Turns the heater pad **off** if the temperature exceeds the target.

3. **Data Transmission:** The Arduino sends the temperature, gravity, and target temperature data to a web server over Wi-Fi. The web server stores the data in a database.

4. **User Interaction:**
   - Users can view temperature and gravity readings on a web browser.
   - Users can update the target temperature directly from the web interface.

---

## Features

- **Affordable Temperature Control:** Eliminates the need for expensive commercial fermentation controllers.
- **Real-Time Monitoring:** View fermentation data (temperature and gravity) from any web browser.
- **Adjustable Parameters:** Easily update the target temperature from a web interface.
- **DIY Flexibility:** You have more fun when brewing beer😀.

---

## Getting Started

This is not by far a step-by-step instructions.

1. **Hardware Requirements:**

   - [Arduino UNO R4 WiFi](https://store.arduino.cc/products/uno-r4-wifi).
   - A relay module for Arduino which can handle mains voltage.

     When you are using a replay with mains voltage, you need to know what you are doing, otherwise, you may shock yourself. This is a serious topic, and we want you to be safe. If you’re NOT 100% sure what you are doing, ask someone who knows!

     You need to wire up the relay with Arduino. This might be the most challenging part of thie project.

   - [RaptPill](https://kegland.com.au/products/yellow-rapt-pill-hydrometer-thermometer-wifi-bluetooth?_pos=1&_sid=ded3c607d&_ss=r).
   - Heater pad for fermentation.
   - A Personal computer to host the web server. I used Mac but should work on Windows as well.

2. **Software Components:**
   ArduinoRaptPillBLE contains two sub projects:

   - **rapt-pill-ble:** a component which executes on Arduino
   - **rapt-pill-server:** a server which executes on a personal computer

3. **Software Installation: **

   - git clone git@github.com:keit/ArduinoRaptPillBLE.git
   - cd ArduinoRaptPillBLE/
   - open rapt-pill-ble.ino with ArduinoIDE
   - Select the correct board(Arduino UNO R4 WiFi) and port in the Arduino IDE (Tools > Board and Tools > Port).
   - set the sketchbook location to ArduinoRaptPillBLE folder in the Arduino IDE Settings.
   - Install ArduinoJSON(7.2.1), ArduinoBLE(1.3.7), WebSockets(2.6.1) libraries from ArduinoIDE.
   - Copy arduino_secrets.samp to arduino_secrets.h and populate with appropriate values.
   - Verify and upload the project to your Arduino.

   - cd ArduinoRaptPillBLE/rapt-pill-server/express
   - npm install
   - cp .env-samp to .env and populate with appropriate values.(TODO InfluxDB token!)
   - cd ArduinoRaptPillBLE/rapt-pill-server
   - docker compose up --build

---

## Future Enhancements

- Add support for cooling systems for more precise temperature control.
- Integrate with third-party platforms like Home Assistant or RAPT Cloud.
- Enable advanced analytics and notifications for fermentation progress.

---

## License

This project is open-source and licensed under the MIT License. Contributions and suggestions are welcome!
