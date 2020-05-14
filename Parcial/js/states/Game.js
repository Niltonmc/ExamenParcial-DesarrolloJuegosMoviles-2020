Game = function(game){}

Game.prototype = {

	create:function(){
		console.log("Juego Cargado");

		this.background = this.game.add.tileSprite(0,0,this.game.world.width,this.game.world.height,"sea");
		this.background.autoScroll(0,100);
		//this.background.moveAxis(0,100);

		this.explosionSound = this.game.add.audio('explosionSound');
		this.shootSound = this.game.add.audio('fireSound');

		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.player = new Player(this.game);
		
		/*
		this.player = this.game.add.sprite(0, 0,"player");
		this.player.anchor.setTo(0.5);

		this.player.x = this.world.centerX;
		this.player.y = this.world.centerY;

		this.player.animations.add("fly",[0,1,2],20,true);
		this.player.animations.play("fly");

		this.player.movement = {
			left: false,
			right: false,
			down: false,
			up: false,
			shoot: false};

		this.physics.arcade.enable(this.player);
		this.player.body.collideWorldBounds = true;
		*/

		this.keys = this.input.keyboard.createCursorKeys();

		this.bullets = this.add.group(); //POR SI NECESITO CREAR GRUPOS
		//this.bullets = [];

		this.playerLifes = 4;
		this.lifes = this.add.group();
		//this.lifes = [];

		this.powerups = this.add.group();
		//this.powerups = [];

		this.score = 0;
		
		this.maxScore = 0;

		this.gameOver= false;

		this.enemies = this.add.group();
		//this.enemies = [];

		this.style = {
			fill: "#FFF"
		};

		this.HUD();

		this.CreateControls();

		

		this.powerUpInterval = 0;
		this.enemyInterval = 0;
		this.shootInterval = 0;
	},

	createCursorKeys:function(){

	},

	HUD:function(){
		
		if(localStorage.score!=null){
			this.maxScore = parseInt(localStorage.score);
		}

		this.scoreText = this.add.text(0,0,'SCORE: 0',this.style);
		this.scoreText.x = this.game.width - 500;
		this.scoreText.y = this.scoreText.y + 10;
		
		this.maxScoreText = this.add.text(0,0,'MAX SCORE: ' + this.maxScore,this.style);
		this.maxScoreText.x = this.game.width - 300;
		this.maxScoreText.y = this.maxScoreText.y + 10;

		for(let i=0; i<this.playerLifes; ++i){
			let life = this.game.add.sprite(0,0,'player');
			life.anchor.setTo(0.5);
			life.index = i;
			life.x = life.width  * i + life.width/2;
			life.y = life.y + life.height/2;
			//this.lifes.push(life);
			this.lifes.add(life);
		}		
	},

	CreateControls:function(){

		this.btnShoot = this.game.add.sprite(900,650,'shoot');
		this.btnShoot.inputEnabled = true;
	
		this.btnShoot.events.onInputDown.add(function(){
			this.player.movement.shoot = true;
			//console.log(this.player.movement.shoot)
		},this);

		this.btnShoot.events.onInputUp.add(function(){
			this.player.movement.shoot = false;
			//console.log(this.player.movement.shoot)
		},this);


		this.left = this.game.add.sprite(30,650,'arrow');
		this.right = this.game.add.sprite(170,650,'arrow');
		this.up = this.game.add.sprite(100,600,'arrow');
		this.down = this.game.add.sprite(100,700,'arrow');
		this.left.inputEnabled = true;
		this.right.inputEnabled = true;
		this.down.inputEnabled = true;
		this.up.inputEnabled = true;

		this.left.events.onInputDown.add(function(){
			this.player.movement.left = true;
		},this);

		this.left.events.onInputUp.add(function(){
			this.player.movement.left = false;
		},this);


		this.right.events.onInputDown.add(function(){
			this.player.movement.right = true;
		},this);

		this.right.events.onInputUp.add(function(){
			this.player.movement.right = false;
		},this);


		this.down.events.onInputDown.add(function(){
			this.player.movement.down = true;
		},this);

		this.down.events.onInputUp.add(function(){
			this.player.movement.down = false;
		},this);


		this.up.events.onInputDown.add(function(){
			this.player.movement.up = true;
		},this);

		this.up.events.onInputUp.add(function(){
			this.player.movement.up = false;
		},this);
	},

	update:function(){

		if(this.gameOver){
			return;
		}

		this.powerUpInterval +=this.game.time.elapsed;
		this.enemyInterval +=this.game.time.elapsed;
		this.shootInterval += this.game.time.elapsed;

		if(this.powerUpInterval >= 10000 && this.playerLifes < 4){
			this.powerUpInterval = 0;
			this.CreatePowerUp();
		}

		
		if( (this.game.input.keyboard.isDown(Phaser.Keyboard.Z) 
			|| this.player.movement.shoot)
					&& this.shootInterval >=300){
			this.shootInterval = 0;
			this.Shoot();
		}

		if(this.enemyInterval >= 1000){
			this.enemyInterval = 0;
			this.CreateEnemy();
		}

		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		
		if(this.keys.left.isDown || this.player.movement.left){
			this.player.body.velocity.x = -300;
		}

		if(this.keys.right.isDown || this.player.movement.right){
			this.player.body.velocity.x = 300;
		}

		if(this.keys.up.isDown || this.player.movement.up){
			this.player.body.velocity.y = -300;
		}

		if(this.keys.down.isDown || this.player.movement.down){
			this.player.body.velocity.y = 300;
		}

		this.enemies.forEach(function(enemy){
			if(enemy.y >= this.game.height){
				enemy.kill();
			}
		},this);

		this.powerups.forEach(function(powerup){
			if(powerup.y >= this.game.height){
				powerup.kill();
			}
		},this);

		this.physics.arcade.overlap(this.player,this.enemies,
			this.ReduceLife,null,this);

		this.physics.arcade.overlap(this.bullets,this.enemies,
				this.DestroyEnemies,null,this);

		this.physics.arcade.overlap(this.player,this.powerups,
				this.GainLife,null,this);
	},

	GainLife:function(player, powerup){
		powerup.kill();
		if(this.playerLifes<4){
			this.playerLifes++;
			let life = this.lifes.getFirstDead();
			life.reset(life.width  * life.index + life.width/2,life.y);
		}
	},

	ReduceLife:function(player, enemy){
		this.ShowExplosion(enemy);
		enemy.kill();
		let life = this.lifes.getFirstAlive();
		//console.log(life);
		life.kill();
		this.playerLifes--;
		
		if(this.playerLifes == 0){
			this.gameOver = true;
			this.ShowExplosion(this.player);
			this.player.kill();
			this.enemies.killAll();
			this.powerups.killAll();

			let gameOverText = this.add.text(0,0,'GAME OVER',this.style);
			gameOverText.anchor.setTo(0.5);
			gameOverText.x = this.world.centerX;
			gameOverText.y = this.world.centerY;

			gameOverText.inputEnabled = true;

			gameOverText.events.onInputDown.add(function(){
				this.state.start("Game")
			},this);

			this.SaveScore();
		}
	},

	SaveScore:function(){
		if(localStorage.score != null){
			let temp = localStorage.score;
			if(temp<this.score){
				localStorage.score = parseInt(this.score);
			}
		}else{
			localStorage.score = parseInt(this.score);	
		}
	},

	DestroyEnemies:function(bullet, enemy){
		this.ShowExplosion(enemy);
		//console.log("entra a muerte");
		let types = ["greenEnemy","whiteEnemy","boss"];
		if(enemy.key == "greenEnemy"){
			this.score +=10;
			console.log(this.score);
		}
		if(enemy.key == "whiteEnemy"){
			this.score +=20;
			console.log(this.score);
		}
		if(enemy.key == "boss"){
			this.score +=40;
			console.log(this.score);
		}

		this.scoreText.text = "SCORE: " + this.score;

		bullet.kill();
		enemy.kill();
	},

	CreatePowerUp:function(){
		//console.log("CREA VIDA");
		let powerup = this.game.add.sprite(0,0,'player');
		powerup.scale.setTo(0.5);
		powerup.anchor.setTo(0.5);
		powerup.y = -powerup.height/2;
		powerup.x = this.game.rnd.between(powerup.width/2,
												this.game.width - (powerup.width / 2));
		this.physics.arcade.enable(powerup);
		this.powerups.add(powerup);
		powerup.body.velocity.y = 100;
	},

	Shoot:function(){
		//console.log("DISPARA");

		let bullet = this.bullets.getFirstDead();
		this.shootSound.play();

		if(bullet){
			bullet.reset(this.player.x,this.player.y);
			bullet.body.velocity.y = -200; 	
		}else{
			
			bullet = this.game.add.sprite(this.player.x,this.player.y,'bullet');
			this.bullets.add(bullet);
			bullet.scale.setTo(2);
			bullet.anchor.setTo(0.5);
			this.physics.arcade.enable(bullet);
			bullet.body.velocity.y = -200; 	
			bullet.checkWorldBounds = true;
			bullet.outOfBoundsKill  = true;
		}
	},

	CreateEnemy:function(){
		//console.log("CREA UN ENEMIGO");

		let types = ["greenEnemy","whiteEnemy","boss"];

		let key = this.game.rnd.between(0,2);
		//console.log(key);
		let enemy = this.enemies.getFirstDead();

		if(enemy){
			//console.log("hay enemigo");
			enemy.reset(0,-enemy.heigth/2);
		}else{
			//console.log("no hay enemigo");
			enemy = this.game.add.sprite(0,0,types[key]);
			enemy.key = types[key];
			enemy.anchor.setTo(0.5);
			enemy.y = -enemy.height/2;
			this.physics.arcade.enable(enemy);
			enemy.body.velocity.y = 200;
			enemy.animations.add("fly",[0,1,2],20,true);

			this.enemies.add(enemy);
		}
		enemy.animations.play("fly");

		enemy.x = this.game.rnd.between(enemy.width/2,
			this.game.width - (enemy.width / 2));
		
	},

	ShowExplosion:function(sprite){
		
		let explosion = this.game.add.sprite(sprite.x,sprite.y,'explosion');
		explosion.anchor.setTo(0.5);
		explosion.width = sprite.width;
		explosion.height = sprite.height;
		explosion.animations.add('boom');
		explosion.animations.play('boom',7,false,true);
		this.explosionSound.play();

	},
}