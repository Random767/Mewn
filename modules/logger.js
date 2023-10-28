const fs = require('fs/promises')
const moment = require('moment')
moment.locale('pt-BR')

let config = {
  file: `${__dirname}/../app.log`,
  overWrite: false
}

async function write(content) {
  try {
    await fs.appendFile(config.file, content);
  } catch (err) {
    console.log(err);
  }
}

const log = {
  info: (arg) => {
    arg = `[${moment().format('L') + ' ' + moment().format('LT')} >> Info] ${arg}`
    console.log(arg)
    write(`${arg}\n`)
  },
  warning: (filename, arg) => {
    arg = `[${moment().format('L') + ' ' + moment().format('LT')} >> Warning] (${filename}) ${arg}`
    console.log(arg)
    write(`${arg}\n`)
  },
  error: (filename, arg) => {
    arg = `[${moment().format('L') + ' ' + moment().format('LT')} >> Error] (${filename}) ${arg}`
    console.log(arg)
    write(`${arg}\n`)
  }
  
}

module.exports = log