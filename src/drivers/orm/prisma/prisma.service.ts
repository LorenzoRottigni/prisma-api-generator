import ts from 'typescript'
export class PrismaService {
    constructor(
        private factory = ts.factory
    ) {}

    public get __prismaClientStatement(): ts.VariableStatement {
        return this.factory.createVariableStatement(
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
        )
    }

    public __findAllStatement(modelName: string): ts.ReturnStatement {
        return this.factory.createReturnStatement(
            this.factory.createAwaitExpression(
                this.factory.createCallExpression(
                    this.factory.createPropertyAccessExpression(
                        this.factory.createPropertyAccessExpression(
                            this.factory.createIdentifier("prisma"),
                            this.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        this.factory.createIdentifier("findMany")
                    ),
                    undefined,
                    []
                )
            )
        )
    }

    public __findOneStatement(modelName: string): ts.ReturnStatement {
        return this.factory.createReturnStatement(
            this.factory.createAwaitExpression(
                this.factory.createCallExpression(
                    this.factory.createPropertyAccessExpression(
                        this.factory.createPropertyAccessExpression(
                            this.factory.createIdentifier("prisma"),
                            this.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        this.factory.createIdentifier("findMany")
                    ),
                    undefined,
                    []
                )
            )
        )
    }

    public __createStatement(modelName: string): ts.ReturnStatement {
        const args = this.factory.createObjectLiteralExpression([
            this.factory.createPropertyAssignment(
                this.factory.createIdentifier("data"),
                this.factory.createIdentifier(modelName.toLowerCase())
            )
        ]);
        return this.factory.createReturnStatement(
            this.factory.createAwaitExpression(
                this.factory.createCallExpression(
                    this.factory.createPropertyAccessExpression(
                        this.factory.createPropertyAccessExpression(
                            this.factory.createIdentifier("prisma"),
                            this.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        this.factory.createIdentifier("create")
                    ),
                    undefined,
                    [args]
                )
            )
        )
    }

    public __updateStatement(modelName: string): ts.ReturnStatement {
        const args = this.factory.createObjectLiteralExpression([
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
                this.factory.createIdentifier(modelName.toLowerCase())
            )
        ]);
        return this.factory.createReturnStatement(
            this.factory.createAwaitExpression(
                this.factory.createCallExpression(
                    this.factory.createPropertyAccessExpression(
                        this.factory.createPropertyAccessExpression(
                            this.factory.createIdentifier("prisma"),
                            this.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        this.factory.createIdentifier("update")
                    ),
                    undefined,
                    [args]
                )
            )
        )
    }

    public __deleteStatement(modelName: string): ts.ReturnStatement {
        return this.factory.createReturnStatement(
            this.factory.createAwaitExpression(
                this.factory.createCallExpression(
                    this.factory.createPropertyAccessExpression(
                        this.factory.createPropertyAccessExpression(
                            this.factory.createIdentifier("prisma"),
                            this.factory.createIdentifier(modelName.toLowerCase())
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
    }

    public __getModelFieldStatement(modelName: string, fieldName: string): ts.ReturnStatement {
        return this.factory.createReturnStatement(
            this.factory.createBinaryExpression(
                this.factory.createNonNullExpression(
                    this.factory.createPropertyAccessExpression(
                        this.factory.createNonNullExpression(
                            this.factory.createAwaitExpression(
                                this.factory.createCallExpression(
                                    this.factory.createPropertyAccessExpression(
                                        this.factory.createPropertyAccessExpression(
                                            this.factory.createIdentifier("prisma"),
                                            this.factory.createIdentifier(modelName.toLowerCase())
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
                                                        this.factory.createIdentifier("id") // Assuming id field for lookup
                                                    )
                                                ])
                                            ),
                                            this.factory.createPropertyAssignment(
                                                this.factory.createIdentifier("select"),
                                                this.factory.createObjectLiteralExpression([
                                                    this.factory.createPropertyAssignment(
                                                        this.factory.createIdentifier(fieldName),
                                                        this.factory.createTrue()
                                                    )
                                                ])
                                            )
                                        ])
                                    ]
                                )
                            )
                        ),
                        this.factory.createIdentifier(fieldName)
                    )
                ),
                this.factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
                this.factory.createNull()
            )
        )
    }

    public __setModelFieldStatement(modelName: string, fieldName: string): ts.ReturnStatement {
        const args = this.factory.createObjectLiteralExpression([
            this.factory.createPropertyAssignment(
                this.factory.createIdentifier("where"),
                this.factory.createObjectLiteralExpression([
                    this.factory.createPropertyAssignment(
                        this.factory.createIdentifier("id"),
                        this.factory.createIdentifier("id")
                    )
                ])
            ),
            this.factory.createPropertyAssignment(
                this.factory.createIdentifier("data"),
                this.factory.createObjectLiteralExpression([
                    this.factory.createPropertyAssignment(
                        this.factory.createIdentifier(fieldName),
                        this.factory.createIdentifier(modelName.toLowerCase())
                    )
                ])
            )
        ]);
        return this.factory.createReturnStatement(
            this.factory.createAwaitExpression(
                this.factory.createCallExpression(
                    this.factory.createPropertyAccessExpression(
                        this.factory.createPropertyAccessExpression(
                            this.factory.createIdentifier("prisma"),
                            this.factory.createIdentifier(modelName.toLowerCase())
                        ),
                        this.factory.createIdentifier("update")
                    ),
                    undefined,
                    [args]
                )
            )
        )
    }
}