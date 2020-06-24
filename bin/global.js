const { walk } = require('..');

walk(process.argv[2], () => { console.log('Done!') });
