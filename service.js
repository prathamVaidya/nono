/*

EXAMPLE: 

    cli.js service "User" --output test/     

*/

// imported modules
const Template = require("./template");
// constants

const PACKAGE_NAME = "microservice";

// Helper Functions

const createService = async (name, options) => {
  const template = new Template();
  try {
    await template.load(PACKAGE_NAME, name);
    template.useModule("service");
    template.setVariables({
      SERVICE_NAME: name,
      PORT: options.port,
    });

    var finalPath = options.path ?? ".";
    template.export(finalPath);

    if (!template.error) {
      console.log("Microservice Created for " + name);
    } else {
      // some error
      console.log(template.getError());
    }
  } catch (error) {
    console.log(error.message);
    template.delete();
  }
};
// Service Handler

function serviceHandler(program) {
  program
    .command("service")
    .description("Create a new Service in MicroService Architecture")
    .argument("<string>", "Service name")
    .option(
      "-p, --port <number>",
      "Port for the service defined in .env (Default: 3000)"
    )
    .option(
      "-o, --output <file>",
      "Path of the folder to create the new service"
    )
    .action(async (name, options) => {
      await createService(name, options);
    });
}

module.exports = serviceHandler;
