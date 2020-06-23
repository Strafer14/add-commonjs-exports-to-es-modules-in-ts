const fs = require('fs');
const path = require('path');

const last = arr => arr[arr.length - 1];

const walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(file);
            next();
          });
        } else {
          if (file.includes('.ts') && !file.includes('.d.ts') && !file.includes('node_modules') && !file.includes('public')) {
            const content = fs.readFileSync(file);
            if (!content.includes("module.exports")) {
              // console.log(file);
              let textContent = content.toString();
              const regex = /export default .*/g;
              const found = textContent.match(regex);
              const componentName = found && found[0].split(" ");
              const lastComponentName = componentName && componentName.length === 3 && componentName[2];
              if (componentName && componentName.length > 3) {
                const nameOfFile = last(file.replace('.ts', '').split('/')) + 'Object';
                textContent = textContent.replace('export default', `const ${nameOfFile} =`);
                textContent = textContent + `export default ${nameOfFile};\n`;
                textContent = textContent + `module.exports = ${nameOfFile};\n`;
                fs.writeFileSync(file, textContent);
              }
              else if (lastComponentName === '{') {
                const nameOfFile = last(file.replace('.ts', '').split('/')) + 'Object';
                textContent = textContent.replace('export default', `const ${nameOfFile} =`);
                textContent = textContent + `export default ${nameOfFile};\n`;
                textContent = textContent + `module.exports = ${nameOfFile};\n`;
                fs.writeFileSync(file, textContent);
              }
              else if (lastComponentName) {
                textContent = textContent + `module.exports = ${lastComponentName}`;
                fs.writeFileSync(file, textContent);
              }
            }
          }
          results.push(file);
          next();
        }
      });
    })();
  });
};

walk(process.argv[2], () => { console.log('Done!') });
