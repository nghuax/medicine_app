import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoName = process.env.PAGES_REPO_NAME ?? process.env.GITHUB_REPOSITORY?.split("/")[1] ?? path.basename(rootDir);
const pagesBasePrefix = `/${repoName}`;
const pagesDir = path.join(rootDir, ".pages");

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: {
      ...process.env,
      ...env,
    },
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function writeFile(target, contents) {
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, contents);
}

function copyDirContents(sourceDir, targetDir) {
  mkdirSync(targetDir, { recursive: true });
  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    cpSync(path.join(sourceDir, entry.name), path.join(targetDir, entry.name), { recursive: true });
  }
}

function createNotFoundPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MediFlow Redirect</title>
    <script>
      (function () {
        var repoBase = ${JSON.stringify(pagesBasePrefix)};
        var pathName = window.location.pathname.startsWith(repoBase)
          ? window.location.pathname.slice(repoBase.length)
          : window.location.pathname;
        var targetBase = repoBase + "/";
        var route = "";

        if (pathName.startsWith("/admin/")) {
          targetBase = repoBase + "/admin/";
          route = pathName.slice("/admin".length) || "/";
        } else if (pathName.startsWith("/app-skip-login/")) {
          targetBase = repoBase + "/app-skip-login/";
          route = pathName.slice("/app-skip-login".length) || "/";
        } else if (pathName.startsWith("/app/")) {
          targetBase = repoBase + "/app/";
          route = pathName.slice("/app".length) || "/";
        }

        if (!route) {
          window.location.replace(targetBase);
          return;
        }

        route += window.location.search + window.location.hash;
        window.location.replace(targetBase + "?route=" + encodeURIComponent(route));
      })();
    </script>
  </head>
  <body></body>
</html>
`;
}

rmSync(pagesDir, { force: true, recursive: true });
mkdirSync(pagesDir, { recursive: true });

run("npm", ["run", "build", "-w", "docs-web"], { PAGES_BASE_PREFIX: pagesBasePrefix });
run("npm", ["run", "build", "-w", "mobile-app"], { PAGES_BASE_PREFIX: pagesBasePrefix });
run("npm", ["run", "build", "-w", "admin-web"], { PAGES_BASE_PREFIX: pagesBasePrefix });
run("npm", ["run", "build", "-w", "mobile-app-skip-login"], { PAGES_BASE_PREFIX: pagesBasePrefix });

copyDirContents(path.join(rootDir, "docs-web", "dist"), pagesDir);
cpSync(path.join(rootDir, "mobile-app", "dist"), path.join(pagesDir, "app"), { recursive: true });
cpSync(path.join(rootDir, "admin-web", "dist"), path.join(pagesDir, "admin"), { recursive: true });
cpSync(path.join(rootDir, "mobile-app-skip-login", "dist"), path.join(pagesDir, "app-skip-login"), { recursive: true });

writeFile(path.join(pagesDir, "404.html"), createNotFoundPage());
writeFile(path.join(pagesDir, ".nojekyll"), "");
