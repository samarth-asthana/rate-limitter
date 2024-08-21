const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let requestQueue = [];
const maxCallsPerMinute = 15;
const penaltyTime = 60000;
const requestInterval = 60000 / maxCallsPerMinute;
let penaltyUntil = 0;
let requestsThisMinute = 0;
const maxQueueSize = 20;

function processRequest(input) {
  return `Processed: ${input}`;
}

function inPenaltyPeriod() {
  return Date.now() < penaltyUntil;
}

setInterval(() => {
  if (requestQueue.length > 0) {
    const { input, res } = requestQueue.shift();
    res.json({ success: true, message: processRequest(input) });
  }
}, requestInterval);

app.post("/call-api", (req, res) => {
  if (inPenaltyPeriod()) {
    res.status(429).json({
      success: false,
      error: "Rate limit exceeded. Penalty in effect.",
    });
    return;
  }

  if (requestsThisMinute >= maxCallsPerMinute) {
    penaltyUntil = Date.now() + penaltyTime;
    requestsThisMinute = 0;
    res.status(429).json({
      success: false,
      error: "Rate limit exceeded. Penalty activated.",
    });
    return;
  }

  if (requestQueue.length >= maxQueueSize) {
    res.status(429).json({
      success: false,
      error: "Request queue is full.",
    });
    return;
  }

  requestQueue.push({ input: req.body.input, res: res });
  requestsThisMinute++;
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not Found" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
