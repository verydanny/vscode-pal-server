import { Client, Events, GatewayIntentBits, Collection } from 'discord.js'
import { stripIndents } from 'proper-tags'
import ping from './commands/utility/ping'
import token from './commands/utility/token'
import { cooldownManager } from './cooldownManager'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.commands = new Collection()

client.commands.set(ping.data.name, ping)
client.commands.set(token.data.name, token)

client.on(Events.InteractionCreate, async (interaction) => {
  const { onCooldown, expiredTimestamp } =
    cooldownManager.commitInteraction(interaction)
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    return console.error(
      `No command matching ${interaction.commandName} was found.`
    )
  }

  if (onCooldown) {
    await interaction.reply({
      content: stripIndents`
          Please wait, you are on a cooldown for \` ${interaction.commandName} \`.
          You can use it again <t:${expiredTimestamp}:R>.
        `,
      ephemeral: true,
    })

    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  }
})

export { client }
