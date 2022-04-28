const { execSync } = require('child_process');
const { dirname, join }  = require('path');
const { readFileSync } = require('fs');

const APP_DIR = join(dirname(__filename), 'app');
const LICENSE_CHECKER = join(dirname(__filename), 'node_modules', 'license-checker', 'bin', 'license-checker');

// We need to install dependencies in order to generate license information.
execSync('npm ci', {
  cwd: APP_DIR
});

const output = JSON.parse(
  execSync(`node ${LICENSE_CHECKER} --json`, {
    cwd: APP_DIR
  })
);

const dependencies = [];

for (const packageName in output) {
  const info = output[packageName];

  // private packages are our own code. No need
  // to list them.
  if (info.private) continue;

  info.packageName = packageName;

  dependencies.push(info);
}

console.log('<h1>List of npm dependencies</h1>');

dependencies.forEach((info) => {
  console.log(`<h2>${info.packageName}</h2>`);
  if (info.publisher)
    console.log(`<b>Author: </b> ${info.publisher}<br>`);
  if (info.repository)
    console.log(`<b>Repository: </b> <a href="${info.repository}" target=_blank rel=noopener>${info.repository}</a><br>`);

  const license = readFileSync(info.licenseFile)
    .toString()
    .split(/\r?\n/)
    .map((line) => {
      if (line.length <= 80)
        return line;

      const words = line.split(/\s+/);
      line = '';

      const lines = [];

      for (const word of words) {
        if (line.length && (line + ' ' + word).length > 80) {
          lines.push(line);
          line = word;
        } else {
          line += (line.length ? ' ' : '') + word;
        }
      }

      lines.push(line);

      return lines;
    })
    .flat()
    .join('\n');

  console.log(`<pre>${license}</pre>`);
});
