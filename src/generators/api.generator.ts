import { DMMF } from "@prisma/generator-helper"
import PrismaDriver from "../drivers/orm/prisma/prisma.driver"
import ts from 'typescript'

export default class APIGenerator {
    protected driver: PrismaDriver

    constructor(
        protected schema: DMMF.Document,
        protected driverName = 'prisma',
        protected fileName = 'api.ts',
        protected outDir = './codegen',
        protected sourceFile = ts.createSourceFile(
            fileName,
            "", /* source text */
            ts.ScriptTarget.Latest,
            false,
            ts.ScriptKind.TS
          )
    ) {
        this.loadORMDriver(driverName)
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