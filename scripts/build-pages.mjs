import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
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

function createLandingPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MediFlow</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, system-ui, sans-serif;
        background: #f5f7f0;
        color: #111827;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at top right, rgba(228, 247, 182, 0.85), transparent 28%),
          radial-gradient(circle at left center, rgba(216, 241, 255, 0.72), transparent 24%),
          #f5f7f0;
      }
      main {
        width: min(540px, calc(100vw - 32px));
        border-radius: 32px;
        padding: 32px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 24px 48px rgba(17, 24, 39, 0.08);
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 5vw, 2.8rem);
        line-height: 0.95;
        letter-spacing: -0.04em;
      }
      p {
        margin: 0 0 24px;
        color: #5e6773;
        line-height: 1.6;
      }
      .links {
        display: grid;
        gap: 12px;
      }
      a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 999px;
        padding: 14px 18px;
        background: #eef4e3;
        color: inherit;
        text-decoration: none;
        font-weight: 700;
      }
      a.admin {
        background: #ffffff;
        box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.06);
      }
    </style>
  </head>
  <body>
    <main>
      <h1>MediFlow</h1>
      <p>GitHub Pages build for the mobile medicine app and the admin dashboard.</p>
      <div class="links">
        <a href="./app/">Open mobile app <span>/app/</span></a>
        <a href="./app-skip-login/">Open no-login app <span>/app-skip-login/</span></a>
        <a class="admin" href="./admin/">Open admin dashboard <span>/admin/</span></a>
      </div>
    </main>
  </body>
</html>
`;
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
        var targetBase = repoBase + "/app/";
        var route = "/";

        if (pathName.startsWith("/admin/")) {
          targetBase = repoBase + "/admin/";
          route = pathName.slice("/admin".length) || "/";
        } else if (pathName.startsWith("/app-skip-login/")) {
          targetBase = repoBase + "/app-skip-login/";
          route = pathName.slice("/app-skip-login".length) || "/";
        } else if (pathName.startsWith("/app/")) {
          route = pathName.slice("/app".length) || "/";
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

run("npm", ["run", "build", "-w", "mobile-app"], { PAGES_BASE_PREFIX: pagesBasePrefix });
run("npm", ["run", "build", "-w", "admin-web"], { PAGES_BASE_PREFIX: pagesBasePrefix });
run("npm", ["run", "build", "-w", "mobile-app-skip-login"], { PAGES_BASE_PREFIX: pagesBasePrefix });

cpSync(path.join(rootDir, "mobile-app", "dist"), path.join(pagesDir, "app"), { recursive: true });
cpSync(path.join(rootDir, "admin-web", "dist"), path.join(pagesDir, "admin"), { recursive: true });
cpSync(path.join(rootDir, "mobile-app-skip-login", "dist"), path.join(pagesDir, "app-skip-login"), { recursive: true });

writeFile(path.join(pagesDir, "index.html"), createLandingPage());
writeFile(path.join(pagesDir, "404.html"), createNotFoundPage());
writeFile(path.join(pagesDir, ".nojekyll"), "");
