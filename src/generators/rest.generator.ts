import { DMMF } from '@prisma/generator-helper'
import { GenerationStrategy, GeneratorConfig } from '../types'
import APIGenerator from './api.generator'
import ts from 'typescript'
import * as fs from 'fs'
import { HTTPDriver } from '../drivers/http/http.driver'

/** @description RESTGenerator */
export default class RESTGenerator extends APIGenerator {
  constructor(config: GeneratorConfig, schema: DMMF.Document) {
    super(config, schema)
  }

  /**
   * @description Binds the correct set of new statements to the provided source file
   * based off the active strategy.
   * @param {GenerationStrategy} strategy
   * @param {ts.SourceFile} sourceFile
   * @returns {string} Generated raw typescript source file.
   * */
  public generateServicesBundle(strategy: GenerationStrategy, sourceFile: ts.SourceFile): string {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

    return {
      [GenerationStrategy.inclusive]: printer.printNode(
        ts.EmitHint.SourceFile,
        ts.factory.updateSourceFile(sourceFile, [
          ...this.drivers.orm.__imports,
          ...this.drivers.orm.__findAllFunctions,
          ...this.drivers.orm.__findOneFunctions,
          ...this.drivers.orm.__createFunctions,
          ...this.drivers.orm.__updateFunctions,
          ...this.drivers.orm.__deleteFunctions,
          ...this.drivers.orm.__getters,
          ...this.drivers.orm.__setters,
        ]),
        sourceFile
      ),
      [GenerationStrategy.modular]: printer.printNode(
        ts.EmitHint.SourceFile,
        ts.factory.updateSourceFile(sourceFile, [
          ...this.drivers.orm.__imports,
          this.drivers.orm.__modelServiceClass(sourceFile.fileName.split('.')[0]),
          // ...this.driver.__modelFunctions(
          //     // TODO: something safer :D
          //     sourceFile.fileName.split('.')[0]
          // )
        ]),
        sourceFile
      ),
    }[strategy]
  }

  public generateResolversBundle(driver: HTTPDriver) {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  }

  /**
   * @description Based off the configured strategies,
   * writes to the output directory the generated API files.
   */
  public generate() {
    this.drivers.orm.generateBundle().forEach(({ file, filename }) => {
      fs.writeFileSync(`${this.config.outDir}/${filename}`, file)
    })
    this.drivers.http.forEach((driver) => {
      driver.generateBundle().forEach(({ file, filename }) => {
        fs.writeFileSync(`${this.config.outDir}/${filename}`, file)
      })
    })

    // this.drivers.http.forEach((httpDriver) => httpDriver.generate(this.models))
  }
}
