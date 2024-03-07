import { DMMF } from "@prisma/generator-helper";
import { APIGeneratorSchema } from "../types";
import APIGenerator from "./api.generator";
import ts from 'typescript'
import * as fs from 'fs'

export default class RESTGenerator extends APIGenerator implements APIGeneratorSchema {
    constructor(
        schema: DMMF.Document,
        private factory = ts.factory
    ) { super(schema) }

    public get declarations(): ts.SourceFile {
        return this.factory.updateSourceFile(
            this.sourceFile,
            [
                ...this.driver.__imports,
                ...this.driver.__findAllFunction,
                ...this.driver.__findOneFunction,
                ...this.driver.__createFunction,
                ...this.driver.__updateFunction,
                ...this.driver.__deleteFunction,
                ...this.driver.__getters,
                ...this.driver.__setters
            ]
        )
    }

    public get bundle(): string {
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        return printer.printNode(
            ts.EmitHint.SourceFile,
            this.declarations,
            this.sourceFile
        );
    }

    public emit() {
        fs.writeFileSync(`${this.outDir}/${this.fileName}`, this.bundle)
    }
}