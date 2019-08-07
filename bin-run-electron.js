#!/usr/bin/env node
/*const shell = require('shelljs');
console.log('starting memoplay')
shell.exec(`npm run electron`);*/

const electroner = require("electroner");

// Start the Electron app
electroner(`${__dirname}/build/electron.js`);