import { DMMF } from "@prisma/generator-helper"
import PrismaDriver from "../drivers/orm/prisma/prisma.driver"
import ts from 'typescript'
import { type GeneratorSourceFiles, type GeneratorConfig, GenerationStrategy, GeneratorORMDriver } from "../types"

/**
 * @description APIGenerator:
 * This is meant to be a base class to perform core api generation operations.
 * GraphQL and REST API generators extend this class to use specific HTTP architectures.
 */
export default class APIGenerator {
    protected driver: PrismaDriver
    protected sourceFiles: GeneratorSourceFiles
    constructor(
        protected config: GeneratorConfig,
        protected schema: DMMF.Document,
        protected fileName = 'api.ts',
        protected outDir = './codegen'
    ) {
        this.loadORMDriver()
        this.loadSourceFiles()
    }

    protected get models() {
        return this.schema.datamodel.models
    }

    /**
     * @description Load different source files based off the specified configuration.
     */
    public loadSourceFiles() {
        this.sourceFiles = {}
        const createSourceFile = (filename: string) => ts.createSourceFile(
            filename,
            "",
            ts.ScriptTarget.Latest,
            false,
            ts.ScriptKind.TS
          )
        if (this.config.strategies.includes(GenerationStrategy.inclusive)) {
            this.sourceFiles[GenerationStrategy.inclusive] = [createSourceFile('api.ts')]
        }
        if (this.config.strategies.includes(GenerationStrategy.modular)) {
            this.sourceFiles[GenerationStrategy.modular] = this.models.map(model => createSourceFile(`${model.name.toLowerCase()}.ts`));
        }
    }

    /**
     * @description Load different ORM drivers based off the specified configuration.
     */
    public loadORMDriver() {
        switch(this.config.orm) {
            case GeneratorORMDriver.prisma:
                this.driver = new PrismaDriver(this.schema)
                break
            default:
                console.warn(`Driver not implemented ${this.config.orm}`)
        }
    }
}