/*global TowerDefense, console, KeyEvent, requestAnimationFrame, performance */

TowerDefense.pages['page-game'] = (function(gameModel, screens, graphics, input) {
	var keyboard = input.Keyboard(),
		cancelNextRequest = false,
		lastTimeStamp = performance.now();

	//------------------------------------------------------------------
	//
	// All one-time game page initialization is performed here.
	function initialize() {
		console.log('game initializing...');

		keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			if(!gameModel.gameIsOver){
				gameModel.addHighScore();
			}
			//
			// Then, return to the main menu
			screens.showScreen('page-mainmenu');
		});

		document.getElementById('buildTowerOneButton').addEventListener(
	    'click',
			function() {	gameModel.towerButton(1) }
		);
		document.getElementById('buildTowerTwoButton').addEventListener(
			'click',
			function() { gameModel.towerButton(2) }
		);
		document.getElementById('buildTowerThreeButton').addEventListener(
			'click',
			function() { gameModel.towerButton(3) }
		);
		document.getElementById('buildTowerFourButton').addEventListener(
			'click',
			function() { gameModel.towerButton(4) }
		);
		document.getElementById('buildTowerOneButton').addEventListener(
			'mouseenter',
			function () { gameModel.showBaseTowerInfo(1) }
		);
		document.getElementById('buildTowerTwoButton').addEventListener(
			'mouseenter',
			function () {gameModel.showBaseTowerInfo(2) }
		);
		document.getElementById('buildTowerThreeButton').addEventListener(
			'mouseenter',
			function () { gameModel.showBaseTowerInfo(3) }
		);
		document.getElementById('buildTowerFourButton').addEventListener(
			'mouseenter',
			function () { gameModel.showBaseTowerInfo(4) }
		);
		document.getElementById('buildTowerOneButton').addEventListener(
			'mouseleave',
			function () { gameModel.hideTowerInfo() }
		);
		document.getElementById('buildTowerTwoButton').addEventListener(
			'mouseleave',
			function () { gameModel.hideTowerInfo() }
		);
		document.getElementById('buildTowerThreeButton').addEventListener(
			'mouseleave',
			function () { gameModel.hideTowerInfo() }
		);
		document.getElementById('buildTowerFourButton').addEventListener(
			'mouseleave',
			function () { gameModel.hideTowerInfo() }
		);
		document.getElementById('upgradeButton').addEventListener(
			'click',
			function() { gameModel.upgradeTower(); }
		);
		document.getElementById('sellButton').addEventListener(
			'click',
			function() { gameModel.sellTower(); }
		)
	}

	//------------------------------------------------------------------
	//
	// Input is procesed here.
	//
	//------------------------------------------------------------------
	function processInput(elapsedTime) {
		keyboard.update(elapsedTime);
		gameModel.processInput(elapsedTime);
	}

	//------------------------------------------------------------------
	//
	// The game model is updated here.
	//
	//------------------------------------------------------------------
	function update(elapsedTime) {
		gameModel.update(elapsedTime);
	}

	//------------------------------------------------------------------
	//
	// The game model is rendered here.
	//
	//------------------------------------------------------------------
	function render() {
		graphics.clear();
		gameModel.render();
	}

	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		var elapsedTime = time - lastTimeStamp;

		processInput(elapsedTime);
		update(elapsedTime);
		lastTimeStamp = time;

		render();

		//
		// Cancel the next animation if the user has pressed the ESC key, returning them
		// to the main menu.
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}

	function run() {
		gameModel.initialize();
		lastTimeStamp = performance.now();
		//
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}

	return {
		initialize : initialize,
		run : run
	};
}(TowerDefense.model, TowerDefense.screens, TowerDefense.graphics, TowerDefense.input));
