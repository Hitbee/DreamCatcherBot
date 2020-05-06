//const Discord = require('discord.js');
//const client = new Discord.Client();
const { Client, MessageEmbed } = require("discord.js");
const client = new Client();
const token = require("./token.json");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//명령어
client.on("message", (msg) => {
  if (msg.content === "*명령어") {
    const embed = new MessageEmbed()
      .setTitle("BIBI봇 명령어 LIST")
      .setColor(0x9986ee)
      .addField("서버 입장시 EVENT발생", "서버 퇴장시 EVENT발생")
      .addField("*명령어", "명령어 LIST를 알려줍니다.")
      .addField("*오늘의운세", "오늘의 운세를 알려줍니다.")
      .addField(
        "*사연기재",
        "ex)*사연기재 오늘저녁엔 이런저런일이..\n※BIBI봇한테 개인톡으로 전송하면 익명보장으로 저장 가능"
      )
      .addField("*사연출력", "익명의 사연을 출력하고, LIST에서 삭제합니다.")
      .addField("*서버소개", "관리자만 사용 가능합니다.");
    msg.channel.send(embed);
  }
});

//오늘의운세
client.on("message", (msg) => {
  if (msg.content === "*오늘의운세") {
    const XLSX = require("xlsx");
    const workbook = XLSX.readFile("todaysluck.xlsx");
    const todaylucky = workbook.SheetNames[0];
    const luckyday = workbook.Sheets[todaylucky];

    function makeRandom(min, max) {
      const RandVal = Math.floor(Math.random() * (max - min + 1)) + min;
      return RandVal;
    }
    const A = makeRandom(1, 15);
    const dbchooser = `A${A}`;
    const luck = luckyday[`${dbchooser}`].v;

    const embed = new MessageEmbed()
      .setTitle("오늘의운세")
      .setColor(0x9986ee)
      .setDescription(`${msg.author}님의 ${luck}`);
    msg.channel.send(embed);
  }
});

//사람 들어왔을때
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === "hitbee"
  );
  if (!channel) return;
  const embed = new MessageEmbed()
    .setTitle("입장!")
    .setColor(0x9986ee)
    .setDescription(`${member}님이 서버에 들어왔어요!`);
  channel.send(embed);
});

//사람 나갔을때
client.on("guildMemberRemove", (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === "hitbee"
  );
  if (!channel) return;
  const embed = new MessageEmbed()
    .setTitle("퇴장!")
    .setColor(0x9986ee)
    .setDescription(`${member}님이 서버에서 나갔어요!`);
  channel.send(embed);
});

//사연기재 사연받기
client.on("message", (msg) => {
  if (msg.channel.type == "dm") {
    if (msg.content.startsWith(token.prefix)) {
      const XLSX = require("xlsx");
      const workbook = XLSX.readFile("astory.xlsx");
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      let i = ws["B1"].v; // 만들어진 갯수
      const Anum = i + 1;
      const A = `A${Anum}`;

      if (!ws[`${A}`]) {
        ws[`${A}`] = {};
      }

      s = msg.content;
      if (s.charAt(0) === "*") {
        s = s.substr(1);
      }
      if (s.charAt(0) === "사") {
        s = s.substr(1);
      }
      if (s.charAt(0) === "연") {
        s = s.substr(1);
      }
      if (s.charAt(0) === "기") {
        s = s.substr(1);
      }
      if (s.charAt(0) === "재") {
        s = s.substr(1);
      }
      if (s.charAt(0) === " ") {
        s = s.substr(1);
      }
      ws[`${A}`].v = s;
      console.log(ws[`${A}`].v); //사연내용 로그로 보기
      i++;

      ws["B1"].v = i;
      console.log(i + "번째 사연 기재완료."); //콘솔출력
      msg.channel.send("사연이 기재되었습니다."); //갠디출력

      if (i === 100) {
        i = 0;
        ws["B1"].v = i;
      }
      XLSX.writeFile(workbook, "astory.xlsx");
    }
  } else {
    return;
  }
});

