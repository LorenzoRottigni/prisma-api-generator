import { DMMF } from '@prisma/generator-helper'
import { Bundle, GeneratorDriver } from '../../../types'
import { HTTPDriver } from '../http.driver'
import ts from 'typescript'

export class NestDriver extends HTTPDriver implements GeneratorDriver {
  constructor(schema: DMMF.Document) {
    super(schema)
  }

  public generateBundle(): Bundle {
    return []
  }
}
