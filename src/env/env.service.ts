import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { KafkaOptions, Transport } from '@nestjs/microservices'
import { randomUUID } from 'crypto'
import { Partitioners } from 'kafkajs'
import { Env } from 'src/env/env'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T): Env[T] {
    return this.configService.get(key)
  }

  private kafkaOpts({
    clientId,
    brokers,
  }: {
    clientId: string
    brokers: string[]
  }): KafkaOptions {
    const consumerUuid = randomUUID()
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId,
          brokers,
        },
        consumer: {
          groupId: `${clientId}-consumer-${consumerUuid}`,
        },
        producer: {
          createPartitioner: Partitioners.DefaultPartitioner,
        },
      },
    }
  }

  get productMicroservice(): KafkaOptions {
    return this.kafkaOpts({
      clientId: 'product',
      brokers: this.get('PRODUCT_MICROSERVICE_BROKERS')!,
    })
  }
}
