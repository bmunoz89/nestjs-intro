import { ConfigService } from '@nestjs/config'
import { ConfigFactory } from '@nestjs/config/dist/interfaces'

export class BaseConfigService<configFactory extends ConfigFactory> {
  constructor(
    private readonly configKey: string,
    protected readonly configService: ConfigService,
  ) {}

  private getValue(key: keyof ReturnType<configFactory>): string | undefined {
    return this.configService.get(`${this.configKey}.${key.toString()}`)
  }

  protected getBooleanOrUndefined(
    key: keyof ReturnType<configFactory>,
  ): boolean | undefined {
    const value = this.getValue(key)
    if (value === undefined) return

    if (typeof value === 'boolean') return value

    return value.toLowerCase() == 'true'
  }

  protected getBoolean(key: keyof ReturnType<configFactory>): boolean {
    return this.getBooleanOrUndefined(key) as boolean
  }

  protected getNumberOrUndefined(
    key: keyof ReturnType<configFactory>,
  ): number | undefined {
    const value = this.getValue(key)
    if (value === undefined) return

    if (typeof value === 'number') return value

    return Number.parseInt(value)
  }

  protected getNumber(key: keyof ReturnType<configFactory>): number {
    return this.getNumberOrUndefined(key) as number
  }

  protected getStringOrUndefined(
    key: keyof ReturnType<configFactory>,
  ): string | undefined {
    return this.getValue(key)
  }

  protected getString(key: keyof ReturnType<configFactory>): string {
    return this.getStringOrUndefined(key) as string
  }
}
