#!/usr/bin/env node

import inquirer from 'inquirer';

import renameDemosStartdemos from './actions/rename-demos-startdemos';

async function prompt() {
  const input = (
    await inquirer.prompt({
      type: 'list',
      message: 'What do you want to do?',
      name: 'kb',
      choices: [{ name: "Rename demos and get a 'startdemos' command." }]
    })
  ).kb;

  if (input === "Rename demos and get a 'startdemos' command.") {
    renameDemosStartdemos();
  }
}

prompt();
