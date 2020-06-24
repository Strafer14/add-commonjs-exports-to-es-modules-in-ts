#! /usr/bin/env node

const args = process.argv.splice(process.execArgv.length + 2);

const { walk } = require('../index');

walk(args[0], () => { console.log('Done!') });
