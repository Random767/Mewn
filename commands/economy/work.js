const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const works = require("../../presets/works.json")
const moment = require("moment")
const Mewn = require("../../index")
const Users = Mewn.Users
const cooldownInMinutes = 60

function verifyAndUpdateEnergy(userinfo){
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
                .setName('choice')
                .setDescription("Escolha um trabalho")
                .addStringOption(options => options.setName("work").setDescription("Nome do trabalho").setRequired(true)
        ))
        .addSubcommand(subcommand => 
            subcommand
                .setName('start')
                .setDescription("Começe a trabalhar")
        )
        .addSubcommand(subcommand => 
          subcommand
            .setName("stat")
            .setDescription("Veja a quantidade de xp e de energia que você tem")),
    
    async execute(interaction) {
        const user = interaction.user
        let userinfo = Users.get(u => u.id === user.id)
        const userHas = Users.has(u => u.id === user.id)

        switch(interaction.options.getSubcommand()) {
            case "list":
                const workFilds = works.map(({ name, salary, xpLevelRequired }) => ({
                  name: `${name}`,
                  value: `Salário: ${salary}\nNível de XP: ${xpLevelRequired}\n`,
                  inline: false,
                }))
                await interaction.reply({ embeds: [{
                  title: "Trabalhos disponiveis",
                  fields: workFilds,
                  thumbnail: {
                    url: "https://authenticjobs.com/wp-content/uploads/2020/04/cropped-aj-site-favicon.png"
                  },
                  color: 0x393A
                }] })
                break
            case "choice":
                const chosenJob = interaction.options.getString("work")
                const index = works.findIndex(work => work.name.toLowerCase() === chosenJob.toLowerCase())
                
                if(index === -1) {
                  return await interaction.reply(":octagonal_sign: | O trabalho escolhido não foi encontrado. Verifique se escreveu o nome corretamente e tente novamente")
                }

                if(!userHas){
                  userinfo = await Users.create({ id: user.id, name: user.username, discriminator: user.discriminator  })
                }

                if(userinfo.work.xp/1000 < works[index].xpLevelRequired){
                  return await interaction.reply(`:octagonal_sign: | Você está no nível ${Math.floor(userinfo.work.xp/1000)} de xp, mas o trabalho de ${works[index].name} exige o nível ${works[index].xpLevelRequired} :/`)
                }

                Users.update(person => {
                  if(person.id === user.id) {
                    person.work.id = index
                  }
                })
                
                await interaction.reply(`:office: | Você escolheu trabalhar como ${works[index].name}, começe a trabalhar com o comando /work start`)
                break

            case "start":
                if(!userHas || userinfo.work.id === -1){
                  return await interaction.reply(":octagonal_sign: | Você precisa escolher um trabalho primeiro. Veja a lista de trabalhos utilizando o comando /work list")
                }
                
                await interaction.deferReply()

                let remainingEnergy = verifyAndUpdateEnergy(userinfo)

                if(remainingEnergy < 270){
                  return await interaction.editReply(":stopwatch: | Você esgotou suas energias diárias, você poderá usa-las novamente daqui a 24 horas. Saiba mais como funciona sua energia e o sistema de xp utilizando /work help")
                }

                const lastWorkedDate = userinfo.work.lastDate
                const minutesPassed = moment()
                const StartEndDiference = minutesPassed.diff(lastWorkedDate, 'minutes')
                if(StartEndDiference < cooldownInMinutes){
                  return await interaction.editReply(`:stopwatch: | Você precisa esperar **${cooldownInMinutes - StartEndDiference} minutos** para trabalhar novamente`)
                }
                
                const xpRecived = Math.floor(Math.random() * (150 - 50 + 1)) + 50
                const energySpent = Math.floor(Math.random() * (270 - 200 + 1)) + 200
                const energyValidity = moment().add(24, 'hours')

                Users.update(person => {
                  if(person.id === user.id){
                    person.work.lastDate = moment().format()
                    person.work.xp += xpRecived
                    person.energy.data = [...person.energy.data, {"energy": energySpent, "validity": energyValidity}]
                    person.coins += works[userinfo.work.id].salary
                  }
                })
                
                await interaction.editReply(`:money_with_wings: | Você trabalhou e recebeu um pagamento de **${works[userinfo.work.id].salary} MewnCoins**, **ganhou ${xpRecived} XP** e **gastou ${energySpent}/${remainingEnergy} pontos de energia** :D`)

                break
            case "stat":
              if(!userHas || userinfo.work.id === -1){
                return await interaction.reply(":octagonal_sign: | Nenhuma informação para monstrar porque você ainda não trabalhou, veja os trabalhos disponiveis utilizando /work list")
              }

              let currentEnergy = verifyAndUpdateEnergy(userinfo)

              const stat = new EmbedBuilder()
                .setTitle("Suas informações de trabalho")
                .setDescription(`:briefcase: | **Trabalho atual**: ${works[userinfo.work.id].name}\n :book: | **XP**: ${userinfo.work.xp}\n :zap: | **energia restante**: ${currentEnergy} de ${userinfo.energy.config.maxDailyPoints}`)
                .setColor("#85bb65")
                .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
                

              return await interaction.reply({ embeds: [stat] }) 

        }
    }
}
