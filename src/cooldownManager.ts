import {
  Collection,
  type CacheType,
  type Interaction,
  type ChatInputCommandInteraction,
} from 'discord.js'

class CooldownManager {
  private readonly cooldowns = new Collection()
  private readonly defaultCountdownDuration = 3 //ms

  constructor() {}

  private setCommandToCooldownCollection(command: string) {
    if (!this.cooldowns.has(command)) {
      this.cooldowns.set(command, new Collection())
    }

    return this
  }

  private setUserIdToCollection<T extends CacheType>(
    interaction: ChatInputCommandInteraction<T>
  ) {
    const now = Date.now()
    const cooldown = interaction.client.commands.get(
      interaction.commandName
    )?.cooldown

    if (!cooldown) {
      return {
        onCooldown: false,
        expiredTimestamp: undefined,
      }
    }

    const cooldownAmount = (cooldown ?? this.defaultCountdownDuration) * 1_000
    const userTimestamp = this.cooldowns.get(
      interaction.commandName
    ) as Collection<unknown, unknown>

    if (userTimestamp.has(interaction.user.id)) {
      const expirationTime =
        <number>userTimestamp.get(interaction.user.id) + cooldownAmount

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000)

        return {
          onCooldown: true,
          expiredTimestamp,
        }
      }
    }

    userTimestamp.set(interaction.user.id, now)
    setTimeout(() => userTimestamp.delete(interaction.user.id), cooldownAmount)

    return {
      onCooldown: false,
      expiredTimestamp: undefined,
    }
  }

  public commitInteraction<T extends CacheType>(interaction: Interaction<T>) {
    if (!interaction.isChatInputCommand()) {
      return {
        onCooldown: false,
        expiredTimestamp: undefined,
      }
    }

    return this.setCommandToCooldownCollection(
      interaction.commandName
    ).setUserIdToCollection(interaction)
  }
}

export const cooldownManager = new CooldownManager()
