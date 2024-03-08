import { DMMF } from '@prisma/generator-helper'
import { GenerationStrategy, GeneratorSourceFiles } from '../../types'
import ts from 'typescript'

export default class ORMDriver {
  protected sourceFiles: GeneratorSourceFiles
  constructor(protected schema: DMMF.Document, protected strategies: GenerationStrategy[]) {
    this.loadSourceFiles()
  }

  /**
   * @description Load different source files based off the specified configuration.
   */
  private loadSourceFiles() {
    this.sourceFiles = {}
    const createSourceFile = (filename: string) =>
      ts.createSourceFile(filename, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
    if (this.strategies.includes(GenerationStrategy.inclusive)) {
      this.sourceFiles[GenerationStrategy.inclusive] = [createSourceFile('api.ts')]
    }
    if (this.strategies.includes(GenerationStrategy.modular)) {
      this.sourceFiles[GenerationStrategy.modular] = this.schema.datamodel.models.map((model) =>
        createSourceFile(`${model.name.toLowerCase()}.service.ts`)
      )
    }
  }
}
