import inquirer from 'inquirer';
import fs from 'fs-extra';

export default async function () {
  const demoName = (
    await inquirer.prompt({
      type: 'input',
      message: 'Name of demos to rename.',
      name: 'demoName',
      validate: async (input) => {
        if (!input) {
          return 'Must provide a demo name.';
        }
        return true;
      }
    })
  ).demoName;
  const nameDemoName = (
    await inquirer.prompt({
      type: 'input',
      message: 'New demo name. Leave blank to rename to numbers in ascending order.',
      name: 'newDemoName'
    })
  ).newDemoName;

  const regex = new RegExp(`^${demoName}(_\\d+)?\\.dem$`);
  const files = (await fs.readdir('./')).filter((fileName) => {
    return !!fileName.match(regex);
  });

  if (files.length === 0) {
    console.log(`No demos found by the name '${demoName}'.`);

    process.exit();
  }

  const shouldRename = (
    await inquirer.prompt({
      type: 'confirm',
      message: `Proceeding will rename ${files.length} file${
        files.length === 1 ? '' : 's'
      }. Continue?`,
      name: 'shouldRename'
    })
  ).shouldRename;

  if (shouldRename) {
    const allFiles: number[] = [];

    files.forEach((fileName) => {
      const regexMatch = fileName.match(regex);
      if (!regexMatch) {
        return;
      }

      const regexResult = regexMatch[1];
      let newName;

      if (!regexResult) {
        newName = '1';
      } else {
        newName = `${regexResult.substring(1)}`;
      }

      allFiles.push(Number(newName));
      fs.renameSync(`./${fileName}`, `${nameDemoName ? `${nameDemoName}_` : ''}${newName}.dem`);
    });

    console.log('');
    console.log('Use the following command to play all demos in game.');
    console.log(
      `startdemos ${allFiles
        .sort((a, b) => {
          return a - b;
        })
        .map((fileNumber) => {
          return `${nameDemoName ? `${nameDemoName}_` : ''}${fileNumber}`;
        })
        .join(' ')}`
    );

    return;
  }

  process.exit();
}
