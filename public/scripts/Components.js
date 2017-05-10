
TowerDefense.Components = (function(graphics, particlesManager) {

	var Constants = {
		get HealthBarWidth(){ return 25; },
		get HealthBarHeight() { return 5; },
		get TowerSellReturnRate() { return 0.7; },
		get ExplosionDamagePercentage() { return 0.75 },
		get BulletSize() { return 5; },
		get TowerOneAttributes() { return {
			id: 1,
			name: "Basic Tower",
			description: "Single fire basic tower",
			type: "Ground/Air",
			radius: 5,
			damage: 50,
			fireRate: 1,
			base: 'resources/images/Towers/tower_base_level_1.png',
			weapon: 'resources/images/Towers/level_1_basic_weapon.png',
			cost: 100,
			projectileSpeed: 10,
			bulletLifeTime: 1000
			};
		},
		get TowerTwoAttributes() { return {
				id: 2,
				name: "Bomb Tower",
				description: "Area of affect tower",
				type: "Ground",
				radius: 3,
				damage: 75,
				fireRate: 2,
				base: 'resources/images/Towers/tower_base_level_1.png',
				weapon: 'resources/images/Towers/level_1_bomb_weapon.png',
				cost: 200,
				projectileSpeed: 5,
				bulletLifeTime: 500,
				explosionRadius: 70
			};
		},
		get TowerThreeAttributes() { return {
				id: 3,
				name: "Guided Missile",
				description: "Guided anti-air tower",
				type: "Air",
				radius: 6,
				damage: 100,
				fireRate: 2,
				base: 'resources/images/Towers/tower_base_level_1.png',
				weapon: 'resources/images/Towers/level_1_missile_weapon.png',
				cost: 300,
				projectileSpeed: 2.5,
				bulletLifeTime: 4000
			};
		},
		get TowerFourAttributes() { return {
				id: 4,
				name: "Wizard Tower",
				description: "Creep Freezing Tower",
				type: "Ground",
				radius: 9,
				damage: 1,
				fireRate: 1,
				base: 'resources/images/Towers/wizard_tower.png',
				weapon: 'resources/images/Towers/empty_weapon.png',
				cost: 200,
				projectileSpeed: 15,
				bulletLifeTime: 1000,
				slowRate: 0.5,
				slowTime: 2000
			};
		},
		get creepOneAttributes() {	return {
				health: 50,
				speed: 2,
				flying: false,
				sprite: {
					spriteSheet : './resources/images/creeps/fast_creep.png',
					spriteCount : 20,
					spriteTime : [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
				}
			};
		},
		get creepTwoAttributes() { return {
				health: 100,
				speed: 1,
				flying : false,
				sprite: {
					spriteSheet : './resources/images/creeps/tank_creep.png',
					spriteCount : 20,
					spriteTime : [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
				}
			};
		},
		get creepThreeAttributes() {	return {
				health: 50,
				speed: 1.5,
				flying : true,
				sprite: {
					spriteSheet : './resources/images/creeps/flying_creep.png',
					spriteCount : 6,
					spriteTime : [1000, 200, 100, 1000, 100, 200],
				}
			};
		}
	}

	// ------------------------------------------------------------------
	//
	// This represents the model for a single Map.  It knows how to draw
	// itself upon request.
	//
	// 'spec' must include:
	//		horizontalSpace: number
	//    verticalSpace: number
	//		areSidesOpen: boolean
	//		areTopBottomOpen: boolean
	//		openingSize: even number
	//		outsideCells: number
	// ------------------------------------------------------------------
	function Map(spec) {
		var MapWidth = document.getElementById('canvas-main').width,
	    MapHeight = document.getElementById('canvas-main').height,
	    horizontalSpace = spec.horizontalSpace,
	    verticalSpace = spec.verticalSpace,
	    towerArea = {},
	    rows = spec.rows,
	    columns = spec.columns,
	    array = [],
	    cellSize = {},
			mapType = spec.mapType,
			areSidesOpen = true,
			areTopBottomOpen = false,
			openingSize = spec.openingSize,
			outsideCells = spec.outsideCells,
			that = {};

		if(mapType >= 2) {
			areTopBottomOpen = true;
		}

	  function createTowerArea(){
	    towerArea.left = horizontalSpace;
	    towerArea.width = MapWidth - (2 * horizontalSpace);
	    towerArea.right = towerArea.left + towerArea.width;
	    towerArea.top = verticalSpace;
	    towerArea.height = MapHeight - (2 * verticalSpace);
	    towerArea.bottom = towerArea.top + towerArea.height;
	    cellSize.width = towerArea.width / columns;
	    cellSize.height = towerArea.height / rows;
			that.cellSize = cellSize;
	  }

		//Initializes the 2x2 array of the map
	  function createArray(rows, columns){
	    for(var row = 0; row < rows; row++){
	      array[row] = [];
	      for(var column = 0; column < columns; column++){
					var left = towerArea.left + (column * cellSize.width),
						top = towerArea.top + (row * cellSize.height);

	        array[row][column] = {
	          isOccupied: false,
						isTree: false,
	          left: left,
	          top: top
	        }
	      }
	    }

			//Setting up the initial bounds
			var topEntranceBound = (rows / 2) - (openingSize /2) - 1,
				bottomEntranceBound = (rows/2) + (openingSize/2),
				leftEntranceBound = (columns/2) - (openingSize/2) - 1,
				rightEntranceBound = (columns/2) + (openingSize/2);

			for(var column = outsideCells; column < columns - outsideCells; column++){
				array[outsideCells][column].isOccupied = true;
				array[array.length - outsideCells - 1][column].isOccupied = true;
			}
			for(var row = outsideCells; row < rows - outsideCells; row++){
				array[row][outsideCells].isOccupied = true;
				array[row][array[0].length - outsideCells - 1].isOccupied = true;
			}

			if(areTopBottomOpen){
				for(var column = (columns /2) - (openingSize / 2);
						column < (columns / 2) + (openingSize / 2); column++){
					array[outsideCells][column].isOccupied = false;
					array[array.length-outsideCells - 1][column].isOccupied = false;
				}
				for(var row = 0; row < outsideCells; row++) {
					array[row][leftEntranceBound].isOccupied = true;
					array[row][rightEntranceBound].isOccupied = true;
				}
				for(var row = rows - outsideCells - 1; row < rows; row++){
					array[row][leftEntranceBound].isOccupied = true;
					array[row][rightEntranceBound].isOccupied = true;
				}
			}

			if(areSidesOpen){
				for(var row = (rows /2) - (openingSize / 2); row < (rows / 2) + (openingSize / 2); row++){
					array[row][outsideCells].isOccupied = false;
					array[row][array[0].length- outsideCells - 1].isOccupied = false;
				}
				for(var column = 0; column < outsideCells; column++) {
					array[topEntranceBound][column].isOccupied = true;
					array[bottomEntranceBound][column].isOccupied = true;
				}
				for(var column = columns - outsideCells - 1; column < columns; column++){
					array[topEntranceBound][column].isOccupied = true;
					array[bottomEntranceBound][column].isOccupied = true;
				}
			}

			for(var row = 0; row < rows; row++){
	      for(var column = 0; column < columns; column++){
					array[row][column].grassTexture = graphics.Texture({
						image: './resources/images/Textures/grass2.png',
						x: array[row][column].left,
						y: array[row][column].top,
						width: cellSize.width,
						height: cellSize.height
					})

					if(array[row][column].isOccupied){
						var texture = './resources/images/Textures/BranchLeaves_Fall.png';

						array[row][column].treeTexture = graphics.Texture({
							image: texture,
							x: array[row][column].left,
							y: array[row][column].top,
							width: cellSize.width,
							height: cellSize.height
						})
					}
	      }
	    }
	  }

		//Returns a spec containing the position of the mouse in terms of the canvas
		that.towerSelection = function(e, elapsedTime){
			var x =  e.clientX - (window.innerWidth - $(game).width()) / 2,
				y = e.clientY - (window.innerHeight - $(game).height()) / 2,
				column = Math.floor((x) / cellSize.width),
				row = Math.floor(y / cellSize.height),
				that = {
					x: x,
					y: y,
					column: column,
					row: row,
					width: cellSize.width * 2,
					height: cellSize.height * 2
				};


			//Check if the tower is within the tower area
			if(row > outsideCells && row + 1 < rows - outsideCells - 1
				&& column > outsideCells && column + 1 < columns - outsideCells - 1){
					//Check validity of placing tower at this position
					if(array[row][column].isOccupied){
						that.isOccupied = true;
					} else {
						that.isOccupied = false;
					}
				}
			return that;
		}

		//Checks if placing a tower at the given location is valid or not.
		//Returns true if valid, false if not.
		that.towerPlacement = function(spec){
			var x =  spec.event.clientX - (window.innerWidth - $(game).width()) / 2,
				y = spec.event.clientY - (window.innerHeight - $(game).height()) / 2,
				column = Math.floor(x / cellSize.width),
				row = Math.floor(y / cellSize.height),
				that = {
					x: column * cellSize.width,
					y: row * cellSize.height,
					column: column,
					row: row,
					width: cellSize.width * 2,
					height: cellSize.height * 2
				};

			//Check if the tower is within the tower area
			if(row > outsideCells && row + 1 < rows - outsideCells - 1
				&& column > outsideCells && column + 1 < columns - outsideCells - 1){

					//Check validity of placing tower at this position
					if(!(array[row][column].isOccupied || array[row + 1][column].isOccupied
							|| array[row][column+1].isOccupied || array[row+1][column+1].isOccupied)){
						that.isPlacementValid = true;
					} else {
						that.isPlacementValid = false;
					}
			} else {
				that.isPlacementValid = false;
			}

			return that;
		}

		//Sets the isOccupied values of the tower's map cells to true.
		//Returns true if a tower can be built at the position, false if it can't.
		that.buildTower = function(position){
			if(position.row > outsideCells && position.row + 1 < rows - outsideCells - 1
			&& position.column > outsideCells && position.column + 1 < columns - outsideCells - 1){
				array[position.row][position.column].isOccupied = true;
				array[position.row+1][position.column].isOccupied = true;
				array[position.row][position.column+1].isOccupied = true;
				array[position.row+1][position.column+1].isOccupied = true;
				return true;
			}
			return false;
		}

		//Sets the isOccupied values of the tower's map cells to false.
		//Returns true if a tower can be removed at the position, false if it can't.
		that.removeTower = function(position){
			if(position.row > outsideCells && position.row + 1 < rows - outsideCells - 1
			&& position.column > outsideCells && position.column + 1 < columns - outsideCells - 1){
				array[position.row][position.column].isOccupied = false;
				array[position.row+1][position.column].isOccupied = false;
				array[position.row][position.column+1].isOccupied = false;
				array[position.row+1][position.column+1].isOccupied = false;
				return true;

			}
			return false;
		}

		//Returns the randomly generated position of the next creep
		that.newCreepPosition = function(difficulty) {
			var row, column, xPos, yPos, random,
				creepSpawnTop = (rows/2)-(openingSize/2),
				creepSpawnLeft = (columns / 2) - (openingSize / 2);
			switch(difficulty){
				case 1:
					column = 0;
					row = creepSpawnTop + Math.floor(openingSize * Math.random());
					break;
				case 2:
					random = Math.floor(Math.random() * 2);
					switch(random) {
						case 0:
							column = 0;
							break;
						case 1:
							column = columns - 1;
							break;
					}
					row = creepSpawnTop + Math.floor(openingSize * Math.random());
					break;
				case 3:
					random = Math.floor(Math.random() * 3);
					switch(random) {
						case 0: //Spawns on left
							column = 0;
							row = creepSpawnTop + Math.floor(openingSize * Math.random());
							break;
						case 1: //Spawns on right
							column = columns - 1;
							row = creepSpawnTop + Math.floor(openingSize * Math.random());
							break;
						case 2: //Spawns on top
							row = 0;
							column = creepSpawnLeft + Math.floor(openingSize * Math.random());
							break;
					}
					break;
				case 4:
					random = Math.floor(Math.random() * 4);
				switch(random) {
					case 0: //Spawns on left
						column = 0;
						row = creepSpawnTop + Math.floor(openingSize * Math.random());
						break;
					case 1: //Spawns on right
						column = columns - 1;
						row = creepSpawnTop + Math.floor(openingSize * Math.random());
						break;
					case 2: //Spawns on top
						row = 0;
						column = creepSpawnLeft + Math.floor(openingSize * Math.random());
						break;
					case 3: //Spawns on bottom
						row = rows - 1;
						column = creepSpawnLeft + Math.floor(openingSize * Math.random());
						break;
				}
				break;
			}

			xPos = column * cellSize.width;
			yPos = row * cellSize.height;

			var position = {
				row: row,
				column: column,
				x: xPos,
				y: yPos,
				width: cellSize.width,
				height: cellSize.height
			}

			return position;
		}

		//Returns a 2D array of the map's isOccuied values
		that.getMapInfo = function() {
			var mapInfo = [];
			for(var row = 0; row < rows; row++) {
				mapInfo[row] = [];
				for(var column = 0; column < columns; column++) {
					mapInfo[row][column] = array[row][column].isOccupied;
				}
			}
			return mapInfo;
		}

		//Fills the mapInfo with the possible new tower, to test against the creep paths.
		that.testTowerPlacement = function(mapInfo, towerposition) {
			if(towerposition.isPlacementValid) {
				mapInfo[towerposition.row][towerposition.column] = true;
				mapInfo[towerposition.row+1][towerposition.column] = true;
				mapInfo[towerposition.row][towerposition.column+1] = true;
				mapInfo[towerposition.row+1][towerposition.column+1] = true;
				return mapInfo;
			} else {
				return mapInfo;
			}
		}

		that.update = function() {
			//Still nothing to do here.
		};

		that.render = function() {
	    for(var row = 0; row < rows; row++){
	      for(var column = 0; column < columns; column++){
					array[row][column].grassTexture.draw();
					if(array[row][column].treeTexture){
						array[row][column].treeTexture.draw();
					}
	      }
	    }
		};

	  createTowerArea();
	  createArray(rows, columns);

		return that;
	};

	// ------------------------------------------------------------------
	//
	// This represents the model for a single Tower.  It knows how to draw
	// itself upon request.
	//
	// 'spec' must include:
	//		y: number
	//    x: number
	//		width: number
	//		height: number
	//		image: string
	// ------------------------------------------------------------------
	function Tower(spec){
		var that = {},
		fireTime = 0,
		baseTexture = spec.baseTexture,
		weaponTexture = spec.weaponTexture,
		attributes = spec.attributes,
		position = spec.position;
		attributes.level = 1;
		attributes.upgradeCost = spec.attributes.cost;
		attributes.totalValue = spec.attributes.cost / 2;

		that.upgrade = function(id){
			var newImage;
			if(id <= 8){
				switch(id){
					case 1:
						newWeaponImage = 'resources/images/Towers/basic_level_2.png';
						newBaseImage = 'resources/images/Towers/tower_base_level_2.png';
						attributes.damage += 50;
						attributes.name = 'Basic Tower (L2)';
						attributes.radius += 1;
						attributes.fireRate -= 0.2;
						attributes.upgradeCost = attributes.upgradeCost * 2;
						attributes.totalValue = attributes.upgradeCost / 2;
						break;
					case 2:
						newWeaponImage = 'resources/images/Towers/bomb_level_2.png';
						newBaseImage = 'resources/images/Towers/tower_base_level_2.png';
						attributes.damage += 50;
						attributes.name = 'Bomb Tower (L2)';
						attributes.radius += 1;
						attributes.fireRate -= 0.2;
						attributes.upgradeCost = attributes.upgradeCost * 2;
						attributes.totalValue = attributes.upgradeCost / 2;
						break;
					case 3:
						newWeaponImage = 'resources/images/Towers/missile_level_2.png';
						newBaseImage = 'resources/images/Towers/tower_base_level_2.png';
						attributes.damage += 50;
						attributes.name = 'Missile Tower (L2)';
						attributes.radius += 1;
						attributes.fireRate -= 0.2;
						attributes.upgradeCost = attributes.upgradeCost * 2;
						attributes.totalValue = attributes.upgradeCost / 2;
						break;
					case 4:
						newWeaponImage = 'resources/images/Towers/empty_weapon.png';
						newBaseImage = 'resources/images/Towers/tesla_coil.png';
						attributes.name = 'Tesla Coil';
						attributes.radius += 1;
						attributes.fireRate -= 0.2;
						attributes.upgradeCost = attributes.upgradeCost * 2;
						attributes.totalValue = attributes.upgradeCost / 2;
						attributes.slowTime += 2000;
						attributes.slowRate = .8;
						break;
					case 5:
						newWeaponImage = 'resources/images/Towers/basic_level_3.png';
						newBaseImage = 'resources/images/Towers/tower_base_level_3.png';
						attributes.damage += 100;
						attributes.name = 'Basic Tower (L3)';
						attributes.radius += 2;
						attributes.fireRate -= 0.2;
						attributes.upgradeCost = attributes.upgradeCost * 2;
						attributes.totalValue = attributes.upgradeCost / 2;
						break;
					case 6:
						newWeaponImage = 'resources/images/Towers/bomb_level_3.png';
						newBaseImage = 'resources/images/Towers/tower_base_level_3.png';
						attributes.damage += 100;
						attributes.name = 'Bomb Tower (L3)';
						attributes.radius += 2;
						attributes.fireRate -= 0.2;
						attributes.upgradeCost = attributes.upgradeCost * 2;
						attributes.totalValue = attributes.upgradeCost / 2;
						break;
					case 7:
						newWeaponImage = 'resources/images/Towers/missile_level_3.png';
						newBaseImage = 'resources/images/Towers/tower_base_level_3.png';
						attributes.damage += 100;
						attributes.name = 'Missile Tower (L3)';
						attributes.radius += 2;
						attributes.fireRate -= 0.2;
						attributes.upgradeCost = attributes.upgradeCost * 2;
						attributes.totalValue = attributes.upgradeCost / 2;
						break;
					case 8:
						newWeaponImage = 'resources/images/Towers/empty_weapon.png';
						newBaseImage = 'resources/images/Towers/cryogenic_station.png';
						attributes.name = 'Cryogenic Station';
						attributes.radius += 2;
						attributes.fireRate -= 0.2;
						attributes.upgradeCost = attributes.upgradeCost * 2;
						attributes.totalValue = attributes.upgradeCost / 2
						attributes.slowTime += 6000;
						attributes.slowRate = 1;
						break;
					default:
						break;
				}

				weaponTexture.setImage(newWeaponImage);
				baseTexture.setImage(newBaseImage);
				attributes.id += 4;
			}
		}

		//determines which direction the tower should rotate depending on if it's positive or negative
		function crossProduct2d(v1, v2) {
			return (v1.x * v2.y) - (v1.y * v2.x);
		}

		//computes the angle between two vectors
		function computeAngle(rotation, towerX, towerY, ptTarget) {
			var v1 = {
					x : Math.cos(rotation),
					y : Math.sin(rotation)
				},
				v2 = {
					x : ptTarget.x - towerX,
					y : ptTarget.y - towerY
				},
				dp,
				angle;

			v2.len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
			v2.x /= v2.len;
			v2.y /= v2.len;

			dp = v1.x * v2.x + v1.y * v2.y;
			angle = Math.acos(dp);

			cp = crossProduct2d(v1, v2);
			return {
				angle : angle,
				crossProduct : cp
			};
		}

		//test if a tower wants to fire or rotate
		function testTolerance(value, test, tolerance) {
			if (Math.abs(value - test) < tolerance) {
				return true;
			} else {
				return false;
			}
		}

		function withinRadius(target) {
			var dx = Math.abs(weaponTexture.getX() - target.x);
			var dy = Math.abs(weaponTexture.getY() - target.y);
			var radii = ((attributes.radius * 31.5) + 15.5);

			if(((dx * dx) + (dy * dy)) < (radii * radii)) {
				return true;
			} else {
				return false;
			}
		}

		function fire(target) {
			var newBulletSpecs = {},
				weaponX = weaponTexture.getX(),
				weaponY = weaponTexture.getY(),
				yDistance = target.y - weaponY,
				xDistance = target.x - weaponX,
				distance = Math.sqrt((yDistance * yDistance) + (xDistance * xDistance)),
				ySpeed = attributes.projectileSpeed * yDistance / distance,
				xSpeed = attributes.projectileSpeed * xDistance/ distance;

			newBulletSpecs.speed = attributes.projectileSpeed;
			newBulletSpecs.ySpeed = ySpeed;
			newBulletSpecs.xSpeed = xSpeed;
			newBulletSpecs.x = weaponTexture.getX();
			newBulletSpecs.y = weaponTexture.getY();
			newBulletSpecs.damage = attributes.damage;
			newBulletSpecs.lifeTime = attributes.bulletLifeTime;
			if(attributes.id <= 4) {
				newBulletSpecs.type = attributes.id;
			} else if(attributes.id <= 8) {
				newBulletSpecs.type = attributes.id - 4;
			} else {
				newBulletSpecs.type = attributes.id - 8;
			}
			newBulletSpecs.explosionRadius = attributes.explosionRadius;
			newBulletSpecs.slowRate = attributes.slowRate;
			newBulletSpecs.slowTime = attributes.slowTime;
			newBulletSpecs.targetUniqueId = target.uniqueId;

			document.getElementById('arrow').play();

			return newBulletSpecs;
		}

		that.update = function(elapsedTime, creepInfo) {
			fireTime += elapsedTime;
			var canFire = false,
				target = null,
				closestCreepDistance = 9999,
				toReturn = -1;

				if(attributes.id <= 4) {
					var tempId = attributes.id;
				} else if (attributes.id <= 8) {
					var tempId = attributes.id - 4;
				} else if(attributes.id <= 12) {
					var tempId = attributes.id - 8;
				}

			if(fireTime > attributes.fireRate * 1000) {
				canFire = true;
			}
			if(creepInfo.length > 0) {
				for(var creep = 0; creep < creepInfo.length; creep++) {
					if((creepInfo[creep].flying && (tempId === 1 || tempId === 3))
					|| (!creepInfo[creep].flying && (tempId != 3))){
						if(creepInfo[creep].distance < closestCreepDistance){
							if (withinRadius(creepInfo[creep])){
								target = creepInfo[creep];
								closestCreepDistance = target.distance;
							}
						}
					}
				}
				if(target != null){
					var result = computeAngle(weaponTexture.getRotation(), weaponTexture.getX(), weaponTexture.getY(), target),
					 atTarget = true;
				}
			}

			if(typeof result != 'undefined') {
				if(testTolerance(result.angle, 0, .03) == false) {
					if (result.crossProduct > 0) {
						weaponTexture.rotateRight(weaponTexture.getRotateRate());
					} else {
						weaponTexture.rotateLeft(weaponTexture.getRotateRate());
					}
				} else {
					if(canFire && atTarget){
						var newBulletSpecs = fire(target);
						fireTime = 0;
						toReturn = newBulletSpecs;
					}
				}
			}

			return toReturn;
		}

		that.render = function() {
			baseTexture.draw();
			weaponTexture.draw();
		}

		that.getPosition = function() {
			return position;
		}

		that.getCenter = function(){
			return {x: weaponTexture.getX(), y: weaponTexture.getY()}
		}

		that.getAttributes = function() {
			return attributes;
		}

		return that;
	}

	function TowerOne(spec) {
		var that = Tower(spec);

		return that;
	}

	function TowerTwo(spec) {
		var that = Tower(spec);

		return that;
	}

	function TowerThree(spec) {
		var that = Tower(spec);

		return that;
	}

	function TowerFour(spec) {
		var that = Tower(spec);

		return that;
	}

	// ------------------------------------------------------------------
	//
	// This represents the model for a set of Tower objects.  It knows how to draw
	// itself upon request.
	//
	// 'spec' must include:
	//
	// ------------------------------------------------------------------
	function Towers() {
		//Constants for each tower's base
		var that = {},
		array = [],
		placingTower = false,
		radiusSpecs,
		newTowerSpecs = {},
		currentlySelectedTower = -1,
		currentlySelectedBaseTower = -1;

		//return the placingTower bool, used to help decide what tower information to display
		that.returnPlacementBool = function() {
			return placingTower;
		}

		//Beginning of the tower palcement process.
		//Does not return any values
		//Modifies the external placingTower property
		//Modifies the external newTowerSpecs.attributes and newTowerSpecs.texture
		that.startTowerPlacement = function(towerId, cellSize) {
			placingTower = true;
			currentlySelectedBaseTower = towerId;
			var radius, base, weapon;
			newTowerSpecs = {};
			switch(towerId) {
				case 1:
					newTowerSpecs.attributes = Constants.TowerOneAttributes;
					base =	Constants.TowerOneAttributes.base;
					weapon = Constants.TowerOneAttributes.weapon;
					radius = Constants.TowerOneAttributes.radius;
					break;
				case 2:
					newTowerSpecs.attributes = Constants.TowerTwoAttributes;
					base = Constants.TowerTwoAttributes.base;
					weapon = Constants.TowerTwoAttributes.weapon;
					radius = Constants.TowerTwoAttributes.radius;
					break;
				case 3:
					newTowerSpecs.attributes = Constants.TowerThreeAttributes;
					base = Constants.TowerThreeAttributes.base;
					weapon = Constants.TowerThreeAttributes.weapon;
					radius = Constants.TowerThreeAttributes.radius;
					break;
				case 4:
					newTowerSpecs.attributes = Constants.TowerFourAttributes;
					base = Constants.TowerFourAttributes.base;
					weapon = Constants.TowerFourAttributes.weapon;
					radius = Constants.TowerFourAttributes.radius;
					break;
				default:
					newTowerSpecs.attributes = Constants.TowerOneAttributes;
					base = Constants.TowerOneAttributes.base;
					weapon = Constants.TowerOneAttributes.weapon;
					radius = Constants.TowerOneAttributes.radius;
					break;
			}

			var textureBase = {
				image: base,
				x: document.getElementById('canvas-main').width / 2 - cellSize.width,
				y: document.getElementById('canvas-main').height / 2 - cellSize.height,
				width: cellSize.width * 2,
				height: cellSize.height * 2
			}
			newTowerSpecs.baseTexture = graphics.Texture(textureBase);

			var textureWeapon = {
				image: weapon,
				center: {	x: document.getElementById('canvas-main').width / 2,
							y: document.getElementById('canvas-main').width / 2},
				width: cellSize.width * 2,
				height: cellSize.height * 2,
				rotation: 0,
				rotateRate : 20 * 3.14159 / 1000
			}
			newTowerSpecs.weaponTexture = graphics.WeaponTexture(textureWeapon);

			radiusSpecs = {
				fill: 'yellow',
				stroke: 'orange',
				alpha: 0.2,
				x: document.getElementById('canvas-main').width / 2,
				y: document.getElementById('canvas-main').height / 2,
				radius: radius * (cellSize.width)
			}
		}

		//Relocates the tower image and radius to the new mouse location
		that.towerPlacement = function(position) {
			radiusSpecs.x = position.x + (position.width / 2);
			radiusSpecs.y = position.y + (position.height / 2);
			if(position.isPlacementValid){
				radiusSpecs.fill = 'yellow';
			} else {
				radiusSpecs.fill = 'red';
			}
			newTowerSpecs.baseTexture.moveTo({x: position.x, y:position.y});
			newTowerSpecs.weaponTexture.moveTo({x: position.x + (position.width / 2), y:position.y + (position.height / 2)});
		}

		//Builds a new tower according to the newTowerSpecs set in startTowerPlacement
		//	and the position passed into the function
		that.addTower = function(position) {
			newTowerSpecs.position = position;
			var newTower;
			switch(newTowerSpecs.id) {
				case 1:
					newTower = TowerOne(newTowerSpecs);
					break;
				case 2:
					newTower = TowerTwo(newTowerSpecs);
					break;
				case 3:
					newTower = TowerThree(newTowerSpecs);
					break;
				case 4:
					newTower = TowerFour(newTowerSpecs);
					break;
				default:
					newTower = TowerOne(newTowerSpecs);
					break;
			}
			document.getElementById('build').play();
			array.push(newTower);
		}

		//Resets the placingTower and newTowerSpecs properties
		that.endTowerPlacement = function(){
			placingTower = false;
			newTowerSpecs = {};
			currentlySelectedBaseTower = -1;
		}

		//Returns the key of the tower located at the position given my mapReport.
		//Returns -1 if there is no tower at that location.
		//MapReport can be obtained via map.towerSelection()
		that.findTower = function(mapReport) {
			for (var tower = 0; tower < array.length; tower++ ) {
				if(mapReport.x >= array[tower].getPosition().x
				&& mapReport.x <= array[tower].getPosition().x + mapReport.width) {
					if(mapReport.y >= array[tower].getPosition().y
					&& mapReport.y <= array[tower].getPosition().y + mapReport.height) {
						currentlySelectedTower = tower;
						return currentlySelectedTower;
					}
				}
			}
			currentlySelectedTower = -1;
			return -1;
		}

		//Removes the tower found at array[key]
		//Returns a percentage of that tower's current cost
		that.sellTower = function() {
			if(currentlySelectedTower != -1) {
				var towerValue = array[currentlySelectedTower].getAttributes().totalValue,
					towerCenter = array[currentlySelectedTower].getCenter();

				particlesManager.sellTower(towerCenter);
				array.splice(currentlySelectedTower, 1);
				currentlySelectedTower = -1;
				document.getElementById('sell').play();
				return Math.floor(towerValue);
			}
			return 0;
		}

		that.upgradeTower = function() {
			if(currentlySelectedTower != -1) {
				array[currentlySelectedTower].upgrade(array[currentlySelectedTower].getAttributes().id);
				that.showTowerInfo(currentlySelectedTower);
			}
			return 0;
		}

		//Shows the information for the base version of a specific tower
		that.showBaseTowerInfo = function(towerId) {
			var towerAttributes;
			switch(towerId) {
				case 1:
					towerAttributes = Constants.TowerOneAttributes;
					break;
				case 2:
					towerAttributes = Constants.TowerTwoAttributes;
					break;
				case 3:
					towerAttributes = Constants.TowerThreeAttributes;
					break;
				case 4:
					towerAttributes = Constants.TowerFourAttributes;
					break;
				default:
					towerAttributes = Constants.TowerOneAttributes;
					break;
			}
			document.getElementById('tower-name').innerHTML = towerAttributes.name;
			document.getElementById('tower-description').innerHTML = towerAttributes.description;
			document.getElementById('tower-type').innerHTML = "Type: " +towerAttributes.type;
			document.getElementById('tower-damage').innerHTML = "Damage: " + towerAttributes.damage;
			document.getElementById('tower-range').innerHTML = "Range: " + towerAttributes.radius;
			document.getElementById('tower-speed').innerHTML = "Fire rate: " + towerAttributes.fireRate;
			document.getElementById('tower-cost').innerHTML = "Cost: " + towerAttributes.cost;
			document.getElementById('tower-value').innerHTML = "";
			document.getElementById('upgrade-cost').innerHTML = "";
			document.getElementById('upgradeButton').disabled = true;
			document.getElementById('upgradeButton').style.visibility = 'hidden';
			document.getElementById('sellButton').disabled = true;
			document.getElementById('sellButton').style.visibility = 'hidden';
			document.getElementById('basic-tower-info').style.display = 'block';
			currentlySelectedTower = -1;
		}

		//Shows the information of a tower that has already been built
		that.showTowerInfo = function(towerKey) {
			if(towerKey < array.length){
				var towerAttributes = array[towerKey].getAttributes();

				document.getElementById('tower-name').innerHTML = towerAttributes.name;
				document.getElementById('tower-description').innerHTML = towerAttributes.description;
				document.getElementById('tower-type').innerHTML = "Type: " +towerAttributes.type;
				document.getElementById('tower-damage').innerHTML = "Damage: " + towerAttributes.damage;
				document.getElementById('tower-range').innerHTML = "Range: " + towerAttributes.radius;
				document.getElementById('tower-speed').innerHTML = "Fire rate: " + towerAttributes.fireRate;
				document.getElementById('tower-cost').innerHTML = "";
				document.getElementById('tower-value').innerHTML = "Sell value: " + towerAttributes.totalValue;
				if(towerAttributes.id <= 8) {
					document.getElementById('upgrade-cost').innerHTML = "Upgrade Cost: " + towerAttributes.upgradeCost * 2;
					document.getElementById('upgradeButton').disabled = false;
					document.getElementById('upgradeButton').style.visibility = 'visible';
				} else {
					document.getElementById('upgrade-cost').innerHTML ="";
					document.getElementById('upgradeButton').disabled = true;
					document.getElementById('upgradeButton').style.visibility = 'hidden';
				}
				document.getElementById('sellButton').disabled = false;
				document.getElementById('sellButton').style.visibility = 'visible';

				document.getElementById('basic-tower-info').style.display = 'block';
			}
		}

		that.update = function(elapsedTime, targets) {
			var newBulletsSpecs = [];
			if(array.length > 0){
				for(var tower = 0; tower < array.length; tower++){
					//Function to find the best target for each tower
					var updateReport = array[tower].update(elapsedTime, targets);
					if(updateReport != -1){
						newBulletsSpecs.push(updateReport);
					}
				}
			}
			return newBulletsSpecs;
		}

		that.render = function(){
			if(array.length > 0){
				for(var tower = 0; tower < array.length; tower++){
					array[tower].render();
				}
			}
			if(placingTower) {
				graphics.drawCircle(radiusSpecs);
				newTowerSpecs.baseTexture.draw();
				newTowerSpecs.weaponTexture.draw();
			}
			if(currentlySelectedTower !== -1) {
				var x = array[currentlySelectedTower].getCenter().x,
					y = array[currentlySelectedTower].getCenter().y,
					radius = array[currentlySelectedTower].getAttributes().radius / 2
						* array[currentlySelectedTower].getPosition().width;

				graphics.drawCircle({
					x: x,
					y: y,
					fill: 'orange',
					stroke: 'red',
					alpha: 0.2,
					radius: radius
				})
			} else {
				document.getElementById('upgradeButton').disabled = true;
				document.getElementById('upgradeButton').style.visibility = 'hidden';
				document.getElementById('sellButton').disabled = true;
				document.getElementById('sellButton').style.visibility = 'hidden';
			}
		}

		that.getBaseTowerAttributes = function(towerId) {
			switch(towerId){
				case 1:
					return Constants.TowerOneAttributes;
				case 2:
					return Constants.TowerTwoAttributes;
				case 3:
					return Constants.TowerThreeAttributes;
				case 4:
					return Constants.TowerFourAttributes;
				default:
					return Constants.TowerOneAttributes;
			}
		}

		that.getCurrentlySelectedBaseTowerAttributes = function() {
			switch(currentlySelectedBaseTower){
				case 1:
					return Constants.TowerOneAttributes;
				case 2:
					return Constants.TowerTwoAttributes;
				case 3:
					return Constants.TowerThreeAttributes;
				case 4:
					return Constants.TowerFourAttributes;
				default:
					return 0;
			}
		}

		that.getCurrentlySelectedTowerKey = function() {
			return currentlySelectedTower;
		}

		that.getCurrentlySelectedTowerAttributes = function() {
			if(currentlySelectedTower != -1){
				return array[currentlySelectedTower].getAttributes();
			}
			return -1;
		}

		that.getCurrentlySelectedTowerPosition = function() {
			if(currentlySelectedTower != -1){
				return array[currentlySelectedTower].getPosition();
			}
			return -1;
		}

		//Returns the attributes of the tower found at array[key]
		that.getTowerAttributes = function(key) {
			return array[key].getAttributes();
		}

		that.getTowerType = function(towerId) {
			return array[towerId].getAttributes().id;
		}

		return that;
	}

	//
	function Creep(position, attributes) {
		var that = {},
		uniqueId = attributes.uniqueId,
		speed = attributes.speed,
		maxHealth = attributes.health,
		health = attributes.health,
		sprite = attributes.sprite,
		flying = attributes.flying,
		slowRate = 1,
		slowTime = 0,
		position = position, //Has row, column, xPos and yPos
		shortestPath = [],
		exitCell,
		nextCell,
		cellSize = {},
		exitReached = false;

		that.flying = attributes.flying;

		var spriteModel = AnimatedModel({
				spriteSheet : sprite.spriteSheet,
				spriteCount : sprite.spriteCount,
				spriteTime : sprite.spriteTime,
				center : {x : 0, y: 0},
				displayWidth: position.width,
				displayHeight: position.height,
				rotation : 0,
				orientation : 0,
				moveRate : 200 / 1000,
				rotateRate : 3.14159 / 1000
			});

		spriteModel.setWidthAndHeight(position.width, position.height);

		that.getMaxHealth = function() {
			return maxHealth;
		}

		that.hitTestBullet = function(bullet) {
			var dx = Math.abs(position.x - bullet.x);
			var dy = Math.abs(position.y - bullet.y);
			var radii = ((bullet.radius) + 15.5);

			if(((dx * dx) + (dy * dy)) < (radii * radii)) {
				if(((bullet.type === 1 || bullet.type === 3) && flying)
				||(bullet.type != 3) && !flying){
					health -= bullet.damage;
				  if(health > 0) { playOuchSound(); }
				  playHitSound();
					if(bullet.type === 4){ slow(bullet); }
					return true;
				}
			} else {
				return false;
			}
		}

		function slow(bullet){
			slowRate = bullet.slowRate;
			slowTime = bullet.slowTime;
		}

		function playHitSound() {
			var soundCount = 2,
				random = Math.floor((Math.random() * soundCount));

			switch(random){
				case 0:
					document.getElementById('hit1').play();
					break;
				case 1:
					document.getElementById('hit2').play();
					break;
				default:
					document.getElementById('hit3').play();
					break;
			}
		}

		function playOuchSound() {
			var soundCount = 7,
				random = Math.floor((Math.random() * soundCount));

			switch(random){
				case 0:
					document.getElementById('ouch0').play();
					break;
				case 1:
					document.getElementById('ouch1').play();
					break;
				case 2:
					document.getElementById('pain1').play();
					break;
				case 3:
					document.getElementById('pain2').play();
					break;
				case 4:
					document.getElementById('pain3').play();
					break;
				case 5:
					document.getElementById('pain4').play();
					break;
				case 6:
					document.getElementById('pain5').play();
					break;
				default:
					break;
			}
		}

		function playDeathSound() {
			var soundCount = 2,
				random = Math.floor((Math.random() * soundCount));

			switch(random){
				case 0:
					document.getElementById('die1').play();
					break;
				case 1:
					document.getElementById('die2').play();
					break;
				default:
					document.getElementById('die3').play();
					break;
			}
		}

		//Requires the current mapInfo, which can be obtained using the map's
			//map.getMapInfo() function
		that.initialize = function(mapInfo){
			var exitRow, exitColumn;
			if(position.row === 0) {
				exitRow = mapInfo.length - 1;
				exitColumn = position.column;
			} else if (position.column === 0) {
				exitRow = position.row;
				exitColumn = mapInfo[0].length - 1;
			} else if (position.row === mapInfo.length - 1){
				exitRow = 0;
				exitColumn = position.column;
			} else {
				exitRow = position.row;
				exitColumn = 0;
			}
			exitCell = {
				row: exitRow,
				column: exitColumn
			}
			cellSize.width = document.getElementById('canvas-main').width / mapInfo[0].length;
			cellSize.height = document.getElementById('canvas-main').height / mapInfo.length
			if(flying === false) {
				that.updateShortestPath(mapInfo);
			} else {
				that.updateShortestPath(emptyMap.getMapInfo());
			}
			updateNextCell();
		}

		that.updateShortestPath = function(mapInfo) {
				shortestPath = that.findShortestPath(mapInfo);
		}

		// Returns of an array of row,column coordinates if path is found,
		//	and false if there is no path to the exitCell.
		that.findShortestPath = function(mapInfo) {
			var map = [];
			for(var row = 0; row < mapInfo.length; row++){
				map[row] = [];
				for(var column = 0; column < mapInfo[0].length; column++) {
					map[row][column] = {
						row: row,
						column: column,
						isOccupied: mapInfo[row][column],
						distance: Infinity,
						parent: null
					}
				}
			}

			var queue = [];
			map[position.row][position.column].distance = 0;
			queue.unshift(map[position.row][position.column]);

			var exitFound = false;
			while(queue.length > 0 && !exitFound){
				var currentCell = queue.pop();
				if(currentCell.row === exitCell.row
				&& currentCell.column === exitCell.column) { //If this is the exit cell
					exitFound = true;
					var shortestPath = reportShortestPath(currentCell, map);
					return shortestPath;
				}

				if(currentCell.row > 0){ //Check bounds above
					var topCell = map[currentCell.row - 1][currentCell.column];
					if(!topCell.isOccupied){
						if(topCell.distance === Infinity) {
							topCell.distance = currentCell.distance + 1;
							topCell.parent = currentCell;
							queue.unshift(topCell);
						}
					}
				}
				if(currentCell.row < map.length - 1) { //Check bound below
					var bottomCell = map[currentCell.row + 1][currentCell.column];
					if(!bottomCell.isOccupied){
						if(bottomCell.distance === Infinity) {
							bottomCell.distance = currentCell.distance + 1;
							bottomCell.parent = currentCell;
							queue.unshift(bottomCell);
						}
					}
				}
				if(currentCell.column > 0) { //Check left bound
					var leftCell = map[currentCell.row][currentCell.column - 1];
					if(!leftCell.isOccupied){
						if(leftCell.distance === Infinity) {
							leftCell.distance = currentCell.distance + 1;
							leftCell.parent = currentCell;
							queue.unshift(leftCell);
						}
					}
				}
				if(currentCell.column < map[0].length - 1) { //Check right bound
					var rightCell = map[currentCell.row][currentCell.column + 1];
					if(!rightCell.isOccupied){
						if(rightCell.distance === Infinity) {
							rightCell.distance = currentCell.distance + 1;
							rightCell.parent = currentCell;
							queue.unshift(rightCell);
						}
					}
				}
			}
			return false;
		}

		 //Traverses the parents of the given cell until start cell is found
		 //	Returns the path from the current position to the exit cell.
		function reportShortestPath(cell, map) {
			var path = [],
				currentCell = cell;

			path.push({row: currentCell.row, column: currentCell.column})
			while(!(currentCell.row === position.row && currentCell.column === position.column)) {
				currentCell = map[currentCell.parent.row][currentCell.parent.column];
				path.push({row: currentCell.row, column: currentCell.column});
			}
			return path;
		}


		function updateNextCell() {
			nextCell = shortestPath.pop();
			nextCell.x = nextCell.column * cellSize.width;
			nextCell.y = nextCell.row * cellSize.height;
			nextCell.yDistance = nextCell.y - position.y;
			nextCell.xDistance = nextCell.x - position.x;

			position.row = nextCell.row;
			position.column = nextCell.column;
		}

		that.update = function(elapsedTime) {
			spriteModel.update(elapsedTime);
			if(health < 0) {
				particlesManager.death({x: position.x, y: position.y});
				playDeathSound();
				return 'killed';
			}
			if(position.row === exitCell.row && position.column === exitCell.column){
				exitReached = true;
				return 'exited';
			}
			//If already at correct x or y position, update nextCell
			if(position.x === nextCell.x && position.y === nextCell.y){
				updateNextCell(nextCell);
			}
			//If will arrive at x or y position this iteration, move to nextCell coordinates
			if(Math.abs(nextCell.yDistance) < (speed * slowRate)){
				position.y = nextCell.y;
			} else { //If further, move in direction of nextCell
				if(Math.sign(nextCell.yDistance) === 1){
					spriteModel.setRotation(1.5708);
					position.y += (speed * slowRate);
					nextCell.yDistance -= (speed * slowRate);
				} else {
					spriteModel.setRotation(3 * 1.5708);
					position.y -= (speed * slowRate);
					nextCell.yDistance += (speed * slowRate);
				}
			}

			if(Math.abs(nextCell.xDistance) < (speed * slowRate)){
				position.x = nextCell.x;
			} else { //If further, move in direction of nextCell
				if(Math.sign(nextCell.xDistance) === 1){
					spriteModel.setRotation(0);
					position.x += (speed * slowRate);
					nextCell.xDistance -= (speed * slowRate);
				} else {
					spriteModel.setRotation(2 * 1.5708);
					position.x -= (speed * slowRate);
					nextCell.xDistance += (speed * slowRate);
				}
			}
			spriteModel.moveTo({x: position.x + (cellSize.width / 2), y:position.y + (cellSize.height / 2)});

			//Update the slowing of creep
			if(slowTime > 0){
				slowTime -= elapsedTime;
			} else {
				slowTime = 0;
				slowRate = 1;
			}

			return 'moved';
		}

		function drawHealthBar(){
			graphics.drawRectangle({
				x: position.x,
				y: position.y - cellSize.height / 4,
				stroke: 'white',
				fill: 'red',
				width: Constants.HealthBarWidth,
				height: Constants.HealthBarHeight
			})

			graphics.drawRectangle({
				x: position.x,
				y: position.y - cellSize.height / 4,
				stroke: 'white',
				fill: 'green',
				width: Constants.HealthBarWidth * (health / maxHealth),
				height: Constants.HealthBarHeight
			})
		}

		that.render = function() {
			if(!exitReached){
				spriteModel.render();
				drawHealthBar();
			}
		}

		that.getCreepPosition = function() {
			var creepPosition = {x : 0, y: 0};
			creepPosition.x = position.x;
			creepPosition.y = position.y;

			return creepPosition;
		}

		that.getPosition = function() { //Simply returns the position of the creep
			return position;
		}

		that.getTargetInfo = function() {
			var that = {
				x: position.x + position.width / 2,
				y: position.y + position.height / 2,
				distance: shortestPath.length,
				flying: flying,
				uniqueId: uniqueId
			}
			return that;
		}

		that.getAttributes = function() {
			return {
				maxHealth: maxHealth,
				speed: speed
			}
		}

		return that;
	}

	function Creeps() {
		var that = {},
		array = [],
		uniqueId = 0,
		creepPositions = [];

		that.getLength = function() {
			return array.length;
		}

		function getCreepAttributes(creepId) {
			switch(creepId){
				case 0:
					return Constants.creepOneAttributes;
					break;
				case 1:
					return Constants.creepTwoAttributes;
					break;
				case 2:
					return Constants.creepThreeAttributes;
					break;
				default:
					return Constants.creepOneAttributes;
					break;
			}
		}

		that.addCreep = function(position, mapInfo, creepId, level) {
			var creepAttributes = getCreepAttributes(creepId);
			creepAttributes.uniqueId = uniqueId;
			creepAttributes.speed += ((level - 1) / 10);
			creepAttributes.health *= (level);
			uniqueId++;
			var	newCreep = Creep(position, creepAttributes);

			newCreep.initialize(mapInfo);
			array.push(newCreep);
		}

		that.findShortestPaths = function(mapInfo) {
			var pathsFound = true;
			for(var creep = 0; creep < array.length; creep++) {
				if(array[creep].findShortestPath(mapInfo) === false) {
					pathsFound = false;
				}
			}
			return pathsFound;
		}

		that.updateShortestPaths = function(mapInfo){
			for(var creep = 0; creep < array.length; creep++) {
				if(array[creep].flying === false) {
					array[creep].updateShortestPath(mapInfo);
				} else {
					array[creep].updateShortestPath(emptyMap.getMapInfo());
				}
			}
		}

		that.creepSelection = function(e, elapsedTime){
			var x =  e.clientX - (window.innerWidth - $(game).width()) / 2,
				y = e.clientY - (window.innerHeight - $(game).height()) / 2,
				column = Math.round((x) / array[0].getPosition().width),
				row = Math.round(y / array[0].getPosition().height);

			var that = {};

			for(var creep = 0; creep < array.length; creep++){
				if(array[creep].getPosition().row === row
				&& array[creep].getPosition().column === column){
					that.isOccupied = true;
					that.score = array[creep].getAttributes().maxHealth;
					that.cash = array[creep].getAttributes().maxHealth;
					// that.creepAttributes = array[creep]
					array.splice(creep, 1);
					return that;
				}
			}
			that.isOccupied = false;
			return that;
		}

		that.getCreepPositions = function() {
			if(array.length > 0) {
				return array[0].getCreepPosition();
			}
		}

		that.getTargetsInfo = function() {
			var targetsInfo = [];
			if(array.length > 0) {
				for(var creep = 0; creep < array.length; creep++){
					targetsInfo.push(array[creep].getTargetInfo());
				}
			}
			return targetsInfo;
		}

		that.hitTests = function(bullets) {
			var bulletsHit = [];
			for(var creep = 0; creep < array.length; creep++) {
				var bulletAdded = false;
				for(var bullet = 0; bullet < bullets.length && !bulletAdded; bullet++) {
					if(array[creep].hitTestBullet(bullets[bullet])){
						bulletAdded = true;
						if(bullets[bullet].type === 2){ explosion(bullets[bullet]); }
						bulletsHit.push(bullet);
					}
				}
			}
			for(var bullet = 0; bullet < bullets.length; bullet++){
				if(bullets[bullet].type === 2 && bullets[bullet].lifeTime <= 30){
					explosion(bullets[bullet]);
					bulletsHit.push(bullet);
				}
			}
			return bulletsHit;
		}

		function explosion(bulletSpec) {
			if(bulletSpec.explosionRadius){
				for(var creep = 0; creep < array.length; creep++) {
					array[creep].hitTestBullet({
						x: bulletSpec.x,
						y: bulletSpec.y,
						radius: bulletSpec.explosionRadius,
						damage: bulletSpec.damage * Constants.ExplosionDamagePercentage
					})
				}
			}
			particlesManager.explosion(bulletSpec);
		}

		that.update = function(elapsedTime) {
			var report = {
				livesLost: 0,
				pointsGained: 0,
				moneyGained: 0,
				deaths: []
			};
			if(array.length > 0){
				var creepsToRemove = [];
				for(var creep = 0; creep < array.length; creep++) {
					//If the creep didn't update because it reached exit or died
					var creepStatus = array[creep].update(elapsedTime)
					if(creepStatus === 'killed'){
						report.pointsGained += array[creep].getMaxHealth() / 5;
						report.moneyGained += array[creep].getMaxHealth() / 5;
						creepsToRemove.push(creep);
						creepPosition = array[creep].getPosition();
						report.deaths.push({
							x: creepPosition.x - creepPosition.width / 2,
							y: creepPosition.y,
							text: array[creep].getMaxHealth() / 5
						});
					} else if (creepStatus === 'exited'){
						report.livesLost++;
						creepsToRemove.push(creep);
					}
				}
				if(creepsToRemove.length > 0){
					for(var creep = array.length - 1; creep >= 0; creep--) {
						for(var i = 0; i < creepsToRemove.length; i++){
							if(creepsToRemove[i] === creep){
								array.splice(creep, 1);
								creepsToRemove.splice(i, 1);
							}
						}
					}
				}
				report.nextWaveReady = false;
			} else {
				report.nextWaveReady = true;
			}
			return report;
		}

		that.render = function() {
			for(var creep = 0; creep < array.length; creep++) {
				array[creep].render();
			}
		}

		return that;
	}

	function AnimatedModel(spec) {
		var that = {},
			sprite = graphics.SpriteSheet(spec);	// We contain a SpriteSheet, not inherited from, big difference

		that.update = function(elapsedTime) {
			sprite.update(elapsedTime, true);
		};

		that.render = function() {
			sprite.draw();
		};

		that.moveTo = function(center) {
			spec.center.x = center.x;
			spec.center.y = center.y;
		};

		that.getX = function() {
			return spec.center.x;
		}

		that.getY = function() {
			return spec.center.y;
		}

		that.setWidthAndHeight = function(width, height) {
			spec.Drawwidth = width;
			spec.Drawheight = height;
		}

		that.setRotation = function(newRotation) {
			spec.rotation = newRotation;
		}

		return that;
	}

	function PathFinder(position) {
		var that = {},
		position = position, //Has row, column, xPos and yPos
		shortestPath = [],
		exitCell,
		nextCell,
		cellSize = {};

		//Requires the current mapInfo, which can be obtained using the map's
			//map.getMapInfo() function
		that.initialize = function(mapInfo){
			var exitRow, exitColumn;
			if(position.row === 0) {
				exitRow = mapInfo.length - 1;
				exitColumn = position.column;
			} else if (position.column === 0) {
				exitRow = position.row;
				exitColumn = mapInfo[0].length - 1;
			} else if (position.row === mapInfo.length - 1){
				exitRow = 0;
				exitColumn = position.column;
			} else {
				exitRow = position.row;
				exitColumn = 0;
			}
			exitCell = {
				row: exitRow,
				column: exitColumn
			}
			cellSize.width = document.getElementById('canvas-main').width / mapInfo[0].length;
			cellSize.height = document.getElementById('canvas-main').height / mapInfo.length;
		}

		// Returns of an array of row,column coordinates if path is found,
		//	and false if there is no path to the exitCell.
		that.findShortestPath = function(mapInfo) {
			var map = [];
			for(var row = 0; row < mapInfo.length; row++){
				map[row] = [];
				for(var column = 0; column < mapInfo[0].length; column++) {
					map[row][column] = {
						row: row,
						column: column,
						isOccupied: mapInfo[row][column],
						distance: Infinity,
						parent: null
					}
				}
			}

			var queue = [];
			map[position.row][position.column].distance = 0;
			queue.unshift(map[position.row][position.column]);

			var exitFound = false;
			while(queue.length > 0 && !exitFound){
				var currentCell = queue.pop();
				if(currentCell.row === exitCell.row
				&& currentCell.column === exitCell.column) { //If this is the exit cell
					return true;
				}

				if(currentCell.row > 0){ //Check bounds above
					var topCell = map[currentCell.row - 1][currentCell.column];
					if(!topCell.isOccupied){
						if(topCell.distance === Infinity) {
							topCell.distance = currentCell.distance + 1;
							topCell.parent = currentCell;
							queue.unshift(topCell);
						}
					}
				}
				if(currentCell.row < map.length - 1) { //Check bound below
					var bottomCell = map[currentCell.row + 1][currentCell.column];
					if(!bottomCell.isOccupied){
						if(bottomCell.distance === Infinity) {
							bottomCell.distance = currentCell.distance + 1;
							bottomCell.parent = currentCell;
							queue.unshift(bottomCell);
						}
					}
				}
				if(currentCell.column > 0) { //Check left bound
					var leftCell = map[currentCell.row][currentCell.column - 1];
					if(!leftCell.isOccupied){
						if(leftCell.distance === Infinity) {
							leftCell.distance = currentCell.distance + 1;
							leftCell.parent = currentCell;
							queue.unshift(leftCell);
						}
					}
				}
				if(currentCell.column < map[0].length - 1) { //Check right bound
					var rightCell = map[currentCell.row][currentCell.column + 1];
					if(!rightCell.isOccupied){
						if(rightCell.distance === Infinity) {
							rightCell.distance = currentCell.distance + 1;
							rightCell.parent = currentCell;
							queue.unshift(rightCell);
						}
					}
				}
			}
			return false;
		}
		return that;
	}

	function Bullet(spec){
		var that = {
			x: spec.x,
			y: spec.y,
			speed: spec.speed,
			xSpeed: spec.xSpeed,
			ySpeed: spec.ySpeed,
			lifeTime: spec.lifeTime,
			damage: spec.damage,
			radius: Constants.BulletSize,
			type: spec.type,
			explosionRadius: spec.explosionRadius,
			slowRate: spec.slowRate,
			slowTime: spec.slowTime,
			targetUniqueId: spec.targetUniqueId
		};

		that.getBullet = function(){
			return {
				x: that.x,
				y: that.y,
				damage: that.damage,
				radius: that.radius,
				type: that.type,
				explosionRadius: that.explosionRadius,
				slowRate: that.slowRate,
				slowTime: that.slowTime,
				lifeTime: that.lifeTime
			}
		}

		that.trackTarget = function(creepPositions){
			for (var creep = 0; creep < creepPositions.length; creep++){
				if(creepPositions[creep].uniqueId === that.targetUniqueId){
					var yDistance = creepPositions[creep].y - that.y,
						xDistance = creepPositions[creep].x - that.x,
						distance = Math.sqrt((yDistance * yDistance) + (xDistance * xDistance));
					that.ySpeed = that.speed * yDistance / distance;
					that.xSpeed = that.speed * xDistance/ distance;
				}
			}
		}

		that.update = function(timeElapsed){
			that.x += that.xSpeed;
			that.y += that.ySpeed;
			that.lifeTime -= timeElapsed;
			if(that.lifeTime > 0){
				return true;
			} else{
				return false;
			}
		}

		that.render = function(){
			graphics.drawCircle({
				x: that.x,
				y: that.y,
				radius: that.radius,
				fill: 'black',
				stroke: 'black'
			})
			if(that.type === 2 || that.type === 3){
				particlesManager.bombTrail({x: that.x, y: that.y});
			}
			if(that.type === 4){
				particlesManager.lightningTrail({x: that.x, y: that.y});
			}
		}

		return that;
	}

	function Bullets(){
		var that = {},
			array = [];

		//Tower Shoots Bullets
		//Towers gets bullets and reports to model
		//Model sends bullets to creeps
		//Creeps check if hit
		//Creeps return array of bullets that made contact
		//Bullets removes the bullets
		that.update = function(elapsedTime) {
			var deadBullets = [];
			for(var bullet = 0; bullet < array.length; bullet++){
				if(!array[bullet].update(elapsedTime)){ //If the bullet is not still alive
					deadBullets.push(bullet);
				}
			}
			for(var bullet = deadBullets.length - 1; bullet >=0; bullet--){
				array.splice(deadBullets[bullet], 1);
			}
		}

		that.trackTargets = function(creepPositions){
			for(var bullet = 0; bullet < array.length; bullet++){
				if(array[bullet].type === 3){
					array[bullet].trackTarget(creepPositions);
				}
			}
		}

		that.getBullets = function() {
			var bullets = [];
			for (var bullet = 0; bullet < array.length; bullet++){
				bullets.push(array[bullet].getBullet());
			}
			return bullets;
		}

		that.newBullets = function(newBulletsSpecs) {
			for(var bullet = 0; bullet < newBulletsSpecs.length; bullet++){
				var newBullet = Bullet(newBulletsSpecs[bullet]);
				array.push(newBullet);
			}
			// array.push(newBulletSpecs);
		}

		that.removeBullets = function(bullets) {
			var uniqueBullets = [],
				isUnique = true;
			for(var bullet = 0; bullet < bullets.length; bullet++){
				isUnique = true;
				 //Check the bullet against the isUnique array.
				 //If unique, push to unique array
				for(var i = 0; i < uniqueBullets.length; i++) {
					if(bullets[bullet] == uniqueBullets[i]){
						isUnique = false;
					}
				}
				if(isUnique){
					uniqueBullets.push(bullets[bullet]);
				}
			}
			if(uniqueBullets.length > 0){
				for(var bullet = uniqueBullets.length - 1; bullet >= 0; bullet--) {
					if(array.length - 1 >= uniqueBullets[bullet]){
							if(array[uniqueBullets[bullet]].type === 3){
								particlesManager.explosion(array[uniqueBullets[bullet]].getBullet());
							}
						array.splice(uniqueBullets[bullet]);
					}
				}
			}
		}

		that.render = function() {
		 	for(var bullet = 0; bullet < array.length; bullet++){
				array[bullet].render();
			}
		}

		return that;
	};

	//keep track of and manipulate overall game info
	function GameInfo() {
		var that = {
			lives: 50,
			cash: 1000,
			score: 0
		};

		that.render = function() {
			document.getElementById('id-lives').innerHTML = 'Lives: ' + that.lives;
			document.getElementById('id-cash').innerHTML = 'Cash: ' + that.cash;
			document.getElementById('id-score').innerHTML = 'Score: ' + that.score;
		}

		that.removeLife = function() {
			that.lives--;
		}

		return that;
	}

	return {
		Map: Map,
		Tower: Tower,
		Towers: Towers,
		Creep: Creep,
		Creeps: Creeps,
		PathFinder: PathFinder,
		Bullets: Bullets,
		GameInfo : GameInfo
	};
}(TowerDefense.graphics, TowerDefense.ParticlesManager));
