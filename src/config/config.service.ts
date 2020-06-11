import { ConfigService } from '@nestjs/config'

export class BaseConfigService {
  constructor(
    private readonly configKey: string,
    protected readonly configService: ConfigService,
  ) {}

  private getValue(key: string): string | undefined {
    return this.configService.get(`${this.configKey}.${key}`)
  }

  protected getBoolean(key: string): boolean | undefined {
    const value = this.getValue(key)
    if (value === undefined) return

    if (typeof value === 'boolean') return value

    return value.toLowerCase() == 'true'
  }

  protected getNumber(key: string): number | undefined {
    const value = this.getValue(key)
    if (value === undefined) return

    if (typeof value === 'number') return value

    return Number.parseInt(value)
  }

  protected getString(key: string): string | undefined {
    return this.getValue(key)
  }
}
