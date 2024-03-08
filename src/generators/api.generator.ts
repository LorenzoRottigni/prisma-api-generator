import { DMMF } from '@prisma/generator-helper'
import PrismaDriver from '../drivers/orm/prisma/prisma.driver'
import ts from 'typescript'
import {
  type GeneratorSourceFiles,
  type GeneratorConfig,
  GenerationStrategy,
  GeneratorORMDriver,
  GeneratorDrivers,
  GeneratorHTTPDriver,
} from '../types'
import { ExpressDriver } from '../drivers/http/express/express.driver'
import { FastifyDriver } from '../drivers/http/fastify/fastify.driver'
import { NestDriver } from '../drivers/http/nest/nest.driver'

/**
 * @description APIGenerator:
 * This is meant to be a base class to perform core api generation operations.
 * GraphQL and REST API generators extend this class to use specific HTTP architectures.
 */
export default class APIGenerator {
  protected drivers: GeneratorDrivers
  constructor(
    protected config: GeneratorConfig,
    protected schema: DMMF.Document,
    protected fileName = 'api.ts',
    protected outDir = './codegen'
  ) {
    this.loadDrivers()
  }

  protected get models() {
    return this.schema.datamodel.models
  }

  private loadDrivers() {
    const orm = this.loadORMDriver()
    const http = this.loadHTTPDrivers()
    if (!orm) throw new Error('Object Relation Model driver not provided.')
    if (!http.length) throw new Error('HTTP driver not provided.')
    this.drivers = { orm, http }
  }

  /**
   * @description Load different ORM drivers based off the specified configuration.
   */
  private loadORMDriver(): PrismaDriver | null {
    switch (this.config.orm) {
      case GeneratorORMDriver.prisma:
        return new PrismaDriver(this.schema, this.config.strategies)
      default:
        console.warn(`Driver not implemented ${this.config.orm}`)
        return null
    }
  }

  private loadHTTPDrivers() {
    return this.config.http.map(
      (driver) =>
        ({
          [GeneratorHTTPDriver.express]: new ExpressDriver(this.schema),
          [GeneratorHTTPDriver.fastify]: new FastifyDriver(this.schema),
          [GeneratorHTTPDriver.nest]: new NestDriver(this.schema),
        }[driver])
    )
  }
}
