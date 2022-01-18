"use strict";
const { Model } = require("sequelize");
const snakecaseKeys = require("snakecase-keys");
const camelcaseKeys = require("camelcase-object-deep");
const helpers = require("require.all")("../helpers");
const { getters } = require("require.all")("../controllers");
const Location = require("./location");

const _ = require("lodash");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			this.belongsTo(models.Location, {
				foreignKey: "areaId",
				targetKey: "id",
				as: "area",
			});
		}
	}

	User.STATUS_ACTIVE = 1;
	User.STATUS_INACTIVE = -1;
	User.STATUS_LOCKED = -2;
	User.STATUS_DELETED = -3;

	User.STATUSES = [
		User.STATUS_ACTIVE,
		User.STATUS_INACTIVE,
		User.STATUS_LOCKED,
		User.STATUS_DELETED
	];

	User.GENDER_MALE = 1;
	User.GENDER_FEMALE = 2;
	User.GENDER_UNKNOWN = 3;
	User.GENDERS = [User.GENDER_MALE, User.GENDER_FEMALE, User.GENDER_UNKNOWN];

	User.TYPE_PERSONAL = 1;
	User.TYPE_ORGANIZATION = 2;
	User.TYPE_BENEFACTOR = 3;
	User.TYPE_ADMIN = 4;
	User.TYPES = [
		User.TYPE_PERSONAL,
		User.TYPE_ORGANIZATION,
		User.TYPE_BENEFACTOR,
		User.TYPE_ADMIN,
	];

	User.ROLE_ID_GUEST = 1;
	User.ROLE_ID_USER = 2;
	User.ROLE_ID_ADMIN = 3;
	User.ROLE_IDS = [User.ROLE_ID_GUEST, User.ROLE_ID_USER, User.ROLE_ID_ADMIN];

	User.SORTED_KEYS = [
		"ID",
		"ROLE_ID",
		"AREA_ID",
		"NAME",
		"EMAIL",
		"PHONE",
		"ADDRESS",
		"DESCRIPTION",
		"TOTAL_MEMBERS",
		"REPRESENT_NAME",
		"TYPE",
		"STATUS",
		"GENDER",
		"BIRTHDAY",
		"CREATED_AT",
		"UPDATED_AT",
		"DELETED_AT",
	];

	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			roleId: {
				field: "role_id",
				type: DataTypes.INTEGER,
				defaultValue: User.ROLE_ID_USER,
			},
			areaId: {
				field: "area_id",
				type: DataTypes.INTEGER,
				defaultValue: null,
			},
			parentId: {
				field: "parent_id",
				type: DataTypes.INTEGER,
				defaultValue: null,
			},
			name: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
			},
			phone: {
				type: DataTypes.STRING,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				defaultValue: "123456a@",
				set(value) {
					this.setDataValue("password", helpers.bcrypt.hash(value));
				},
			},
			address: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			description: {
				type: DataTypes.STRING,
				defaultValue: "",
			},
			totalMembers: {
				field: "total_members",
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			representName: {
				field: "represent_name",
				type: DataTypes.STRING,
				defaultValue: "",
			},
			type: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: User.TYPE_PERSONAL,
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: User.STATUS_ACTIVE,
			},
			gender: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: User.GENDER_UNKNOWN,
			},
			websites: {
				type: DataTypes.JSONB,
				defaultValue: {
					facebook: "#",
				},
				get() {
					return camelcaseKeys(this.getDataValue("websites"));
				},
				set(value) {
					this.setDataValue("websites", snakecaseKeys(value));
				},
			},
			images: {
				type: DataTypes.JSONB,
				defaultValue: {
					image: "",
					alt_text: "",
				},
				get() {
					return camelcaseKeys(this.getDataValue("images"));
				},
				set(value) {
					this.setDataValue("images", snakecaseKeys(value));
				},
			},
			loginInfo: {
				field: "login_info",
				type: DataTypes.JSONB,
				defaultValue: {
					crm: "",
					web: "",
					app: "",
					other: {},
					login_at: null,
				},
				allowNull: false,
				get() {
					return camelcaseKeys(this.getDataValue("loginInfo"));
				},
				set(value) {
					this.setDataValue("loginInfo", snakecaseKeys(value));
				},
			},
			otp: {
				type: DataTypes.JSONB,
				defaultValue: {},
				get() {
					return camelcaseKeys(this.getDataValue("otp"));
				},
				set(value) {
					this.setDataValue("otp", snakecaseKeys(value));
				},
			},
			logs: {
				type: DataTypes.JSONB,
				defaultValue: {
					list: [],
					statuses: [],
				},
				get() {
					return camelcaseKeys(this.getDataValue("logs"));
				},
				set(value) {
					this.setDataValue("logs", snakecaseKeys(value));
				},
			},
			meta: {
				type: DataTypes.JSONB,
				defaultValue: {},
				get() {
					return camelcaseKeys(this.getDataValue("meta"));
				},
				set(value) {
					this.setDataValue("meta", snakecaseKeys(value));
				},
			},
			extra: {
				type: DataTypes.JSONB,
				defaultValue: {},
				get() {
					return camelcaseKeys(this.getDataValue("extra"));
				},
				set(value) {
					this.setDataValue("extra", snakecaseKeys(value));
				},
			},
			birthday: {
				type: DataTypes.DATE,
				defaultValue: Date.parse("01 Jan 1990"),
			},
			deletedAt: {
				field: "deleted_at",
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			tableName: "users",
			modelName: "User",
			updated_at: "updatedAt",
			created_at: "createdAt",
			underscored: true,
			timestamps: true,
			hooks: {
				afterCreate: (row) => {
					delete row.dataValues.password;
					delete row.dataValues.loginInfo;
				},
				afterUpdate: (row) => {
					delete row.dataValues.password;
					delete row.dataValues.loginInfo;
				},
			},
		}
	);

	User.getList = async (
		page = 1,
		size = 10,
		query,
		sortedBy = [["id", "DESC"]],
		excludes = [],
		includes
	) =>
		await getters.getList(
			User,
			page,
			size,
			query,
			sortedBy,
			excludes,
			includes
		);

	User.getOne = async (id, excludes = [], includes = []) =>
		await getters.getOne(User, id, excludes, includes);


	return User;
};
