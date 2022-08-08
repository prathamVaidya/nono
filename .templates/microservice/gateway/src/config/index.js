const dotEnv = require("dotenv");

if (process.env.NODE_ENV == "production") {
  // for production
  dotEnv.config();
} else {
  // for other environments
  var ext = "";
  if (process.env.NODE_ENV == "development") {
    ext = "dev";
  } else {
    ext = "local";
  }
  const configFile = "./.env." + ext;
  dotEnv.config({ path: configFile });
}

checkInstallation(); // checks if needed installation and envs are configured.

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGO_DB_URL,
  NODE_ENV: process.env.NODE_ENV,
};

function checkInstallation() {
  // this function checks if all conditions are met including envs

  if (!process.env.NODE_ENV) {
    console.error("[O] Node Environment is not Set (NODE_ENV)");
    process.exit(1);
  }

  if (!process.env.MONGO_DB_URL) {
    console.error("[O] Node Environment is not Set (MONGO_DB_URL)");
    process.exit(1);
  }
}
