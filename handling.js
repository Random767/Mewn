const { REST, Routes, Collection } = require('discord.js');
const fs = require(`fs`)
const path = require('node:path');

module.exports = (client) => {
  client.commands = new Collection();
  const commandsPath = path.join(__dirname + `/commands/`)
  const commandFIles = fs.readdirSync(commandsPath).filter(file => file.endsWith(`.js`))

  for(const file of commandFIles){
    const filePath = path.join(commandsPath, file)
    command = require(filePath)

    if(`data` in command && `execute` in command) {
      client.commands.set(command.data.name, command)
      console.log(`[${command.data.name}] Carregado`)
    } else {
      console.log(`[Aviso]: O comando em ${filePath} nao tem a propriedade "data" ou "execute"`)
    }
  }

}