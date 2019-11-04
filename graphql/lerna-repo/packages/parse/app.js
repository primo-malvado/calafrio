
import yaml from "node-yaml";


function loadYaml(filename){

	return new Promise(function(resolve, reject) {

		yaml.read(filename, null, function(err, data){
			if(err){
				reject(err);
			}else{
				resolve(data);

		      
			}
		});
	});
}


function compare(aKeys, bKeys){

	var deleted = aKeys.filter(function(item){
		return bKeys.indexOf(item) === -1;
	})
	var created = bKeys.filter(function(item){
		return aKeys.indexOf(item) === -1;
	});
	var maintain = bKeys.filter(function(item){
		return aKeys.indexOf(item) !== -1;
	})

	return {
		deleted,
		created,
		maintain
	}


}
 


Promise.all([loadYaml("a.yaml"), loadYaml("b.yaml")]).then(function(values) {

	var a = values[0];
	var b = values[1];

	var aKeys = Object.keys(a.models);
	var bKeys = Object.keys(b.models);

	var comp = compare(aKeys, bKeys);



	console.log(comp.deleted, comp.maintain, comp.created);

	comp.maintain.forEach(function(maintain){

		var a2Keys = Object.keys(a.models[maintain].attributes);
		var b2Keys = Object.keys(b.models[maintain].attributes);
		var comp2 = compare(a2Keys, b2Keys);

		console.log("    ", maintain, comp2.deleted, comp2.maintain, comp2.created);
	})





}, 
function(error) {
  console.error(error);
}

);


/*
yaml.write("file.yaml", {
	tables: [
		{
			name:"client",
			columns: [1,2,3]
		}
	]
});
*/