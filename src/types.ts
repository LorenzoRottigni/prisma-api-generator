import ts from 'typescript'

export declare interface ORMDriverSchema {
    get __imports(): ts.ImportDeclaration[]
    get __findAll(): ts.FunctionDeclaration[]
    get __findOne(): ts.FunctionDeclaration[]
    get __create(): ts.FunctionDeclaration[]
    get __update(): ts.FunctionDeclaration[]
    get __delete(): ts.FunctionDeclaration[]
}

export declare interface APIGeneratorSchema {
    
}