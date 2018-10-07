const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel("<:tickNo:495100045863944192> **| You dont have `MANAGE_ROLES` permissions.**");
  let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!rMember) return message.channel.send("<:tickNo:495100045863944192> **| That user cannot be found!**");
  let role = args.join(" ").slice(22);
  if(!role) return message.channel.send("<:tickNo:495100045863944192> **| Please specify a role!**");
  let gRole = message.guild.roles.find(`name`, role);
  if(!gRole) return message.channel.send("<:tickNo:495100045863944192> **| Couldn't find that role.**");

  if(rMember.roles.has(gRole.id)) return message.reply("<:tickNo:495100045863944192> **| They already have that role.**");
  await(rMember.addRole(gRole.id));
  message.channel.send(`<:tickYes:432418492889694210> | ${rMember} has been given the ${gRole.name} role.`).then(msg => msg.delete({timeout: 20000}));
  
}

module.exports.help = {
  name: "addrole"
}
