TowerDefense.ParticlesManager = (function(graphics) {
	var that = {},
		array = [];

	that.explosion = function(spec){ // Spec needs an x and y
		var particlesFire = ExplodeParticleSystem( {
				image : 'resources/images/textures/fire.png',
				center: {x: spec.x, y: spec.y},
				speed: {mean: 50, stdev: 5},
				lifetime: {mean: 1, stdev: 0.2},
				particleCount: {max: 40, min: 30},
				size: {max: 20, min: 10}
			}, graphics);

		array.push(particlesFire);

		var particlesSmoke = ExplodeParticleSystem( {
			image : 'resources/images/textures/smoke.png',
			center: {x: spec.x, y: spec.y},
			speed: {mean: 25, stdev: 10},
			lifetime: {mean: 1, stdev: 0.5},
			particleCount: {max: 30, min: 20},
			size: {max: 20, min: 10}
		}, graphics);

		array.push(particlesSmoke);
	}

	that.death = function(spec) {
		var particlesDeath = ExplodeParticleSystem( {
				image : 'resources/images/textures/bloodsplats_0004.png',
				center: {x: spec.x + 15, y: spec.y +15},
				speed: {mean: 5, stdev: 3},
				lifetime: {mean: 0.7, stdev: 0.2},
				particleCount: {max: 10, min: 5},
				size: {max: 12, min: 7}
			}, graphics);

		array.push(particlesDeath);
	}

	that.lightningTrail= function(spec) {
		var zapTrail = ExplodeParticleSystem( {
				image : 'resources/images/textures/zap.png',
				center: {x: spec.x, y: spec.y},
				speed: {mean: 0, stdev: 0},
				lifetime: {mean: 0.1, stdev: 0},
				particleCount: {max: 3, min: 3},
				size: {max: 45, min: 20}
			}, graphics);

		array.push(zapTrail);
	}

	that.bombTrail = function(spec) {
		var fireTrail = ExplodeParticleSystem( {
				image : 'resources/images/textures/fire.png',
				center: {x: spec.x, y: spec.y},
				speed: {mean: 10, stdev: 2},
				lifetime: {mean: 0.8, stdev: 0.3},
				particleCount: {max: 5, min: 2},
				size: {max: 10, min: 3}
			}, graphics);

		array.push(fireTrail);

		var smokeTrail = ExplodeParticleSystem( {
				image : 'resources/images/textures/smoke.png',
				center: {x: spec.x, y: spec.y},
				speed: {mean: 10, stdev: 2},
				lifetime: {mean: 0.8, stdev: 0.3},
				particleCount: {max: 3, min: 1},
				size: {max: 2, min: 1}
			}, graphics);

		array.push(smokeTrail);
	}

	that.sellTower = function(spec) {
		var whiteParticles = FallingParticleSystem( {
				image : 'resources/images/textures/whitePuff00.png',
				center: {x: spec.x, y: spec.y},
				speed: {mean: -10, stdev: 2},
				lifetime: {mean: 0.8, stdev: 0.3},
				particleCount: {max: 20, min: 10},
				size: {max: 25, min: 15},
				areaWidth: 30,
				areaHeight: 20
			}, graphics);

		array.push(whiteParticles);

		var blackParticles = FallingParticleSystem( {
				image : 'resources/images/textures/blackSmoke00.png',
				center: {x: spec.x, y: spec.y},
				speed: {mean: 20, stdev: 5},
				lifetime: {mean: 2, stdev: 0.5},
				particleCount: {max: 20, min: 10},
				size: {max: 10, min: 7},
				areaWidth: 30,
				areaHeight: 20
			}, graphics);

		array.push(blackParticles);

		var flashParticles = ExplodeParticleSystem( {
				image : 'resources/images/textures/flash00.png',
				center: {x: spec.x, y: spec.y},
				speed: {mean: 20, stdev: 3},
				lifetime: {mean: 0.5, stdev: 0.4},
				particleCount: {max: 15, min: 10},
				size: {max: 35, min: 20},
				areaWidth: 50,
				areaHeight: 50
			}, graphics);

		array.push(flashParticles);
	}

	that.update = function(timeElapsed) {
		var toRemove = [];
		for(var system = 0; system < array.length; system++ ) {
			if(!array[system].update(timeElapsed)){ //If there are no more particles
				toRemove.push(system);
			}
		}
		for(var system = toRemove.length - 1; system >= 0; system--) {
			array.splice(system, 1);
		}
	}

	that.render = function() {
		for(var system = 0; system < array.length; system++ ) {
			array[system].render();
		}
	}

	function ExplodeParticleSystem(spec, graphics) {
		'use strict';
		var that = {},
			particles = [],	// Set of all active particles
			imageSrc = spec.image;

		//
		// Replace the spec.image (file to load), with the actual
		// image that should be rendered.
		spec.image = new Image();
		spec.image.onload = function() {
			//
			// Replace the render function!  This approach eliminates the need to have a boolean
			// that we test on every draw call.
			that.render = function() {
				for (var particle = 0; particle < particles.length; particle++) {
					graphics.drawImage(particles[particle]);
				}
			};
		};
		spec.image.src = imageSrc;

		//------------------------------------------------------------------
		//
		// This creates one new particle
		//
		//------------------------------------------------------------------
		function create() {
			var p = {
					image: spec.image,
					size: Random.nextRange(spec.size.max, spec.size.min),
					center: {x: spec.center.x, y: spec.center.y},
					direction: Random.nextCircleVector(),
					speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
					rotation: Math.random() * 2 * Math.PI,
					lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
					alive: 0	// How long the particle has been alive, in seconds
				};

			//
			// Ensure we have a valid size - gaussian numbers can be negative
			p.size = Math.max(1, p.size);
			//
			// Same thing with lifetime
			p.lifetime = Math.max(0.01, p.lifetime);
			//
			// Assign a unique name to each particle
			particles.push(p);
		};

		//------------------------------------------------------------------
		//
		// Update the state of all particles.  This includes remove any that
		// have exceeded their lifetime.
		//
		//------------------------------------------------------------------
		that.update = function(elapsedTime) {
			var removeMe = [];

			//
			// We work with time in seconds, elapsedTime comes in as milliseconds
			elapsedTime = elapsedTime / 1000;

			for (var particle = 0; particle < particles.length; particle++) {
				//
				// Update how long it has been alive
				particles[particle].alive += elapsedTime;

				//
				// Update its position
				particles[particle].center.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
				particles[particle].center.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);

				//
				// Rotate proportional to its speed
				particles[particle].rotation += particles[particle].speed / 500;

				//
				// If the lifetime has expired, identify it for removal
				if (particles[particle].alive > particles[particle].lifetime) {
					removeMe.push(particle);
				}
			}

			//
			// Remove all of the expired particles
			for (var particle = removeMe.length - 1; particle >= 0; particle--) {
				particles.splice(removeMe[particle], 1);
			}

			if(particles.length > 0){
				return true; //There are still particles to be rendered
			} else {
				return false; //No particles in this system, to be deleted.
			}
		};

		//------------------------------------------------------------------
		//
		// When a particle system is first created, this function is empty.
		// Once the texture for the particle system is loaded, this function
		// gets replaced with one that will actually render things.
		//
		//------------------------------------------------------------------
		that.render = function() {
		};

		var particleCount = Random.nextRange(spec.particleCount.min, spec.particleCount.max);
		for (var particle = 0; particle < particleCount; particle++) {
			create();
		}

		return that;
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	function FallingParticleSystem(spec, graphics) {
		'use strict';
		var that = {},
			particles = [],	// Set of all active particles
			imageSrc = spec.image;

		//
		// Replace the spec.image (file to load), with the actual
		// image that should be rendered.
		spec.image = new Image();
		spec.image.onload = function() {
			//
			// Replace the render function!  This approach eliminates the need to have a boolean
			// that we test on every draw call.
			that.render = function() {
				for (var particle = 0; particle < particles.length; particle++) {
					graphics.drawImage(particles[particle]);
				}
			};
		};
		spec.image.src = imageSrc;

		//------------------------------------------------------------------
		//
		// This creates one new particle
		//
		//------------------------------------------------------------------
		function create() {
			var p = {
					image: spec.image,
					size: Random.nextRange(spec.size.max, spec.size.min),
					center: {x: spec.center.x + Random.nextRange(-spec.areaWidth / 2, spec.areaWidth/2)
						, y: spec.center.y + Random.nextRange(-spec.areaHeight/2, spec.areaHeight)},
					direction: {x: 0, y: 1},
					speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
					rotation: 0,
					lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
					alive: 0	// How long the particle has been alive, in seconds
				};

			//
			// Ensure we have a valid size - gaussian numbers can be negative
			p.size = Math.max(1, p.size);
			//
			// Same thing with lifetime
			p.lifetime = Math.max(0.01, p.lifetime);
			//
			// Assign a unique name to each particle
			particles.push(p);
		};

		//------------------------------------------------------------------
		//
		// Update the state of all particles.  This includes remove any that
		// have exceeded their lifetime.
		//
		//------------------------------------------------------------------
		that.update = function(elapsedTime) {
			var removeMe = [];

			//
			// We work with time in seconds, elapsedTime comes in as milliseconds
			elapsedTime = elapsedTime / 1000;

			for (var particle = 0; particle < particles.length; particle++) {
				//
				// Update how long it has been alive
				particles[particle].alive += elapsedTime;

				//
				// Update its position
				particles[particle].center.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
				particles[particle].center.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);

				//
				// Rotate proportional to its speed
				particles[particle].rotation += particles[particle].speed / 500;

				//
				// If the lifetime has expired, identify it for removal
				if (particles[particle].alive > particles[particle].lifetime) {
					removeMe.push(particle);
				}
			}

			//
			// Remove all of the expired particles
			for (var particle = removeMe.length - 1; particle >= 0; particle--) {
				particles.splice(removeMe[particle], 1);
			}

			if(particles.length > 0){
				return true; //There are still particles to be rendered
			} else {
				return false; //No particles in this system, to be deleted.
			}
		};

		//------------------------------------------------------------------
		//
		// When a particle system is first created, this function is empty.
		// Once the texture for the particle system is loaded, this function
		// gets replaced with one that will actually render things.
		//
		//------------------------------------------------------------------
		that.render = function() {
		};

		var particleCount = Random.nextRange(spec.particleCount.min, spec.particleCount.max);
		for (var particle = 0; particle < particleCount; particle++) {
			create();
		}

		return that;
	}

	return that;
}(TowerDefense.graphics));
