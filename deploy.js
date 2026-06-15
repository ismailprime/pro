const { REST, Routes } = require("discord.js");
const fs = require("fs");

const commands = [];

try {
  const files = fs.readdirSync("./commands");

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const cmd = require(`./commands/${file}`);

    if (!cmd.data) {
      console.log(file + " data yok");
      continue;
    }

    commands.push(cmd.data.toJSON());
  }

} catch (err) {
  console.log("COMMANDS HATA:", err);
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Slash yükleniyor...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("SLASH OK");
  } catch (err) {
    console.log("DEPLOY ERROR:", err);
  }
})();
