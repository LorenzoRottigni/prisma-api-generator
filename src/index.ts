import { generatorHandler } from '@prisma/generator-helper'
import type { DMMF } from '@prisma/generator-helper'
import RestAPIGenerator from './generator/rest-api.generator'

generatorHandler({
    onManifest() {
        return {
            defaultOutput: './api-generator',
            prettyName: 'Prisma API Generator',
        }
    },
    async onGenerate(options) {
        const document: DMMF.Document = options.dmmf
        const generator = new RestAPIGenerator(document)
        generator.generate()
    },
})
