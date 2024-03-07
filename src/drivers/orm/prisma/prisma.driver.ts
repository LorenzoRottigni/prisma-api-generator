import { DMMF } from "@prisma/generator-helper";
import type { ORMDriverSchema } from "../../../types";
import ORMDriver from "../orm.driver";
import ts from 'typescript'
import { PrismaService } from "./prisma.service";
import { capitalize } from "../../../utils";

export default class PrismaDriver extends ORMDriver implements ORMDriverSchema {
    constructor(
        private document: DMMF.Document,
        private prismaService = new PrismaService()
    ) { super() }

    public get models() {
        return this.document.datamodel.models
    }

    public get __imports(): ts.ImportDeclaration[] {
        return [
            this.prismaService.__prismaClientImport,
            this.__prismaClientModelsImport,
        ]
    }

    public __modelFunctions(modelName: string): ts.FunctionDeclaration[] {
        const model = this.models.find(model => model.name.toLowerCase() === modelName.toLowerCase())
        if (!model) return []
        return [
            this.prismaService.__findAllFunction(model.name), 
            this.prismaService.__findOneFunction(model.name), 
            this.prismaService.__createFunction(model.name), 
            this.prismaService.__updateFunction(model.name), 
            this.prismaService.__deleteFunction(model.name),
            ...model.fields.map(
                field => this.prismaService.__getter(model.name, field)
            ),
            ...model.fields.map(
                field => this.prismaService.__setter(model.name, field)
            )
        ]
    }

    public get __findAllFunctions(): ts.FunctionDeclaration[] {
        return this.models.map(model => this.prismaService.__findAllFunction(model.name));
    }

    public get __findOneFunctions(): ts.FunctionDeclaration[] {
        return this.models.map(model => this.prismaService.__findOneFunction(model.name));
    }

    public get __createFunctions(): ts.FunctionDeclaration[] {
        return this.models.map(model => this.prismaService.__createFunction(model.name));
    }

    public get __updateFunctions(): ts.FunctionDeclaration[] {
        return this.models.map(model => this.prismaService.__updateFunction(model.name));
    }

    public get __deleteFunctions(): ts.FunctionDeclaration[] {
        return this.models.map(model => this.prismaService.__deleteFunction(model.name));
    }

    public get __getters(): ts.FunctionDeclaration[] {
        const getters: ts.FunctionDeclaration[] = [];
        this.models.forEach(model => {
            model.fields.forEach(field => {
                if (field.name === 'id') return
                getters.push(this.prismaService.__getter(model.name, field));
            });
        });
        return getters;
    }
    
    public get __setters(): ts.FunctionDeclaration[] {
        const setters: ts.FunctionDeclaration[] = [];
    
        this.models.forEach(model => {
            model.fields.forEach(field => {
                if (field.name === 'id') return
                setters.push(
                    this.prismaService.__setter(model.name, field)
                );
            });
        });
    
        return setters;
    }

    public get __prismaClientModelsImport(): ts.ImportDeclaration {
        return ts.factory.createImportDeclaration(
            undefined,
            ts.factory.createImportClause(
                true,
                undefined,
                ts.factory.createNamedImports(
                    this.models.map(model => ts.factory.createImportSpecifier(
                        false,
                        undefined,
                        ts.factory.createIdentifier(model.name)
                    ))
                )
            ),
            ts.factory.createStringLiteral("@prisma/client")
        )
    }
}