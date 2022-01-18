const modelToRawModel = (model) => JSON.parse(JSON.stringify(model, null, ""));

const TreeLocationToLine = (data, types) => {
	const result = { ward: null, district: null, city: null, country: null };
	while (data) {
		const location = {
			id: data.id,
			parentId: data.parentId,
			name: data.name,
			type: data.type,
		};
		switch (data.type) {
			case types.TYPE_WARD:
				result.ward = location;
				break;
			case types.TYPE_DISTRICT:
				result.district = location;
				break;
			case types.TYPE_CITY:
				result.city = location;
				break;
			case types.TYPE_COUNTRY:
				result.country = location;
				break;
			default:
				break;
		}
		data = data.parent;
	}
	return result;
};
module.exports = { modelToRawModel, TreeLocationToLine };
