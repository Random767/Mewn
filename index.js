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


client.on(`ready`, () => {
  console.log(`[Start] ${client.user.tag} foi iniciado com ${client.guilds.cache.size} servidores`)
  
  let activities = [
    `❓ • Ultilize /help para ajuda`,
    `🖥️ • Criado por: ${client.users.cache.get(info.devId[0]).tag}`,
    `🐱 • Estou espalhando fofura em ${client.guilds.cache.size} servidores >:3`,
    `👌 • Ajudando ${client.users.cache.size} pessoas :3`,
    `🦆 • Patos são fofos :D`,
    `+  • Me adicione usando o comando /adicionar`
  ]
  i = 0
  setInterval(() => {
    client.user.setActivity(`${activities[i++ % activities.length]}`, {
    type: 1
  }
  )}, 10000);
  client.user.setStatus('online')

  require(`${__dirname}/handling`)(client)
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


client.on('guildCreate', (guild) => {
  console.log(`[New server] O servidor "${guild.name}" adicionou o ${client.user.username}, agora tenho ${client.guilds.cache.size} servidores`)
  const log = new EmbedBuilder()
    .setTitle(`Novo servidor :D`)
    .addFields({ name: "Nome", value: `${guild.name} (${guild.id})`, inline: false })
    .addFields({ name: "Criado em", value: moment(guild.createdTimestamp).format('LLLL'), inline: false })
    .addFields({ name: "Usuários", value: `${guild.memberCount}`, inline: false })
    .setThumbnail(guild.iconURL({dynamic: true}, {size: 4096}))
    .setColor('#4775ec')

  if(eventLog.isEnabled){
    client.channels.cache.get(eventLog.channels.guildUpdateChannelId).send({ embeds: [log] })
  }
})

client.on('guildDelete', (guild) => {
  console.log(`[Lost server] O servidor "${guild.name}" removeu o ${client.user.username}, agora tenho ${client.guilds.cache.size} servidores`)

  const log = new EmbedBuilder()
  .setTitle(`Fui removido de um servidor`)
  .addFields({ name: "Nome", value: `${guild.name} (${guild.id})`, inline: false })
  .addFields({ name: "Criado em", value: moment(guild.createdTimestamp).format('LLLL'), inline: false })
  .addFields({ name: "Usuários", value: `${guild.memberCount}`, inline: false })
  .setThumbnail(guild.iconURL({dynamic: true}, {size: 4096}))
  .setColor('#e02c2f')

  if(eventLog.isEnabled){
    client.channels.cache.get(eventLog.channels.guildUpdateChannelId).send({ embeds: [log] })
  }

})

client.on('messageCreate', (message) => {
  if(message.content.includes(client.user.id) && (!message.author.bot)){
    const response = new EmbedBuilder()
      .setTitle('Central de ajuda')
      .setDescription(`Olá ${message.author.username}! Eu sou o ${client.user.username}, um bot em fase beta, mas futuramente vai vir cheio de functionalidades`)
      .addFields(({ name: '❓ • Entre no meu servidor de suporte', value: 'Clicando aqui: [discord.gg/3WYfg5RV9T](https://discord.gg/3WYfg5RV9T)', inline: true} ))
      .addFields(({ name: '🖥 • Eu sou open source', value: 'Meu repositório no github: [github.com/Random767/Mewn](https://github.com/Random767/Mewn)', inline: true} ))
      
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
