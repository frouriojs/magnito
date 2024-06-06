const assert = require('assert');
const fs = require('fs');
const path = require('path');

const version = process.argv[2];
const jsonPath = path.join(process.cwd(), 'package.json');

assert(/\d+\.\d+\.\d+/.test(version));
fs.writeFileSync(jsonPath, JSON.stringify({ ...require(jsonPath), version }, null, 2), 'utf8');
