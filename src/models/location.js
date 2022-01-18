"use strict";
const { Model } = require("sequelize");
const snakecaseKeys = require("snakecase-keys");
const camelcaseKeys = require("camelcase-object-deep");
const { getters } = require("require.all")("../controllers");

module.exports = (sequelize, DataTypes) => {
	class Location extends Model {
		static associate(models) {
			this.belongsTo(models.Location, {
				foreignKey: "parentId",
				targetKey: "id",
				as: "parent",
			});

			this.hasMany(models.Location, {
				foreignKey: "parentId",
				targetKey: "id",
				as: "children",
			});
		}
	}

	Location.TYPE_WARD = 1;
	Location.TYPE_DISTRICT = 2;
	Location.TYPE_CITY = 3;
	Location.TYPE_COUNTRY = 4;
	Location.TYPES = [
		Location.TYPE_WARD,
		Location.TYPE_DISTRICT,
		Location.TYPE_CITY,
		Location.TYPE_COUNTRY,
	];
	Location.JSON_TYPES = {
		TYPE_WARD: Location.TYPE_WARD,
		TYPE_DISTRICT: Location.TYPE_DISTRICT,
		TYPE_CITY: Location.TYPE_CITY,
		TYPE_COUNTRY: Location.TYPE_COUNTRY,
	};

	Location.SORTED_KEYS = ["ID", "NAME", "TYPE"];
	Location.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			parentId: {
				field: "parent_id",
				type: DataTypes.INTEGER,
				defaultValue: null,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "",
			},
			type: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: Location.TYPE_COUNTRY,
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
			deletedAt: {
				field: "deleted_at",
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			tableName: "locations",
			modelName: "Location",
			updated_at: "updatedAt",
			created_at: "createdAt",
			underscored: true,
			timestamps: true,
		}
	);

	Location.getList = async (
		page = 1,
		size = 10,
		query,
		sortedBy = [["id", "DESC"]],
		excludes = [],
		includes = []
	) =>
		await getters.getList(
			Location,
			page,
			size,
			query,
			sortedBy,
			excludes,
			includes
		);

	Location.getOne = async (id, includes = [], excludes = []) =>
		await getters.getOne(Location, id, excludes, includes);

	return Location;
};
