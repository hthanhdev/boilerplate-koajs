"use strict";
const { Model } = require("sequelize");
const snakecaseKeys = require("snakecase-keys");
const camelcaseKeys = require("camelcase-object-deep");
module.exports = (sequelize, DataTypes) => {
	class Role extends Model {
		static associate(models) {
			this.hasMany(models.Permission, {
				foreignKey: "roleId",
				targetKey: "id",
				as: "permissions",
			});
		}
	}

	Role.STATUS_ACTIVE = 1;
	Role.STATUS_INACTIVE = -1;
	Role.STATUSES = [Role.STATUS_ACTIVE, Role.STATUS_INACTIVE];

	Role.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			inheritFromRoleIds: {
				field: "inherit_from_role_ids",
				type: DataTypes.ARRAY(DataTypes.INTEGER),
				defaultValue: [],
				get() {
					return camelcaseKeys(this.getDataValue("inheritFromRoleIds"));
				},
				set(value) {
					this.setDataValue("inheritFromRoleIds", snakecaseKeys(value));
				},
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			status: {
				type: DataTypes.ENUM(Role.STATUSES),
				allowNull: false,
				defaultValue: Role.STATUS_ACTIVE,
			},
			logs: {
				type: DataTypes.JSONB,
				defaultValue: {
					list: [],
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
			tableName: "roles",
			modelName: "Role",
			updated_at: "updatedAt",
			created_at: "createdAt",
			underscored: true,
			timestamps: true,
		}
	);

	return Role;
};
