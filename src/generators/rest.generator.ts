import { DMMF } from "@prisma/generator-helper";
import { APIGeneratorSchema, GenerationStrategy, GeneratorConfig } from "../types";
import APIGenerator from "./api.generator";
import ts from 'typescript'
import * as fs from 'fs'

export default class RESTGenerator extends APIGenerator implements APIGeneratorSchema {
    constructor(
        config: GeneratorConfig,
        schema: DMMF.Document
    ) { super(config, schema) }

    public generateBundle(strategy: GenerationStrategy, sourceFile: ts.SourceFile): string {
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        return ({
            [GenerationStrategy.inclusive]: 
                printer.printNode(
                    ts.EmitHint.SourceFile,
                    ts.factory.updateSourceFile(
                        sourceFile,
                        [
                            ...this.driver.__imports,
                            ...this.driver.__findAllFunctions,
                            ...this.driver.__findOneFunctions,
                            ...this.driver.__createFunctions,
                            ...this.driver.__updateFunctions,
                            ...this.driver.__deleteFunctions,
                            ...this.driver.__getters,
                            ...this.driver.__setters
                        ]
                    ),
                    sourceFile,
                )
            ,
            [GenerationStrategy.modular]: printer.printNode(
                ts.EmitHint.SourceFile,
                ts.factory.updateSourceFile(
                    sourceFile,
                    [
                        ...this.driver.__imports,
                        ...this.driver.__modelFunctions(
                            // TODO: something safer :D
                            sourceFile.fileName.split('.')[0]
                        )
                    ]
                ),
                sourceFile
            )
        })[strategy]
    }

    public emit() {
        this.config.strategies.forEach(
            strategy => this.sourceFiles[strategy]?.forEach(
                sourceFile => {
                    fs.writeFileSync(
                        `${this.config.outDir}/${sourceFile.fileName}`,
                        this.generateBundle(strategy, sourceFile)
                    )
                }
            )
        )
    }
}