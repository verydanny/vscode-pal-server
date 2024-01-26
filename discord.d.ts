import {
  Client as BaseClient,
  ChatInputCommandInteraction,
  Collection,
  SlashCommandBuilder as BaseSlashCommandBuilder,
  type CacheType,
} from 'discord.js'
import ping from './src/commands/utility/ping'
import token from './src/commands/utility/token'
import { CooldownManager } from './src/cooldownManager'

declare module 'discord.js' {
  type Commands = typeof ping | typeof token

  export interface GuessOutput<P> {
    cooldown?: number
    data: SlashCommandBuilder
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<P>
  }

  export type PromiseTypeCommand<T extends GuessOutput> =
    T['execute'] extends (
      (interaction: ChatInputCommandInteraction<CacheType>) => Promise<infer P>
    ) ?
      P
    : never

  export type CommandsUnwrapped = GuessOutput<PromiseTypeCommand<Commands>>
  type GotPromises = Collection<
    CommandsUnwrapped['data']['name'],
    CommandsUnwrapped
  >

  export class SlashCommandBuilder implements BaseSlashCommandBuilder {
    setName<const T>(name: T): this & Readonly<{ name: T }>
    setDescription<const T>(name: T): this & Readonly<{ description: T }>
  }

  export interface Client extends BaseClient {
    commands: GotPromises
    cooldowns: CooldownManager
  }

  type SetsProps<T> = {
    [P in keyof T]: T[P]
  }
}
