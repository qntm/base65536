#!/usr/bin/env node

'use strict'

import * as fs from 'fs'

import Action from './action'
import { createEncodeStream, createDecodeStream } from 'base65536-stream'

import parse from './parse'

const args = process.argv
args.shift() // Node.js executable
args.shift() // JavaScript source file

let config
try {
  config = parse(args)
  if (config.action === Action.help) {
    const help = fs.readFileSync(__dirname + '/help.txt', 'utf8')
    console.log(help)
  } else if (config.action === Action.version) {
    const packageDotJson = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'))
    console.log(packageDotJson.name + '@' + packageDotJson.version)
  } else if (config.action === Action.encode) {
    const readableStream = config.fileName === undefined ? process.stdin : fs.createReadStream(config.fileName)
    readableStream
      .pipe(createEncodeStream(config.wrap))
      .pipe(process.stdout)
  } else if (config.action === Action.decode) {
    if (config.fileName === undefined) {
      // TODO: work out what type this actually has (error message says "Socket" but
      // that's not it) and why it's not compatible with ReadableStream so we have
      // to duplicate code here -_-
      // TODO: the command line should ALWAYS ignore line breaks, like `base64` does.
      const readableStream = process.stdin
      readableStream
        .setEncoding('utf8')
        .pipe(createDecodeStream(config.ignoreGarbage))
        .pipe(process.stdout)
    } else {
      const readableStream = fs.createReadStream(config.fileName)
      readableStream
        .setEncoding('utf8')
        .pipe(createDecodeStream(config.ignoreGarbage))
        .pipe(process.stdout)
    }
  } else {
    // This should be impossible
    throw Error('Bad action ' + config.action)
  }
} catch (e) {
  console.error(e.message)
}
