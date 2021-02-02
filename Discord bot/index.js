const Discord = require('discord.js');
const bot = new Discord.Client();

const ytdl = require("ytdl-core");


const PREFIX = '/';

var servers = {};

const usedCommandRecently = new Set();

bot.on('ready', () => {
    console.log('Hey guys, I am online!');
    bot.user.setActivity("Gamerz Fam Server", { type: 'WATCHING' }).catch(console.error);
})

bot.on('guildMemberAdd', member => {

    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) return;

    channel.send(`Welcome to our server, ${member}, please read the rules in the rules text channel.`)
});

bot.on('message', message => {
    if (message.content === "Hello") {
        message.reply('Hello Friend!');
    }
})

bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'serverrules':
            if(usedCommandRecently.has(message.author.id)){
                message.reply("You cannot use that command just yet.");
            }else{
                message.reply('Go to rules text channel.')

                usedCommandRecently.add(message.author.id);
                setTimeout(() => {
                 usedCommandRecently.delete(message.author.id)
                }, 60000);
            }
            break;
        case 'youtubechannel':
            if(usedCommandRecently.has(message.author.id)){
                message.reply("You cannot use that command just yet.");
            }else{
                const embed = new Discord.MessageEmbed()
                .setTitle('Youtube Channel')
                .setColor(0x58D68D)
                .addField('RS GAMERZ - https://www.youtube.com/channel/UCjigezip4OXQCsuYBxJYXcA', )
                .addField('Guide Gamerz - https://www.youtube.com/channel/UCmpFNujwpccHoWASlH47n3w', )
                .setDescription('Hello Everyone welcome to my Youtube Channel. Please Like, Share and Subscribe.')
                .setFooter('Created by Rutva Shah')
                message.channel.send(embed);
                usedCommandRecently.add(message.author.id);
                setTimeout(() => {
                 usedCommandRecently.delete(message.author.id)
                }, 60000);
            }
            break;
        case 'info':
            if (args[1] === 'version') {
                message.reply('Version 1.0.0');
            } else {
                message.reply('Hey i am Gamerz Hub bot. Created by Rutva Shah.')
            }
            break;
        case 'clear':
            if (!args[1]) 
                if(usedCommandRecently.has(message.author.id)){
                    message.reply("You cannot use that command just yet.");
                }else{
                    message.reply('Error please define number of messages to be deleted.');

                usedCommandRecently.add(message.author.id);
                setTimeout(() => {
                 usedCommandRecently.delete(message.author.id)
                }, 60000);
            }else{
                message.channel.bulkDelete(args[1]);
            }
            
            break;
        case 'myself':
            if(usedCommandRecently.has(message.author.id)){
                message.reply("You cannot use that command just yet.");
            }else{
            const embed = new Discord.MessageEmbed()
                .setTitle('User Information')
                .addField('Player Name', message.author.username)
                .addField('Current Server', message.guild.name)
                .setColor(0x58D68D)
                .setThumbnail(message.author.defaultAvatarURL)
                .setFooter('Created by Rutva Shah')
                message.channel.send(embed);
                 usedCommandRecently.add(message.author.id);
                setTimeout(() => {
                 usedCommandRecently.delete(message.author.id)
                }, 60000);
            }
            break;
        case 'kick':

            const user = message.mentions.users.first();

            if (user) {
                const member = message.guild.member(user);

                if (member) {
                    member.kick('You were kicked from this server.').then(() => {
                        message.reply(`Sucessfully kicked ${user.tag}`);
                    }).catch(error => {
                        message.reply('I was unable to kick the member.');
                        console.log(error);
                    });
                } else {
                    message.reply("Unable to find user in this server.")
                }
            } else {
                message.reply('You need to specify a person. Eg - kick @username.')
            }
            break;
        case 'cooldown':
            if(usedCommandRecently.has(message.author.id)){
                message.reply("You cannot use that command just yet.");
            }else{
                message.reply('You are not on cooldown.');

                usedCommandRecently.add(message.author.id);
                setTimeout(() => {
                 usedCommandRecently.delete(message.author.id)
                }, 30000);
            }
            break;
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }
                });
            }

            if(!args[1]){
                message.channel.send("Cannot play music. You need to provide a link.");
                return;
            }

            if(!message.memmber.voice.channel){
                message.channel.send("Cannot play music. You must be in a voice channel.");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection){
                play(connection, message);
            }).catch(error => {
                message.reply('I was unable to kick the member.');
                console.log(error);
            });

    }
})

bot.login(process.env.token);