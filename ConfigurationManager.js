const fs = require("fs");

class ConfigurationManager {
  static CONFIG_FILE_NAME = "nono.json";

  constructor(path = null, init = false) {
    // load var

    this.PATH = path ?? "./" + ConfigurationManager.CONFIG_FILE_NAME;
    this._isLoaded = false;

    this.loadConfiguration(init);
  }

  loadConfiguration(init) {
    if (init) {
      fs.writeFileSync(this.PATH, JSON.stringify({}));
    }

    if (!fs.existsSync(this.PATH)) {
      throw Error("Project is not initiliazed");
    }

    const data = fs.readFileSync(this.PATH, {
      encoding: "utf-8",
    });

    try {
      // load config to memory
      this.data = JSON.parse(data);
      this._isLoaded = true; // indicates loaded
    } catch (error) {
      throw Error("Project Nono File is Not valid");
    }
  }

  setVariables(vars, moduleData = null) {
    if (!moduleData) {
      var variables = this.data.variables ?? {}; // init key-value pair
      Object.keys(vars).map((key) => (variables[key] = vars[key])); // update key-value pair
      this.data.variables = variables;
    } else {
      // for module

      module = moduleData.name;
      if (this.data["modules"] == undefined) {
        this.data.modules = [];
      }

      var moduleIndex = this.data.modules.findIndex((el) => el.name == module);
      var moduleObj;

      if (moduleIndex == -1) {
        moduleObj = {
          name: module,
          type: moduleData.type,
          variables: {},
        };
      } else {
        moduleObj = this.data.modules[moduleIndex];
      }

      var variables = moduleObj.variables;
      Object.keys(vars).map((key) => (variables[key] = vars[key])); // update key-value pair
      moduleObj.variables = variables;
      if (moduleIndex == -1) {
        this.data.modules.push(moduleObj);
      } else {
        this.data.modules[moduleIndex] = moduleObj;
      }
    }

    // console.log(JSON.stringify(this.data, null, 2));
  }

  save() {
    // return;
    // saves the config file to path. IMP
    fs.writeFileSync(this.PATH, JSON.stringify(this.data, null, 2));
  }

  get() {
    return this.data;
  }
  getGlobalVariables() {
    return this.data.variables;
  }
}

module.exports = ConfigurationManager;
