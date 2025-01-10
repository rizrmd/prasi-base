import { existsSync } from "fs";
import { execSync } from "child_process";
import input from "@inquirer/input";
import { writeFileSync } from "fs";
if (!existsSync("./system/prasi-srv")) {
  console.log("Initializing submodules...");

  execSync(
    "git clone --depth 1 https://github.com/rizrmd/prasi-srv ./system/prasi-srv",
    {
      stdio: "inherit",
    }
  );
}

if (!existsSync("./system/nova")) {
  console.log("Setting up -p Nova components...");
  execSync("git clone --depth 1 https://github.com/rizrmd/prasi ./tmp-prasi", {
    stdio: "inherit",
  });
  if (process.platform === "win32") {
    execSync("if not exist .\\system\\nova mkdir .\\system\\nova");
    execSync(
      "xcopy .\\tmp-prasi\\frontend\\src\\nova\\prod\\* .\\system\\nova\\ /E /I /Y"
    );
    execSync("rmdir /S /Q .\\tmp-prasi");
  } else {
    execSync("mkdir -p ./system/nova");
    execSync("cp -r ./tmp-prasi/frontend/src/nova/prod/* ./system/nova/");
    execSync("rm -rf ./tmp-prasi");
  }
}

if (!existsSync("./node_modules")) {
  console.log("Installing dependencies...");
  execSync("bun i", { stdio: "inherit" });

  process.on("exit", () => {
    execSync("bun run dev", { stdio: "inherit" });
  });
  process.exit();
}

if (!existsSync("./backend/.env")) {
  console.clear();
  console.log("Setting up database configuration...");
  const askDb = await input({
    message: "Do you want to configure DATABASE_URL? (y/N):",
    default: "n",
  });

  if (askDb.toLowerCase() === "y") {
    const dburl = await input({
      message: "Enter your DATABASE_URL:",
      default: "postgresql://postgres:postgres@localhost:5432/prasi",
    });
    writeFileSync("./backend/.env", `DATABASE_URL="${dburl}"`);
    console.log("Database configuration saved.");

    console.log("Initializing database schema...");
    execSync("cd backend && bun prisma db pull && bun prisma generate", {
      stdio: "inherit",
    });
  } else {
    console.log("Skipping database configuration.");
  }
}
console.clear();

await import("prasi-srv/standalone/server");
