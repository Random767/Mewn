const { Client, Events, GatewayIntentBits, REST, EmbedBuilder} = require('discord.js');
require('dotenv').config()
process.title = 'Mewn'

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


client.on(`ready`, () => {
  console.log(`[Start] ${client.user.tag} foi iniciado com ${client.guilds.cache.size} servidores`)
  require(`${__dirname}/handling`)(client, rest)

})

client.on('guildCreate', (guild) => {
  console.log(`[New server] O servidor "${guild.name}" adicionou o ${client.user.username}, agora tenho ${client.guilds.cache.size} servidores`)
})

client.on('guildDelete', (guild) => {
  console.log(`[Lost server] O servidor "${guild.name}" removeu o ${client.user.username}, agora tenho ${client.guilds.cache.size} servidores`)
})

client.on('messageCreate', (message) => {
  if(message.content.includes(client.user.id) && (!message.author.bot)){
    const response = new EmbedBuilder()
      .setTitle('Central de ajuda')
      .setDescription(`Olá ${message.author.username}! Eu sou o ${client.user.username}, um bot em fase beta, mas futuramente vai vir cheio de functionalidades`)
      .addFields(({ name: '❓ • Entre no meu servidor de suporte', value: 'Clicando aqui: https://discord.gg/3WYfg5RV9T', inline: true} ))
      .addFields(({ name: '🖥 • Eu sou open source', value: 'Meu repositório no github: https://github.com/Random767/Mewn-Bot', inline: true} ))
      
      .setThumbnail(client.user.displayAvatarURL({ dinamic: true, size: 4096, format: "png" }))
      .setColor('#2f3136')

    message.reply({ embeds: [response] })
  }
})


client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  
  if (!command) {
    console.error(`Nenhum comando com o nome ${interaction.commandName} foi encontrado`);
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
