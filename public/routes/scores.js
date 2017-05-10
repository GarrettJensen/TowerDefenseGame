var scores = [];

exports.all = function(request, response) {
	console.log('find all scores called');
  // alert(scores);
	response.writeHead(200, {'content-type': 'application/json'});
	response.end(JSON.stringify(scores));
};

exports.add = function(request, response) {
  console.log('add new score called');
	console.log('Score: ' + request.query.score);
  var number = parseInt(request.query.score);
	scores.push(number);

	response.writeHead(200);
	response.end();
};
