# Nono - CLI

Nono CLI is a development tool to speed up your development process. You can use your own codebase and convert into a template or you can use template offered by Nono to manage and create Microservice Project.

## Commands:

- To create a new microservice project. This will create a new project with a default gateway and config file called nono.json

  `nono create microservice --project <PROJECT-NAME>`

- To create a new micro service. Use command in the project directory.

  `nono service <SERVICE-NAME> --port <PORT>`

- Other Manager Commands

  `nono list` -> To view list of installed templates  
  `nono install <FOLDER-PATH>`-> To install a template from directory  
  `nono remove <TEMPLATE-NAME>` -> To uninstall an installed template

## Requirements:

To install all the requirements use

    npm i
