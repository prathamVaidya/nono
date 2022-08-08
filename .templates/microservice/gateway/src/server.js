const { PORT, NODE_ENV } = require("./config/");

const express = require("express");
const app = express();
const cors = require("cors");
const proxy = require("express-http-proxy");
var responseTime = require("response-time");

const Response = require("./Response");

const Service = {
  name: "gateway",
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

app.use(
  "/user",
  proxy("http://localhost:3005", {
    proxyErrorHandler: proxyErrorHandler,
  })
);
// [NEW_ROUTE] Don't remove this line. Use `nono service <name>` to create a new service.

// all default routes
app.get(
  "/",
  proxy("http://localhost:3005", {
    proxyErrorHandler: proxyErrorHandler,
  })
);
// [DEFAULT_ROUTE] Don't remove this line. Change default route as per your preference.

// API Routes

app.listen(PORT, () => {
  console.log(Service.name + " Service is Listening at PORT " + Service.port);
  console.log("Version: " + Service.version);
  console.log("Environment: " + NODE_ENV);
});

function onServerStart() {
  // this function runs everytime server restarts
}
console.log();
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

function proxyErrorHandler(err, res, next) {
  return Response(res).status(503).error("Service is not available").send();
}
