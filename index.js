console.log('Prepping...');
const disc=require('discord.js');
const fs=require('fs');
var config=require('./config.js');

var bot=new disc.Client();
// Entries will be 'UID:GUILD:CHANNEL'
var logs=[]; // Entries will be 'UID:MSGID'

bot.on('ready',()=>{
  console.log('Ready.\nInvite Link:\nhttps://discordapp.com/oauth2/authorize?client_id='+bot.user.id+'&scope=bot&permissions=125952');
});

bot.on('message',(message)=>{
  if(message.author.bot==false){
    if(message.channel.type=='dm'){
      if(message.content.match(/^<[0-9]{18}>:<[0-9]{18}>$/)){
        var err='';
        do{
          var targ=message.content.replace(/[<>]/g,'');
          targ=targ.split(':');
          var gus=bot.guilds;
          if(!gus.get(targ[0])){
            err='AnonBot isn\'t a part of that server';
            break;
          }
          let chan2=bot.guilds.get(targ[0]).channels.get(targ[1]);
          if(!chan2){
            err='That channel doesn\'t exist';
            break;
          }
          if(chan2.type!='text'){
            err='That isn\'t a text channel';
            break;
          }
          if(!chan2.permissionsFor(bot.user).has('SEND_MESSAGES',true)){
            err='AnonBot doesn\'t have permission to send messages in that channel.';
          }
        }while(false);
        if(err!=''){
          message.channel.send('Error with Target: '+err);
        }else{
          /*chan.push(message.author.id+':'+targ.join(':'));*/
          fs.appendFileSync('targs.txt',message.author.id+':'+targ.join(':')+',','utf-8');
          console.log('Target channel for <@'+message.author.id+'> set to '+targ.join(':')+'.');
          message.channel.send('New target set to '+targ.join(':')+'.');
        }
      }else{
        if(message.content.match(/^;blist [0-9]{18}$/)&&config.mods.match(message.author.id)){
          let data=message.content.replace(';blist ','');
          let loc=0;
          for(i=0;i<logs.length;i++){
            let m=new RegExp('^[0-9]{18}:'+data+'$');
            if(logs[i].match(m)){
              loc=1;
              break;
            }
          }
          if(loc==1){
            let uid=logs[i].split(':')[0];
            fs.appendFileSync('blacklist.txt',uid+',','utf-8');
            console.log('Blacklisted <@'+uid+'>.');
            message.channel.send('Blacklisted <@'+uid+'>.');
          }else{
            message.channel.send('Either that message doesn\'t exist, or it wasn\'t sent with AnonBot during this session.');
          }
        }else{
          let blist=fs.readFileSync('blacklist.txt','utf-8');
          if(blist.indexOf(message.author.id)!=-1){
            console.log('<@'+message.author.id+'> attempted to use this, but was blacklisted.');
            message.channel.send('Sorry, but you\'ve been blacklisted by a moderator.');
          }else{
            let ltarg='NOTARG';
            let targs=fs.readFileSync('targs.txt','utf-8');
            targs=targs.match(/[0-9]{18}:[0-9]{18}:[0-9]{18}/g);
            for(j=0;j<targs.length;j++){
              let arr=targs[j].split(':');
              if(arr[0]==message.author.id){
                ltarg=arr;
              }
            }
            if(ltarg=='NOTARG'){
              message.channel.send('You have no target set. Set one with <`SERVER ID`>:<`CHANNEL ID`>.');
            }else{
              let gid=ltarg[1];
              let cid=ltarg[2];
              let omsg=message;
              bot.guilds.get(gid).channels.get(cid).send(message.content)
              .then((message)=>{
                console.log('Sent message in '+gid+':'+cid+'.');
                omsg.channel.send('Message sent.');
                logs.push(ltarg[0]+':'+message.id);
              })
              .catch((error)=>{
                console.error;
                message.channel.send('Uh oh, something went wrong. Contact an admin or try again later.');
              });
            }
          }
        }
      }
    }else if(message.content.match(/^;anon$/i)){
      message.member.send('__AnonBot__\n\nWelcome to AnonBot. First, the rules:\nAnonBot is a privilege. You have been trusted to send messages anonymously, and with that comes responsibility. **Please do not think you aren\'t responsible for your messages.** Although AnonBot keeps no accessible logs, mods can blacklist you based on your message if necessary.\n\nOk, here\'s how it works:\n1. Define a channel. You\'ll need Developer Mode enabled for this, to do that click below.\nhttps://github.com/hingobway/coolbot/wiki/enabling-developer-mode\nThen, just send a message like this (using the <>): `<SERVER ID>:<CHANNEL ID>`.\n2. Send a message right here. That message will be sent straight to that channel, provided it\'s one that AnonBot has permissions to send in.\n\nThat\'s it! Remember, you can always change your target location using step 1. **And don\'t forget, you are responsible for what you say!**');
      message.reply('Sent you a DM with more info.\nTo target this channel, send me the following in a DM: ```<'+message.guild.id+'>:<'+message.channel.id+'>``` \n**Remember, you are responsible for what you post!**');
      console.log('Initiated chat with <@'+message.author.id+'>.');
    }
  }
});

bot.login(config.token);
