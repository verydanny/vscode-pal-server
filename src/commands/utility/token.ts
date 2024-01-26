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
  try {
    const generatedToken = await generateSecureToken(48)

    await interaction.reply({
      ephemeral: true,
      content: stripIndents`
        **Important:** Keep this token safe! You will not be able to regenerate this token for 24 hours,
        if you regenerate this token, the old token will become invalid.

        \`\`\`bash
        ${generatedToken}
        \`\`\`
        **Remember:** This token works accross any VSCode Pal-enabled server that you're a member of.
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
