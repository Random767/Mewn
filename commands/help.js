const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Menu de comandos`),
    async execute(interaction) {
        await interaction.reply(`Nada aqui por enquanto...`);
    },
};