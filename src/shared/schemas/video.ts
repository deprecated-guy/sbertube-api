export const uploadVideoScheme = {
	type: 'object',
	properties: {
		file: {
			type: 'file',
			format: 'binary',
		},
		title: {
			type: 'string',
			example: 'My Best Video Ever',
		},
		shortBody: {
			type: 'string',
			example: 'My Best Video Ever',
		},
		body: {
			type: 'string',
			example: 'My Best Video Ever',
		},
	},
};

export const editVideoSchema = {
	properties: {
		title: {
			type: 'string',
			example: 'Me best video ever(renamed)',
		},
		body: {
			type: 'string',
			example: 'Me best video ever(renamed)',
		},
		shortBody: {
			type: 'string',
			example: 'Me best video ever(renamed)',
		},
	},
};
