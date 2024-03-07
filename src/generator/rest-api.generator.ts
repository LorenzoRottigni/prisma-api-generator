import { DMMF } from "@prisma/generator-helper";
import ts from 'typescript';
import * as fs from 'fs'
import { capitalize } from "./utils";

export default class RestAPIGenerator {
    constructor(
        private document: DMMF.Document,
        private fileName = 'api.ts',
        private outDir = './codegen',
        private factory = ts.factory,
        private sourceFile = ts.createSourceFile(
          fileName,
          "", /* source text */
          ts.ScriptTarget.Latest,
          false,
          ts.ScriptKind.TS
        )
    ) {}

    public get models() {
        return this.document.datamodel.models
    }

    public get prismaClientImport(): ts.ImportDeclaration {
        const module = '@prisma/client'
        const namedImport = 'PrismaClient'
        return this.factory.createImportDeclaration(
            /* modifiers */ undefined,
            this.factory.createImportClause(
                /* isTypeOnly */ false,
                /* name (default import) */ undefined,
                this.factory.createNamedImports([
                    this.factory.createImportSpecifier(
                        false,
                        undefined,
                        this.factory.createIdentifier(namedImport)
                    ),
                ])
            ),
            this.factory.createStringLiteral(module)
        );
    }

    private get prismaClientModelImports(): ts.ImportDeclaration {
        return this.factory.createImportDeclaration(
            undefined,
            this.factory.createImportClause(
                true,
                undefined,
                this.factory.createNamedImports(
                    this.models.map(model => this.factory.createImportSpecifier(
                        false,
                        undefined,
                        this.factory.createIdentifier(model.name)
                    ))
                )
            ),
            this.factory.createStringLiteral("@prisma/client")
        )
    }
    

    public get getters(): ts.FunctionDeclaration[] {
        return this.models.map(model => {
            const functionBody = this.factory.createBlock([
                // Instantiate PrismaClient
                this.factory.createVariableStatement(
                    undefined,
                    this.factory.createVariableDeclarationList([
                        this.factory.createVariableDeclaration(
                            this.factory.createIdentifier("prisma"),
                            undefined,
                            undefined,
                            this.factory.createNewExpression(
                                this.factory.createIdentifier("PrismaClient"),
                                undefined,
                                []
                            )
                        )
                    ])
                ),
                // Execute query using PrismaClient and return the result
                this.factory.createReturnStatement(
                    this.factory.createAwaitExpression(
                        this.factory.createCallExpression(
                            this.factory.createPropertyAccessExpression(
                                this.factory.createPropertyAccessExpression(
                                    this.factory.createIdentifier("prisma"),
                                    this.factory.createIdentifier(capitalize(model.name))
                                ),
                                this.factory.createIdentifier("findMany")
                            ),
                            undefined,
                            []
                        )
                    )
                )
            ], true);
            
            // Create function declaration
            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)], // Add async modifier
                undefined,
                `get${capitalize(model.name)}`,
                undefined,
                [],
                this.factory.createTypeReferenceNode(
                    "Promise", 
                    [this.factory.createTypeReferenceNode(model.name, [])]
                ),
                functionBody
            );
        });
    }
    

    public get setters(): ts.FunctionDeclaration[] {
        return this.models.map(model => {
            const parameterName = `${model.name.toLowerCase()}Data`; // Parameter name for data to set
            
            const functionBody = this.factory.createBlock([
                // Instantiate PrismaClient
                this.factory.createVariableStatement(
                    undefined,
                    this.factory.createVariableDeclarationList([
                        this.factory.createVariableDeclaration(
                            this.factory.createIdentifier("prisma"),
                            undefined,
                            undefined,
                            this.factory.createNewExpression(
                                this.factory.createIdentifier("PrismaClient"),
                                undefined,
                                []
                            )
                        )
                    ])
                ),
                // Execute query using PrismaClient and return the result
                this.factory.createReturnStatement(
                    this.factory.createAwaitExpression(
                        this.factory.createCallExpression(
                            this.factory.createPropertyAccessExpression(
                                this.factory.createPropertyAccessExpression(
                                    this.factory.createIdentifier("prisma"),
                                    this.factory.createIdentifier(capitalize(model.name))
                                ),
                                this.factory.createIdentifier("create")
                            ),
                            undefined,
                            [this.factory.createIdentifier(parameterName)]
                        )
                    )
                )
            ], true);
            
            // Create function declaration
            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)], // Add async modifier
                undefined,
                `set${capitalize(model.name)}`,
                undefined,
                [this.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    this.factory.createIdentifier(parameterName),
                    undefined,
                    this.factory.createTypeReferenceNode(model.name, [])
                )],
                this.factory.createTypeReferenceNode(
                    "Promise", 
                    [this.factory.createTypeReferenceNode(model.name, [])]
                ),
                functionBody
            );
        });
    }
    
    public get declarations() {
        return this.factory.updateSourceFile(
            this.sourceFile,
            [
                this.prismaClientImport,
                this.prismaClientModelImports,
                ...this.getters,
                ...this.setters
            ]
        )
    }

    public get bundle() {
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        return printer.printNode(
            ts.EmitHint.SourceFile,
            this.declarations,
            this.sourceFile
        );
    }

    public generate() {
        fs.writeFileSync(`${this.outDir}/${this.fileName}`, this.bundle)
    }
}