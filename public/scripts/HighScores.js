/* global TowerDefense */

// ------------------------------------------------------------------
//
// High scores implementation.  Behind the abstraction localStorage is
// used for client-side persistence.
//
// ------------------------------------------------------------------
TowerDefense.HighScores = (function() {
	'use strict';
	var localScores = [];

	function add(score) {
		// console.log("Add Score Called");
		// console.log(localScores);
		localScores.push(score);
		localScores.sort(function(a, b) {
			if (a > b) {
				return -1;
			} else if (a < b) {
				return 1;
			}

			return 0;
		});

		//
		// Keep only the best five
		if (localScores.length > 5) {
			localScores = localScores.slice(0, 5);
		}

		addScoresServer(score);
	}

	function get() {
		var currentURL = window.location.href;
		$.ajax({
			url: currentURL + 'scores',
			cache: false,
			type: 'GET',
			error: function() { alert('GET failed'); },
			success: function(data) {
				var scores = data;
				console.log(scores);
				scores.sort(function(a, b) {
					if (a > b) {
						return -1;
					} else if (a < b) {
						return 1;
					}
					return 0;
				});
				console.log(scores);
				var list = $('#high-scores-list'),
					value,
					text;
				list.empty();
				for (value = 0; value < 5; value++) {
					text = (scores[value]);
					list.append($('<li>', { text: text }));
				}
			}
		});
	}

	function clear() {

	}

	function addScoresServer(score) {
		var currentURL = window.location.href;
		$.ajax({
			url: currentURL + 'scores?score=' + score,
			type: 'POST',
			error: function() { alert('POST failed'); },
			success: function() {
				console.log('success!');
			}
		});
	}

	return {
		add : add,
		get : get,
		clear: clear
	};
}());
