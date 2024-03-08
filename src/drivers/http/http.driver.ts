import { DMMF } from '@prisma/generator-helper'

export class HTTPDriver {
  constructor(private schema: DMMF.Document) {}
}
