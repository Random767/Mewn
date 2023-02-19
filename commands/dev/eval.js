const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { developerCommands } = require('./../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('[DEV] Execute códigos no Mewn')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option => 
            option.setName('eval')
                .setDescription('Escreva um código')
                .setRequired(true)),
    async execute(interaction, client){
        const clean = text => {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          }
        if(!developerCommands.whitelist.users.includes(interaction.user.id)) {
            return interaction.reply('🚫 | Acesso negado')
        }
        try {
            const code = interaction.options.getString('eval');
            let evaled = eval(code);
       
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
            
            const saida = new EmbedBuilder()
                .setTitle("Saída")
                .setDescription(clean(evaled), {code:"xl"})
                .setColor("#5097A4")
            await interaction.reply({ embeds: [saida] })
          } catch (err) {
            const embed = new EmbedBuilder()
            .setTitle('Hmmmmmmm, me parece que ocorreu um erro')
            .setDescription("```js\n"+clean(err)+"\n```")
            .setColor("#2f3136")
            await interaction.reply({ embeds:[embed] })
        }
    }
}