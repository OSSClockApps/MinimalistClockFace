import clock from "clock";
import document from "document";
import { me } from "appbit";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { BodyPresenceSensor } from "body-presence";
import { battery } from "power";
import { locale } from "user-settings";
import * as util from "../common/utils";
import * as fs from "fs";
import * as messaging from "messaging";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

// Update the clock every second
clock.granularity = "seconds";

const dElem = document.getElementById("dateText");
const hmElem = document.getElementById("hoursMinutesText");
const sElem = document.getElementById("secondsText");
const hrElem = document.getElementById("heartRateText");
const bElem = document.getElementById("batteryText");

const hrVisible = true;

//HeartRateSensor
if (HeartRateSensor) {
  const hrs = new HeartRateSensor();
  hrs.start();
}

// Disable HRS when watch is not on wrist
if (BodyPresenceSensor && hrs) {
  const body = new BodyPresenceSensor();
  body.addEventListener("reading", () => {
    if (body.present && hrVisible) {
      hrs.start();
    } else {
      hrs.stop();
    }
  });
  body.start();
}

// Disable HRS when screen is off
if (display && hrs) {
  display.addEventListener("change", () => {
    if (hrs != null) {
      if (display.on && hrVisible) {
        hrs.start();
      } else {
        hrs.stop();
      }
    }
  });
}



let settings = loadSettings();
applySettings();

// Update the <text> elements every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let date = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let dateText = util.getWeekDay(today.getDay(), locale) + " ";
  if (locale.language == "en-us") {
    dateText += month + "/" + date + "/" + year;
  } else {
    dateText += date + "." + month + "." + year;
  }
  dElem.text = dateText;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = util.monoDigits(hours % 12 || 12, false);
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.monoDigits(today.getMinutes());
  let secs = util.monoDigits(today.getSeconds());
  hmElem.text = hours + ':' + mins;
  sElem.text = secs;
  if (hrs.heartRate == null) {
    hrElem.text = "--bpm";
  } else {
    hrElem.text = hrs.heartRate + "bpm";
  }
  bElem.text = battery.chargeLevel + "%";
  if (battery.chargeLevel >= 75) {
    bElem.style.fill = "lime";
  } else if (battery.chargeLevel >= 35) {
    bElem.style.fill = "yellow";
  } else {
    bElem.style.fill = "red";
  }
}

//Settings

function applySettings() {
  hmElem.style.fill = settings.color;
  sElem.style.fill = settings.color;
  hrVisible = !settings.hideHeartRate;
  if(!hrVisible){
    hrs.stop();
  }else{
    hrs.start();
  }
  hrElem.style.display = settings.hideHeartRate ? "none" : "inherit";
  bElem.style.display = settings.hideBattery ? "none" : "inherit";
  dElem.style.display = settings.hideDate ? "none" : "inherit";
}

messaging.peerSocket.onmessage = (evt) => {
  if (evt.data.key == "fontColor") {
    settings.color = evt.data.value;
  } else if (evt.data.key == "hideHeartRate") {
    settings.hideHeartRate = evt.data.value;
  } else if (evt.data.key == "hideBattery") {
    settings.hideBattery = evt.data.value;
  } else if (evt.data.key == "hideDate") {
    settings.hideDate = evt.data.value;
  }
  applySettings()
}


me.onunload = saveSettings;

function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {
      color: "lime",
      hideHeartRate: false,
      hideBattery: false,
      hideDate: false
    }
  }
}

function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