//사연기재 사연출력
client.on("message", (msg) => {
  if (msg.channel.name === "dreamcatcher-ssul🐦") {
    if (msg.content === "*사연출력") {
      const XLSX = require("xlsx");
      const workbook = XLSX.readFile("astory.xlsx");
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      //var reset = '사연1';
      let i = Number(ws["B2"].v); // 삭제된 갯수
      const Anum = i + 1; // 1번부터
      const A = `A${Anum}`; // A1번부터 출력
      const sender = ws[`${A}`].v; // A1번부터 있는 데이터 읽어오기

      if (sender === "사연1") {
        msg.channel.send("기재된 사연이 없습니다.");
      } else {
        const gongbaek = `사연${Anum}`;

        const embed = new MessageEmbed()
          .setTitle("익명의 사연")
          .setColor(0x9986ee)
          .setDescription(`${sender}`);
        msg.channel.send(embed);

        ws[`${A}`].v = gongbaek;
        i++;
        ws["B2"].v = i;
        //msg.channel.send(i+'번째 사연이 삭제되었습니다.');
        console.log(i + "번째 사연이 삭제되었습니다.");
        if (i === 100) {
          i = 0;
          ws["B2"].v = i;
        }
      }

      XLSX.writeFile(workbook, "astory.xlsx");
    }
  }
});

