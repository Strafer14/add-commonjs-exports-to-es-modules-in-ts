var myLib = require('..');

myLib.walk(process.argv[2], () => { console.log('Done!') });
