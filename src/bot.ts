import { Client, Events, GatewayIntentBits, Collection } from 'discord.js'
import ping from './commands/utility/ping'
import server from './commands/utility/server'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
})

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.commands = new Collection()
client.commands.set(ping.data.name, ping)
client.commands.set(server.data.name, server)

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
  }

  try {
    await command?.execute(interaction)
  } catch (err) {
    console.error(err)
  }
})

export { client }
