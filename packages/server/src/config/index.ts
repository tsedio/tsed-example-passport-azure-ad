import {readFileSync} from "fs";
import {envs} from "./envs/index";
import loggerConfig from "./logger/index";
import {passportConfig} from "./passport";

const pkg = JSON.parse(readFileSync("./package.json", {encoding: "utf8"}));

export const config: Partial<TsED.Configuration> = {
  version: pkg.version,
  envs,
  logger: loggerConfig,
  passport: passportConfig
};
