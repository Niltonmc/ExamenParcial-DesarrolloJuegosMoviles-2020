Preload = function(game){}

Preload.prototype = {

	preload:function(){

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.load.image('titlepage', 'assets/titlepage.png');

		this.load.audio("explosionSound",["assets/explosion.ogg","assets/explosion.wav"])
		this.load.audio("fireSound",["assets/enemy-fire.ogg","assets/enemy-fire.wav"])
	


		this.load.image('arrow', 'assets/arrowButton.png');
		this.load.image('shoot', 'assets/actionButton.png');
		this.load.image('sea', 'assets/sea.png');
		this.load.image('bullet', 'assets/bullet.png');
		this.load.image('enemyBullet', 'assets/enemy-bullet.png');
		this.load.image('powerup1', 'assets/powerup1.png');
		


		this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32, 4);
		this.load.spritesheet('whiteEnemy', 'assets/shooting-enemy.png', 32, 32,4);
		this.load.spritesheet('boss', 'assets/boss.png', 93, 75, 4);
		this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32, 6);
		this.load.spritesheet('player', 'assets/player.png', 64, 64, 4);

	},

	create:function(){
		this.state.start("Menu");
	}

}