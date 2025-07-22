/* export workflow */
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const dateFormat = require('date-fns/format');
const inquirer = require('inquirer');
const packagejson = require('../../package.json');

module.exports = (() => {
  const parentDir = path.dirname(process.cwd());

  const newProjectName = `${packagejson.name}-${
    packagejson.version
  }__${dateFormat(new Date(), 'YYYYMMDD-hhmm')}`;

  const questions = [
    {
      type: 'list',
      name: 'exportChoice',
      message: `What do you want to export?`,
      choices: [`workflow`, `project-files`],
      default: 'workflow',
    },
    {
      type: 'input',
      name: 'parentDirectory',
      default: parentDir,
      message:
        'Enter the absolute path of the directory into which you want to clone the project.',
      validate: input => {
        const isDirectory = fs.lstatSync(input).isDirectory();
        if (!isDirectory) {
          return `The specified path is not a directory or does not exist. Please try again.`;
        }
        return true;
      },
    },
  ];

  console.log(
    `Beginning export questionnaire.\nPress ctrl + c to exit at any time.`
  );
  // : \nThis will git stash any changes to the workflow and clone the entire project to the parent directory of this project, or the directory you specify. It will not clone any project-specific files.
  inquirer.prompt(questions).then(initialAnswers => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'projectName',
          message: `What should be the name of the new project folder?`,
          default:
            initialAnswers.exportChoice === 'workflow'
              ? newProjectName
              : `${newProjectName}__project-files`,
          validate: input => {
            const dirExists = fs.existsSync(
              path.resolve(initialAnswers.parentDirectory, input)
            );
            if (dirExists) {
              return `There is already a directory with the same name located there. Try again.`;
            }
            return true;
          },
        },
        {
          type: 'confirm',
          name: 'shouldZip',
          message: `Create a zip file (for sharing)?`,
          default: false,
        },
      ])
      .then(answers => {
        const newProjectPath = path.resolve(
          initialAnswers.parentDirectory,
          answers.projectName
        );
        let command;
        if (initialAnswers.exportChoice === 'workflow') {
          console.log(`exporting workflow`);
          command = `git submodule foreach 'git stash' && git clone --recursive . ${newProjectPath}`;
          if (answers.shouldZip) {
            command += ` && cd ${initialAnswers.parentDirectory} && zip -r ${
              answers.projectName
            }.zip ${answers.projectName}`;
          }
        } else {
          console.log('exporting project files');
          command = `mkdir ${newProjectPath} && cp -r ./src ${newProjectPath}/src`;
          if (answers.shouldZip) {
            command += ` && cd ${initialAnswers.parentDirectory} && zip -r ${
              answers.projectName
            }.zip ${answers.projectName}/src`;
          }
        }
        exec(command, (err, stdout, stderr) => {
          if (err) {
            // node couldn't execute the command
            console.log(err.message);
            return;
          }
          // the *entire* stdout and stderr (buffered)
          console.log(stdout);
          console.log(stderr);
        });
      });
  });
})();
