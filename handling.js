const { Routes, Collection } = require('discord.js');
const fs = require(`fs`);

module.exports = (client, rest) => {
  client.commands = new Collection()
  const commands = [];
  const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));

  for (const file of commandFiles){
    const command = require(`${__dirname}/commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command)
  }

  (async () => {
    try {
      rest.put(Routes.applicationCommands(client.user.id), { body: [] })
        .catch(console.error)

      let data;
      const servers = client.guilds.cache.map(x => x.id)
      for(let i=0; i<servers.length; i++){
        data = await rest.put(Routes.applicationGuildCommands(client.user.id, `${servers[i]}`),
        { body: commands }
      )
    }

      console.log(`[Load] ${data.length} comandos carregados `)

    } catch(err){
      console.error(err);
    }
  })();
}
