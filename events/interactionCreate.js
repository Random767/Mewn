const { Events, EmbedBuilder } = require('discord.js')
const { eventLog } = require('./../config.json')
const logger = require('./../logger')
const Discord = require('./../index')
let client = Discord.client

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async exec(interaction){
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        
        if (!command) {
          console.error(`Nenhum comando com o nome ${interaction.commandName} foi encontrado`);
          return;
        }
        const options = interaction.options._hoistedOptions
        const log = new EmbedBuilder()
          .setTitle("Alguém executou um comando")
          .addFields(
            { name: "Autor", value: "```" + interaction.user.tag + " (" + interaction.user.id + ") ```", inline: false},
            { name: "Servidor", value: "```" + interaction.guild.name + " (" + interaction.guild.id + ")```", inline: false},
            { name: "Canal", value: "```" + interaction.channel.name + " (" + interaction.channel.id + ")```", inline: false},
            { name: "Comando", value: "```" + interaction.commandName + "```", inline: false},
            { name: "Argumentos", value: `\`\`\`${options[0]?.value ?? 'Nenhum argumento foi utilizado'}\`\`\`` }
          )
          .addFields()
          .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
          .setColor('#2f3136')
        if(eventLog.isEnabled){
          client.channels.cache.get(eventLog.channels.commandCreate).send({ embeds: [log] })
        }
      
        try {
          await command.execute(interaction, client);
        } catch (error) {
          console.error(error)
          logger.error(`${error.stack.split('\n')[1].trim()}: ${error}`)
          await interaction.reply({ content: 'Ocorreu um erro enquanto eu estava executando o comando :/', ephemeral: true });
        }
    }
}