// Host
const http = require("http");
const express = require("express");
const app = express();
const YouTube = require('simple-youtube-api'); //DO NOT MODIFY 
const ytdl = require('ytdl-core'); //DO NOT MODIFY 
const ffmpeg = require('ffmpeg'); //DO NOT MODIFY 
const youtube = new YouTube('AIzaSyAPEceNnYOsJcVPw-nSuiibzHaLg8P9zwo'); //DO NOT MODIFY 
const queue = new Map(); //DO NOT MODIFY 
const ownerID = '424916247696900135'


app.get("/", (request, response) => {
  console.log(`${new Date()} Wall-e Ping Received.`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

// Calling the Packages and Files
const Discord = require("discord.js");
const botconfig = require("./botconfig.json");
const fs = require("fs");
let bot = new Discord.Client();
bot.commands = new Discord.Collection();
//const DBL = require("dblapi.js");
//const dbl = new DBL(process.env.DBL_TOKEN, bot);

// Ready event
bot.on('ready', () => {
  console.log("Loading..");
  setTimeout(function(){
  console.log("Bot has been loaded completely.");
  }, 1000);

  
  
// Bot Status
function botStatus() {
  let status = [
    `my default prefix ${botconfig.prefix}`,
    `in ${bot.guilds.size} guilds.`,
    `with A Coder's Hangout team.`,
    `waiting for EVA.`,
    `with ${bot.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} users.`
  ];
  let rstatus = Math.floor(Math.random() * status.length);
  bot.user.setActivity(status[rstatus], {Type: 'STREAMING'});        
}; setInterval(botStatus, 20000)
  setInterval(() => {
    //dbl.postStats(bot.guilds.size)
  }, 1800000);
});



// Message event
bot.on("message", async message => {
  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  };
	
  let prefix = prefixes[message.guild.id].prefixes;
	if(message.author.bot) return undefined;
	if(message.channel.type === 'dm') return;
    
// Bot Mention Embed
  if(message.content.toLowerCase() === '<@495481147841576962>'){
    let embed = new Discord.RichEmbed()
    .setTitle("Tritax AI")
    .addField("Prefix", `\`${prefix}\``, true)
    .addField("Help", `\`${prefix}help\``, true)
    .setThumbnail(bot.user.displayAvatarURL)
    .setColor(`${message.guild.me.displayHexColor!=='#00000000' ? message.guild.me.displayHexColor : 0xffffff}`);
    message.channel.send(embed);
  };

	let args = message.content.slice(prefix.length).trim().split(" ");
	let cmd = args.shift().toLowerCase();
	if(message.author.bot) return undefined;
	if(!message.content.startsWith(prefix)) return undefined;
  message.prefix = prefix;
  
	try {
	let commandFile = require(`./commands/${cmd}.js`);
	commandFile.run(bot, message, args);
    
	if(!commandFile) return message.channel.send("Wall-e Error: No Command found with that name.");
  
  console.log(`[${message.author.tag}]: Command: "${cmd}" [${message.guild.name}]`);
	} catch (err) {
    console.log(`Wall-e Error: I found an Error while Loading my Commands!\n${err.stack}`);
  };   
  
  


});



//Youtube MUsic COmmands
var servers = {};
bot.on("message", async message => {
   if (message.channel.type == "dm") return;
  
    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  };
  
    let prefix = prefixes[message.guild.id].prefixes;
    var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
    var searchString = args.slice(1).join(' ');
    var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    var serverQueue = queue.get(message.guild.id);
    switch (args[0].toLowerCase()) {
        //PLAY COMMAND
        case "play":
            var voiceChannel = message.member.voiceChannel;
            var error7 = new Discord.RichEmbed().setColor("990033")
                .setDescription('**I\'m sorry but you need to be in a voice channel to play music!**')
                .setColor(0xff0000)
            if (!voiceChannel) return message.channel.send(error7).then(msg => {
                msg.delete(25000)
            });
            var permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT')) {
                var error5 = new Discord.RichEmbed().setColor("990033")
                    .setDescription('**I cannot connect to your voice channel, make sure you are in the Music #2 Channel!**')
                    .setColor(0xff0000)
                return message.channel.send(error5).then(msg => {
                    msg.delete(25000)
                });
            }
            if (!permissions.has('SPEAK')) {
                var error6 = new Discord.RichEmbed().setColor("990033")
                    .setDescription('**I cannot speak in this voice channel, make sure you are in the Music #2 Channel!**')
                    .setColor(0xff0000)
                return message.channel.send(error6).then(msg => {
                    msg.delete(25000)
                });
            }
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                var playlist = await youtube.getPlaylist(url);
                var videos = await playlist.getVideos();
                for (const video of Object.values(videos)) {
                    var video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                    await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
                }
                return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
            } else {
                try {
                    var video = await youtube.getVideo(url);
                } catch (error) {
                    try {
                        var videos = await youtube.searchVideos(searchString, 10);
                        var index = 0;

                        var playing = new Discord.RichEmbed().setColor("990033")
                            .setDescription(`${videos.map(video2 => `\`${++index}\` - [${video2.title}](${video2.url})`).join('\n')}`)
                            .setFooter(`Please provide a value to select one of the search results ranging from 1-10.`)
                            .setColor(0x0E3866)
                        message.channel.send(playing)
                        // ESLINT-DISABLE-NEXT-LINE MAX-DEPTH
                        try {
                            var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                                maxMatches: 1,
                                time: 10000,
                                errors: ['time']
                            });
                        } catch (err) {
                            console.error(err);
                            var error2 = new Discord.RichEmbed().setColor("990033")
                                .setDescription('**No or invalid value entered, cancelling video selection.**')
                                .setColor(0xff0000)
                            return message.channel.send(error2);
                        }
                        var videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    } catch (err) {
                        console.error(err);
                        var error1 = new Discord.RichEmbed().setColor("990033")
                            .setDescription('**I could not obtain any search results.**')
                            .setColor(0xff0000)
                        return message.channel.send(error1);
                    }
                }
                return handleVideo(video, message, voiceChannel);
            }
            break;
            //SKIP COMMAND
        case "skip":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0xff0000)
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
            if (!serverQueue) return message.channel.send(nothing);
            serverQueue.connection.dispatcher.end('Skip command has been used!');
            return undefined;
            break;
            //STOP COMMAND
        case "stop":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0xff0000)
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
            if (!serverQueue) return message.channel.send(nothing);
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end('Stop command has been used!');
            return undefined;
            break;
            //VOLUME COMMAND

            //WIP
        case "volume":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0xff0000)
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
            if (!serverQueue) return message.channel.send(nothing);
            if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
            serverQueue.volume = args[1];
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
            var volval;
            if (serverQueue.volume == 1) {
                volval = `○──── :loud_sound:⠀`
            }
            if (serverQueue.volume == 2) {
                volval = `─○─── :loud_sound:⠀`
            }
            if (serverQueue.volume == 3) {
                volval = `──○── :loud_sound:⠀`
            }
            if (serverQueue.volume == 4) {
                volval = `───○─ :loud_sound:⠀`
            }
            if (serverQueue.volume == 5) {
                volval = `────○ :loud_sound:⠀`
            }
            message.channel.send(volval)
            break;
            //NOW PLAYING COMMAND
        case "np":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0xff0000)
            if (!serverQueue) return message.channel.send(nothing);
            var NowEmbed = new Discord.RichEmbed().setColor("990033")
                .setDescription(`Now playing:<a:youtube:484226993727078403> **[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**`)
                .setColor(0x0E3866)

            return message.channel.send(NowEmbed);
            break;
            //QUEUE COMMAND
        case "queue":
            if (!serverQueue) return message.channel.send('There is nothing playing.');
            return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
            break;
            //PAUSE COMMAND
        case "pause":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0xff0000)
            if (serverQueue && serverQueue.playing) {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                return message.channel.send('⏸ Paused the music for you!');
            }
            return message.channel.send(nothing);
            break;
            //RESUME MUSIC COMMAND
        case "resume":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0xff0000)
            if (serverQueue && !serverQueue.playing) {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                return message.channel.send('▶ Resumed the music for you!');
            }
            return message.channel.send(nothing);


            return undefined;
            break;
    }
    //VIDEO HANDLER 
    async function handleVideo(video, message, voiceChannel, playlist = false) {
        var serverQueue = queue.get(message.guild.id);
        console.log(video);
        //META DATA
        var song = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
        };
        if (!serverQueue) {
            var queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };

            queue.set(message.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                queue.delete(message.guild.id);
                return message.channel.send(`I could not join the voice channel: ${error}`);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            if (playlist) return undefined;
            else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
        }
        return undefined;
    }

    function play(guild, song) {
        var serverQueue = queue.get(guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
        console.log(serverQueue.songs);

        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', reason => {
                message.channel.send('``The queue of song is end.``');
                if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                else console.log(reason);
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            }).on('error', error => console.error(error));
        var volval;
        if (serverQueue.volume == 1) {
            volval = `○──── :loud_sound:⠀`
        }
        if (serverQueue.volume == 2) {
            volval = `─○─── :loud_sound:⠀`
        }
        if (serverQueue.volume == 3) {
            volval = `──○── :loud_sound:⠀`
        }
        if (serverQueue.volume == 4) {
            volval = `───○─ :loud_sound:⠀`
        }
        if (serverQueue.volume == 5) {
            volval = `────○ :loud_sound:⠀`
        }
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        var NowEmbed = new Discord.RichEmbed().setColor("990033")
            .setDescription(`Now playing:<a:youtube:484226993727078403>**[${song.title}](${song.url})**`)
            .setFooter(`Requested by ${message.author.username}#${message.author.discriminator} `)
            .setColor(0x0E3866)
        serverQueue.textChannel.send("Loading song...").then(msg => {
            msg.edit(NowEmbed)
        });

    }
});





// Member Join Event
	bot.on('guildMemberAdd', member => {   
    if(member.guild.id === "421853697027473408"){
	  const members = member.guild.memberCount;
	  const channel = member.guild.channels.find('name', 'member-log');
	  if (!channel) return;

    let Role = member.guild.roles.find(`name`, "Bots");
    if(member.user.bot){
	    member.addRole(Role.id)
    }else{
      let role = member.guild.roles.find(`name`, "Members");
	    member.addRole(role.id)
    };
 
	  let Embed = new Discord.RichEmbed()
	  .setFooter(`User Joined | ${member.guild.memberCount} Members`)
	  .setColor("#cde246")    
	  .setAuthor(`${member.displayName} has joined ${member.guild.name}`, member.user.displayAvatarURL)
	  .setTimestamp()
	  channel.send(Embed);
  }else{return; }
	});






// Member Leave Event
	bot.on('guildMemberRemove', member => {
    if(member.guild.id === "421853697027473408"){
	  const channel = member.guild.channels.find(`name`, 'member-log');
	  if(!channel) return; 
    
	  let Embed = new Discord.RichEmbed()
	  .setColor("#e26346")
	  .setAuthor(`${member.displayName}, has left ${member.guild.name}.`, member.user.displayAvatarURL)
	  .setTimestamp()
	  .setFooter(`User Left | ${member.guild.memberCount} Members`)
	  channel.send(Embed);
    }else{return; }
	});





// Guild Join event
	bot.on('guildCreate', guild => {
	  let channel = bot.channels.get("428564028239904790");
    
    const embed = new Discord.RichEmbed()
    .setColor("#cde246")
    .setAuthor(`Joined ${guild.name}`)
    .setThumbnail(guild.iconURL)
    .addField("Owner", guild.owner.user.tag)
    .addField("ID", guild.id, true)
    .addField("Users", guild.memberCount, true)
    .addField("Channels", guild.channels.size, true)
    channel.send(embed);
	});

// Guild Leave event
	bot.on('guildDelete', guild => {
	  let channel = bot.channels.get("428564028239904790");
    
    const embed = new Discord.RichEmbed()
    .setColor("#cde246")
    .setAuthor(`Left ${guild.name}`)
    .setThumbnail(guild.iconURL)
    .addField("Owner", guild.owner.user.tag)
    .addField("ID", guild.id, true)
    .addField("Users", guild.memberCount, true)
    .addField("Channels", guild.channels.size, true)
    channel.send(embed);
	});


// WAll-e Login:
	bot.login(process.env.TOKEN_BOT);
