import { execSync } from "child_process";
import { existsSync, writeFileSync } from "fs";

let should_bun_install = false;
if (!existsSync("./system/prasi-srv")) {
  console.log("Initializing submodules...");

  execSync(
    "git clone --depth 1 https://github.com/rizrmd/prasi-srv ./system/prasi-srv",
    {
      stdio: "inherit",
    }
  );
  should_bun_install = true;
}

if (!existsSync("./system/nova")) {
  console.log("Setting up -p Nova components...");
  execSync(
    "git clone --depth 1 https://github.com/rizrmd/nova-static ./system/nova",
    {
      stdio: "inherit",
    }
  );
}

if (!existsSync("./node_modules") || should_bun_install) {
  console.log("Installing dependencies...");
  execSync("bun i --trust", { stdio: "inherit" });

  process.on("exit", () => {
    execSync("bun run dev", { stdio: "inherit" });
  });
  process.exit();
}

if (process.argv.includes("system")) {
  const settings = existsSync(".vscode/settings.json")
    ? JSON.parse(require("fs").readFileSync(".vscode/settings.json", "utf-8"))
    : {};

  settings["files.exclude"] = {
    ...settings["files.exclude"],
    system: false,
  };

  if (!existsSync(".vscode")) {
    execSync("mkdir -p .vscode");
  }
  writeFileSync(".vscode/settings.json", JSON.stringify(settings, null, 2));
} else {
  const settings = existsSync(".vscode/settings.json")
    ? JSON.parse(require("fs").readFileSync(".vscode/settings.json", "utf-8"))
    : {};

  settings["files.exclude"] = {
    ...settings["files.exclude"],
    system: true,
  };

  if (!existsSync(".vscode")) {
    execSync("mkdir -p .vscode");
  }
  writeFileSync(".vscode/settings.json", JSON.stringify(settings, null, 2));
}

if (!existsSync("./backend/.env")) {
  if (!existsSync("./node_modules/@inquirer/input")) {
    console.log("Installing @inquirer/input...");
    execSync("bun i --trust", { stdio: "inherit" });

    process.on("exit", () => {
      execSync("bun run dev", { stdio: "inherit" });
    });
    process.exit();
  }

  console.clear();
  const input = (await import("@inquirer/input")).default;

  console.log("Setting up database configuration...");

  const dburl = await input({
    message: "Enter your DATABASE_URL:",
    default: "postgresql://postgres:postgres@localhost:5432/prasi",
  });

  if (dburl !== "postgresql://postgres:postgres@localhost:5432/prasi") {
    writeFileSync("./backend/.env", `DATABASE_URL="${dburl}"`);
    console.log("Database configuration saved.");

    console.log("Initializing database schema...");
    execSync("cd backend && bun prisma db pull && bun prisma generate", {
      stdio: "inherit",
    });
  } else {
    console.log("Using default database configuration. Skipping setup.");

    writeFileSync("./backend/.env", ``);
    console.log("Database configuration saved.");
  }
}
console.clear();

console.log("Starting Prasi...");

await import("prasi-srv/standalone/server");
