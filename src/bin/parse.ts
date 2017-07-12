'use strict'

import Action from './action'

enum Consume {
  flags,
  oneMoreFileName,
  done
}

// TODO: wrap support
interface Config {
  action: Action,
  ignoreGarbage: boolean,
  fileName: string|undefined
}

export default function (args: string[]) {
  let consume: Consume = Consume.flags

  const config: Config = {
    action: Action.unknown,
    ignoreGarbage: false,
    fileName: undefined
  }

  args.forEach(arg => {
    if (consume === Consume.flags) {
      if (arg === '-d' || arg === '--decode') {
        if (config.action !== Action.unknown) {
          throw Error('Unexpected ' + arg)
        }
        config.action = Action.decode
      } else if (arg === '-i' || arg === '--ignore-garbage') {
        if (config.action !== Action.decode) {
          throw Error('Unexpected ' + arg)
        }
        if (config.ignoreGarbage) {
          throw Error('Unexpected ' + arg)
        }
        config.ignoreGarbage = true
      } else if (arg === '--help') {
        if (config.action !== Action.unknown) {
          throw Error('Unexpected ' + arg)
        }
        config.action = Action.help
      } else if (arg === '--version') {
        if (config.action !== Action.unknown) {
          throw Error('Unexpected ' + arg)
        }
        config.action = Action.version
      } else if (arg === '--') {
        consume = Consume.oneMoreFileName
      } else if (arg === '-') {
        if (config.action === Action.help || config.action === Action.version) {
          throw Error('Unexpected ' + arg)
        }
        // leave fileName as `undefined` i.e. STDIN
        consume = Consume.done
      } else {
        if (config.action === Action.help || config.action === Action.version) {
          throw Error('Unexpected ' + arg)
        }
        config.fileName = arg
        consume = Consume.done
      }
    } else if (consume === Consume.oneMoreFileName) {
      config.fileName = arg
      consume = Consume.done
    } else if (consume === Consume.done) {
      throw Error('Unexpected ' + arg)
    }
  })

  if (config.action === Action.unknown) {
    config.action = Action.encode
  }

  return config
}
