	var Ajv = require('ajv');
	var ajv = new Ajv({
		'extendRefs': true,
		'allErrors': true,
		'jsonPointers': true
	});
	var validate = null;

	ajv.addKeyword('itemTypeReference', {
		validate: function(schema, data, parentSchema, dataPath, parentData, propertyName, rootData) {
			var matches = /.*\#\/definitions\/(.*)/g.exec(schema);
			if (matches) {
				var result = curriculum.types[data] == matches[1];
				return result;
			}
			console.log('Unknown #ref definition: '+schema);
		}
	});

	var curriculum     = require('../curriculum-doelen/lib/curriculum.js');
	var doelenSchema   = curriculum.loadSchema('curriculum-doelen/context.json','curriculum-doelen/');
	var inhoudenSchema = curriculum.loadSchema('curriculum-inhouden/context.json','curriculum-inhouden/');
	var lpibSchema     = curriculum.loadSchema('context.json');

	var valid = ajv.addSchema(doelenSchema, 'https://opendata.slo.nl/curriculum/schemas/curriculum-doelen.json')
	               .addSchema(inhoudenSchema, 'https://opendata.slo.nl/curriculum/schemas/curriculum-inhouden/context.json')
                   .addSchema(lpibSchema, 'https://opendata.slo.nl/curriculum/schemas/curriculum-leerplaninbeeld/context.json')
	               .validate('https://opendata.slo.nl/curriculum/schemas/curriculum-leerplaninbeeld/context.json', curriculum.data);

	if (!valid) {
		ajv.errors.forEach(function(error) {
			console.log(error.dataPath+': '+error.message);
		});
	} else {
		console.log('data is valid!');
	}

