import { getDMMF } from '@prisma/internals'
import RestAPIGenerator from '../src/generator/rest-api.generator'
import { ecommerceDatamodel as datamodel } from './data/ecommerce'

describe('Rest API Generator', () => {
    it('Should generate bundle.', async () => {
        const document = await getDMMF({ datamodel })
        const generator = new RestAPIGenerator(document)
        generator.generate()
    })
})