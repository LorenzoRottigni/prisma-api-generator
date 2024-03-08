import type ts from 'typescript'
import type PrismaDriver from './drivers/orm/prisma/prisma.driver'
import type { ExpressDriver } from './drivers/http/express/express.driver'
import type { FastifyDriver } from './drivers/http/fastify/fastify.driver'
import type { NestDriver } from './drivers/http/nest/nest.driver'
import { HTTPDriver } from './drivers/http/http.driver'

export enum GeneratorORMDriver {
  prisma = 'prisma',
}

export enum GeneratorHTTPDriver {
  express = 'express',
  fastify = 'fastify',
  nest = 'nest',
}

export declare interface GeneratorConfig {
  orm: GeneratorORMDriver
  http: GeneratorHTTPDriver[]
  strategies: GenerationStrategy[]
  outDir: string
}

export enum GenerationStrategy {
  inclusive = 'inclusive',
  modular = 'modular',
}

export declare interface BundleFile {
  file: string
  filename: string
}

export declare type Bundle = BundleFile[]

export declare interface GeneratorDrivers {
  orm: PrismaDriver
  http: (ExpressDriver | FastifyDriver | NestDriver)[]
}

export declare interface GeneratorSourceFiles {
  [GenerationStrategy.inclusive]?: ts.SourceFile[]
  [GenerationStrategy.modular]?: ts.SourceFile[]
}

export declare interface GeneratorDriver {
  generateBundle(): Bundle
}
