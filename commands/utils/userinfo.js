const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require('moment')
moment.locale('pt-BR')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`userinfo`)
        .setDescription(`[UTILS] Veja as informações de um usuário`)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('usuário')
                .setDescription('Digite o nome de um usuário, o mencione ou coloque o id')
                .setRequired(false)),
    async execute(interaction, client) {
        const getUser = interaction.options.getString('usuário') || interaction.member.id
        const userinfo = client.users.cache.get(getUser.replace('<@','').replace('>','')) || client.users.cache.find(user => user.username.toLowerCase() === getUser.toLowerCase()) || client.users.cache.get(getUser) || await client.users.fetch(getUser)
        if(!userinfo){
            await interaction.reply({ content: "Desculpe, não consegui encontrar o usuário", ephemeral: true})
            return
        }
        const memberinfo = interaction.guild.members.cache.get(`${getUser}`) || interaction.guild.members.cache.get(getUser.replace('<@','').replace('>','')) || interaction.guild.members.cache.find(x => userinfo.username === getUser.toLowerCase())

        const uname = userinfo.username
        const unickname = uname ?? memberinfo.nickname
        const utag = userinfo.tag
        const uid = userinfo.id
        const ucreatedat = `${moment(userinfo.createdAt).format('LLL')} (${moment(userinfo.createdAt).fromNow()})`
        const uavatar = userinfo.displayAvatarURL({dynamic: true})

        function isMember(){
            let result = interaction.guild.members.cache.filter(a => a.id === userinfo.id).size
            if(result === 1){
                return true
            } else{
                return false
            }
        }

        if(isMember()){
            let upresence = memberinfo?.presence?.status ?? 'offiline';
            const ujoined = `${moment(memberinfo.joinedTimestamp).format('LLL')} (${moment(memberinfo.joinedTimestamp).fromNow()})`

            const embed = new EmbedBuilder()
                .setTitle(unickname)
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
                    name: "Presença",
                    value: upresence,
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