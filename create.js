/*

EXAMPLE: 

    cli.js service "User" --output test/     

*/

// imported modules
const Template = require("./template");
// constants

const PACKAGE_NAME = "microservice";

// Helper Functions

const createProject = async (type, options) => {
  if (type.toLowerCase() == "microservice") {
    const template = new Template();
    await template.load(PACKAGE_NAME, options.project);

    template.setVariables({
      PROJECT_NAME: options.project,
    });

    template.export(options.path ?? "."); // create a new project with all the default modules

    if (!template.error) {
      console.log(options.project + " Microservice Project Created ");
    } else {
      // some error
      console.log(template.getError());
    }
  } else {
    console.log("Invalid Project Type");
  }
};
// Service Handler

function handler(program) {
  program
    .command("create")
    .description("Create a new Project. Available Type: Microservice")
    .argument("<string>", "Project Type")
    .requiredOption("--project <string>", "Name of the project")

    .action(async (arg, options) => {
      await createProject(arg, options);
    });
}

module.exports = handler;
