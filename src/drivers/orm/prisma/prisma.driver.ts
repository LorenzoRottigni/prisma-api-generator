import { DMMF } from '@prisma/generator-helper'
import ORMDriver from '../orm.driver'
import ts from 'typescript'
import { PrismaService } from './prisma.service'
import { capitalize } from '../../../utils'
import { Bundle, BundleFile, GenerationStrategy, GeneratorDriver } from '../../../types'

export default class PrismaDriver extends ORMDriver implements GeneratorDriver {
  constructor(schema: DMMF.Document, strategies: GenerationStrategy[], private prismaService = new PrismaService()) {
    super(schema, strategies)
  }

  public get models() {
    return this.schema.datamodel.models
  }

  public get __imports(): ts.ImportDeclaration[] {
    return [this.prismaService.__prismaClientImport, this.__prismaClientModelsImport()]
  }

  public generateServiceBundle(strategy: GenerationStrategy, sourceFile: ts.SourceFile): string {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

    return {
      [GenerationStrategy.inclusive]: printer.printNode(
        ts.EmitHint.SourceFile,
        ts.factory.updateSourceFile(sourceFile, [
          ...this.__imports,
          ...this.__findAllFunctions,
          ...this.__findOneFunctions,
          ...this.__createFunctions,
          ...this.__updateFunctions,
          ...this.__deleteFunctions,
          ...this.__getters,
          ...this.__setters,
        ]),
        sourceFile
      ),
      [GenerationStrategy.modular]: printer.printNode(
        ts.EmitHint.SourceFile,
        ts.factory.updateSourceFile(sourceFile, [
          ...this.__imports,
          this.__modelServiceClass(sourceFile.fileName.split('.')[0]),
          // ...this.driver.__modelFunctions(
          //     // TODO: something safer :D
          //     sourceFile.fileName.split('.')[0]
          // )
        ]),
        sourceFile
      ),
    }[strategy]
  }

  public generateBundle(): Bundle {
    return this.strategies
      .filter((strategy) => !!this.sourceFiles[strategy])
      .map(
        (strategy) =>
          this.sourceFiles[strategy]?.map(
            (sourceFile): BundleFile => ({
              file: this.generateServiceBundle(strategy, sourceFile),
              filename: sourceFile.fileName,
            })
          ) || []
      )
      .flat(2)
  }

  public __modelServiceClass(modelName: string): ts.ClassDeclaration {
    const model = this.models.find((model) => model.name.toLowerCase() === modelName.toLowerCase())

    const constructor = ts.factory.createConstructorDeclaration(undefined, [], ts.factory.createBlock([], true))
    return ts.factory.createClassDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      `${capitalize(modelName)}Service`,
      [],
      [],
      [
        constructor,
        this.prismaService.__findAllMethod(model?.name || modelName),
        this.prismaService.__findOneMethod(model?.name || modelName),
        this.prismaService.__createMethod(model?.name || modelName),
        this.prismaService.__updateMethod(model?.name || modelName),
        this.prismaService.__deleteMethod(model?.name || modelName),
        ...(model ? model.fields.map((field) => this.prismaService.__getterMethod(model.name, field)) : []),
        ...(model ? model.fields.map((field) => this.prismaService.__setterMethod(model.name, field)) : []),
      ]
    )
  }

  public __modelFunctions(modelName: string): ts.FunctionDeclaration[] {
    const model = this.models.find((model) => model.name.toLowerCase() === modelName.toLowerCase())
    if (!model) return []
    return [
      this.prismaService.__findAllFunction(model.name),
      this.prismaService.__findOneFunction(model.name),
      this.prismaService.__createFunction(model.name),
      this.prismaService.__updateFunction(model.name),
      this.prismaService.__deleteFunction(model.name),
      ...model.fields.map((field) => this.prismaService.__getter(model.name, field)),
      ...model.fields.map((field) => this.prismaService.__setter(model.name, field)),
    ]
  }

  public get __findAllFunctions(): ts.FunctionDeclaration[] {
    return this.models.map((model) => this.prismaService.__findAllFunction(model.name))
  }

  public get __findOneFunctions(): ts.FunctionDeclaration[] {
    return this.models.map((model) => this.prismaService.__findOneFunction(model.name))
  }

  public get __createFunctions(): ts.FunctionDeclaration[] {
    return this.models.map((model) => this.prismaService.__createFunction(model.name))
  }

  public get __updateFunctions(): ts.FunctionDeclaration[] {
    return this.models.map((model) => this.prismaService.__updateFunction(model.name))
  }

  public get __deleteFunctions(): ts.FunctionDeclaration[] {
    return this.models.map((model) => this.prismaService.__deleteFunction(model.name))
  }

  public get __getters(): ts.FunctionDeclaration[] {
    const getters: ts.FunctionDeclaration[] = []
    this.models.forEach((model) => {
      model.fields.forEach((field) => {
        if (field.name === 'id') return
        getters.push(this.prismaService.__getter(model.name, field))
      })
    })
    return getters
  }

  public get __setters(): ts.FunctionDeclaration[] {
    const setters: ts.FunctionDeclaration[] = []

    this.models.forEach((model) => {
      model.fields.forEach((field) => {
        if (field.name === 'id') return
        setters.push(this.prismaService.__setter(model.name, field))
      })
    })

    return setters
  }

  public __prismaClientModelsImport(models: string[] = this.models.map((m) => m.name)): ts.ImportDeclaration {
    return ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        true,
        undefined,
        ts.factory.createNamedImports(
          models.map((model) => ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(model)))
        )
      ),
      ts.factory.createStringLiteral('@prisma/client')
    )
  }
}
