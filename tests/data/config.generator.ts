import { GenerationStrategy, GeneratorConfig, GeneratorHTTPDriver, GeneratorORMDriver } from '../../src/types'

export const config: GeneratorConfig = {
  http: [GeneratorHTTPDriver.nest],
  orm: GeneratorORMDriver.prisma,
  outDir: './codegen',
  strategies: [GenerationStrategy.inclusive, GenerationStrategy.modular],
}
