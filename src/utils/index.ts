import ts from 'typescript'

export const capitalize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

export const prismaToTSType = (type: string): ts.TypeNode => {
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