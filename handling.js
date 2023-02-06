const { Routes, Collection, REST } = require('discord.js');
const fs = require(`fs`);

module.exports = (client) => {
  client.commands = new Collection()
  const commands = [];
  const commandFolder = fs.readdirSync(__dirname + `/commands`)

  for(const folder of commandFolder){
    const commandFiles = fs.readdirSync(__dirname + `/commands/${folder}`).filter(file => file.endsWith('.js'))
    for (const file of commandFiles){
      console.log(`Loading ${folder}/${file}`)
      const command = require(__dirname + `/commands/${folder}/${file}`);
      commands.push(command.data.toJSON());
      client.commands.set(command.data.name, command)
    }  
  }
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
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
