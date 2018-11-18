#!/usr/bin/env node

var path = require('path')
var slash = require('slash')

var dirname = slash(path.resolve(__dirname))
var isFfanScript = (dirname.indexOf("/node_modules/rich-scripts") !== -1)

require('babel-register')({
  only: isFfanScript  ? /rich-scripts/ : undefined
})
require('babel-polyfill')

var run = require('../scripts/run').default

var scripts = {
  start : require('../scripts/start'),
  new   : require('../scripts/newPage'),
  deploy: require('../scripts/deploy'),
}

var argv = require('minimist')(process.argv.slice(2))
var commands = argv._
var script = scripts[commands[0]]

if (script) {
  run(script, argv)
} else {
  console.log('-- invalid script --\n\n')
}
