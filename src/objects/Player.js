class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y) {
        super(scene, x, y, "player")
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)
        this.setBounce(0);
        this.setGravityY(700)
        this.setFriction(1,1);
        this.setDisplaySize(70,100)
        this.setBodySize(this.body.width,this.body.height);
        this.setOffset(0, 0);
        this.rechargeSonTir = false;

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'back',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'stance',
            frames: [ { key: 'player', frame: 5 } ],
            // frameRate: 3,
            // repeat: -1
        });

        this._directionX=0;
        this._directionY=0;


    }

    set directionX(value){
        this._directionX=value;
    }
    set directionY(value){
        this._directionY=value;
    }

    /**
     * arrête le joueur
     */
    stop(){
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.directionY=0;
        this.directionX=0;
    }

    /**
     * Déplace le joueur en fonction des directions données
     */
    move(){
        switch (true){
            case this._directionX<0:
                this.sens=-1;
                this.setVelocityX(-500);
                this.anims.play('left', true);
                break;
            case this._directionX>0:
                this.sens=1;
                this.setVelocityX(500);
                this.anims.play('right', true);
                break;
            default:
                this.setVelocityX(0);
                this.anims.play('stance', true);
                this.anims.play(this.sens===-1 ? 'back' : 'stance' ,true);
        }

        if(this._directionY<0){
            if(this.body.blocked.down){
                this.setVelocityY(-800);
                
            }
        }


    }

    shoot()
    {
        

        if(this.rechargeSonTir === false) {
            this.rechargeSonTir = true;
            var bullet = new Tir(this.scene,this.x, this.y);
            console.log("Tir");
            setTimeout(function(){
                bullet.destroy();
            },1500);
            setTimeout(function () {
                Tableau.current.player.rechargeSonTir = false;
            }, 900);
        }
    }


}