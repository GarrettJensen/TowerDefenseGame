TowerDefense.model = (function(components, graphics, input, particlesManager, highScores) {
	var	internalUpdate,
		internalRender,
		keyboard = input.Keyboard(),
		mouse = input.Mouse(),
		hotKeys = TowerDefense.screens.returnKeys(),
		mouseCapture = false,
		mouseMoveBool = false,
		hotKeys,
		map,
		mapRows = 24,
		mapColumns = 24,
		openingSize = 6, //Needs to be an even number
		tower,
		creeps,
		gameInfo,
		gameOver,
		bullets,
		creepDeaths,
		pathFinderOne,
		pathFinderTwo,
		waves = [],
		creepsPerWave,
		creepsToSpawn,
		currentWave,
		currentLevel,
		difficulty,
		mapType,
		creepSpawnRate = 0.03,
		levelStarted = false,
		canvasWidth = document.getElementById('canvas-main').width,
		canvasHeight = document.getElementById('canvas-main').height,
		gameIsOver;

	//------------------------------------------------------------------
	//
	// Prepares a newly initialized game model, ready for the start of
	// the game.
	//
	//------------------------------------------------------------------
	function initialize() {
		gameIsOver = false;
		levelStarted = false;
		internalUpdate = updatePlaying;
		internalRender = renderPlaying;
		currentLevel = 1;
		difficulty = 1;
		mapType = 2;
		creepsPerWave = 20;
		initializeMap(mapType);
		initializeInputs();
		initializePathFinders();
		towers = components.Towers();
		creeps = components.Creeps();
		gameInfo = components.GameInfo();
		bullets = components.Bullets();
		creepDeaths = graphics.CreepDeaths();
		gameOver = graphics.GameOver();

		document.getElementById('startLevelButton').innerHTML = 'Start Level: ' + currentLevel;
		//initializeWaves();
	}

	function initializeMap(mapType){ //Difficulty is a scale from 1-4
		map = components.Map({
			rows: mapRows,
			columns: mapColumns,
			horizontalSpace: 0,
			verticalSpace: 0,
			mapType: mapType,
			openingSize: openingSize, //Needs to be an even number
			outsideCells: 3
		});

		emptyMap = components.Map({
			rows: mapRows,
			columns: mapColumns,
			horizontalSpace: 0,
			verticalSpace: 0,
			mapType: mapType,
			openingSize: openingSize, //Needs to be an even number
			outsideCells: 3
		});
	}

	function initializeInputs(){
		document.getElementById('cancelButton').addEventListener(
			'click',
			function () { towers.endTowerPlacement(); mouseMoveBool = false;
				mouseCapture = false; hideTowerInfo();
			}
		);
		mouse.registerCommand('mousemove', mouseMoveTowerPlacement);
		mouse.registerCommand('mousedown', mouseDownTowerPlacement);
		mouse.registerCommand('mousedown', mouseDownTowerSelection);
		mouse.registerCommand('mouseup', mouseUpTowerPlacement);
		keyboard.registerCommand(hotKeys.sell, sellTower);
		keyboard.registerCommand(hotKeys.upgrade, upgradeTower);
		keyboard.registerCommand(hotKeys.start, startLevel);
	}

	function initializeWaves() {
		waves[0] = [creepsPerWave, 0, 0]; //Each element in the array represents a creep type
		waves[1] = [0, creepsPerWave, 0];
		waves[2] = [0, 0, creepsPerWave];
		waves[3] = [Math.floor(creepsPerWave/2), Math.floor(creepsPerWave/4),
			Math.floor(creepsPerWave/4)];
		currentWave = 0;
	}

	function initializePathFinders() {
		var pathFinderOneLocation = {	row: mapRows/2,	column: 0 }
		pathFinderOne = components.PathFinder(pathFinderOneLocation);
		pathFinderOne.initialize(map.getMapInfo());
		if(difficulty > 2) {
			pathFinderTwo = components.PathFinder({row: 0, column: mapColumns/2});
		} else {
			pathFinderTwo = components.PathFinder(pathFinderOneLocation);
		}
		pathFinderTwo.initialize(map.getMapInfo());
	}

	//------------------------------------------------------------------
	//
	// A Crapload of input handling jargon
	//
	//------------------------------------------------------------------


	function mouseMoveTowerPlacement(e, timeElapsed){
		if(mouseMoveBool){
			var towerLocation = map.towerPlacement({event: e});
			towerLocation.isPlacementValid = testCreepPaths(towerLocation);
			towers.towerPlacement(towerLocation);
		}
	}

	function testCreepPaths(towerLocation) {
		var newMapInfo = map.testTowerPlacement(map.getMapInfo(), towerLocation);
		if(towerLocation.isPlacementValid){
			if(creeps.findShortestPaths(newMapInfo) === false
			|| pathFinderOne.findShortestPath(newMapInfo) === false
			|| pathFinderTwo.findShortestPath(newMapInfo) === false
			){
				return false;
			} else{
				return true;
			}
		}else{
			return false;
		}
	}

	function mouseDownTowerPlacement(e, timeElapsed){
		if(mouseCapture){
			var towerLocation = map.towerPlacement({event: e});
			towerLocation.isPlacementValid = testCreepPaths(towerLocation);
			if(towerLocation.isPlacementValid) {
				var currentTower = towers.getCurrentlySelectedBaseTowerAttributes(),
					cost = currentTower.cost;
					if(cost <= gameInfo.cash){
						gameInfo.cash -= cost;
						map.buildTower(towerLocation);
						towers.addTower(towerLocation);
						creeps.updateShortestPaths(map.getMapInfo());
					}
			}
			towers.endTowerPlacement();
			mouseMoveBool = false;
			hideTowerInfo();
		}
	}

	function mouseUpTowerPlacement(e, timeElapsed) {
		if(mouseCapture === true) {
			mouseCapture = false;
		}
	}

	function mouseDownTowerSelection(e, timeElapsed) {
		if(mouseCapture === false) {
			var mapReport = map.towerSelection(e, timeElapsed),
				towerKey = towers.findTower(mapReport); //-1 if no tower there.
			if(towerKey >= 0){
				towers.showTowerInfo(towerKey);
			} else {
				hideTowerInfo();
			}
		}
	}

	function startLevel() {
		if(levelStarted === false) {
			levelStarted = true;
			creepsPerWave += 10;
			initializeWaves();
			startCreepSpawn();
		}
	}


	//The functionality of the button depends on the ID which is passed.
	function towerButton(towerId) {
	  mouseCapture = true;
		mouseMoveBool = true;
		towers.startTowerPlacement(towerId, map.cellSize);
		showBaseTowerInfo(towerId);
  };

	function showBaseTowerInfo(towerId) {
		if (!towers.returnPlacementBool()) {
			towers.showBaseTowerInfo(towerId);
			document.getElementById('basic-tower-info').style.display = 'block';
		}
		else {
			document.getElementById('cancelButton').style.display = 'block';
		}
	}

	function hideTowerInfo() {
		if (!towers.returnPlacementBool()) {
			document.getElementById('basic-tower-info').style.display = 'none';
			document.getElementById('cancelButton').style.display = 'none';
		}
		document.getElementById('upgradeButton').style.display = 'hidden';
		document.getElementById('sellButton').style.display = 'hidden';
	}

	function upgradeTower() {
		var currentTowerKey = towers.getCurrentlySelectedTowerKey();
		if(currentTowerKey != -1){
			var currentTowerAttributes = towers.getCurrentlySelectedTowerAttributes();
			if(gameInfo.cash >= currentTowerAttributes.upgradeCost * 2 && currentTowerAttributes.id <= 8){
				towers.upgradeTower();
				gameInfo.cash -= currentTowerAttributes.upgradeCost;
			}
		}
	}

	function sellTower() {
		var currentTowerAttributes = towers.getCurrentlySelectedTowerAttributes();
		if(currentTowerAttributes != -1){
			var currentTowerPosition = towers.getCurrentlySelectedTowerPosition();
			map.removeTower(currentTowerPosition)
			gameInfo.cash += towers.sellTower();
			creeps.updateShortestPaths(map.getMapInfo());
		}
		hideTowerInfo();
	}

	//------------------------------------------------------------------
	//
	// Logic to decide which creeps will spawn, and spawns them.
	//
	//------------------------------------------------------------------

	function startCreepSpawn(){
		var mapInfo = map.getMapInfo();
		for(var creepType = 0; creepType < waves[currentWave].length; creepType++) {
			if(waves[currentWave][creepType]){ //If there are still creeps of this type to be spawned
					creeps.addCreep(map.newCreepPosition(difficulty), mapInfo, creepType, currentLevel);
					waves[currentWave][creepType]--;
			}
		}
	}

	function spawnCreeps() {
		var mapInfo = map.getMapInfo();
		if(levelStarted) {
			creepsToSpawn = false;
			for(var creepType = 0; creepType < waves[currentWave].length; creepType++) {
				if(waves[currentWave][creepType]){ //If there are still creeps of this type to be spawned
					creepsToSpawn = true;
					if(Math.random() <= creepSpawnRate){
						creeps.addCreep(map.newCreepPosition(difficulty), mapInfo, creepType, currentLevel);
						waves[currentWave][creepType]--;
					}
				}
			}
			if(!creepsToSpawn && creeps.getLength() === 0 && currentWave === waves.length - 1){
				currentLevel++;
				document.getElementById('startLevelButton').innerHTML = 'Start Level: ' + currentLevel;
				levelStarted = false;
				if(difficulty < 4){
					difficulty++;
				}
			}
		}
	}

	//------------------------------------------------------------------
	//
	// Handle any mouse and keyboard input
	//
	//------------------------------------------------------------------
	function processInput(elapsedTime) {
		keyboard.update(elapsedTime);
		mouse.update(elapsedTime);
	}

	function endGame() {
		if (gameInfo.lives === 0) {
			addHighScore();
			gameIsOver = true;
			internalUpdate = updateGameOver;
			// initialize();
			internalRender = renderGameOver;
		}
	}

	function updatePlaying(elapsedTime){
		endGame();
		map.update();

		var creepPositions = creeps.getTargetsInfo(),
			towersReport = towers.update(elapsedTime, creepPositions);

		if(towersReport.length > 0){
			bullets.newBullets(towersReport);
		}
		bullets.trackTargets(creepPositions)
		bullets.update(elapsedTime);

		var getBullets = bullets.getBullets(),
			hitTestReport = creeps.hitTests(getBullets),
			creepsReport = creeps.update(elapsedTime);

		bullets.removeBullets(hitTestReport);

		gameInfo.cash += creepsReport.moneyGained;
		gameInfo.score += creepsReport.pointsGained;
		creepDeaths.addDeaths(creepsReport.deaths);

		if(gameInfo.lives >= creepsReport.livesLost){
			gameInfo.lives -= creepsReport.livesLost;
		} else if( gameInfo.livesLost ){
			gameInfo.lives = 0;
		}
		if(creepsReport.nextWaveReady && levelStarted && !creepsToSpawn){
			if(currentWave < waves.length - 1){
				currentWave++
			} else {
				levelStarted = false;
			}
		}

		creepDeaths.update(elapsedTime);
		if(levelStarted) {
			spawnCreeps();
		}
		particlesManager.update(elapsedTime);
	}

	function addHighScore() {
		highScores.add(gameInfo.score);
	}

	function clearHighScores() {
		highScores.clear();
	}

	function renderPlaying(){
		map.render(graphics);
		towers.render();
		bullets.render();
		creeps.render();
		gameInfo.render();
		creepDeaths.render();
		particlesManager.render();
	}

	function renderGameOver(){
		map.render(graphics);
		towers.render();
		creeps.render();
		gameInfo.render();
		particlesManager.render();
		creepDeaths.render();
		gameOver.draw();
	}

	function updateGameOver() {

	}

	//------------------------------------------------------------------
	//
	// Update the state of the game model based upon the passage of time.
	//
	//------------------------------------------------------------------
	function update(elapsedTime) {
		internalUpdate(elapsedTime);
	}

	//------------------------------------------------------------------
	//
	// Render the current state of the game model.
	//
	//------------------------------------------------------------------
	function render() {
		internalRender();
	}

	return {
		towerButton: towerButton,
		showBaseTowerInfo: showBaseTowerInfo,
		hideTowerInfo: hideTowerInfo,
		upgradeTower: upgradeTower,
		sellTower: sellTower,
		initialize: initialize,
		processInput: processInput,
		update: update,
		render: render,
		startLevel : startLevel,
		addHighScore: addHighScore,
		gameIsOver: gameIsOver
	};
}(TowerDefense.Components, TowerDefense.graphics, TowerDefense.input
	, TowerDefense.ParticlesManager, TowerDefense.HighScores));
