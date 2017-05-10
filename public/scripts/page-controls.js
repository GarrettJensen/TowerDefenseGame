/*global TowerDefense */

TowerDefense.pages['page-controls'] = (function(screens, input) {
	
	var keyboard = input.Keyboard();
	var keyPressed = true;
	var keys = [];
	var previousKeys = localStorage.getItem('TowerDefense.keys');
	console.log(previousKeys);
	if(previousKeys !== null) {
		keys = JSON.parse(previousKeys);
	} else {
		keys[0] = 71;
		keys[1] = 83;
		keys[2] = 85;
		localStorage['TowerDefense.keys'] = JSON.stringify(keys);
	}
	
	document.getElementById('levelHotkey').innerHTML = keyboard.getKey(keys[0]);
	document.getElementById('sellHotkey').innerHTML = keyboard.getKey(keys[1]);
	document.getElementById('upgradeHotkey').innerHTML = keyboard.getKey(keys[2]);

	function initialize() {
		document.getElementById('id-controls-back').addEventListener(
			'click',
			function() {if(keyPressed) { screens.showScreen('page-mainmenu'); }}
			); 
			
		document.getElementById('levelHotkey').addEventListener(
			'click',
			function() { if(keyPressed) {changeKey(1);} }
		);
		
		document.getElementById('sellHotkey').addEventListener(
			'click',
			function() { if(keyPressed) {changeKey(2);} }
		);
		
		document.getElementById('upgradeHotkey').addEventListener(
			'click',
			function() { if(keyPressed) {changeKey(3);} }
		);
	}

	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}
	
	function returnKeys() {
		
		var hotKeys = {
			start : keys[0],
			sell : keys[1],
			upgrade : keys[2]
		};
		
		return hotKeys;
	}
	
	function changeKey(id) {
		keyPressed = false;
		switch(id) {
			case 1: 
				document.getElementById('levelHotkey').innerHTML = '&#60Press Key To Bind&#62';
				document.addEventListener('keydown', bindKeyLevel);
				break;
			case 2:
				document.getElementById('sellHotkey').innerHTML = '&#60Press Key To Bind&#62';
				document.addEventListener('keydown', bindKeySell);
				break;
			case 3:
				document.getElementById('upgradeHotkey').innerHTML = '&#60Press Key To Bind&#62';
				document.addEventListener('keydown', bindKeyUpgrade);
				break;
			default:
				break;
		}
		
		localStorage['TowerDefense.keys'] = JSON.stringify(keys);
	}
	
	function bindKeyLevel(e) {
		keyPressed = true;
		
		document.getElementById('levelHotkey').innerHTML = keyboard.getKey(e.keyCode)
		document.removeEventListener('keydown', bindKeyLevel);
		keys[0] = e.keyCode;
		localStorage['TowerDefense.keys'] = JSON.stringify(keys);
	}
	
	function bindKeySell(e) {
		keyPressed = true;
		
		document.getElementById('sellHotkey').innerHTML = keyboard.getKey(e.keyCode);
		document.removeEventListener('keydown', bindKeySell);
		keys[1] = e.keyCode;
		localStorage['TowerDefense.keys'] = JSON.stringify(keys);
	}
	
	function bindKeyUpgrade(e) {
		keyPressed = true;
		
		document.getElementById('upgradeHotkey').innerHTML = keyboard.getKey(e.keyCode);
		document.removeEventListener('keydown', bindKeyUpgrade);
		keys[2] = e.keyCode;
		localStorage['TowerDefense.keys'] = JSON.stringify(keys);
	}

	return {
		initialize : initialize,
		returnKeys : returnKeys,
		run : run
	};
}(TowerDefense.screens, TowerDefense.input));
