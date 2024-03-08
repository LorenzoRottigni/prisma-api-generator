import { DMMF } from "@prisma/generator-helper";
import { APIGeneratorSchema, GenerationStrategy, GeneratorConfig } from "../types";
import APIGenerator from "./api.generator";
import ts from 'typescript'
import * as fs from 'fs'
import { capitalize } from "../utils";

/** @description RESTGenerator */
export default class RESTGenerator extends APIGenerator implements APIGeneratorSchema {
    constructor(
        config: GeneratorConfig,
        schema: DMMF.Document
    ) { super(config, schema) }

    /**
     * @description Binds the correct set of new statements to the provided source file
     * based off the active strategy.
     * @param {GenerationStrategy} strategy
     * @param {ts.SourceFile} sourceFile
     * @returns {string} Generated raw typescript source file.
     * */
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
                        this.driver.__modelServiceClass(sourceFile.fileName.split('.')[0])
                        // ...this.driver.__modelFunctions(
                        //     // TODO: something safer :D
                        //     sourceFile.fileName.split('.')[0]
                        // )
                    ]
                ),
                sourceFile
            )
        })[strategy]
    }

    /**
     * @description Based off the configured strategies,
     * writes to the output directory the generated API files.
     */
    public emit() {
        this.config.strategies.forEach(
            strategy => this.sourceFiles[strategy]?.forEach(
                sourceFile => {
                    const printer = ts.createPrinter();
                    fs.writeFileSync(
                        `${this.config.outDir}/${sourceFile.fileName}`,
                        this.generateBundle(strategy, sourceFile)
                    )
                }
            )
        )
    }
}