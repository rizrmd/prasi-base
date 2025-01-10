import { existsSync } from "fs";
import { execSync } from "child_process";

if (!existsSync("./node_modules")) {
  console.log("Installing dependencies...");
  execSync("bun i", { stdio: "inherit" });
}
