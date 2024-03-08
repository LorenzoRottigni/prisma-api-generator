import ts from 'typescript'
import { capitalize } from '../../../utils'

export class NestService {
  constructor() {}

  public __findAllResolvers(modelName: string) {
    return modelName
  }

  public __modelServiceImport(modelName: string) {
    return ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        true,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(
            false,
            undefined,
            ts.factory.createIdentifier(`${capitalize(modelName)}Service`)
          ),
        ])
      ),
      ts.factory.createStringLiteral(`@/codegen/${modelName.toLowerCase()}.service`)
    )
  }
}
