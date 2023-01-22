const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`userinfo`)
        .setDescription(`[Beta] Veja as informações de um usuário`)
        .addStringOption(option =>
            option.setName('usuário')
                .setDescription('Digite um id ou mencione um usuário')
                .setRequired(false)),
    async execute(interaction, client) {
        const getUser = interaction.options.getString('usuário') || interaction.user.id
        const userinfo = client.users.cache.find(user => user.username.toLowerCase() === getUser.toLowerCase()) || client.users.cache.get(getUser)

        console.log(client.members.cache.map(x => x))
        if(!userinfo){
            await interaction.reply('Desculpe, não consegui encontrar o usuário')
        }

        const uname = userinfo.username
        const utag = userinfo.tag
        const uid = userinfo.id
        const ucreatedat = `${moment(userinfo.createdAt).format('LLLL')} (${moment(userinfo.createdAt).fromNow()})`
        const ujoined = `${moment(userinfo.joinedAt).format('LLLL')} (${moment(userinfo.joinedAt).fromNow()})`
        const uavatar = userinfo.displayAvatarURL({dynamic: true})

        const embed = new EmbedBuilder()
            .setTitle(uname)
            .addFields({
                name: "Tag",
                value: utag,
                inline: true
            })
            .addFields({
                name: "Id",
                value: uid,
                inline: true
            })
            .addFields({
                name: "Conta criada em",
                value: ucreatedat,
                inline: true
            })
            .addFields({
                name: "Entrou aqui em",
                value: ujoined,
                inline: true
            })
            .setThumbnail(uavatar)
        


        await interaction.reply({ embeds: [embed] });
    },
};