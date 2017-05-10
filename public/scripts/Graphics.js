/*global CanvasRenderingContext2D, TowerDefense */

// ------------------------------------------------------------------
//
// This provides the rendering code for the game.
//
// ------------------------------------------------------------------
TowerDefense.graphics = (function() {

	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');

	//
	// Place a 'clear' function on the Canvas prototype, tFhis makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};

	//------------------------------------------------------------------
	//
	// Public method that allows the client code to clear the canvas.
	//
	//------------------------------------------------------------------
	function clear() {
		context.clear();
	}

	function Texture(spec) {
		var that = {},
			ready = false,
			image = new Image();
		image.onload = function(){
			ready = true;
		}

		image.src = spec.image;

		that.moveTo = function(center) {
			spec.x = center.x;
			spec.y = center.y;
		};

		that.draw = function() {
			if(ready) {
				context.save();
				context.drawImage(image, spec.x, spec.y, spec.width, spec.height);
				context.restore();
			}
		};

		that.setImage = function(newImage){
			image.src = newImage;
		}

		return that;
	}

	function WeaponTexture(spec) {
		var that = {},
			image = new Image();

		image.onload = function() {

			that.draw = function() {
				context.save();
				context.translate(spec.center.x, spec.center.y);
				context.rotate(spec.rotation);
				context.translate(-spec.center.x, -spec.center.y);

				context.drawImage(image, spec.center.x - spec.width/2, spec.center.y - spec.height/2, spec.width, spec.height);

				context.restore();

			};


		};
		image.src = spec.image;

		that.setImage = function(newImage){
			image.src = newImage;
		}

		that.moveTo = function(position) {
			spec.center.x = position.x;
			spec.center.y = position.y;
		}

		that.setRotation = function(angle) {
			spec.rotation = angle;
		}

		that.draw = function() {

		};

		that.getRotation = function() {
			return spec.rotation;
		}

		that.getRotateRate = function() {
			return spec.rotateRate;
		}

		that.getX = function() {
			return spec.center.x;
		}

		that.getY = function() {
			return spec.center.y;
		}

		that.rotateRight = function(angle) {
			spec.rotation += angle;
		};

		that.rotateLeft = function(angle) {
			spec.rotation -= angle;
		}

		return that;
	}

	//draws a circle
	function drawCircle(spec) {
		context.save();
		context.globalAlpha = spec.alpha;
		context.beginPath();
		context.arc(spec.x, spec.y, spec.radius, 0, 2*Math.PI);
		context.fillStyle = spec.fill;
		context.fill();
		context.strokeStyle = spec.stroke;
		context.stroke();

		context.restore();
	}

	function drawImage(spec) {
		context.save();

		context.translate(spec.center.x, spec.center.y);
		context.rotate(spec.rotation);
		context.translate(-spec.center.x, -spec.center.y);

		context.drawImage(
			spec.image,
			spec.center.x - spec.size/2,
			spec.center.y - spec.size/2,
			spec.size, spec.size);

		context.restore();
	}

	// Provides rendering support for a sprite animated from a sprite sheet.
	function SpriteSheet(spec) {
		var that = {},
			image = new Image();

		//
		// Initialize the animation of the spritesheet
		spec.sprite = 0;		// Which sprite to start with
		spec.elapsedTime = 0;	// How much time has occured in the animation

		//
		// Load the image, set the ready flag once it is loaded so that
		// rendering can begin.
		image.onload = function() {
			//
			// Our clever trick, replace the draw function once the image is loaded...no if statements!
			that.draw = function() {
				context.save();

				context.translate(spec.center.x, spec.center.y);
				context.rotate(spec.rotation);
				context.translate(-spec.center.x, -spec.center.y);

				//
				// Pick the selected sprite from the sprite sheet to render
				context.drawImage(
					image,
					spec.width * spec.sprite, 0,	// Which sprite to pick out
					spec.width, spec.height,		// The size of the sprite
					spec.center.x - spec.displayWidth/2,	// Where to draw the sprite
					spec.center.y - spec.displayHeight/2,
					spec.displayWidth, spec.displayHeight);

				context.restore();
			};
			//
			// Once the image is loaded, we can compute the height and width based upon
			// what we know of the image and the number of sprites in the sheet.
			spec.height = image.height;
			spec.width = image.width / spec.spriteCount;
		};
		image.src = spec.spriteSheet;

		//------------------------------------------------------------------
		//
		// Update the animation of the sprite based upon elapsed time.
		//
		//------------------------------------------------------------------
		that.update = function(elapsedTime, forward) {
			spec.elapsedTime += elapsedTime;
			//
			// Check to see if we should update the animation frame
			if (spec.elapsedTime >= spec.spriteTime[spec.sprite]) {
				//
				// When switching sprites, keep the leftover time because
				// it needs to be accounted for the next sprite animation frame.
				spec.elapsedTime -= spec.spriteTime[spec.sprite];
				//
				// Depending upon the direction of the animation...
				if (forward === true) {
					spec.sprite += 1;
					//
					// This provides wrap around from the last back to the first sprite
					spec.sprite = spec.sprite % spec.spriteCount;
				} else {
					spec.sprite -= 1;
					//
					// This provides wrap around from the first to the last sprite
					if (spec.sprite < 0) {
						spec.sprite = spec.spriteCount - 1;
					}
				}
			}
		};



		//------------------------------------------------------------------
		//
		// Render the correct sprint from the sprite sheet
		//
		//------------------------------------------------------------------
		that.draw = function() {
			//
			// Starts out empty, but gets replaced once the image is loaded!
		};

		return that;
	}

	function drawRectangle(spec) {
		context.save();
		// context.translate(spec.x + spec.width / 2, spec.y + spec.height / 2);
		// context.rotate(spec.rotation);
		// context.translate(-(spec.x + spec.width / 2), -(spec.y + spec.height / 2));

		context.fillStyle = spec.fill;
		context.fillRect(spec.x, spec.y, spec.width, spec.height);

		context.strokeStyle = spec.stroke;
		context.strokeRect(spec.x, spec.y, spec.width, spec.height);

		context.restore();
	}

	function CreepDeaths() {
		var that = {},
			font = "16px Arial",
			stroke = 'White',
			fill = 'White',
			lifetime = 1000,
			array = [],
			riseRate = 0.5;

		that.addDeaths = function(deaths){
			for(var death = 0; death < deaths.length; death++){
				var	newAnimationSpecs = {
						x: deaths[death].x,
						y: deaths[death].y,
						text: deaths[death].text,
						fill: fill,
						stroke: stroke,
						font: font,
						time: 0
					};

				array.push(newAnimationSpecs);
			}

		}

		that.update = function(elapsedTime) {
			var toRemove = [];
			for(var animation = 0; animation < array.length; animation++) {
				array[animation].y -= riseRate;
				array[animation].x += (Math.random() * 2) - 1;
				array[animation].time += elapsedTime;
				if(array[animation].time > lifetime){
					toRemove.push(animation);
				}
			}
			for(var animation = toRemove.length - 1; animation >= 0; animation--){
				array.splice(toRemove[animation], 1);
			}
		}

		that.render = function() {
			context.save()
			context.font = font;
			context.fillStyle = fill;
			context.strokeStyle = stroke;
			for(var animation = 0; animation < array.length; animation++) {
				animationSpec = array[animation];
				context.fillText(animationSpec.text, animationSpec.x, animationSpec.y);
			}
			context.restore();
		}

		return that;
	}

	function GameOver() {
    var that = {
      font: '100px Arial',
      text: 'GAME OVER'
    }

    that.draw = function(){
      context.save();
      context.beginPath();
      context.font = that.font;
      context.fillStyle = 'white';

      context.fillText(that.text, canvas.width / 2 - 300, canvas.width / 2 - 20)

      context.closePath();
      context.restore();
    }

    return that;
  }

	return {
		clear : clear,
		drawCircle : drawCircle,
		drawRectangle: drawRectangle,
		drawImage: drawImage,
		SpriteSheet : SpriteSheet,
		Texture: Texture,
		WeaponTexture : WeaponTexture,
		CreepDeaths: CreepDeaths,
		GameOver: GameOver
	};
}());
