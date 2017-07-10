'use strict'

enum Consume {
  flags,
  oneMoreFileName,
  done
}

import Action from './action'

// TODO: wrap support

let consume: Consume = Consume.flags
let action: Action = Action.unknown
let ignoreGarbage = false
let fileName: string|undefined = undefined

export default function (args: string[]) {
  args.forEach(arg => {
    if (consume === Consume.flags) {
      if (arg === '-d' || arg === '--decode') {
        if (action !== Action.unknown) {
          throw Error('Unexpected ' + arg)
        }
        action = Action.decode
      } else if (arg === '-i' || arg === '--ignore-garbage') {
        if (action !== Action.decode) {
          throw Error('Unexpected ' + arg)
        }
        if (ignoreGarbage) {
          throw Error('Unexpected ' + arg)
        }
        ignoreGarbage = true
      } else if (arg === '--help') {
        if (action !== Action.unknown) {
          throw Error('Unexpected ' + arg)
        }
        action = Action.help
      } else if (arg === '--version') {
        if (action !== Action.unknown) {
          throw Error('Unexpected ' + arg)
        }
        action = Action.version
      } else if (arg === '--') {
        consume = Consume.oneMoreFileName
      } else if (arg === '-') {
        if (action === Action.help || action === Action.version) {
          throw Error('Unexpected ' + arg)
        }
        // leave fileName as `undefined` i.e. STDIN
        consume = Consume.done
      } else {
        if (action === Action.help || action === Action.version) {
          throw Error('Unexpected ' + arg)
        }
        fileName = arg
        consume = Consume.done
      }
    } else if (consume === Consume.oneMoreFileName) {
      fileName = arg
      consume = Consume.done
    } else if (consume === Consume.done) {
      throw Error('Unexpected ' + arg)
    }
  })

  if (action === Action.unknown) {
    action = Action.encode
  }

  return {action, ignoreGarbage, fileName}
}
