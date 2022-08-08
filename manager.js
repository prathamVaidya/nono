/*

EXAMPLE: 

    node cli.js install /home/pratham/Workspace/Argue/argue-backend/sample --force

*/

// imported modules
const fs = require("fs");
const fse = require("fs-extra");

// constants
const { TEMPLATE_CONFIG_FILE, TEMPLATE_FOLDER } = require("./constants");

// Helper Functions

const isInstalled = (name) => {
  if (fs.existsSync(TEMPLATE_FOLDER + name)) {
    return true;
  }

  return false;
};

const getDirectories = (source) => {
  try {
    return fs
      .readdirSync(source, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } catch (error) {
    console.log(error);
  }
};

const install = async (sourceFolder, options) => {
  if (sourceFolder.slice(-1) != "/") {
    sourceFolder += "/";
  }

  if (!fs.existsSync(sourceFolder + TEMPLATE_CONFIG_FILE)) {
    console.log("Template not found at the given path");
    return;
  }

  const data = fs.readFileSync(sourceFolder + TEMPLATE_CONFIG_FILE, {
    encoding: "utf-8",
  });

  try {
    // set required params
    const config = JSON.parse(data);

    if (isInstalled(config.name)) {
      if (!options.force) {
        console.log("Template is already Installed");
        return;
      } else {
        fse.removeSync(TEMPLATE_FOLDER + config.name);
      }
    }

    await fse.copy(sourceFolder, TEMPLATE_FOLDER + config.name, {
      overwrite: true,
    });
    console.log("Template Installed");
    return;
  } catch (error) {
    console.log(error);
    console.log("Template Conifguration File is invalid");
    return;
  }
};

const remove = async (program = null, options) => {
  if (options.all) {
    fse.removeSync(TEMPLATE_FOLDER);
    console.log("All templates removed");
    return;
  }
  if (program) {
    if (isInstalled(program)) {
      fse.removeSync(TEMPLATE_FOLDER + program);
      console.log(program + " removed");
    } else {
      console.log("Template is not Installed");
    }
  }
};

const list = async (program = null, options) => {
  const templates = getDirectories(TEMPLATE_FOLDER);

  for (let template of templates) {
    if (!program) {
      console.log("[INSTALLED]", template);
    } else {
      if (template.includes(program)) {
        console.log("[INSTALLED]", template);
      }
    }
  }
};

// Service Handler

function handler(program) {
  program
    .command("remove")
    .description("Removes an installed template")
    .argument("[string]", "Name of the Template to be removed")
    .option("--all", "Remove all the installed templates")
    .action(async (arg, options) => {
      await remove(arg, options);
    });

  program
    .command("install")
    .description("Install the template from local file or url")
    .argument("<string>", "File Path or Url")
    .option(
      "--force",
      "Forcefully install template even if it is already installed"
    )
    .action(async (arg, options) => {
      await install(arg, options);
    });

  program
    .command("list")
    .description("List all the installed templates")
    .argument("[string]", "Template starting with name")
    .action(async (arg, options) => {
      await list(arg, options);
    });
}

module.exports = handler;
