import { DMMF } from "@prisma/generator-helper";
import type { ORMDriverSchema } from "../../../types";
import ORMDriver from "../orm.driver";
import ts from 'typescript'
import { capitalize, prismaToTSType } from "../../../utils";
import { PrismaService } from "./prisma.service";

export default class PrismaDriver extends ORMDriver implements ORMDriverSchema {
    constructor(
        private document: DMMF.Document,
        private factory = ts.factory,
        private prismaService = new PrismaService()
    ) {
        super()
    }

    public get models() {
        return this.document.datamodel.models
    }

    public get __imports() {
        return [
            this.__prismaClientImport,
            this.__prismaClientModelsImport,
        ]
    }

    public get __findAllFunction(): ts.FunctionDeclaration[] {
        return this.models.map(model => {
            const body: ts.FunctionBody = this.factory.createBlock([
                this.prismaService.__prismaClientStatement,
                this.prismaService.__findAllStatement(model.name)
            ], true);

            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                undefined,
                `get${capitalize(model.name)}s`,
                undefined,
                [],
                this.factory.createTypeReferenceNode(
                    "Promise",
                    [this.factory.createArrayTypeNode(this.factory.createTypeReferenceNode(model.name, []))]
                ),
                body
            );
        });
    }

    public get __findOneFunction(): ts.FunctionDeclaration[] {
        return this.models.map(model => {
            const body: ts.FunctionBody = this.factory.createBlock([
                this.prismaService.__prismaClientStatement,
                this.prismaService.__findOneStatement(model.name)
            ], true);

            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                undefined,
                `findOne${capitalize(model.name)}`,
                undefined,
                [this.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    this.factory.createIdentifier("id"),
                    undefined,
                    this.factory.createTypeReferenceNode("number", [])
                )],
                this.factory.createTypeReferenceNode(
                    "Promise",
                    [
                        this.factory.createUnionTypeNode([
                            this.factory.createArrayTypeNode(this.factory.createTypeReferenceNode(model.name, [])),
                            this.factory.createTypeReferenceNode("null")
                        ])
                    ]
                ),
                body
            );
        });
    }

    public get __createFunction(): ts.FunctionDeclaration[] {
        return this.models.map(model => {
            const body: ts.FunctionBody = this.factory.createBlock([
                this.prismaService.__prismaClientStatement,
                this.prismaService.__createStatement(model.name)
            ], true);
    
            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                undefined,
                `create${capitalize(model.name)}`,
                undefined,
                [this.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    this.factory.createIdentifier(model.name.toLowerCase()),
                    undefined,
                    this.factory.createTypeReferenceNode(model.name, [])
                )],
                this.factory.createTypeReferenceNode(
                    "Promise",
                    [this.factory.createTypeReferenceNode(model.name, [])]
                ),
                body
            );
        });
    }

    public get __updateFunction(): ts.FunctionDeclaration[] {
        return this.models.map(model => {
            const body: ts.FunctionBody = this.factory.createBlock([
                this.prismaService.__prismaClientStatement,
                this.prismaService.__updateStatement(model.name)
            ], true);
    
            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                undefined,
                `update${capitalize(model.name)}`,
                undefined,
                [this.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    this.factory.createIdentifier("id"),
                    undefined,
                    this.factory.createTypeReferenceNode("number", [])
                ),
                this.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    this.factory.createIdentifier(model.name.toLowerCase()),
                    undefined,
                    this.factory.createTypeReferenceNode(model.name, [])
                )],
                this.factory.createTypeReferenceNode(
                    "Promise",
                    [this.factory.createTypeReferenceNode(model.name, [])]
                ),
                body
            );
        });
    }

    public get __deleteFunction(): ts.FunctionDeclaration[] {
        return this.models.map(model => {
            const body: ts.FunctionBody = this.factory.createBlock([
                this.prismaService.__prismaClientStatement,
                this.prismaService.__deleteStatement(model.name)
            ], true);

            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                undefined,
                `delete${capitalize(model.name)}`,
                undefined,
                [this.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    this.factory.createIdentifier("id"),
                    undefined,
                    this.factory.createTypeReferenceNode("number", [])
                )],
                this.factory.createTypeReferenceNode(
                    "Promise",
                    [this.factory.createTypeReferenceNode(model.name, [])]
                ),
                body
            );
        });
    }

    public get __getters(): ts.FunctionDeclaration[] {
        const getters: ts.FunctionDeclaration[] = [];
    
        this.models.forEach(model => {
            model.fields.forEach(field => {
                if (field.name === 'id') return
                const body: ts.FunctionBody = this.factory.createBlock([
                    this.prismaService.__prismaClientStatement,
                    this.prismaService.__getModelFieldStatement(model.name, field.name)
                ], true);
                
                const getter = this.factory.createFunctionDeclaration(
                    [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                    undefined,
                    `get${capitalize(model.name)}${capitalize(field.name)}`,
                    undefined,
                    [this.factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        this.factory.createIdentifier("id"),
                        undefined,
                        this.factory.createTypeReferenceNode("number", [])
                    )],
                    this.factory.createTypeReferenceNode(
                        "Promise",
                        [
                            this.factory.createUnionTypeNode(
                                [prismaToTSType(field.type), this.factory.createTypeReferenceNode("null")]
                            )
                        ]
                        
                    ),
                    body
                );
    
                getters.push(getter);
            });
        });
    
        return getters;
    }
    
    public get __setters(): ts.FunctionDeclaration[] {
        const setters: ts.FunctionDeclaration[] = [];
    
        this.models.forEach(model => {
            model.fields.forEach(field => {
                if (field.name === 'id') return
                const body: ts.FunctionBody = this.factory.createBlock([
                    this.prismaService.__prismaClientStatement,
                    this.prismaService.__setModelFieldStatement(model.name, field.name)
                ], true);

                const setter = this.factory.createFunctionDeclaration(
                    [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                    undefined,
                    `set${capitalize(model.name)}${capitalize(field.name)}`,
                    undefined,
                    [
                        this.factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            this.factory.createIdentifier("id"),
                            undefined,
                            this.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
                        ),
                        this.factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            this.factory.createIdentifier(model.name.toLowerCase()),
                            undefined,
                            prismaToTSType(field.type)
                        )
                    ],
                    this.factory.createTypeReferenceNode(
                        "Promise",
                        [this.factory.createTypeReferenceNode(model.name, [])]
                    ),
                    body
                );
    
                setters.push(setter);
            });
        });
    
        return setters;
    }
    
    public get __prismaClientImport(): ts.ImportDeclaration {
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

    public get __prismaClientModelsImport(): ts.ImportDeclaration {
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
}