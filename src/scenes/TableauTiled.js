class TableauTiled extends Tableau{
    /**
     * Ce tableau démontre comment se servir de Tiled, un petit logiciel qui permet de designer des levels et de les importer dans Phaser (entre autre).
     *
     * Ce qui suit est très fortement inspiré de ce tuto :
     * https://stackabuse.com/phaser-3-and-tiled-building-a-platformer/
     *
     * Je vous conseille aussi ce tuto qui propose quelques alternatives (la manière dont son découpées certaines maisons notamment) :
     * https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
     */
    preload() {
        super.preload();
        // ------pour TILED-------------
        // nos images
        this.load.image('tiles', 'assets/Tiled/Tile_sheet2.png');
        //les données du tableau qu'on a créé dans TILED
        this.load.tilemapTiledJSON('map', 'assets/TiledMap/MapVibe.json');

        // -----et puis aussi-------------
        this.load.image('ciel', 'assets/ciel.png');
        this.load.image('monster-fly', 'assets/Burt.png');
        this.load.image('night', 'assets/Fond.png');
        this.load.image('Burt', 'assets/EnnemiVibe.png');

        this.load.image('tir', 'assets/Attack.png');

        //collectible
        this.load.image('plume', 'assets/plume.png');

        //atlas de texture généré avec https://free-tex-packer.com/app/
        //on y trouve notre étoiles et une tête de mort
    }
    create() {
        super.create();

        //on en aura besoin...
        let ici=this;

        //--------chargement de la tile map & configuration de la scène-----------------------

        //notre map
        this.map = this.make.tilemap({ key: 'map' });
        //nos images qui vont avec la map
        this.tileset = this.map.addTilesetImage('Tile_sheet2', 'tiles');

        //on agrandit le champ de la caméra du coup
        let largeurDuTableau=this.map.widthInPixels;
        let hauteurDuTableau=this.map.heightInPixels;
        this.physics.world.setBounds(0, 0, largeurDuTableau,  hauteurDuTableau);
        this.cameras.main.setBounds(0, 0, largeurDuTableau, hauteurDuTableau);
        this.cameras.main.startFollow(this.player, true, 1, 1);

        //---- ajoute les plateformes simples ----------------------------

        this.solide = this.map.createLayer('sol', this.tileset, 0, 0);
        this.decor = this.map.createLayer('décor', this.tileset, 0, 0);
        this.plat = this.map.createLayer('platformes', this.tileset, 0, 0);


        //on définit les collisions, plusieurs méthodes existent:

        this.solide.setCollisionByProperty({ collides: true });
        this.plat.setCollisionByProperty({ collides: true });


        // 2 manière la plus simple (là où il y a des tiles ça collide et sinon non)
        this.solide.setCollisionByExclusion(-1, true);
        this.plat.setCollisionByExclusion(-1, true);


        //----------les étoiles (objets) ---------------------

        // c'est un peu plus compliqué, mais ça permet de maîtriser plus de choses...
        this.stars = this.physics.add.group({
            allowGravity: true,
            immovable: false,
            bounceY:1
        });
        //this.starsObjects = this.map.getObjectLayer('stars')['objects'];
        // On crée des étoiles pour chaque objet rencontré
        // this.starsObjects.forEach(starObject => {
        //     // Pour chaque étoile on la positionne pour que ça colle bien car les étoiles ne font pas 64x64
        //     let star = this.stars.create(starObject.x+32, starObject.y-64, 'star');
        // });


        //----------les monstres volants (objets tiled) ---------------------

        this.monstersContainer=this.add.container();
        ici.monstreTestObject = this.map.getObjectLayer('mob1')['objects'];
        // On crée des montres volants pour chaque objet rencontré
        ici.monstreTestObject.forEach(monsterObject => {
            let monster=new Burt(this,monsterObject.x,monsterObject.y);
            this.monstersContainer.add(monster);
            this.physics.add.collider(monster, this.solide);
        });

        this.plightContainer=this.add.container();
        ici.plight = ici.map.getObjectLayer('ligths')['objects'];
        ici.plight.forEach(plightObjects => {
          let light = new Light(this,plightObjects.x+16,plightObjects.y-10).setDepth(9999);
          light.addLight(this,204,229,151, 200, 0.5, 0.04,false);
          this.plightContainer.add(light);
        });


        //----------débug---------------------
        
        //pour débugger les collisions sur chaque layer
        let debug=this.add.graphics().setAlpha(this.game.config.physics.arcade.debug?0.75:0);
        if(this.game.config.physics.arcade.debug === false){
            debug.visible=false;
        }


        //---------- parallax ciel (rien de nouveau) -------------

        //on change de ciel, on fait une tileSprite ce qui permet d'avoir une image qui se répète
        this.ciel=this.add.tileSprite(
            0,
            0,
            this.sys.canvas.width,
            this.sys.canvas.height,
            'ciel'
        );
        
        this.ciel.setOrigin(0,0);
        this.ciel.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
        // this.sky2.blendMode=Phaser.BlendModes.ADD;

        // this.sky=this.add.tileSprite(
        //     0,
        //     0,
        //     this.sys.canvas.width,
        //     this.sys.canvas.height,
        //     'night'
        // );
        // this.sky2=this.add.tileSprite(
        //     0,
        //     0,
        //     this.sys.canvas.width,
        //     this.sys.canvas.height,
        //     'night'
        // );

        // this.sky.setOrigin(0,0);
        // this.sky2.setOrigin(0,0);
        // this.sky.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
        // this.sky2.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
        // this.sky2.blendMode=Phaser.BlendModes.ADD;

        //----------collisions---------------------

        //quoi collide avec quoi?
        this.physics.add.collider(this.player, this.solide);
        this.physics.add.collider(this.player, this.plat);

        this.physics.add.collider(this.viniles, this.solide);
        //si le joueur touche une étoile dans le groupe...
        this.physics.add.overlap(this.player, this.viniles, this.ramasserEtoile, null, this);
        //quand on touche la lave, on meurt
        this.physics.add.collider(this.player, this.lave,this.playerDie,null,this);

        //--------- Z order -----------------------

        //on définit les z à la fin
        let z=1000; //niveau Z qui a chaque fois est décrémenté.
        debug.setDepth(z--);
        //this.boom.setDepth(z--);
        this.monstersContainer.setDepth(z--);

        vinileContainer.setDepth(z--);
        //this.viniles.setDepth(z--);
        //starsFxContainer.setDepth(z--);
        this.plat.setDepth(z--);
        this.solide.setDepth(z--);
        //this.solides.setDepth(z--);
        //this.laveFxContainer.setDepth(z--);
        //this.lave.setDepth(z--);
        this.player.setDepth(z--);
        this.plightContainer.setDepth(z--);

        this.decor.setDepth(z--);
        //this.derriere.setDepth(z--);
        this.ciel.setDepth(z--);
        // this.sky2.setDepth(z--);
        // this.sky.setDepth(z--);


    }

    /**
     * Permet d'activer, désactiver des éléments en fonction de leur visibilité dans l'écran ou non
     */
    optimizeDisplay(){
        //return;
        let world=this.cameras.main.worldView; // le rectagle de la caméra, (les coordonnées de la zone visible)

    }

    /**
     * Fait se déplacer certains éléments en parallax
     */
    moveParallax(){
        //le ciel se déplace moins vite que la caméra pour donner un effet paralax
        // this.sky.tilePositionX=this.cameras.main.scrollX*0.6;
        // this.sky.tilePositionY=this.cameras.main.scrollY*0.6;
        this.ciel.tilePositionX=this.cameras.main.scrollX*0.6;
        this.ciel.tilePositionY=this.cameras.main.scrollY*0.6;
        // this.sky2.tilePositionX=this.cameras.main.scrollX*0.7+100;
        // this.sky2.tilePositionY=this.cameras.main.scrollY*0.7+100;
    }


    update(){
        super.update();
        this.moveParallax();

        //optimisation
        //teste si la caméra a bougé
        let actualPosition=JSON.stringify(this.cameras.main.worldView);
        if(
            !this.previousPosition
            || this.previousPosition !== actualPosition
        ){
            this.previousPosition=actualPosition;
            this.optimizeDisplay();
        }
    }




}
