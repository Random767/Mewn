const fs = require('fs/promises')
const { mkdirSync } = require('fs')
const moment = require('moment')
const config = require(`${__dirname}/../config.json`)
moment.locale('pt-BR')

const infos = {
  file: config.eventLog.file.filename,
  dir: `${__dirname}/../logs/`,
  overWrite: false
}

try{
  mkdirSync(infos.dir)
} catch(err) {
  if(err.code !== 'EEXIST') throw err;
}

async function write(content) {
  try {
    await fs.appendFile(`${infos.dir}${infos.file}`, content);
  } catch (err) {
    console.log(err);
  }
}

async function debugWrite(content) {
  try {
    await fs.appendFile('logs/debug.log', content);
  } catch (err) {
    console.log(err);
  }
}

function getDefaultDateAndTime(){
  const formateddate = moment().format('L')
  const formatedtime = moment().format('LT')
  return formateddate + " " + formatedtime
}

const args = process.argv.slice(2)
const debugFlag = args.includes("-debug")
const magenta = "\x1b[35m"
const colorEnd = "\x1b[0m"

const log = {
  info: (arg) => {
    arg = `[${getDefaultDateAndTime()} >> Info] ${arg}`
    console.log(arg)
    write(`${arg}\n`)
  },
  warning: (filename, arg) => {
    arg = `[${getDefaultDateAndTime()} >> Warning] (${filename}) ${arg}`
    console.log(arg)
    write(`${arg}\n`)
  },
  error: (filename, arg) => {
    arg = `[${getDefaultDateAndTime()} >> Error] (${filename}) ${arg}`
    console.log(arg)
    write(`${arg}\n`)
  },
  debug: (filename, arg) => {
    if(debugFlag){
      arg = `[${getDefaultDateAndTime()} >> Debug] (${filename}) ${arg}`
      console.log(`${magenta}${arg}${colorEnd}`)
      debugWrite(`${arg}\n`)
    } 
  }
  
}

module.exports = log
