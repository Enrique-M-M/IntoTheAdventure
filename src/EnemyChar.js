import Phaser from 'phaser'
import { crossNeigbours, indexBadTileBackground } from './constants';

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

    lookingBackward;
    

    constructor(enemyData, scene, targetVec, flipX, lookingBackward) {
        super(scene, targetVec.x,targetVec.y,'enemies_sp');
        this.name = enemyData.name;
        this.maxHp = enemyData.maxHp;
        this.currentHp = enemyData.maxHp;
        this.movementRange = enemyData.mov_Range
        this.mov_remaining = enemyData.movementRange
        this.spriteIndex = enemyData.spriteIndex*8
        this.scene.add.existing(this);
        this.createAnims()
        this.createUIEnemy()

        this.setVisible(true)
        this.setFlipX(flipX)
        console.log(targetVec.x, targetVec.y);
        this.lookingBackward= lookingBackward
        this.mover(targetVec)
        
    }
    
    /**
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t,dt)
    }
    createAnims(){
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

    createUIEnemy(){
        this.barraVida = this.scene.add.sprite(this.x,this.y+ 5,'ui_barraVida',0)
        this.barraVidaEx = this.scene.add.sprite(this.x,this.y+ 5,'ui_barraVida_ex',0)
        this.barraVida.setDepth(this.depth+1)
        this.barraVidaEx.setDepth(this.depth+2)
        this.barraVida.setScale(0.6,0.3)
        this.barraVidaEx.setScale(0.7,0.3)
    }
    orientaPersonajeyPlayAnimation(nameAnim, targetVec = null){
        if(targetVec != null){
            if(targetVec.x < this.tileX){
                this.lookingBackward = true;
                this.setFlipX(true)
            } else if(targetVec.x > this.tileX){
                this.lookingBackward = false;
                this.setFlipX(false)
            } else if(targetVec.y < this.tileY){
                this.lookingBackward = true;
                this.setFlipX(false)
            } else if(targetVec.y > this.tileY){
                this.lookingBackward = false;
                this.setFlipX(true)
            }
        }

        switch(nameAnim){
            case 'idle':
                if(!this.lookingBackward){
                        this.play('idle_'+this.name)
                } else {
                        this.play('idleBack_'+this.name)
                    }
                break
            case 'atack':
                if(!this.lookingBackward){
                        this.play('atack_'+this.name)
                } else {
                        this.play('atackBack_'+this.name)
                }
        }
    }

    mover(targetVec){
        this.orientaPersonajeyPlayAnimation('idle',targetVec)
        this.tileX=targetVec.x;
        this.tileY=targetVec.y;
        this.x= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
        this.y= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom();
        this.barraVida.x = this.x
        this.barraVida.y = this.y + 7
        this.barraVidaEx.x = this.x
        this.barraVidaEx.y = this.y + 7

        this.setDepth(this.tileX+this.tileY)
        this.barraVida.setDepth(this.depth+1)
        this.barraVidaEx.setDepth(this.depth+2)

    }
    getTileXY(){
        return {x:this.tileX, y:this.tileY}
    }

    setSeleccionado(){
        this.play('atack_'+this.name)
        this.playAfterDelay('idle_'+this.name,1000)
    }

    isAlive(){
        return this.currentHp > 0;
    }
    //Si no tiene personaje a rango, se mueve, si tiene personaje a rango, ataca.
    takeTurn(){
        const matrizpath = this._generarPathfinding(targetVec);
        const listaCasillas = generarCamino(targetVec,matrizpath);
        this._recorrerCamino(listaCasillas);
    }
    _generarPathfinding(targetVec) {
        // Crear matriz de 8x8 inicializada con valores de -1
        const matriz = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => -1));
    
        // Función auxiliar para verificar si una celda está dentro de los límites del mapa
        function estaEnMapa(x, y) {
            return x >= 0 && x < 8 && y >= 0 && y < 8;
        }
    

        matriz[targetVec.x][targetVec.y] = 0;
    
       
            for (const [dx, dy] of crossNeigbours) {
                if(!indexBadTileBackground.find(i => i === this.capaSuelo.getTileAt(newVec.x, newVec.y, true).index)){
                const nx = x + dx;
                const ny = y + dy;
    
                    if (estaEnMapa(nx, ny) && matriz[nx][ny] === -1) {
                        matriz[nx][ny] = matriz[x][y] + 1;

                    }
                }
            
            }
    
        return matriz;
    }   

    //Generamos el camino hacia el objetivo.
    _generarCamino(targetVec, matrizPath){
        const cola = [[targetVec.x, targetVec.y]];
        for (const [dx, dy] of crossNeigbours) {
            const nx = x + dx;
            const ny = y + dy; 
            if (estaEnMapa(nx, ny) && matrizPath[targetVec.x][targetVec.y] > matrizPath[nx][ny] && matrizPath[nx][ny] !== -1)  {
                cola.push({x: nx, y: ny});  
                targetVec.x = nx;
                targetVec.y = ny;  
            }
           
        }
        return cola;
    }
    //recorremos el camino
    _recorrerCamino(colaCasillas){
        for(let i = 0; i < this.mov_remaining; i++){
            this.mover(colaCasillas[i]);
        }
        _resetMov();
    }

    //reset de rango
    _resetMov(){
        this.mov_remaining=this.mov_range;
    }
}