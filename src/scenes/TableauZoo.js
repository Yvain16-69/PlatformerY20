class TableauZoo extends Tableau{

    preload() {
        super.preload();
        this.load.image('star', 'assets/Pièces.png');
        this.load.image('monster-violet', 'assets/Bandana-Dee.png');
        this.load.image('Burt', 'assets/Burt.png');
        this.load.image('kirby', 'assets/kib8b.png');
    }
    create() {
        super.create();
        //quelques étoiles
        let largeur=64*2;
        this.stars=this.physics.add.group();
        for(let posX=largeur/2;posX<largeur*7;posX+=largeur){
            this.stars.create(posX ,0,"star");
        }
        this.stars.children.iterate(function (child) {
            child.setBounce(1);
            child.setGravity(1);
            child.setCollideWorldBounds(true);
            child.setVelocity( 0,Phaser.Math.Between(-100, 100));
            child.setMaxVelocity(0,500);
        });
        this.physics.add.overlap(this.player, this.stars, this.ramasserEtoile, null, this);

        //notre monstre
        this.monstre=this.physics.add.sprite(300,this.sys.canvas.height-70,"monster-violet");
        this.monstre.setOrigin(0,0);
        this.monstre.setDisplaySize(80,80);
        this.monstre.setCollideWorldBounds(true);
        this.monstre.setBounce(1.1);
        this.monstre.setVelocityX(150);
        this.physics.add.overlap(this.player, this.monstre, this.hitSpike, null, this);

        /**notre monstre
        this.monstre=this.physics.add.sprite(300,this.sys.canvas.height-70,"kirby");
        this.monstre.setOrigin(90,0);
        this.monstre.setDisplaySize(80,80);
        this.monstre.setCollideWorldBounds(true);
        this.monstre.setBounce(1);
        this.monstre.setVelocityX(50);
        this.physics.add.overlap(this.player, this.monstre, this.hitSpike, null, this);**/


        new Kirby(this,380,400);
        new Burt(this,400,100);
        new Burt(this,600,100);


    }

}
