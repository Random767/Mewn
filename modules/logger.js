const fs = require('fs/promises')
const moment = require('moment')
const config = require("./../config.json")
moment.locale('pt-BR')

const infos = {
  file: `${__dirname}/../${config.eventLog.filename}`,
  overWrite: false
}

async function write(content) {
  try {
    await fs.appendFile(infos.file, content);
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
