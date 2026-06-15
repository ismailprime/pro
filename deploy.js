const { REST, Routes } = require("discord.js");
const fs = require("fs");

const commands = [];

const files = fs
  .readdirSync("./commands")
  .filter(f => f.endsWith(".js"));

for (const file of files) {
  const cmd = require(`./commands/${file}`);
  commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: "10" })
  .setToken(process.env.TOKEN);

(async () => {

  console.log("Slash yükleniyor...");

  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );

  console.log("Slash hazır!");
})();
