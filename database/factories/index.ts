import User from 'App/Models/User/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'
import { RoleNames, UserExperienceTypes, UserTypeNames } from 'Config/user'

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
  .build()
