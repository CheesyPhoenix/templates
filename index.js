#! /usr/bin/env node
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.clear();
let settings = { type: "sub-category" };
let currPath = "";
while (true) {
    let choices = fs
        .readdirSync(__dirname + "/templates/" + currPath, {
        withFileTypes: true,
    })
        .filter((el) => el.isDirectory());
    const questions = [
        {
            name: "template",
            type: "list",
            message: "Choose a template",
            choices,
        },
    ];
    const answers = await inquirer.prompt(questions);
    console.log(path.join("file://" + __dirname, "/templates", currPath, answers["template"]));
    settings = (await import("file://" +
        __dirname +
        "/templates/" +
        currPath +
        answers["template"] +
        "/settings.js")).default;
    if (settings.type == "template") {
        currPath += answers["template"] + "/template";
        break;
    }
    else if ((settings.type = "sub-category")) {
        currPath += answers["template"] + "/";
    }
}
const name = (await inquirer.prompt([
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
]))["name"];
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
createDirectoryContents(__dirname + `/templates/${currPath}`, name, name);
if (settings.installation) {
    settings.installation.forEach((install) => {
        exec(install, { cwd: CURR_DIR + "/" + name }, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    });
}
