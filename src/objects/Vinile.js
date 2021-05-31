class Vinile extends ObjetPhysique{
    /**
     * Un oiseau qui vole et fait des allez -retours
     * @param {Tableau} scene
     * @param x
     * @param y
     */
    constructor(scene, x, y) {
        super(scene, x, y, "vinile");
        this.setDisplaySize(33,36);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.allowGravity=false;
        this.setBounceY(0);

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('vinile', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });

        let me=this;
        this.anims.play('right', true);
    }
}