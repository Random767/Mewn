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
        const getUser = interaction.options.getString('usuário') || interaction.member.id
        const userinfo =  client.users.cache.find(user => user.username.toLowerCase() === getUser.toLowerCase()) || client.users.cache.get(getUser)
        const joinedAt = interaction.guild.members.cache.get(getUser).joinedTimestamp

        if(!userinfo){
            await interaction.reply('Desculpe, não consegui encontrar o usuário')
            return
        }

        const uname = userinfo.username
        const utag = userinfo.tag
        const uid = userinfo.id
        const ucreatedat = `${moment(userinfo.createdAt).format('LLLL')} (${moment(userinfo.createdAt).fromNow()})`
        const ujoined = `${moment(joinedAt).format('LLLL')} (${moment(joinedAt).fromNow()})`
        const uavatar = userinfo.displayAvatarURL({dynamic: true})

        function isMember(){
            let result = interaction.guild.members.cache.filter(a => a.id === userinfo.id).size
            if(result === '1'){
                return true
            } else{
                return false
            }
        }

        if(isMember){
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
            .setColor('#2f3136')

            await interaction.reply({ embeds: [embed] });
            return
        } else{
            const inServer = new EmbedBuilder()
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
            .setThumbnail(uavatar)
            .setColor('#2f3136')

        await interaction.reply({ embeds: [inServer] });
        return

        }
    },
};