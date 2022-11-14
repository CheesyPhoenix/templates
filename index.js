#! /usr/bin/env node
import fs from "fs";
import inquirer from "inquirer";
const choices = fs.readdirSync("./templates");
console.clear();
const questions = [
    {
        name: "template",
        type: "list",
        message: "What project template would you like to generate?",
        choices,
    },
    {
        name: "name",
        type: "input",
        message: "Project name:",
        validate: (input) => {
            const valRegExp = /(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/gm;
            if (valRegExp.test(input))
                return true;
            else
                return "Project name needs to match nodejs name conventions. (/ ^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$ /)";
        },
    },
];
const answers = await inquirer.prompt(questions);
const CURR_DIR = process.cwd();
function createDirectoryContents(templatePath, newProjectPath, name) {
    fs.mkdirSync(`${CURR_DIR}/${newProjectPath}`);
    const filesToCreate = fs.readdirSync(templatePath);
    filesToCreate.forEach((file) => {
        const origFilePath = `${templatePath}/${file}`;
        // get stats about the current file
        const stats = fs.statSync(origFilePath);
        if (stats.isFile()) {
            const contents = fs
                .readFileSync(origFilePath, "utf8")
                .replaceAll("$NAME", name);
            const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
            fs.writeFileSync(writePath, contents, "utf8");
        }
        else if (stats.isDirectory()) {
            // recursive call
            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`, name);
        }
    });
}
createDirectoryContents(`./templates/${answers["template"]}`, answers["name"], answers["name"]);
