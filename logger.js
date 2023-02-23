const fs = require('fs/promises')
const moment = require('moment')
moment.locale('pt-BR')

let config = {
  file: "app.log",
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
    console.log(arg)
    arg = `[${moment().format()}] [info] ${arg}\n`
    write(arg)
  },
  warning: (arg) => {
    console.log(arg)
    arg = `[${moment().format()}] [Warning] ${arg}\n`
    write(arg)
  },
  error: (arg) => {
    console.log(arg)
    arg = `[${moment().format()}] [🔴 Error] ${arg}\n`
    write(arg)
  }
  
}

module.exports = log