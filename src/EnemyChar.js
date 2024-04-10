import Phaser from 'phaser'

/**
 * Clase que representa al enemigo del juego. El enemigo se mueve aleatoriamente por el mapa.
 */
export default class EnemyChar extends Phaser.GameObjects.Sprite{

    name;
    tileX;
    tileY;
    class;
    maxHp;
    currentHp;
    spriteIndex;
    

    constructor(enemyData, scene) {
        super(scene, 0,0,'enemies_sp');
        this.name = enemyData.name;
        this.maxHp = enemyData.maxHp;
        this.currentHp = enemyDato.maxHp;
        this.spriteIndex = charData.spriteIndex*8
        this.setVisible(true)
        this.anims.create({
            key: 'idle_'+this.name,
            frames: this.anims.generateFrameNumbers('enemies_sp', { start: this.spriteIndex, end: (this.spriteIndex+1)}),
            frameRate: 2, // Velocidad de la animación
            repeat: -1    // Animación en bucle
            });
        this.anims.create({
            key: 'atack_'+this.name,
            frames: this.anims.generateFrameNumbers('enemies_sp', { start:( this.spriteIndex+2), end: (this.spriteIndex+3)}),
            frameRate: 2, // Velocidad de la animación
            repeat: 0    // Animación en bucle
            });
        this.anims.create({
                key: 'idleBack_'+this.name,
                frames: this.anims.generateFrameNumbers('enemies_sp', { start: (this.spriteIndex+4), end: (this.spriteIndex+5)}),
                frameRate: 2, // Velocidad de la animación
                repeat: -1    // Animación en bucle
                });
        this.anims.create({
            key: 'atackBack_'+this.name,
            frames: this.anims.generateFrameNumbers('enemies_sp', { start: (this.spriteIndex+6), end: (this.spriteIndex+7)}),
            frameRate: 2, // Velocidad de la animación
            repeat: 1    // Animación en bucle
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
        //this.mover(targetVec)
        this.setScale(1,1);
        console.log("Desplegando " +this.name +" en " + this.x + " " + this.y);
        this.play('idle_'+this.name);
    }

    // mover(targetVec){
    //     this.tileX=targetVec.x;
    //     this.tileY=targetVec.y;
    //     this.x= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
    //     this.y= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom();
    // }
    getTileXY(){
        return {x:this.tileX, y:this.tileY}
    }

    setSeleccionado(){
        this.play('atack_'+this.name)
        this.playAfterDelay('idle_'+this.name,1000)
    }
}
