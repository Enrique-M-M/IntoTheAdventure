import Phaser from 'phaser'
import { CombatManager } from './combatManager';


export default class PlayerChar extends Phaser.GameObjects.Sprite{

    name;
    tileX;
    tileY;

    class;

    maxHp;
    currentHp;

    movementRange;

    armorType;

    apt;

    suerte;
    inteligence;
    strength;
    desterity;

    spriteIndex;
    selectSpriteIndex;
    ui_icon;

    arma;
    armaduraSup;
    armaduraInf;
    amuleto;

    desplegado
    seleccionado

    acciones

    lookingBackward
    constructor(charData, scene) {
        super(scene, 0,0,'characters_sp');
        this.name = charData.name;
        this.maxHp = charData.maxHp;
        this.currentHp= charData.maxHp;

        this.movementRange= charData.movementRange;

        this.armorType= charData.armorType;

        this.apt= charData.apt;

        this.suerte= charData.suerte;
        this.inteligence= charData.inteligence;
        this.strength= charData.strength;
        this.desterity= charData.desterity;

        this.spriteIndex = charData.spriteIndex*8
        this.selectSpriteIndex = this.spriteIndex + 64
        this.seleccionado = false;
        this.desplegado = false;
        this.ui_icon = charData.ui_index
        this.lookingBackward = false

        this.danoBasico = 18

        //Acciones de personaje prototipo
        this.acciones = {Mover:{nombre: 'mover', rango: this.movementRange, accion: (targetVec) => this.mover(targetVec), tipoSeleccion: 'Movimiento' }, AtaqueBasico: {nombre: 'atacar', objetivo: 'enemy' , rango: 1, area: 1, accion: (targetVec) => this.hacerDano(targetVec) , tipoSeleccion: 'Habilidad'} }

        this.setVisible(true)
        this.anims.create({
            key: 'idle_'+this.name,
            frames: this.anims.generateFrameNumbers('characters_sp', { start: this.spriteIndex, end: (this.spriteIndex+1)}),
            frameRate: 2, // Velocidad de la animación
            repeat: -1    // Animación en bucle
            });
        this.anims.create({
            key: 'atack_'+this.name,
            frames: this.anims.generateFrameNumbers('characters_sp', { start:( this.spriteIndex+2), end: (this.spriteIndex+3)}),
            frameRate: 3, // Velocidad de la animación
            repeat: 0    // Animación en bucle
            });
        this.anims.create({
                key: 'idleBack_'+this.name,
                frames: this.anims.generateFrameNumbers('characters_sp', { start: (this.spriteIndex+4), end: (this.spriteIndex+5)}),
                frameRate: 2, // Velocidad de la animación
                repeat: -1    // Animación en bucle
                });
        this.anims.create({
            key: 'atackBack_'+this.name,
            frames: this.anims.generateFrameNumbers('characters_sp', { start: (this.spriteIndex+6), end: (this.spriteIndex+7)}),
            frameRate: 3, // Velocidad de la animación
            repeat: 0    // Animación en bucle
            });
        this.anims.create({
            key: 'idle_s_'+this.name,
            frames: this.anims.generateFrameNumbers('characters_sp', { start: this.selectSpriteIndex, end: (this.selectSpriteIndex+1)}),
            frameRate: 2, // Velocidad de la animación
            repeat: -1    // Animación en bucle
            });
        this.anims.create({
            key: 'atack_s_'+this.name,
            frames: this.anims.generateFrameNumbers('characters_sp', { start:( this.selectSpriteIndex+2), end: (this.selectSpriteIndex+3)}),
            frameRate: 3, // Velocidad de la animación
            repeat: 0    // Animación en bucle
            });
        this.anims.create({
                key: 'idleBack_s_'+this.name,
                frames: this.anims.generateFrameNumbers('characters_sp', { start: (this.selectSpriteIndex+4), end: (this.selectSpriteIndex+5)}),
                frameRate: 2, // Velocidad de la animación
                repeat: -1    // Animación en bucle
                });
        this.anims.create({
            key: 'atackBack_s_'+this.name,
            frames: this.anims.generateFrameNumbers('characters_sp', { start: (this.selectSpriteIndex+6), end: (this.selectSpriteIndex+7)}),
            frameRate: 2, // Velocidad de la animación
            repeat: 0    // Animación en bucle
            });
       
    }
    /**
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t,dt)
    }

    desplegar(targetVec, index){
        this.scene.add.existing(this);
        this.setScale(1,1);
        console.log("Desplegando " +this.name +" en " + this.x + " " + this.y);
        this.scene.botonesPersonajes[index].activar()
        this.barraVida = this.scene.add.sprite(this.x,this.y + 8,'ui_barraVida',0)
        this.barraVidaEx = this.scene.add.sprite(this.x,this.y + 8,'ui_barraVida_ex',0)
        this.barraVida.setDepth(this.depth-1)
        this.barraVidaEx.setDepth(this.depth)
        this.barraVida.setScale(0.8,0.5)
        this.barraVidaEx.setScale(0.8,0.5)

        
        this.orientaPersonajeyPlayAnimation('idle')

        this.mover(targetVec)
        this.desplegado = true
    }

    mover(targetVec){
        this.orientaPersonajeyPlayAnimation('idle',targetVec)
        this.tileX=targetVec.x;
        this.tileY=targetVec.y;
        this.x= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
        this.y= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom();

        

        this.setDepth(this.tileX+this.tileY)

        this.barraVida.setX(this.x)
        this.barraVida.setY(this.y -8)
        this.barraVidaEx.setX(this.x)
        this.barraVidaEx.setY(this.y-8)
        this.barraVida.setDepth(this.depth+20)
        this.barraVidaEx.setDepth(this.depth+20)
    }

    ataqueBasico(targetVec){
        console.log("Ataque en " + targetVec.x+ " "+ targetVec.y)
        //this.scene.getEnemyAt(targetVec).recibirAtaque(1)
    }
    getTileXY(){
        return {x:this.tileX, y:this.tileY}
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
                    if(this.seleccionado){
                        this.play('idle_s_'+this.name)
                    } else{
                        this.play('idle_'+this.name)
                    }
                } else {
                    if(this.seleccionado){
                        this.play('idleBack_s_'+this.name)
                    } else{
                        this.play('idleBack_'+this.name)
                    }
                }
                break
            case 'atack':
                if(!this.lookingBackward){
                    if(this.seleccionado){
                        this.play('atack_s_'+this.name)
                    } else{
                        this.play('atack_'+this.name)
                    }
                } else {
                    if(this.seleccionado){
                        this.play('atackBack_s_'+this.name)
                    } else{
                        this.play('atackBack_'+this.name)
                    }
                }
        }
    }
    

    setSeleccionado(val){
        console.log('selecciona '+ this.name + ' seleccionado ' + this.seleccionado)
        if(val !== this.seleccionado) {
            this.seleccionado = val
            if(val){
                this.setScale(1.2,1.2)  
            }else{
                this.setScale(1,1)
            }
        }
        this.orientaPersonajeyPlayAnimation('idle')
    }

    hacerDano(targetVec){
        //this.scene.combatManager.getEnemyAt(targetVec).recibeDano(this.danoBasico)ç
        this.orientaPersonajeyPlayAnimation('atack', targetVec)
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE , 
            () => {
             this.orientaPersonajeyPlayAnimation('idle') })
    }

    recibeDano(num){
        this.currentHp - num
        if(this.currentHp <= 0)
            this.muere()
    }

    muere(){
        this.scene.personajeMuerto(this)
        this.setVisible(false)
    }
    getUi_icon(){return this.ui_icon}

    setAlpha(val){
        this.alpha = val
        this.barraVida.alpha = val
        this.barraVidaEx.alpha= val
    }
}
