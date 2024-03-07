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

    public get getters(): ts.FunctionDeclaration[] {
        return this.models.map(model => this.factory.createFunctionDeclaration(
            /* Modifiers */ undefined,
            /* Asterisk token */ undefined,
            `get${capitalize(model.name)}`,
            /* Type parameters*/ undefined,
            /* Parameters */ [],
            this.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            undefined
        ))
    }

    public get setters(): ts.FunctionDeclaration[] {
        return this.models.map(model => this.factory.createFunctionDeclaration(
            /* Modifiers */ undefined,
            /* Asterisk token */ undefined,
            `set${capitalize(model.name)}`,
            /* Type parameters*/ undefined,
            [
                this.factory.createParameterDeclaration(undefined, undefined,
                    this.factory.createIdentifier(model.name),
                    undefined, undefined
                )
            ],
            this.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            undefined
        ))
    }

    public get declarations() {
        return this.factory.updateSourceFile(
            this.sourceFile,
            [this.prismaClientImport, ...this.getters, ...this.setters]
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