const { Client, Collection, Events, GatewayIntentBits, REST, Routes, ApplicationCommand } = require('discord.js');
const { prefix } = require('./config.json')
process.title = 'Mewn'
require('dotenv').config()
const client = new Client ({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    presence: {
        activities: [{
            name: "Mewn beta",
            type: 3
        }],
        status: 'dnd'
    } 
})

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

require(`./handling`)(client, rest)

client.on(`ready`, () => {
  console.log(`[Start] O bot ${client.user.tag} foi iniciado com ${client.guilds.cache.size} servidores`)
})

client.on('guildCreate', (guild) => {
  console.log(`[New server] O servidor "${guild.name}" adicionou o ${client.user.username}`)
})

client.on('messageCreate', (message) => {
  if(message.content.includes(client.user.id)){
    message.reply(`Olá ${message.author}! Eu sou o ${client.user.username}, utilize ${prefix}help para ajuda`)
  }
})


client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Ocorreu um erro enquanto eu estava executando o comando :/', ephemeral: true });
  }
});

client.login(process.env.TOKEN)
