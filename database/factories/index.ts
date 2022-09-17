import Feedback from 'App/Models/Feedback'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const FeedbackFactory = Factory
  .define(Feedback, ({ faker }) => {
    return {
      isCompleted: faker.datatype.boolean(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      question: faker.lorem.paragraph(5),
    }
  })
  .build()
