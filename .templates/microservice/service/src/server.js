const { PORT, NODE_ENV } = require("./config/");

const express = require("express");
const app = express();
const cors = require("cors");
var responseTime = require("response-time");

const Response = require("./Response");

const Service = {
  name: "<--Service_name-->",
  version: "1.0.0",
  port: PORT ?? 3000,
};

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// contains all the function to run when server starts
onServerStart();

if (NODE_ENV != "production") {
  // Log requests
  app.use(logger());
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return Response(res)
    .status(200)
    .body(Service.name + " Service is Live. Version : " + Service.version)
    .send();
});

// API Routes

app.use("/<--service_name-->", (req, res) => {
  return Response(res)
    .status(200)
    .body("Hello from " + Service.name + " Service")
    .send();
});

app.listen(PORT, () => {
  console.log(Service.name + " Service is Listening at PORT " + Service.port);
  console.log("Version: " + Service.version);
  console.log("Environment: " + NODE_ENV);
});

function onServerStart() {
  // this function runs everytime server restarts
}

function logger() {
  return responseTime(function (req, res, time) {
    console.log(
      "----------------------------------------------------------------"
    );
    console.log(
      "METHOD: " + req.method.toUpperCase() + "   ENDPOINT: " + req.originalUrl
    );
    console.log("RESPONSE TIME: " + time.toFixed(2) + "ms");
    console.log(
      "----------------------------------------------------------------"
    );
  });
}
