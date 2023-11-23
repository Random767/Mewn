const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const works = require("../../presets/works.json")
const moment = require("moment")
const Mewn = require("../../index")
const Users = Mewn.Users
const cooldownInMinutes = 60

function verifyAndUpdateEnergy(userinfo, user){
  let remainingEnergy = userinfo.energy.config.maxDailyPoints
  if(userinfo.energy.data.length > 0){
    const actualDate = moment()

    userinfo.energy.data.forEach(energy => {
      const isAfter = actualDate.isAfter(energy.validity, 'minutes')
      if(!isAfter) {
        remainingEnergy -= energy.energy
      } else {
        Users.update(person => {
          if(person.id === user.id){
            person.energy.data = person.energy.data.filter((value) => value.validity !== energy.validity) 
          }
        })
      }
    })
  }
  return remainingEnergy
}

const dynamicChoices = works.map((work, index) => ({
    name: `${work.name} [Level ${work.xpLevelRequired !== undefined ? work.xpLevelRequired : 0}]`,
    value: index.toString(),
}))

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("[Economy] (BETA) Trabalhe e consiga MewnCoins em troca")
        .setDMPermission(false)
        .addSubcommand(subcommand => 
                subcommand
                    .setName('list')
                    .setDescription("Veja todos os trabalhos disponiveis")
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('start')
                .setDescription("Começe a trabalhar")
        )
        .addSubcommand(subcommand => 
          subcommand
            .setName('choice')
            .setDescription("Escolha um trabalho")
            .addStringOption(options => options.setName("work").setDescription("Nome do trabalho").setRequired(true)
            .addChoices(...dynamicChoices)
        ))
        .addSubcommand(subcommand => 
          subcommand
            .setName("stat")
            .setDescription("Veja a quantidade de xp, energia e etc que um usuário tem")
            .addUserOption(option => option.setName("usuário").setDescription("Deseja ver as infos de qual usuário?"))
        ),
    
    async execute(interaction) {
        const user = interaction.user
        let userinfo = Users.get(u => u.id === user.id)
        const userHas = Users.has(u => u.id === user.id)

        switch(interaction.options.getSubcommand()) {
            case "list":
                const workFilds = works.map(({ name, salary, xpLevelRequired }) => ({
                  name: `${name}`,
                  value: `> Salário: ${salary}\n> Nível de XP: ${xpLevelRequired !== undefined ? xpLevelRequired : 0}\n`,
                  inline: false,
                }))
                await interaction.reply({ embeds: [{
                  title: "Trabalhos disponiveis",
                  fields: workFilds,
                  thumbnail: {
                    url: "https://hotemoji.com/images/dl/2/cityscape-emoji-by-google.png"
                  },
                  color: 0x85bb65
                }] })
                break
            case "choice":
                const userInput = interaction.options.getString("work")
                const chosenJob = works[Number(userInput)]

                if(!userHas){
                  userinfo = await Users.create({ id: user.id, name: user.username, discriminator: user.discriminator  })
                }

                if(userinfo.work.xp/1000 < chosenJob.xpLevelRequired){
                  return await interaction.reply(`:octagonal_sign: | Você está no nível ${Math.floor(userinfo.work.xp/1000)} de xp, mas o trabalho de ${chosenJob.name} exige o nível ${chosenJob.xpLevelRequired} :/`)
                }

                Users.update(person => {
                  if(person.id === user.id) {
                    person.work.id = userInput
                  }
                })
                
                await interaction.reply(`:office: | Você escolheu trabalhar como **${chosenJob.name}**, começe a trabalhar com o comando **/work start**`)
                break

            case "start":
                if(!userHas || userinfo.work.id === -1){
                  return await interaction.reply(":octagonal_sign: | Você precisa escolher um trabalho primeiro. Veja a lista de trabalhos utilizando o comando /work list")
                }
                
                await interaction.deferReply()

                let remainingEnergy = verifyAndUpdateEnergy(userinfo, user)

                if(remainingEnergy < 170){
                  return await interaction.editReply(":stopwatch: | Você esgotou suas energias diárias, você poderá usa-las novamente daqui a 24 horas. Saiba mais como funciona sua energia e o sistema de xp utilizando /work help")
                }

                const lastWorkedDate = userinfo.work.lastDate
                const minutesPassed = moment()
                const StartEndDiference = minutesPassed.diff(lastWorkedDate, 'minutes')
                if(StartEndDiference < cooldownInMinutes){
                  return await interaction.editReply(`:stopwatch: | Você precisa esperar **${cooldownInMinutes - StartEndDiference} minutos** para trabalhar novamente`)
                }
                
                const xpRecived = Math.floor(Math.random() * (250 - 150 + 1)) + 150
                const energySpent = Math.floor(Math.random() * (170 - 120 + 1)) + 120
                const energyValidity = moment().add(24, 'hours')
                const energyId = Date.now().toString()

                Users.update(person => {
                  if(person.id === user.id){
                    person.work.lastDate = moment().format()
                    person.work.xp += xpRecived
                    person.energy.data = [...person.energy.data, {"id": energyId, "energy": energySpent, "validity": energyValidity}]
                    person.notifications.work.channelId = interaction.channel.id
                    person.coins += works[userinfo.work.id].salary
                  }
                })
                
                await interaction.editReply(`:money_with_wings: | Você trabalhou e recebeu um pagamento de **${works[userinfo.work.id].salary} MewnCoins**, **ganhou ${xpRecived} XP** e **gastou ${energySpent}/${remainingEnergy} pontos de energia** :D`)

                break
            case "stat":
              const target = interaction.options.getUser("usuário") || interaction.user
              const targetInfo = Users.get(u => u.id === target.id)

              if(!targetInfo || targetInfo.work.id === -1){
                return await interaction.reply(`:octagonal_sign: | Nenhuma informação para monstrar porque ${target.username} nunca trabalhou`)
              }

              let currentEnergy = verifyAndUpdateEnergy(targetInfo, target)

              const stat = new EmbedBuilder()
                .setTitle(`Informações de trabalho de ${target.username}`)
                .setDescription(`:briefcase: | **Trabalho atual**: ${works[targetInfo.work.id].name}\n :book: | **XP**: ${targetInfo.work.xp}\n :zap: | **energia restante**: ${currentEnergy} de ${targetInfo.energy.config.maxDailyPoints}`)
                .setColor("#85bb65")
                .setThumbnail(target.displayAvatarURL({dynamic: true}))
                
              return await interaction.reply({ embeds: [stat] }) 

        }
    }
}
