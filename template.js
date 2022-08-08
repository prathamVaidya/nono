const fs = require("fs");
const replace = require("replace-in-file");
const fse = require("fs-extra");
const ConfigurationManager = require("./ConfigurationManager");
const isInstalled = (name) => {
  if (fs.existsSync(TEMPLATE_FOLDER + name)) {
    return true;
  }

  return false;
};

const {
  TEMPLATE_CONFIG_FILE,
  TEMP_FOLDER_PATH,
  TEMPLATE_FOLDER,
} = require("./constants");

class Template {
  constructor(templateUrl = null) {
    // pass the template url if already loaded in .temp folder with changed name
    this._isLoaded = false;
    this.error = false;
    this.module = null;

    if (!templateUrl) {
      return;
    }
    this._loadConfiguration(templateUrl);
  }

  // load the template from source template folder
  async load(packageName, projectDirName) {
    if (!isInstalled(packageName)) {
      throw Error("Template Package is not installed");
    }

    const sourceFolder = TEMPLATE_FOLDER + packageName;
    this.name = projectDirName; // set template name, will be used as folder name while exporting

    // create folder if not found
    if (!fs.existsSync(TEMP_FOLDER_PATH)) {
      fs.mkdirSync(TEMP_FOLDER_PATH);
    }
    const folderPath =
      TEMP_FOLDER_PATH +
      Math.floor(Date.now()).toString() +
      Math.floor(Math.random() * 10000).toString() +
      "/";

    // copy from source folder
    await fse.copy(sourceFolder, folderPath);

    this._loadConfiguration(folderPath);
  }

  async export(expPath) {
    if (!this.module) {
      // when creating project. delete unnecessary files
      fse.removeSync(this.templatePath + TEMPLATE_CONFIG_FILE); // remove template file before exporting

      for (let moduleData of this.config.modules) {
        if (moduleData.default == false) {
          fse.removeSync(this.templatePath + moduleData.path); // remove modules
        }
      }
    }

    try {
      if (!this.moduleData) {
        fse.moveSync(this.templatePath, expPath + "/" + this.name);
      } else {
        fse.moveSync(
          this.templatePath + this.moduleData.path,
          expPath + "/" + this.name
        );

        // delete template for temp storage
        this.delete();
      }
    } catch (error) {
      // delete template for temp storage
      this.delete();
      return this.setError(
        "(FOLDER ALREADY EXISTS) Cannot create from template here because a folder with the same name already exists"
      );
    }
  }

  setError(msg) {
    this.error = true;
    this.errorMessage = msg;
  }

  getError() {
    return this.errorMessage;
  }

  delete() {
    // delete from temp

    if (fs.existsSync(this.templatePath)) {
      fse.removeSync(this.templatePath);
    }
  }

  _loadConfiguration(templateUrl) {
    this.templatePath = templateUrl;

    if (!fs.existsSync(templateUrl + TEMPLATE_CONFIG_FILE)) {
      this.delete();
      throw Error(
        "No Template Configuration found in the given folder " + templateUrl
      );
    }

    const data = fs.readFileSync(templateUrl + TEMPLATE_CONFIG_FILE, {
      encoding: "utf-8",
    });
    try {
      // set required params
      this.config = JSON.parse(data);
      this._isLoaded = true; // indicates loaded
    } catch (error) {
      this.delete();
      throw Error(
        "Template Configuration File in not in valid JSON format " + templateUrl
      );
    }
  }

  useModule(moduleName) {
    this.module = moduleName;

    const moduleIndex = this.config.modules.findIndex((obj) => {
      return obj.name == this.module;
    });

    if (moduleIndex == -1) {
      throw Error("Module Not Found");
    }

    this.moduleData = this.config.modules[moduleIndex];
  }

  setVariables(variables = {}) {
    if (!this._isLoaded) {
      throw Error("Template not loaded");
    }

    // init it here because Module state is known at this time
    if (this.moduleData) {
      this.cm = new ConfigurationManager(); // normal init, throws error if nono.json not found
    } else {
      this.cm = new ConfigurationManager(
        this.templatePath + ConfigurationManager.CONFIG_FILE_NAME,
        true
      ); // init nono.json in empty project
    }

    if (this.moduleData) {
      // if module selected

      // restore global var
      variables = {
        ...this.cm.getGlobalVariables(),
        ...variables,
      };

      var moduleConfigVariables = this.moduleData.variables;
      // set Module variables
      for (let variable of moduleConfigVariables) {
        // set this variable
        variable.fullpath = [];
        for (let path of variable.path) {
          // push full path
          variable.fullpath.push(
            this.templatePath + this.moduleData.path + path
          );

          var dict = {};
          dict[variable.name] = variables[variable.name] ?? variable.default;

          if (!variable.inherit) {
            this.cm.setVariables(dict, {
              name: this.name,
              type: this.moduleData.name,
            });
          }

          this._setVariable(variables[variable.name], variable);
        }
      }
    } else {
      // create project

      var configVariables = this.config.variables;
      // set Global variables
      for (let variable of configVariables) {
        // set this variable
        variable.fullpath = [];
        for (let path of variable.path) {
          // push full path
          variable.fullpath.push(this.templatePath + path);

          var dict = {};
          dict[variable.name] = variables[variable.name] ?? variable.default;
          this.cm.setVariables(dict);
          this._setVariable(variables[variable.name], variable);
        }
      }
    }

    // saves the nono config file.
    this.cm.save();
  }

  _setVariable(value, variable) {
    // update var in nono config file

    // find and replace the variables
    try {
      // Search For Lowercase
      replace.sync({
        files: variable.fullpath,
        from: new RegExp(`<--${variable.name.toLowerCase()}-->`, "g"),
        to: value.toLowerCase(),
      });

      // Search For Uppercase
      replace.sync({
        files: variable.fullpath,
        from: new RegExp(`<--${variable.name.toUpperCase()}-->`, "g"),
        to: value.toUpperCase(),
      });

      // Search For Propercase
      replace.sync({
        files: variable.fullpath,
        from: new RegExp(`<--${variable.name.toProperCase()}-->`, "g"),
        to: value.toProperCase(),
      });
    } catch (error) {
      //   console.error("Error occurred:", error);
    }
  }
}

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

module.exports = Template;
