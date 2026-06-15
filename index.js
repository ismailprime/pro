require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
});

// ================= DATA =================

let xp = {};
let money = {};
let cooldown = {};

if (fs.existsSync("./xp.json"))
  xp = JSON.parse(fs.readFileSync("./xp.json"));

if (fs.existsSync("./money.json"))
  money = JSON.parse(fs.readFileSync("./money.json"));

function save() {
  fs.writeFileSync("./xp.json", JSON.stringify(xp, null, 2));
  fs.writeFileSync("./money.json", JSON.stringify(money, null, 2));
}

// ================= ROLLER =================

const ROLES = {
  caylak: "1515752720433152050",
  aktif: "1515752883600232538",
  sadik: "1515753054912118796",
  daimi: "1515770549870264330",
  special: "1515779632761143540"
};

const UYE_ROLE = "1515752720433152050"; // join rol

// ================= XP ROLE SYSTEM =================

async function updateRoles(member, xpValue) {

  const g = member.guild;

  const roles = Object.values(ROLES)
    .map(id => g.roles.cache.get(id))
    .filter(Boolean);

  await member.roles.remove(roles).catch(()=>{});

  if (xpValue >= 50000)
    return member.roles.add(ROLES.special).catch(()=>{});

  if (xpValue >= 25000)
    return member.roles.add(ROLES.daimi).catch(()=>{});

  if (xpValue >= 14000)
    return member.roles.add(ROLES.sadik).catch(()=>{});

  if (xpValue >= 6500)
    return member.roles.add(ROLES.aktif).catch(()=>{});

  if (xpValue >= 1000)
    return member.roles.add(ROLES.caylak).catch(()=>{});
}

// ================= HOŞGELDİN + OTOMATİK ROL =================

client.on("guildMemberAdd", member => {

  const role = member.guild.roles.cache.get(UYE_ROLE);
  if (role) member.roles.add(role).catch(()=>{});

  const channel = member.guild.systemChannel;
  if (channel) {
    channel.send(`👋 Hoşgeldin <@${member.id}>!`);
  }
});

// ================= XP + PARA + KÜFÜR =================

const badWords = ["amk", "oç", "siktir", "fuck", "shit"];

client.on("messageCreate", async message => {

  if (message.author.bot) return;

  const id = message.author.id;
  const now = Date.now();

  if (!xp[id]) xp[id] = 0;
  if (!money[id]) money[id] = 0;
  if (!cooldown[id]) cooldown[id] = 0;

  // ================= KÜFÜR =================
  const content = message.content.toLowerCase();

  if (badWords.some(w => content.includes(w))) {

    await message.delete().catch(()=>{});

    const member = message.member;

    if (member && member.moderatable) {
      member.timeout(5 * 60 * 1000);
    }

    return message.channel.send(`⚠️ Küfür → 5 dk mute`);
  }

  // ================= XP / PARA =================

  if (now - cooldown[id] >= 120000) {

    const xpGain = Math.floor(Math.random() * 21) + 10;
    const moneyGain = Math.floor(Math.random() * 901) + 100;

    xp[id] += xpGain;
    money[id] += moneyGain;

    cooldown[id] = now;

    save();
    updateRoles(message.member, xp[id]);
  }

  // ================= KOMUTLAR =================

  if (message.content === "!xp")
    return message.reply(`⭐ XP: ${xp[id] || 0}`);

  if (message.content === "!param")
    return message.reply(`💰 Para: ${money[id] || 0}`);

  if (message.content === "!shop") {

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("buy_xp")
        .setLabel("⭐ XP (50💰)")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("buy_senor")
        .setLabel("👑 Señor (100K)")
        .setStyle(ButtonStyle.Success)
    );

    return message.channel.send({ content: "🛒 SHOP", components: [row] });
  }
});

// ================= BUTTON SYSTEM =================

client.on("interactionCreate", async i => {

  if (!i.isButton()) return;

  const id = i.user.id;

  if (!xp[id]) xp[id] = 0;
  if (!money[id]) money[id] = 0;

  if (i.customId === "buy_xp") {

    if (money[id] < 50)
      return i.reply({ content: "Yetersiz para", ephemeral: true });

    money[id] -= 50;
    xp[id] += 1;

    save();

    return i.reply({ content: "⭐ XP alındı", ephemeral: true });
  }

  if (i.customId === "buy_senor") {

    const role = i.guild.roles.cache.get("1515780264779841689");

    if (money[id] < 100000)
      return i.reply({ content: "100K gerekli", ephemeral: true });

    money[id] -= 100000;

    await i.member.roles.add(role);

    save();

    return i.reply({ content: "👑 Señor verildi", ephemeral: true });
  }
});

// ================= LOGIN =================

client.login(process.env.TOKEN);
