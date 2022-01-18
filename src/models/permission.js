"use strict";
const { Model } = require("sequelize");
const snakecaseKeys = require("snakecase-keys");
const camelcaseKeys = require("camelcase-object-deep");
module.exports = (sequelize, DataTypes) => {
	class Permission extends Model {
		static associate(models) {}
	}

	Permission.ACTION_CREATE = "create";
	Permission.ACTION_UPDATE = "update";
	Permission.ACTION_DELETE = "delete";
	Permission.ACTION_READ = "read";
	Permission.ACTIONS = [
		Permission.ACTION_CREATE,
		Permission.ACTION_UPDATE,
		Permission.ACTION_DELETE,
		Permission.ACTION_READ,
	];

	Permission.ACTION_SCOPE_ANY = "any";
	Permission.ACTION_SCOPE_OWN = "own";
	Permission.ACTION_SCOPES = [
		Permission.ACTION_SCOPE_ANY,
		Permission.ACTION_SCOPE_OWN,
	];

	Permission.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			roleId: {
				field: "role_id",
				type: DataTypes.INTEGER,
			},
			resource: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "",
			},
			action: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: Permission.ACTION_READ,
			},
			actionScope: {
				field: "action_scope",
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: Permission.ACTION_SCOPE_OWN,
			},
			denyOnAttributes: {
				field: "deny_on_attributes",
				type: DataTypes.ARRAY(DataTypes.STRING),
				allowNull: false,
				defaultValue: [],
				get() {
					return camelcaseKeys(this.getDataValue("denyOnAttributes"));
				},
				set(value) {
					this.setDataValue("denyOnAttributes", snakecaseKeys(value));
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
			deletedAt: {
				field: "deleted_at",
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			tableName: "permissions",
			modelName: "Permission",
			updated_at: "updatedAt",
			created_at: "createdAt",
			underscored: true,
			timestamps: true,
		}
	);

	return Permission;
};
