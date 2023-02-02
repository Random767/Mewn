const { Client, Events, GatewayIntentBits, REST, EmbedBuilder} = require('discord.js');
require('dotenv').config()
const { eventLog } = require('./config.json')
const { info } = require('./config.json')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
process.title = 'Mewn'

const client = new Client ({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ],
    presence: {
        activities: [{
            name: "Carregando...",
            type: 3
        }],
        status: 'idle'
    } 
})

client.on('rateLimit', (limite) => {
  console.log(`[rateLimit] - RateLimit de ${limite.timeout}ms`)
})

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.exec(...args));
	} else {
		client.on(event.name, (...args) => event.exec(...args));
	}
}


client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  
  if (!command) {
    console.error(`Nenhum comando com o nome ${interaction.commandName} foi encontrado`);
    return;
  }
  const log = new EmbedBuilder()
    .setTitle(interaction.commandName)
    .addFields({ name: "Autor", value: "```" + interaction.user.tag + " (" + interaction.user.id + ") ```", inline: false})
    .addFields({ name: "Servidor", value: "```" + interaction.guild.name + " (" + interaction.guild.id + ")```", inline: false})
    .addFields({ name: "Canal", value: "```" + interaction.channel.name + " (" + interaction.channel.id + ")```", inline: false})
    .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
    .setColor('#2f3136')
  if(eventLog.isEnabled){
    client.channels.cache.get(eventLog.channels.commandCreateChannelId).send({ embeds: [log] })
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Ocorreu um erro enquanto eu estava executando o comando :/', ephemeral: true });
  }
});

client.login(process.env.TOKEN)
