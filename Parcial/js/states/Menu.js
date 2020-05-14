Menu = function(game){}

Menu.prototype = {
	create:function(){
		console.log("Menu Cargado Exitosamente");

		let background = this.add.sprite(0,0,"titlepage");
		background.inputEnabled = true;
		background.events.onInputDown.add(this.GoGame, this)

	},

	GoGame:function(){
		console.log("Envia la carga de game");
		this.state.start("Game")
	}
}