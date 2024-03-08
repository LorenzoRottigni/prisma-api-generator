import ts from 'typescript'
import { capitalize } from '../../../utils';
export class PrismaService {
    constructor() {}

    /**
     * @description Generates Prisma client import declaration:
     * import { PrismaClient } from '@prisma/client' 
     * @returns {ts.ImportDeclaration}
     */
    public get __prismaClientImport(): ts.ImportDeclaration {
        const module = '@prisma/client'
        const namedImport = 'PrismaClient'
        return ts.factory.createImportDeclaration(
            /* modifiers */ undefined,
            ts.factory.createImportClause(
                /* isTypeOnly */ false,
                /* name (default import) */ undefined,
                ts.factory.createNamedImports([
                    ts.factory.createImportSpecifier(
                        false,
                        undefined,
                        ts.factory.createIdentifier(namedImport)
                    ),
                ])
            ),
            ts.factory.createStringLiteral(module)
        );
    }

    /**
     * @description Generates PrismaClient object declaration:
     * const prisma = new PrismaClient()
     * @returns {ts.VariableStatement} 
     */
    public get __prismaClientStatement(): ts.VariableStatement { 
        return ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList([
                ts.factory.createVariableDeclaration(
                    ts.factory.createIdentifier("prisma"),
                    undefined,
                    undefined,
                    ts.factory.createNewExpression(
                        ts.factory.createIdentifier("PrismaClient"),
                        undefined,
                        []
                    )
                )
            ])
        )
    }

    /**
     * @description Converts a Prisma raw DB type to a known Typescript type.
     * @param {string} type Prisma raw DB type 
     * @returns {ts.TypeNode} 
     */
    public prismaToTSType(type: string): ts.TypeNode {
        switch (type) {
            case "Int":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
            case "String":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
            case "Boolean":
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
            case "DateTime":
                return ts.factory.createTypeReferenceNode("Date", []);
            default:
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
        }
    }

    /**
     * @description Generates findAll function for the given model:
     * ex. async function getUsers(): Promise<User[]>
     * @param modelName 
     * @returns {ts.FunctionDeclaration}
     */
    public __findAllFunction(modelName: string): ts.FunctionDeclaration {
        const body: ts.FunctionBody = ts.factory.createBlock([
            this.__prismaClientStatement,
            this.__findAllStatement(modelName)
        ], true);

        return ts.factory.createFunctionDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
            undefined,
            `get${capitalize(modelName)}s`,
            undefined,
            [],
            ts.factory.createTypeReferenceNode(
                "Promise",
                [ts.factory.createArrayTypeNode(ts.factory.createTypeReferenceNode(modelName, []))]
            ),
            body
        );
    }

    /**
     * @description Generates findOne function for the given model:
     * ex. async function findOneUser(id: number): Promise<User[] | null>
     * @param modelName 
     * @returns {ts.FunctionDeclaration}
     */
    public __findOneFunction(modelName: string) {
        const body: ts.FunctionBody = ts.factory.createBlock([
            this.__prismaClientStatement,
            this.__findOneStatement(modelName)
        ], true);

        return ts.factory.createFunctionDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
            undefined,
            `findOne${capitalize(modelName)}`,
            undefined,
            [ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ts.factory.createIdentifier("id"),
                undefined,
                ts.factory.createTypeReferenceNode("number", [])
            )],
            ts.factory.createTypeReferenceNode(
                "Promise",
                [
                    ts.factory.createUnionTypeNode([
                        ts.factory.createTypeReferenceNode(modelName, []),
                        ts.factory.createTypeReferenceNode("null")
                    ])
                ]
            ),
            body
        );
    }

    /**
     * @description Generates create function for the given model:
     * ex. async function createUser(user: User): Promise<User>
     * @param modelName 
     * @returns {ts.FunctionDeclaration}
     */
    public __createFunction(modelName: string): ts.FunctionDeclaration {
        const body: ts.FunctionBody = ts.factory.createBlock([
            this.__prismaClientStatement,
            this.__createStatement(modelName)
        ], true);

        return ts.factory.createFunctionDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
            undefined,
            `create${capitalize(modelName)}`,
            undefined,
            [ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ts.factory.createIdentifier(modelName.toLowerCase()),
                undefined,
                ts.factory.createTypeReferenceNode(modelName, [])
            )],
            ts.factory.createTypeReferenceNode(
                "Promise",
                [ts.factory.createTypeReferenceNode(modelName, [])]
            ),
            body
        );
    }

    /**
     * @description Generates update function for the given model:
     * ex. async function updateUser(id: number, user: User): Promise<User>
     * @param modelName 
     * @returns {ts.FunctionDeclaration}
     */
    public __updateFunction(modelName: string): ts.FunctionDeclaration {
        const body: ts.FunctionBody = ts.factory.createBlock([
            this.__prismaClientStatement,
            this.__updateStatement(modelName)
        ], true);

        return ts.factory.createFunctionDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
            undefined,
            `update${capitalize(modelName)}`,
            undefined,
            [ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ts.factory.createIdentifier("id"),
                undefined,
                ts.factory.createTypeReferenceNode("number", [])
            ),
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ts.factory.createIdentifier(modelName.toLowerCase()),
                undefined,
                ts.factory.createTypeReferenceNode(modelName, [])
            )],
            ts.factory.createTypeReferenceNode(
                "Promise",
                [ts.factory.createTypeReferenceNode(modelName, [])]
            ),
            body
        );
    }

    /**
     * @description Generates delete function for the given model:
     * ex. async function deleteUser(id: number): Promise<User>
     * @param modelName 
     * @returns {ts.FunctionDeclaration}
     */
    public __deleteFunction(modelName: string): ts.FunctionDeclaration {
        const body: ts.FunctionBody = ts.factory.createBlock([
            this.__prismaClientStatement,
            this.__deleteStatement(modelName)
        ], true);

        return ts.factory.createFunctionDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
            undefined,
            `delete${capitalize(modelName)}`,
            undefined,
            [ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ts.factory.createIdentifier("id"),
                undefined,
                ts.factory.createTypeReferenceNode("number", [])
            )],
            ts.factory.createTypeReferenceNode(
                "Promise",
                [ts.factory.createTypeReferenceNode(modelName, [])]
            ),
            body
        );
    }

    /**
     * @description Generates getter function for the given model's field:
     * ex. async function getUserEmail(id: number): Promise<string | null>
     * @param modelName 
     * @param field 
     * @returns {ts.FunctionDeclaration}
     */
    public __getter(modelName: string, field: { name: string, type: string }): ts.FunctionDeclaration {
        const body: ts.FunctionBody = ts.factory.createBlock([
            this.__prismaClientStatement,
            this.__getModelFieldStatement(modelName, field.name)
        ], true);
        
        return ts.factory.createFunctionDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
            undefined,
            `get${capitalize(modelName)}${capitalize(field.name)}`,
            undefined,
            [ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ts.factory.createIdentifier("id"),
                undefined,
                ts.factory.createTypeReferenceNode("number", [])
            )],
            ts.factory.createTypeReferenceNode(
                "Promise",
                [
                    ts.factory.createUnionTypeNode(
                        [this.prismaToTSType(field.type), ts.factory.createTypeReferenceNode("null")]
                    )
                ]
                
            ),
            body
        );
    }

    /**
     * @description Generates setter function for the given model's field:
     * ex. async function setUserEmail(id: number, user: string): Promise<User> {
     * @param modelName 
     * @param field 
     * @returns {ts.FunctionDeclaration}
     */
    public __setter(modelName: string, field: { name: string, type: string }): ts.FunctionDeclaration {
        const body: ts.FunctionBody = ts.factory.createBlock([
            this.__prismaClientStatement,
            this.__setModelFieldStatement(modelName, field.name)
        ], true);

        return ts.factory.createFunctionDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
            undefined,
            `set${capitalize(modelName)}${capitalize(field.name)}`,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("id"),
                    undefined,
                    ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier(modelName.toLowerCase()),
                    undefined,
                    this.prismaToTSType(field.type)
                )
            ],
            ts.factory.createTypeReferenceNode(
                "Promise",
                [ts.factory.createTypeReferenceNode(modelName, [])]
            ),
            body
        );
    }

    /**
     * @description Generates the prisma.<model>.findAll statement for the given model:
     * ex. return await prisma.user.findMany();
     * @param modelName 
     * @returns {ts.ReturnStatement}
     */
    public __findAllStatement(modelName: string): ts.ReturnStatement {
        return ts.factory.createReturnStatement(
            ts.factory.createAwaitExpression(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("prisma"),
                            ts.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        ts.factory.createIdentifier("findMany")
                    ),
                    undefined,
                    []
                )
            )
        )
    }

    /**
     * @description Generates the prisma.<model>.findUnique statement for the given model:
     * ex. return await prisma.user.findUnique();
     * @param modelName 
     * @returns {ts.ReturnStatement}
     */
    public __findOneStatement(modelName: string): ts.ReturnStatement {
        const idIdentifier = ts.factory.createIdentifier("id");
        return ts.factory.createReturnStatement(
            ts.factory.createAwaitExpression(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("prisma"),
                            ts.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        ts.factory.createIdentifier("findUnique")
                    ),
                    undefined,
                    [ts.factory.createObjectLiteralExpression([
                        ts.factory.createPropertyAssignment(
                            "where",
                            ts.factory.createObjectLiteralExpression([
                                ts.factory.createPropertyAssignment(
                                    "id",
                                    idIdentifier
                                )
                            ])
                        )
                    ])]
                )
            )
        )
    }
    
    /**
     * @description Generates the prisma.<model>.create statement for the given model:
     * ex. return await prisma.user.create({ data: user });
     * @param modelName 
     * @returns {ts.ReturnStatement}
     */
    public __createStatement(modelName: string): ts.ReturnStatement {
        const args = ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier("data"),
                ts.factory.createIdentifier(modelName.toLowerCase())
            )
        ]);
        return ts.factory.createReturnStatement(
            ts.factory.createAwaitExpression(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("prisma"),
                            ts.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        ts.factory.createIdentifier("create")
                    ),
                    undefined,
                    [args]
                )
            )
        )
    }

    /**
     * @description Generates the prisma.<model>.update statement for the given model:
     * ex. return await prisma.user.update({ where: { id: id }, data: user });
     * @param modelName 
     * @returns {ts.ReturnStatement}
     */
    public __updateStatement(modelName: string): ts.ReturnStatement {
        const args = ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier("where"),
                ts.factory.createObjectLiteralExpression([
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("id"),
                        ts.factory.createIdentifier("id") // Assuming id field for update condition
                    )
                ])
            ),
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier("data"),
                ts.factory.createIdentifier(modelName.toLowerCase())
            )
        ]);
        return ts.factory.createReturnStatement(
            ts.factory.createAwaitExpression(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("prisma"),
                            ts.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        ts.factory.createIdentifier("update")
                    ),
                    undefined,
                    [args]
                )
            )
        )
    }

    /**
     * @description Generates the prisma.<model>.delete statement for the given model:
     * ex. return await prisma.user.delete({ where: { id: id } });
     * @param modelName 
     * @returns {ts.ReturnStatement}
     */
    public __deleteStatement(modelName: string): ts.ReturnStatement {
        return ts.factory.createReturnStatement(
            ts.factory.createAwaitExpression(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("prisma"),
                            ts.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        ts.factory.createIdentifier("delete")
                    ),
                    undefined,
                    [
                        ts.factory.createObjectLiteralExpression([
                            ts.factory.createPropertyAssignment(
                                ts.factory.createIdentifier("where"),
                                ts.factory.createObjectLiteralExpression([
                                    ts.factory.createPropertyAssignment(
                                        ts.factory.createIdentifier("id"),
                                        ts.factory.createIdentifier("id")
                                    )
                                ])
                            )
                        ])
                    ]
                )
            )
        )
    }

    /**
     * @description Generates fields getters for the given model:
     * ex. async function getUserUsername(id: number): Promise<string | null>
     * @param modelName 
     * @param fieldName 
     * @returns {ts.ReturnStatement}
     */
    public __getModelFieldStatement(modelName: string, fieldName: string): ts.ReturnStatement {
        return ts.factory.createReturnStatement(
            ts.factory.createBinaryExpression(
                ts.factory.createNonNullExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createNonNullExpression(
                            ts.factory.createAwaitExpression(
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createIdentifier("prisma"),
                                            ts.factory.createIdentifier(modelName.toLowerCase())
                                        ),
                                        ts.factory.createIdentifier("findUnique")
                                    ),
                                    undefined,
                                    [
                                        ts.factory.createObjectLiteralExpression([
                                            ts.factory.createPropertyAssignment(
                                                ts.factory.createIdentifier("where"),
                                                ts.factory.createObjectLiteralExpression([
                                                    ts.factory.createPropertyAssignment(
                                                        ts.factory.createIdentifier("id"),
                                                        ts.factory.createIdentifier("id") // Assuming id field for lookup
                                                    )
                                                ])
                                            ),
                                            ts.factory.createPropertyAssignment(
                                                ts.factory.createIdentifier("select"),
                                                ts.factory.createObjectLiteralExpression([
                                                    ts.factory.createPropertyAssignment(
                                                        ts.factory.createIdentifier(fieldName),
                                                        ts.factory.createTrue()
                                                    )
                                                ])
                                            )
                                        ])
                                    ]
                                )
                            )
                        ),
                        ts.factory.createIdentifier(fieldName)
                    )
                ),
                ts.factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
                ts.factory.createNull()
            )
        )
    }

    /**
     * @description Generates fields setters for the given model:
     * ex. await prisma.user.update({ where: { id: id }, data: { username: user } });
     * @param modelName 
     * @param fieldName 
     * @returns {ts.ReturnStatement}
     */
    public __setModelFieldStatement(modelName: string, fieldName: string): ts.ReturnStatement {
        const args = ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier("where"),
                ts.factory.createObjectLiteralExpression([
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("id"),
                        ts.factory.createIdentifier("id")
                    )
                ])
            ),
            ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier("data"),
                ts.factory.createObjectLiteralExpression([
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier(fieldName),
                        ts.factory.createIdentifier(modelName.toLowerCase())
                    )
                ])
            )
        ]);
        return ts.factory.createReturnStatement(
            ts.factory.createAwaitExpression(
                ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("prisma"),
                            ts.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        ts.factory.createIdentifier("update")
                    ),
                    undefined,
                    [args]
                )
            )
        )
    }
}