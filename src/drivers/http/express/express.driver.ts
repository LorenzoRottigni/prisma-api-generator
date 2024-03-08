import { DMMF } from '@prisma/generator-helper'
import { Bundle, GeneratorDriver } from '../../../types'
import { HTTPDriver } from '../http.driver'

export class ExpressDriver extends HTTPDriver implements GeneratorDriver {
  constructor(schema: DMMF.Document) {
    super(schema)
  }

  generateBundle(): Bundle {
    return []
  }
}
