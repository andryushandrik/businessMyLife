import Factory from '@ioc:Adonis/Lucid/Factory'
import News from 'App/Models/News'

export const NewsFactory = Factory.define(News, ({faker}) => {
    return {
        slug: faker.lorem.slug(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(2),
        viewsCount: faker.datatype.number(),
        suptitle: faker.lorem.sentence(),
        image: faker.image.city(),
        readingTimeFrom: faker.datatype.number(),
        readingTimeTo: faker.datatype.number(),
    }
}).build()