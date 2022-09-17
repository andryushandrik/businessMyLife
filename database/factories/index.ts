import Banner from 'App/Models/Banner'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const BannerFactory = Factory
  .define(Banner, ({ faker }) => {
    return {
      image: faker.image.business(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(3),
    }
  })
  .build()
