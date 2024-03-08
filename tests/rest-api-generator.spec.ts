import { getDMMF } from '@prisma/internals'
import { ecommerceDatamodel as datamodel } from './data/ecommerce'
import RESTGenerator from '../src/generators/rest.generator'
import { config } from './data/config.generator'

describe('Rest API Generator', () => {
  it('Should generate bundle.', async () => {
    const document = await getDMMF({ datamodel })
    const generator = new RESTGenerator(config, document)
    generator.generate()
  })
})
