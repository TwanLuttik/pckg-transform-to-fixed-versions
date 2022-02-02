import fs from "node:fs";
import { parse as yarnParse } from "parse-yarn-lockfile";

let yarnLock = fs.readFileSync("./input/yarn.lock", { encoding: "utf-8" });
// parse the yarn.lock file to a readable json format
yarnLock = yarnParse(yarnLock).object;

let pckg = fs.readFileSync("./input/package.json", { encoding: "utf8" });
// parse to json
pckg = JSON.parse(pckg);

const main = async () => {
  if (pckg?.dependencies)
    pckg.dependencies = getFixedVersionsList(pckg.dependencies);

  if (pckg.devDependencies)
    pckg.devDependencies = getFixedVersionsList(pckg.devDependencies);

  fs.writeFileSync("./output/package.json", JSON.stringify(pckg), "utf8");
};

const getFixedVersionsList = (obj) => {
  let newObjectList = {};

  // loop trough the dependecies
  for (let item of Object.entries(obj)) {
    const package_name = item[0];
    const package_version = item[1];

    console.log(`packaged name: ${package_name}@${package_version}`);
    if (package_version.includes("^") || package_version.includes("~")) {
      Object.entries(yarnLock).map((v) => {
        if (v[0].includes(package_name + "@" + package_version)) {
          console.log(`using version ${v[1].version} `);
          newObjectList[package_name] = v[1].version;
        }
      });
      console.log(`\n`);
    } else {
      console.log("Already using fixed version");
      console.log(`\n`);
      newObjectList[package_name] = package_version;
    }
  }

  return newObjectList;
};

main();
