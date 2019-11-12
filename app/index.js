import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const hm = document.getElementById("hm");
const s = document.getElementById("s");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
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
  hm.text = hours + ':' + mins;
  s.text = secs;  
}
