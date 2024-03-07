import { DMMF } from "@prisma/generator-helper"
import PrismaDriver from "../drivers/orm/prisma/prisma.driver"
import ts from 'typescript'
import { type GeneratorSourceFiles, type GeneratorConfig, GenerationStrategy } from "../types"

export default class APIGenerator {
    protected driver: PrismaDriver
    protected sourceFiles: GeneratorSourceFiles
    constructor(
        protected config: GeneratorConfig,
        protected schema: DMMF.Document,
        protected driverName = 'prisma',
        protected fileName = 'api.ts',
        protected outDir = './codegen'
    ) {
        this.loadORMDriver(driverName)
        this.loadSourceFiles()
    }

    protected get models() {
        return this.schema.datamodel.models
    }

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

    public loadORMDriver(driver: 'prisma' | string) {
        switch(driver) {
            case 'prisma':
                this.driver = new PrismaDriver(this.schema)
                break
            default:
                console.warn(`Driver not implemented ${driver}`)
        }
    }
}