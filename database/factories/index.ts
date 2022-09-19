import News from 'App/Models/News'
import Banner from 'App/Models/Banner'
import User from 'App/Models/User/User'
import Area from 'App/Models/Offer/Area'
import Feedback from 'App/Models/Feedback'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserImage from 'App/Models/User/UserImage'
import Subsection from 'App/Models/Offer/Subsection'
import { DateTime } from 'luxon'
import { RoleNames, UserExperienceTypes, UserTypeNames } from 'Config/user'

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

export const BannerFactory = Factory
  .define(Banner, ({ faker }) => {
    return {
      image: faker.image.business(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(3),
    }
  })
  .build()

/**
 * * Offer
 */

export const AreaFactory = Factory
  .define(Area, ({ faker }) => {
    return { name: faker.helpers.unique(faker.lorem.word) }
  })
  .relation('subsections', () => SubsectionFactory)
  .build()

export const SubsectionFactory = Factory
  .define(Subsection, ({ faker }) => {
    return { name: faker.helpers.unique(faker.lorem.word) }
  })
  .build()

/**
 * * User
 */

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      patronymic: faker.name.middleName(),

      email: faker.internet.email(),
      password: '1234Test',

      placeOfWork: faker.company.name(),
      companyName: faker.company.name(),
      legalAddress: faker.address.streetAddress(),
      experienceType: faker.datatype.number({ min: UserExperienceTypes.BEFORE_THREE_MONTH, max: UserExperienceTypes.AFTER_THREE_YEARS }),

      birthday: DateTime.now(),
      city: faker.address.city(),
      phone: faker.phone.number(),
      avatar: faker.internet.avatar(),
      hobby: faker.lorem.word(),

      mainStateRegistrationNumber: faker.datatype.number(),
      taxpayerIdentificationNumber: faker.datatype.number(),

      roleId: RoleNames.USER + 1,
      typeId: faker.datatype.number({ min: UserTypeNames.PHYSICAL_PERSON + 1, max: UserTypeNames.LIMITED_LIABILITY_COMPANY + 1 }),
    }
  })
  .relation('images', () => UserImageFactory)
  .build()

export const UserImageFactory = Factory
  .define(UserImage, ({ faker }) => {
    return { image: faker.image.avatar() }
  })
  .build()
