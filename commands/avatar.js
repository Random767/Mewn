const { SlashCommandBuilder, EmbedBuilder  } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`avatar`)
        .setDescription(`Veja o avatar de um usuário`)
        .addStringOption(option =>
            option.setName('usuário')
                .setDescription('Digite um id ou mencione um usuário')
                .setRequired(false)),
    async execute(interaction, client) {
        const getUser = interaction.options.getString('usuário') || interaction.user.id
        const userAvatar = client.users.cache.find(user => user.username.toLowerCase() === getUser.toLowerCase()) || client.users.cache.get(getUser)

        const png = userAvatar.displayAvatarURL({ dynamic: true, size: 4096, format: "png" })
        const jpg = userAvatar.displayAvatarURL({ dynamic: true, size: 4096, format: "jpg" })
        const webp = userAvatar.displayAvatarURL({ dynamic: true, size: 4096, format: "webp" })
        
        const embed = new EmbedBuilder()
            .setTitle(`🐈 | Avatar de ${userAvatar.username}`)
            .setDescription(`Baixar avatar [png](${png}) | [jpg](${jpg}) | [webp](${webp})`)
            .setImage(png)
            .setColor('#2f3136')

        await interaction.reply(({ embeds: [embed] }));
    },
};