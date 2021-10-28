#!/usr/bin/env node

const path = require('path')
const tokenize = require('../src')

let [, , filename] = process.argv

filename = filename || 'tokens.yml'
filename = path.resolve(process.cwd(), filename)

tokenize(filename)
