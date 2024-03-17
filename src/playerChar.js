import Phaser from 'phaser'

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class PlayerChar extends Phaser.GameObjects.Sprite{

    name;

    class;

    maxHp;
    currentHp;

    movementRange;

    armorType;

    apt;

    luck;
    inteligence;
    strength;
    desterity;

    spriteIndex;

    constructor(charData, scene) {
        super(scene, 0,0,'characters_sp');
        this.name = charData.name;
        this.maxHp = charData.maxHp;
        this.currentHp= charData.maxHp;

        this.movementRange= charData.movementRange;

        this.armorType= charData.armorType;

        this.apt= charData.apt;

        this.luck= charData.luck;
        this.inteligence= charData.inteligence;
        this.strength= charData.strength;
        this.desterity= charData.desterity;

        this.spriteIndex = charData.spriteIndex
        this.setVisible(true)
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('characters_sp', { start: 0, end: 1}),
            frameRate: 2, // Velocidad de la animación
            repeat: -1    // Animación en bucle
            });
       
    }
    /**
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t,dt)
    }

    desplegar(targetVec){
        this.scene.add.existing(this);
        this.x= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
        this.y= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom();
        this.setScale(1,1);
        console.log("Desplegando " +this.name +" en " + this.x + " " + this.y);
    }

}
