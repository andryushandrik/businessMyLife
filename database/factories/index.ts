import Factory from '@ioc:Adonis/Lucid/Factory'
import Partner from 'App/Models/Partner'

export const PartnersFactory = Factory
  .define(Partner, ({faker}) => {
    return {
      isTitleLink: faker.datatype.boolean(),
      title: faker.lorem.sentence(),
      media: faker.image.abstract(),
      mediaType: faker.datatype.boolean(),
    }
  })
  .build()
