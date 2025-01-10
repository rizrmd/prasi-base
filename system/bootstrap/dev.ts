import { existsSync } from "fs";
import { execSync } from "child_process";
import input from '@inquirer/input';
import { writeFileSync } from 'fs';

if (!existsSync("./node_modules")) {
  console.log("Installing dependencies...");
  execSync("bun i", { stdio: "inherit" });
}
if (!existsSync("./system/prasi-srv")) {
  console.log("Initializing submodules...");

  execSync(
    "git clone --depth 1 https://github.com/rizrmd/prasi-srv ./system/prasi-srv",
    {
      stdio: "inherit",
    }
  );
}

if (!existsSync("./backend/.env")) {
  console.log("Setting up database configuration...");
  const dburl = await input({
    message: 'Enter your DATABASE_URL:',
    default: 'postgresql://postgres:postgres@localhost:5432/prasi'
  });

  writeFileSync("./backend/.env", `DATABASE_URL="${dburl}"`);
  console.log("Database configuration saved.");

  console.log("Initializing database schema...");
  execSync("cd backend && bun prisma db pull && bun prisma generate", {
    stdio: "inherit",
  });
}