const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`8ball`)
        .setDescription(`[RP] Faça uma pergunta`)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('pergunta')
                .setDescription('Digite algo')
                .setRequired(true)),
    async execute(interaction, client) {
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
            'Tenho minhas dúvidas',
            'Sim, sem sombra de dúvida!',
            "Não :D",
            "Claramente",
        ]
        const pergunta = interaction.options.getString("pergunta")
        if(pergunta.length > 220) return interaction.reply(`Desculpe, o que você enviou tem ${pergunta.length} caracteres e eu suporto de 1 a 220 devido a limitações do Discord`)
        let result = Math.floor((Math.random() * results.length));

        const embed = new EmbedBuilder()
            .addFields({ name: `"${pergunta}"`, value: results[result] })
            .setThumbnail(client.user.displayAvatarURL())
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({dynamic: true}) })
            .setColor("#2f3136")
        await interaction.reply({ embeds:[embed] });
    },
};
