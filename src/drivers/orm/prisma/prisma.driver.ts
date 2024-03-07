import { DMMF } from "@prisma/generator-helper";
import type { ORMDriverSchema } from "../../../types";
import ORMDriver from "../orm.driver";
import ts from 'typescript'
import { capitalize } from "../../../utils";

export default class PrismaDriver extends ORMDriver implements ORMDriverSchema {
    constructor(
        private document: DMMF.Document,
        private factory = ts.factory
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

    public get __findAll() {
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
                                    this.factory.createIdentifier(model.name.toLowerCase())
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
                `get${capitalize(model.name)}s`,
                undefined,
                [],
                this.factory.createTypeReferenceNode(
                    "Promise",
                    [this.factory.createArrayTypeNode(this.factory.createTypeReferenceNode(model.name, []))]
                ),
                functionBody
            );
        });
    }

    public get __findOne() {
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
                                    this.factory.createIdentifier(model.name.toLowerCase())
                                ),
                                this.factory.createIdentifier("findUnique")
                            ),
                            undefined,
                            [
                                this.factory.createObjectLiteralExpression([
                                    this.factory.createPropertyAssignment(
                                        this.factory.createIdentifier("where"),
                                        this.factory.createObjectLiteralExpression([
                                            this.factory.createPropertyAssignment(
                                                this.factory.createIdentifier("id"),
                                                this.factory.createIdentifier("id")
                                            )
                                        ])
                                    )
                                ])
                            ]
                        )
                    )
                )
            ], true);
    
            // Create function declaration
            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)], // Add async modifier
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
                            this.factory.createTypeReferenceNode(model.name, []),
                            this.factory.createTypeReferenceNode("null")
                        ])
                    ]
                ),
                functionBody
            );
        });
    }

    public get __create() {
        return this.models.map(model => {
            const parameterName = `${model.name.toLowerCase()}Data`; // Parameter name for data to create
    
            // Create the argument for the create method
            const createMethodArgument = this.factory.createObjectLiteralExpression([
                this.factory.createPropertyAssignment(
                    this.factory.createIdentifier("data"),
                    this.factory.createIdentifier(parameterName)
                )
            ]);
    
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
                                    this.factory.createIdentifier(model.name.toLowerCase())
                                ),
                                this.factory.createIdentifier("create")
                            ),
                            undefined,
                            [createMethodArgument]
                        )
                    )
                )
            ], true);
    
            // Create function declaration
            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)], // Add async modifier
                undefined,
                `create${capitalize(model.name)}`,
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

    public get __update() {
        return this.models.map(model => {
            const parameterName = `${model.name.toLowerCase()}Data`; // Parameter name for data to update
    
            // Create the argument for the update method
            const updateMethodArgument = this.factory.createObjectLiteralExpression([
                this.factory.createPropertyAssignment(
                    this.factory.createIdentifier("where"),
                    this.factory.createObjectLiteralExpression([
                        this.factory.createPropertyAssignment(
                            this.factory.createIdentifier("id"),
                            this.factory.createIdentifier("id") // Assuming id field for update condition
                        )
                    ])
                ),
                this.factory.createPropertyAssignment(
                    this.factory.createIdentifier("data"),
                    this.factory.createIdentifier(parameterName)
                )
            ]);
    
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
                                    this.factory.createIdentifier(model.name.toLowerCase())
                                ),
                                this.factory.createIdentifier("update")
                            ),
                            undefined,
                            [updateMethodArgument]
                        )
                    )
                )
            ], true);
    
            // Create function declaration
            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)], // Add async modifier
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

    public get __delete() {
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
                                    this.factory.createIdentifier(model.name.toLowerCase())
                                ),
                                this.factory.createIdentifier("delete")
                            ),
                            undefined,
                            [
                                this.factory.createObjectLiteralExpression([
                                    this.factory.createPropertyAssignment(
                                        this.factory.createIdentifier("where"),
                                        this.factory.createObjectLiteralExpression([
                                            this.factory.createPropertyAssignment(
                                                this.factory.createIdentifier("id"),
                                                this.factory.createIdentifier("id")
                                            )
                                        ])
                                    )
                                ])
                            ]
                        )
                    )
                )
            ], true);
    
            // Create function declaration
            return this.factory.createFunctionDeclaration(
                [this.factory.createModifier(ts.SyntaxKind.AsyncKeyword)], // Add async modifier
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
                functionBody
            );
        });
    }

    public get __prismaClientImport() {
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

    public get __prismaClientModelsImport() {
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