//서버소개
client.on("message", (msg) => {
  if (msg.content === "*서버소개") {
    if (msg.channel.name === "🌜드림캐쳐-서버소개🌝") {
      const embed = new MessageEmbed()
        .setTitle(":purple_heart: 드림캐쳐 각 채널 설명 1 :purple_heart:")
        .setColor(0x9986ee)
        .addField("# Gate :hand_splayed:", "서버 입장 및 퇴장 인사!")
        .addField(
          "# dreamcatcher-rule :hourglass_flowing_sand:",
          "드림캐쳐에서 지켜야 할 규정. 꼭 정독해주세요!"
        )
        .addField(
          "# notice :no_entry:",
          "서버 내 공지사항입니다. 확인 후에 꼭 이모지를 달아주세요!"
        )
        .addField(
          "# receiving-suggestion :pushpin:",
          "건의사항 제시 공간입니다. 서버가 더 좋아질 수 있는 방법이나,\n여러분들의 의견을 자유롭게 적어주세요!"
        )
        .addField(
          "# self-introduction :raising_hand:",
          "새로 온 뉴비분들이 자기소개 남기는 공간입니다!"
        )
        .addField(
          "# attendance-check :heavy_check_mark:",
          "하루 한번씩 출석체크를 남기는 공간입니다.\n양식을 꼭 지켜서 기재해주세요! (EX- !출첵 라엘)"
        )
        .addField(
          ":gift_heart: COMPLIMENT CHANNEL :gift_heart:",
          "# compliment-request - 칭찬스티커 요청 채널\n# compliment - 칭찬스티커 채널"
        )
        .addField(
          ":warning: WARNING CHANEL :warning:",
          "# warning - 욕설 및 도배 로인한 예비경고 채널\n# warning-list - 서버 내 규정에 따른 관리자의 경고 채널\n# black-list - 서버 내 불의를 일으키고 퇴출 당한 서버원의 퇴출사유 박제 채널"
        )
        .addField(
          ":paperclip: CONFERENCE CHANNEL :paperclip:",
          "# conference-chat - 드림캐쳐 서버의 전체 회의때 사용하는 채팅 채널\n# CONFERENCE ROOM - 드림캐쳐서버의 전체회의때 사용하는 음성 채널"
        )
        .addField(
          ":rose: EVENT CHANNEL :rose:",
          "기념일 등 각종 특별한날 이벤트 진행 채널\n# 2019-lie-day (2019만우절)\n# remember-20140416 (세월호추모5주기)\n# 200th-dreamcatcher-20190815 (드림캐쳐 200일)\n# merry-christmas (크리스마스)\n# wish-list (새해소원)\n# 2020-lie-day (2020만우절)\nremember-20140416 (세월호추모6주기)"
        )
        .addField(
          ":gift: PARTY CHANNEL :gift:",
          "뉴비 환영 파티 . 서버원 생일 파티 채널\n# happy-birthday - 서버원 생일 리스트\n# party-chat - 파티할 때 사용하는 채팅 채널\n# DREAM PARTY - 파티할 때 사용하는 음성 채널"
        )
        .addField(
          ":speaker: VOICE CHANNEL :purple_heart:",
          "# dream-chat - 드림캐쳐 서버 전체 채팅 채널\n# DREAM GARDEN -\n# DREAM LOBBY - 　　　　　　- 자유 음성 채널\n# DREAM CAFE -\n# SLEEP IN 코코낸내 - 잠잘 때 사용하는 수면 채널"
        )
        .addField(
          ":speech_balloon: PRACTICE CHANNEL :purple_heart:",
          "# practice-chat - 연습할 때 사용하는 채팅 채널\n# feedback-chat - 연습한 피드백 주고받는 채널\n# PRACTICE ROOM1 - 연습할 때 사용하는 음성 채널\n# PRACTICE ROOM2 - 연습할 때 사용하는 음성 채널"
        )
        .addField(
          ":purple_heart: SHARE :purple_heart:",
          "dreamcatcher-ssul (서버원 썰)\ntodays-english (오늘의영어)\n# 발음 - 발음 대본 모음\n# script - 대본 모음\n# 노래가사 - 노래가사 모음\n# 글귀 - 이쁜 글귀 모음"
        )
        .addField(
          ":projector: ACTOR CASTLE :european_castle:",
          "# actor-story - 액터팀 전용 채팅 채널\n# acting-output - 연기 관련 작업물 채널\n# acting-feedback - 연기 관련 피드백 채널\n# scriptreading-chat - 대본 리딩 채팅 채널\n# SCRIPT READING - 대본 리딩 음성 채널\n# ACTING HALL - 액터팀 전용 음성 채널"
        )
        .addField(
          ":notes: MUSICIAN CASTLE :european_castle:",
          "# musician-story - 뮤지션팀 전용 채팅 채널\n# music-output - 음악 관련 작업물 채널\n# music-feedback - 음악 관련 피드백 채널\n# singingroom-chat - 노래방 채팅 채널\n# SINGING ROOM - 노래방 음성 채널\n# MUSIC HALL - 뮤지션팀 전용 음성 채널"
        )
        .addField(
          ":film_frames: MEDIA EDITOR CASTLE :european_castle:",
          "# media-story - 미디어 에디터팀 전용 채팅 채널\n# media-output - 영상 관련 작업물 채널\n# media-feedback - 영상 관련 작업물 피드백 채널"
        )
        .addField(
          ":art: DESIGNER CASTLE :european_castle:",
          "# designer-story - 디자인팀 전용 채팅 채널\n# design-output - 디자인 관련 작업물 채널\n# design-feedback - 디자인 관련 피드백 채널\n# DESIGN HALL - 디자인팀 전용 음성 채널"
        )
        .addField(
          ":pill: MEDICAL CASTLE :european_castle:",
          "# medical-story - 메디컬팀 전용 채팅 채널\n# counseling-center - 상담 문의 채널\n# COUNSELING CENTER - 상담 음성 채널"
        )
        .addField(
          ":bulb: ENGINEER CASTLE :european_castle:",
          "# engineer-story - 엔지니어팀 전용 채팅 채널\n# question - 공학 관련 질문 채널\n# blackboard - 공학 관련 채팅 채널\n# bot-request - 봇 제작 요청 채널\n# LABORATORY - 엔지니어팀 전용 음성 채널"
        );
      msg.channel.send(embed);
    }

    if (msg.channel.name === "🌜드림캐쳐-서버소개🌝") {
      const embed = new MessageEmbed()
        .setTitle(":purple_heart: 드림캐쳐 각 채널 설명 2 :purple_heart:")
        .setColor(0x9986ee)
        .addField(
          ":circus_tent: PERFORMANCE CHANNEL :circus_tent:",
          "# broadcast-publicity - 개인 방송 홍보 채널 \n# content-promotion - 서버 공식 컨텐츠 홍보 채널 \n# content-chat - 컨텐츠 진행시에 사용하는 채팅 채널\n# theater-chat - 극장 채팅 채널\n# concerthall-chat - 콘서트홀 채팅 채널\n# CONTENT - 컨텐츠 진행시에 사용하는 음성 채널\n# THEATER - 극장 음성 채널\n# CONCERT HALL - 콘서트홀 음성 채널"
        )
        .addField(
          ":camera: GALLERY :camera:",
          "# gallery-hall - 자유로운 사진 게시 채널\n# fashion-hall - 패션 관련 사진 게시 채널\n# art-hall - 그림 관련 사진 게시 채널\n# food-gallery - 음식 관련 사진 게시 채널\n# cooking-output - 직접 요리한 음식 사진 게시 채널"
        )
        .addField(
          ":peach: RECOMMEND CHANNEL :peach:",
          "# movie-recommend - 영화 추천 채널\n# music-recommend - 음악 추천 채널\n# book-recommend - 책 추천 채널\n# restaurant-recommend - 맛집 추천 채널\n# recipe-recommend - 요리 레시피 추천 채널"
        )
        .addField(
          ":ferris_wheel: DREAM LAND :carousel_horse:",
          "# 강화봇 - 강화전용채널\n# music-bot - 음악 봇 전용 명령 채널\n# weather - 날씨 전용 채널\n# rabong-bot - RABONG BOT 전용 채널\n# bibi-bot - BIBI BOT 전용 채널\n# kety-bot - KETY BOT 전용 채널\n# chuchu-bot - CHUCHU BOT 전용 채널\n# koko-bot - KOKO BOT(프로필 정보) 전용 채널\n# 끝말잇기 - 아무말잇기 채널\n# 오목조목 - 오목 채널\n# 포숑포숑 - 총알피하기 게임 채널\n# cinema-chat - 영화 상영시 사용하는 채팅 채널\n# king - 왕게임 채팅 채널\n# mafia-chat - 마피아 채팅 채널\n# DREAM CINEMA - 영화 상영시 사용하는 음성 채널\n# KING - 왕게임 음성 채널\n# MAFIA - 마피아 음성 채널"
        )
        .addField(
          ":space_invader: GAME CHANNEL :space_invader:",
          "# game-chat - 게임 관련 채팅 채널\n# OTHER GAME - 기타 게임할때 사용하는 음성 채널\n# League Of Legends - 리그 오브 레전드 전용 음성 채널\n# BATTLE GROUNDS - 배틀 그라운드 전용 음성 채널"
        )
        .addField(
          ":warning: TRASH CHANNEL :warning:",
          "욕설과 모든 나쁜 발언이 허용되는 유일한 채널\n# trash-chat - 나쁜말 관련 채팅 채널\n# TRASH - 나쁜말 관련 음성 채널"
        )
        .addField(
          ":lock: SECRET CHANNEL :lock:",
          "관리자에게 신고사항 및 1대1 면담 등의 채널\n(관리자의 허가 없이 절대 사용할 수 없습니다)\n# SECRET ROOM1\n# SECRET ROOM2\n# 잠수채널 - 모든 음성 채널에서 아무 작동 없이 30분 이상 방치되어있을 경우\n자동으로 잠수채널에 내려가도록 설정되어 있습니다.\n(자동채널로 내려갈 때에는 마이크도 자동 음소거 됩니다)"
        );
      msg.channel.send(embed);
    }
  }
});

client.login(token.token);

//XLSX.writeFile(workbook, 'astory.xlsx');
