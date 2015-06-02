var flatSignature = [];

module.exports = {
	flatSignature : flatSignature,
	document : document
}

function document(base_url, node, method, nodeName){
	flatSignature.push({
		type: method,
		node:node[method],
		path:baseUrl + path.join('/') + '/' + nodeName
	});
}
