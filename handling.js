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
      const data = await rest.put(
        Routes.applicationCommands(config.id),
        { body: commands },
      )

      console.log(`[Load] ${data.length} comandos carregados `)

      rest.put(Routes.applicationCommands(config.id), { body: [] })
        .catch(console.error)
    } catch(err){
      console.error(err);
    }
  })();
}
