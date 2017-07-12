#!/usr/bin/env node

'use strict'

import * as fs from 'fs'

import Action from './action'
import { createEncodeStream, createDecodeStream } from './../dist/base65536'
import parse from './parse'

const args = process.argv
args.shift() // Node.js executable
args.shift() // JavaScript source file

let config
try {
  config = parse(args)
  if (config.action === Action.help) {
    console.log(
`Usage: base65536 [OPTION]... [FILE]
Base65536 encode or decode FILE, or standard input, to standard output.

  -d, --decode          decode data
  -i, --ignore-garbage  when decoding, ignore non-Base65536 characters
      --help            display this help and exit
      --version         output version information and exit

With no FILE, or when FILE is -, read standard input.
`
    )
  } else if (config.action === Action.version) {
    console.log('base65536@' + JSON.parse(fs.readFileSync('./package.json', 'utf8')).version)
  } else if (config.action === Action.encode) {
    const readableStream = config.fileName === undefined ? process.stdin : fs.createReadStream(config.fileName)
    readableStream
      .pipe(createEncodeStream())
      .pipe(process.stdout)
  } else if (config.action === Action.decode) {
    if (config.fileName === undefined) {
      // TODO: work out what type this actually has (error message says "Socket" but
      // that's not it) and why it's not compatible with ReadableStream so we have
      // to duplicate code here -_-
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
