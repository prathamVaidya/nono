#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();

// https://openbase.com/js/commander

const serviceHandler = require("./service");
const managerHandler = require("./manager");
const createProjectHandler = require("./create");

program
  .name("nono")
  .description("CLI to create Backend Node quickly")
  .version("0.0.1");

serviceHandler(program);
managerHandler(program);
createProjectHandler(program);
program.parse();
