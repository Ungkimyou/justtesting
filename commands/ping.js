const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let pEmbed = new Discord.RichEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setTitle('Pong!')
        .addField('<:wifi:495101715821887488> Latency', (new Date().getTime() - message.createdTimestamp) + ' ms', true)
        .addField('<:server:495101750517170188> Websocket' , `${Math.round(bot.ping)} ms`, false);
         message.channel.send(pEmbed);
}


module.exports.help = {
  name: "ping"
}
