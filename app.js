//const Discord = require('discord.js');
//const client = new Discord.Client();
const {Client, MessageEmbed} = require('discord.js');
const client = new Client();
const token = require("./token.json");

client.on('ready',() =>
{
    console.log(`Logged in as ${client.user.tag}!`)
});

//오늘의운세
client.on('message', msg =>
{
    if (msg.content === '*오늘의운세')
    {   
        var XLSX = require("xlsx");
        var workbook = XLSX.readFile("todaysluck.xlsx");
        var todaylucky = workbook.SheetNames[0];
        var luckyday = workbook.Sheets[todaylucky];

        function makeRandom(min, max)
        {
            var RandVal = Math.floor(Math.random()*(max-min+1)) + min;
            return RandVal;
        }
        var A = makeRandom(1, 15)
        var dbchooser = `A${A}`;
        var luck = luckyday[`${dbchooser}`].v;
        
        const embed = new MessageEmbed()
        .setTitle('오늘의운세')
        .setColor(0x9986EE)
        .setDescription(`${msg.author}님의 ${luck}`);  
        msg.channel.send(embed);
    }    
});

//사람 들어왔을때
client.on('guildMemberAdd', member =>
{
    const channel = member.guild.channels.cache.find(ch => ch.name === 'hitbee');
     if(!channel) return;
        const embed = new MessageEmbed()
        .setTitle('입장!')
        .setColor(0x9986EE)
        .setDescription(`${member}님이 서버에 들어왔어요!`);
        channel.send(embed);
});

//사람 나갔을때
client.on("guildMemberRemove", member => 
{
    const channel = member.guild.channels.cache.find(ch => ch.name === "hitbee");
    if(!channel) return;
    const embed = new MessageEmbed()
        .setTitle('퇴장!')
        .setColor(0x9986EE)
        .setDescription(`${member}님이 서버에서 나갔어요!`);
        channel.send(embed);
});


client.on("message", msg => 
{
    if(msg.channel.type == 'dm')
    {
        if (msg.content.startsWith(token.prefix))
        {
            const XLSX = require("xlsx");
            const workbook = XLSX.readFile("astory.xlsx");
            var ws = workbook.Sheets[workbook.SheetNames[0]];
            var i = ws['B1'].v; // 만들어진 갯수
            var Anum = (i+1);
            var A = `A${Anum}`;
            
            
            if(!ws[`${A}`])
            {
                ws[`${A}`] = {};
            }

            s = msg.content;
            if(s.charAt(0) === "*")
            {
                s = s.substr(1);
            }
            if(s.charAt(0) === "사")
            {
                s = s.substr(1);
            }
            if(s.charAt(0) === "연")
            {
                s = s.substr(1);
            }
            if(s.charAt(0) === "기")
            {
                s = s.substr(1);
            }
            if(s.charAt(0) === "재")
            {
                s = s.substr(1);
            }
            if(s.charAt(0) === " ")
            {
                s = s.substr(1);
            }
             ws[`${A}`].v = s;
             console.log(ws[`${A}`].v);
             i++;
             ws['B1'].v = i;
             console.log(i+'번째 사연 기재완료.')//콘솔출력
             msg.channel.send(i+'번째 사연이 기재되었습니다.')//갠디출력
             XLSX.writeFile(workbook, "astory.xlsx");
            
         }
    }
    else
    {
        return;
    }
});


client.login(token.token);

//XLSX.writeFile(workbook, 'astory.xlsx');