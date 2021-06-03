class TableauIntro extends Phaser.Scene{
    constructor(){
      super("bootGame");
    }
  
    preload ()
    {
    
        this.load.image('ecrantitre', 'assets/title.png');
        //this.load.image('bouton', 'assets/bouton.png');
        
        
    }
  
    create()
    {
        
        this.EnterPressed = false;
        
        this.add.sprite(game.config.width/2, game.config.height/2, 'ecrantitre');

        this.input.keyboard.on('keydown-ENTER', function () //'keydown-SPACE', function () 
        {
            if (!this.EnterPressed & !this.SpacePressed)
            {    
                this.EnterPressed = true;
                this.cameras.main.fadeOut(1000, 0, 0, 0)
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => 
                {
                    this.game.scene.start(TableauTiled);
                    this.scene.start("jeu");
                })
            }

        }, this);
    }
}