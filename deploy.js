const { REST, Routes } = require("discord.js");
const fs = require("fs");

// commands oku
const commands = [];

if (fs.existsSync("./commands")) {
  const files = fs.readdirSync("./commands");

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const cmd = require(`./commands/${file}`);

    if (cmd?.data) {
      commands.push(cmd.data.toJSON());
    }
  }
}

console.log("Komut sayısı:", commands.length);

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Slash komutlar yükleniyor...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Slash komutlar yüklendi!");
  } catch (err) {
    console.log("❌ HATA:");
    console.log(err);
  }
})();
