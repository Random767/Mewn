const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`8ball`)
        .setDescription(`Pergunte algo e eu responderei com sim ou não`)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('frase')
                .setDescription('Digite algo')
                .setRequired(true)),
    async execute(interaction) {
        let results = [
            'Sim',
            'Não',
            'Talvez :v',
            'Boa pergunta',
            'Não sei',
            'Pergunte pra outra pessoa',
            'Com certeza não',
            'Com certeza',
            'Sem dúvida',
            'Provavelmente',
            'Eu sou apenas um bot, nao posso responder essas perguntas',
            'Sim, sem sombra de dúvida!',
            "Não :D"
        ]

        let result = Math.floor((Math.random() * results.length));
        await interaction.reply(results[result]);
    },
};