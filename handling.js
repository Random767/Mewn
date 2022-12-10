const { REST, Routes, Collection } = require('discord.js');
const fs = require(`fs`)
const path = require('node:path');
const config = require('./config.json')

module.exports = (client, rest) => {
  client.commands = new Collection()
  const commands = [];
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command)
  }

  (async () => {
    try {
      console.log(`[Reload] recarregando ${commands.length} comandos`);

      const data = await rest.put(
        Routes.applicationCommands('1049428107150512148'),
        { body: commands },
      )

      console.log('[Load] Comandos recarregados ' + data.length)
    } catch(err){
      console.error(err);
    }
  })();
}
