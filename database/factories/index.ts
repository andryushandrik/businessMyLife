import Factory from '@ioc:Adonis/Lucid/Factory'
import News from 'App/Models/News'
import Feedback from 'App/Models/Feedback'
import Banner from 'App/Models/Banner'
import Partner from 'App/Models/Partner'

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

export const FeedbackFactory = Factory.define(Feedback, ({ faker }) => {
    return {
        isCompleted: faker.datatype.boolean(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        question: faker.lorem.paragraph(5)
    }
}).build()

export const BannerFactory = Factory.define(Banner, ({ faker }) => {
    return {
        image: faker.image.business(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(3)
    }
}).build()

export const PartnersFactory = Factory.define(Partner, ({faker}) => {
    return {
        title: faker.lorem.sentence(),
        isTitleLink: faker.datatype.boolean(),
        media: faker.image.abstract(),
        mediaType: faker.datatype.number(1)
    }
}).build()