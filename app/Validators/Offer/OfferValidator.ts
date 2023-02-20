// * Types
import type { CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// * Types

import IndexValidator from '../IndexValidator'
import { GLOBAL_DATETIME_FORMAT } from 'Config/app'
import { getUserIdRules } from '../Rules/User/user'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { getSubsectionIdRules } from '../Rules/Offer/subsection'
import { getOfferCategoryRules, getOfferImageOptions, getOfferPaybackTimeRules, getOfferProjectStageRules } from '../Rules/Offer/offer'
import {
	OFFER_ABOUT_COMPANY_MAX_LENGTH,
	OFFER_ABOUT_COMPANY_MIN_LENGTH,
	OFFER_ABOUT_MAX_LENGTH,
	OFFER_ABOUT_MIN_LENGTH,
	OFFER_BENEFITS_MAX_LENGTH,
	OFFER_BENEFITS_MIN_LENGTH,
	OFFER_BUSINESS_PLAN_MAX_LENGTH,
	OFFER_BUSINESS_PLAN_MIN_LENGTH,
	OFFER_COOPERATION_TERMS_MAX_LENGTH,
	OFFER_COOPERATION_TERMS_MIN_LENGTH,
	OFFER_DESCRIPTION_MAX_LENGTH,
	OFFER_DESCRIPTION_MIN_LENGTH,
	OFFER_TITLE_MAX_LENGTH,
	OFFER_TITLE_MIN_LENGTH,
} from 'Config/database'

export default class OfferValidator extends IndexValidator {
	constructor(protected ctx: HttpContextContract) {
		super()
	}

	/**
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
	public schema = schema.create({
		title: schema.string({ trim: true }, [rules.minLength(OFFER_TITLE_MIN_LENGTH), rules.maxLength(OFFER_TITLE_MAX_LENGTH)]),
		description: schema.string({ trim: true }, [rules.minLength(OFFER_DESCRIPTION_MIN_LENGTH), rules.maxLength(OFFER_DESCRIPTION_MAX_LENGTH)]),
		city: schema.string({ trim: true }),

		category: schema.number(getOfferCategoryRules()),

		userId: schema.number(getUserIdRules()),
		subsectionId: schema.number(getSubsectionIdRules()),

		/**
		 * * Optional fields
		 */

		image: schema.file.optional(getOfferImageOptions()),
		video: schema.string.optional({ trim: true }),
		images: schema.array.optional().members(schema.file(getOfferImageOptions())),

		cooperationTerms: schema.string.optional({ trim: true }, [
			rules.minLength(OFFER_COOPERATION_TERMS_MIN_LENGTH),
			rules.maxLength(OFFER_COOPERATION_TERMS_MAX_LENGTH),
		]),
		businessPlan: schema.string.optional({ trim: true }, [rules.minLength(OFFER_BUSINESS_PLAN_MIN_LENGTH), rules.maxLength(OFFER_BUSINESS_PLAN_MAX_LENGTH)]),
		benefits: schema.string.optional({ trim: true }, [
			rules.minLength(OFFER_BENEFITS_MIN_LENGTH),
			rules.maxLength(OFFER_BENEFITS_MAX_LENGTH),
			// rules.requiredWhen('category', '=', OfferCategories.FRANCHISES),
		]),

		about: schema.string.optional({ trim: true }, [rules.minLength(OFFER_ABOUT_MIN_LENGTH), rules.maxLength(OFFER_ABOUT_MAX_LENGTH)]),
		aboutCompany: schema.string.optional({ trim: true }, [
			rules.minLength(OFFER_ABOUT_COMPANY_MIN_LENGTH),
			rules.maxLength(OFFER_ABOUT_COMPANY_MAX_LENGTH),
			// rules.requiredWhen('category', '=', OfferCategories.FRANCHISES),
		]),

		paybackTime: schema.number.nullableAndOptional(getOfferPaybackTimeRules()),
		projectStage: schema.number.optional([
			...getOfferProjectStageRules(),
			// rules.requiredWhen('category', 'in', [
			//   `${OfferCategories.COMPLETE_BUSINESS_SELL}`,
			//   `${OfferCategories.SEARCH_FOR_BUSINESS_PARTNERS}`,
			//   `${OfferCategories.SEARCH_FOR_INVESTORS}`,
			// ]),
		]),

		investments: schema.number.optional([
			rules.unsigned(),
			// rules.requiredWhen('category', 'in', [
			//   `${OfferCategories.FRANCHISES}`,
			//   `${OfferCategories.INVESTOR_PROPOSALS}`,
			//   `${OfferCategories.SEARCH_FOR_BUSINESS_PARTNERS}`,
			//   `${OfferCategories.SEARCH_FOR_INVESTORS}`,
			// ]),
		]),
		dateOfCreation: schema.date.optional({ format: GLOBAL_DATETIME_FORMAT }, [
			// rules.requiredWhen('category', '=', OfferCategories.FRANCHISES),
		]),

		price: schema.number.optional([
			rules.unsigned(),
			// rules.requiredWhen('category', 'in', [
			//   `${OfferCategories.COMPLETE_BUSINESS_SELL}`,
			//   `${OfferCategories.FRANCHISES}`,
			// ]),
		]),
		pricePerMonth: schema.number.optional([
			rules.unsigned(),
			// rules.requiredWhen('category', '=', OfferCategories.FRANCHISES),
		]),
		isPricePerMonthAbsolute: schema.boolean.optional(),
		profit: schema.number.optional([
			rules.unsigned(),
			// rules.requiredWhen('category', 'in', [
			//   `${OfferCategories.COMPLETE_BUSINESS_SELL}`,
			//   `${OfferCategories.FRANCHISES}`,
			// ]),
		]),
		profitPerMonth: schema.number.optional([rules.unsigned()]),

		branchCount: schema.number.optional([
			rules.unsigned(),
			// rules.requiredWhen('category', 'in', [
			//   `${OfferCategories.COMPLETE_BUSINESS_SELL}`,
			//   `${OfferCategories.FRANCHISES}`,
			// ]),
		]),
		soldBranchCount: schema.number.optional([
			rules.unsigned(),
			// rules.requiredWhen('category', '=', OfferCategories.FRANCHISES),
		]),
		isArchived: schema.boolean.optional(),
		isVerified: schema.boolean.optional(),
		placedForMonths: schema.number.optional([rules.unsigned(), rules.range(3,6)]),
	})

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages: CustomMessages = this.messages
}

