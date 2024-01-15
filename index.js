#!/usr/bin/env node

import { createInterface } from "readline";
import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let projectName = "";
rl.question("Project name: ", (input) => {
  if (!input.match(/^[a-z0-9-]+$/)) {
    console.error("Invalid project name");
    process.exit(1);
  }

  projectName = input;

  console.log("Cloning template...");

  execSync(
    `git clone https://github.com/DanielCaz/chrome-extension-template.git ${projectName}`
  );

  const packageJson = JSON.parse(
    readFileSync(`${projectName}/package.json`, "utf8")
  );

  packageJson.name = projectName;
  delete packageJson.repository;
  delete packageJson.bugs;
  delete packageJson.homepage;
  delete packageJson.author;
  delete packageJson.license;

  writeFileSync(
    `${projectName}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );

  execSync(`rmdir /s /q ${projectName}\\.git`);

  execSync(`cd ${projectName} && del /q LICENSE`);

  console.log("Installing dependencies...");
  execSync(`cd ${projectName} && npm install`);

  rl.close();
});

rl.on("close", () => {
  console.log("Done!");

  process.exit(0);
});
