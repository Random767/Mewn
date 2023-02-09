const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`commands`)
        .setDescription(`Menu de comandos`)
        .setDMPermission(false),
    async execute(interaction, client) {
      let bot = []
      let moderation = []
      let roleplay = []
      let social = []
      let utils = []
      
      const commandFolder = fs.readdirSync(`${__dirname}/../`)
    
      for(const folder of commandFolder){
        const commandFiles = fs.readdirSync(`${__dirname}/../${folder}`).filter(file => file.endsWith('.js'))
        for (const file of commandFiles){
          const command = require(`${__dirname}/../${folder}/${file}`);
          if(folder === 'bot'){bot.push(command.data.name)}
          if(folder === 'moderation'){moderation.push(command.data.name)}
          if(folder === 'roleplay'){roleplay.push(command.data.name)}
          if(folder === 'social'){social.push(command.data.name)}
          if(folder === 'utils'){utils.push(command.data.name)}

        }  
      }
        const embed = new EmbedBuilder()
          .setTitle('Meus comandos')
          .addFields({ name: "bot", value: bot.toLocaleString(), inline: false })
          .addFields({ name: "Roleplay", value: roleplay.toLocaleString(), inline: false })
          .addFields({ name: "Utils", value: utils.toLocaleString(), inline: false })
          .setThumbnail(client.user.displayAvatarURL({ dinamic: true, size: 4096, format: "png" }))
          .setTimestamp()
          
          .setColor('#2f3136')
        await interaction.reply({ embeds: [embed] });
    },
};
