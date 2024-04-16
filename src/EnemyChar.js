import Phaser from 'phaser'
import { neigbours, frontNeigbours } from '../constants';
import { CombatManager } from './CombatScene/combatManager.js';

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
    mov_range;
    mov_remaining;
    attackRange;
    spriteIndex;
    

    constructor(enemyData, scene, targetVec) {
        super(scene, targetVec.x,targetVec.y,'enemies_sp');
        this.name = enemyData.name;
        this.maxHp = enemyData.maxHp;
        this.currentHp = enemyData.maxHp;
        this.movementRange = enemyData.mov_Range
        this.mov_remaining = enemyData.movementRange
        this.spriteIndex = enemyData.spriteIndex*8
        this.scene.add.existing(this);
        this.setVisible(true)
   //     this.mover(targetVec)
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
            this.play("idle_"+this.name);
    }
    
    /**
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t,dt)
    }

    mover(targetVec){
     //   this.orientaPersonajeyPlayAnimation('idle',targetVec)
        this.tileX=targetVec.x;
        this.tileY=targetVec.y;
        this.x= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
        this.y= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom();

        

        this.setDepth(this.tileX+this.tileY)

    }
    getTileXY(){
        return {x:this.tileX, y:this.tileY}
    }

    setSeleccionado(){
        this.play('atack_'+this.name)
        this.playAfterDelay('idle_'+this.name,1000)
    }

    isAlieve(){
        return this.currentHp > 0;
    }
    //Si no tiene personaje a rango, se mueve, si tiene personaje a rango, ataca.
    takeTurn(targetVec){
        if(this.mov_remaining > 0){
            this.check
        }

    }
}
