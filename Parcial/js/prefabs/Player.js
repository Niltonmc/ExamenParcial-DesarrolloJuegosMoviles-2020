Player = function(game){

	Phaser.Sprite.call(this,game,0,0,"player");
	this.game = game;
    this.anchor.setTo(0.5);
	this.x = this.game.world.centerX;
    this.y = this.game.world.centerY;

	this.animations.add("fly",[0,1,2],20,true);
	this.animations.play("fly");

	this.movement = {
		left: false,
		right: false,
		down: false,
		up: false,
        shoot: false
    };

    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

/*
Player.prototype.update = function(){
	if(this.body.velocity.y > -20){
		this.frame = 3;
	}else{
		this.animations.play("fly");
	}
}


Player.prototype.flap = function(jumpForce){
	this.body.velocity.y = jumpForce;
}
*/
