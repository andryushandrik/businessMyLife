import News from 'App/Models/News'
import Banner from 'App/Models/Banner'
import User from 'App/Models/User/User'
import Partner from 'App/Models/Partner'
import Area from 'App/Models/Offer/Area'
import Feedback from 'App/Models/Feedback'
import Offer from 'App/Models/Offer/Offer'
import PromoCode from 'App/Models/PromoCode'
import Report from 'App/Models/Report/Report'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserImage from 'App/Models/User/UserImage'
import Subsection from 'App/Models/Offer/Subsection'
import OfferImage from 'App/Models/Offer/OfferImage'
import ReportType from 'App/Models/Report/ReportType'
import UploadTutorial from 'App/Models/UploadTutorial'
import { DateTime } from 'luxon'
import { RoleNames, UserExperienceTypes, UserTypeNames } from 'Config/user'
import { OfferCategories, OfferPaybackTimes, OfferProjectStages } from 'Config/offer'

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

export const UploadTutorialFactory = Factory
  .define(UploadTutorial, ({ faker }) => {
    return {
      isEmbed: true,
      media: faker.image.business(),
      title: faker.lorem.sentence(),
    }
  })
  .build()

export const PartnersFactory = Factory
  .define(Partner, ({ faker }) => {
    return {
      isTitleLink: faker.datatype.boolean(),
      title: faker.lorem.sentence(),
      media: faker.image.abstract(),
      mediaType: faker.datatype.boolean(),
    }
  })
  .build()

export const PromoCodesFactory = Factory
  .define(PromoCode, ({ faker }) => {
    return {
      name: faker.lorem.word(),
      code: faker.helpers.unique(faker.finance.bic),
      discountPrice: faker.datatype.number(),
    }
  })
  .build()

/**
 * * Report
 */

export const ReportFactory = Factory
  .define(Report, async ({ faker }) => {
    return {
      description: faker.lorem.paragraph(),

      userId: (await User.query().random().first())!.id,
      reportTypeId: (await ReportType.query().random().first())!.id,
    }
  })
  .build()

export const ReportTypesFactory = Factory
  .define(ReportType, ({ faker }) => {
    return {
      isForUsers: faker.datatype.boolean(),
      isForOffers: faker.datatype.boolean(),
      name: faker.helpers.unique(faker.lorem.word),
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

export const OfferFactory = Factory
  .define(Offer, async ({ faker }) => {
    const subsection: Subsection = (await Subsection.query().random().first())!

    return {
      isVerified: true,
      isArchived: false,

      title: faker.lorem.words(2),
      description: faker.lorem.paragraph(),
      city: faker.address.cityName(),
      image: faker.image.business(),

      category: faker.datatype.number({ min: OfferCategories.SEARCH_FOR_INVESTORS, max: OfferCategories.FRANCHISES }),
      paybackTime: faker.datatype.number({ min: OfferPaybackTimes.BEFORE_THREE_MONTH, max: OfferPaybackTimes.AFTER_THREE_YEARS }),

      cooperationTerms: faker.lorem.paragraph(),
      businessPlan: faker.lorem.paragraph(),
      benefits: faker.lorem.paragraph(),

      about: faker.lorem.paragraph(),
      aboutCompany: faker.lorem.paragraph(),

      investments: faker.datatype.number(),
      projectStage: faker.datatype.number({ min: OfferProjectStages.IDEA, max: OfferProjectStages.COMPLETE }),
      dateOfCreation: DateTime.now(),

      price: faker.datatype.number(),
      pricePerMonth: faker.datatype.number(),

      profit: faker.datatype.number(),
      profitPerMonth: faker.datatype.number(),

      branchCount: faker.datatype.number(),
      soldBranchCount: faker.datatype.number(),

      subsectionId: subsection.id,
    }
  })
  .relation('images', () => OfferImageFactory)
  .relation('reports', () => ReportFactory)
  .build()

export const OfferImageFactory = Factory
  .define(OfferImage, ({ faker }) => {
    return { image: faker.image.business() }
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
  .relation('reportsTo', () => ReportFactory)
  .relation('offers', () => OfferFactory)
  .build()

export const UserImageFactory = Factory
  .define(UserImage, ({ faker }) => {
    return { image: faker.image.avatar() }
  })
  .build()
