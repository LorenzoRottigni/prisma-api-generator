import ts from 'typescript'

export enum GeneratorORMDriver {
    prisma = 'prisma'
}

export enum GeneratorHTTPDriver {
    express = 'express',
    fastify = 'fastify',
    nest = 'nest'
}


export declare interface GeneratorConfig {
    orm: GeneratorORMDriver
    http: GeneratorHTTPDriver
    strategies: GenerationStrategy[]
    outDir: string
}

export enum GenerationStrategy {
    inclusive = 'inclusive',
    modular = 'modular'
}

export declare interface GeneratorSourceFiles {
    [GenerationStrategy.inclusive]?: ts.SourceFile[],
    [GenerationStrategy.modular]?: ts.SourceFile[]
}

export declare interface ORMDriverSchema {
    get __imports(): ts.ImportDeclaration[]
    get __findAllFunctions(): ts.FunctionDeclaration[]
    get __findOneFunctions(): ts.FunctionDeclaration[]
    get __createFunctions(): ts.FunctionDeclaration[]
    get __updateFunctions(): ts.FunctionDeclaration[]
    get __deleteFunctions(): ts.FunctionDeclaration[]
    get __getters(): ts.FunctionDeclaration[]
    get __setters(): ts.FunctionDeclaration[]
}

export declare interface APIGeneratorSchema {
    
}