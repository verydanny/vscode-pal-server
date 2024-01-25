import crypto from 'crypto'
import { stripIndents } from 'proper-tags'
import {
  type ChatInputCommandInteraction,
  type CacheType,
  SlashCommandBuilder,
  // Collection,
} from 'discord.js'

function generateSecureToken(length = 48) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        reject(err)
      } else {
        resolve(buffer.toString('base64'))
      }
    })
  })
}

const cooldown = 86400

const data = new SlashCommandBuilder()
  .setName('token')
  .setDescription('Generates a new token for the VSCode Extension')

async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
  // const { cooldowns } = interaction.client
  // const now = Date.now()
  // const timestamps = cooldowns.get(data.name)
  // const defaultCooldownDuration = 3
  // const cooldownAmount = (cooldown ?? defaultCooldownDuration) * 1_000

  // if (!cooldowns.has(data.name)) {
  //   cooldowns.set(data.name, new Collection())
  // }

  // if (timestamps?.has(interaction.user.id)) {
  //   const expirationTime =
  //     <number>timestamps.get(interaction.user.id) + cooldownAmount
  //   if (now < expirationTime) {
  //     const expiredTimestamp = Math.round(expirationTime / 1_000)

  //     await interaction.reply({
  //       content: stripIndents`
  //         Please wait, you are on a cooldown for \`${data.name}\`.
  //         You can use it again <t:${expiredTimestamp}:R>.
  //       `,
  //       ephemeral: true,
  //     })
  //   }
  // }

  // timestamps?.set(interaction.user.id, now)
  // setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount)

  try {
    const generatedToken = await generateSecureToken(48)

    await interaction.reply({
      ephemeral: true,
      content: stripIndents`

        **Important:** Keep this token safe!
        You will not be able to regenerate this token for 24 hours

        \`\`\`bash
        ${generatedToken}
        \`\`\`
      `,
    })
  } catch (error) {
    console.error(
      stripIndents`
        Failed to generate tokens:

        Error:
        ${error}
      `
    )
  }
}

export default {
  cooldown,
  data,
  execute,
}
