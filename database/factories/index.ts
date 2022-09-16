import News from 'App/Models/News'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const NewsFactory = Factory
  .define(News, ({faker}) => {
    return {
      slug: faker.lorem.slug(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(2),
      suptitle: faker.lorem.sentence(),
      image: faker.image.city(),

      viewsCount: faker.datatype.number(),

      readingTimeFrom: faker.datatype.number(),
      readingTimeTo: faker.datatype.number(),
    }
  })
  .build()
