#!/usr/bin/env node

const { walk } = require('../index');

walk(process.argv[2], () => { console.log('Done!') });
