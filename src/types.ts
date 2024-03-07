import ts from 'typescript'

export declare interface ORMDriverSchema {
    get __imports(): ts.ImportDeclaration[]
    get __findAllFunction(): ts.FunctionDeclaration[]
    get __findOneFunction(): ts.FunctionDeclaration[]
    get __createFunction(): ts.FunctionDeclaration[]
    get __updateFunction(): ts.FunctionDeclaration[]
    get __deleteFunction(): ts.FunctionDeclaration[]
    get __getters(): ts.FunctionDeclaration[]
    get __setters(): ts.FunctionDeclaration[]
}

export declare interface APIGeneratorSchema {
    
}