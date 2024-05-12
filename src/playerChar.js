import Phaser from 'phaser'
import { CombatManager } from './CombatScene/combatManager';
import { catalogoObjetos } from '../assets/CharactersInfo/ObjectsDATA';

/*
Personaje del Jugagor
*/

export default class PlayerChar extends Phaser.GameObjects.Sprite{
    name;
    tileX;
    tileY;

    class;

    maxHp;
    currentHp;

    movementRange;

    armorType;

    maxApt;
    currentApt

    suerte;
    inteligence;
    strength;
    desterity;

    spriteIndex;
    selectSpriteIndex;
    ui_icon;

    desplegado
    seleccionado

    acciones

    inventario
        /* 
        arma;
        armaduraSup;
        armaduraInf;
        amuleto;
        */

    lookingBackward

    //Datos a modificar por el Arma equipada
    danoBasico 
    areaBasico
    rangoBasico
    gastoAPTBasico

    indexCombatManager

    mejorasAplicadas

    //-------------------- Constructor, setters y getters ---------------------
    constructor(charData, scene, x, y) {
        super(scene, x ,y ,'characters_sp');
        this.name = charData.name;
        this.maxHp = charData.maxHp;
        this.currentHp= charData.maxHp;

        this.movementRange= charData.movementRange;

        this.armorType= charData.armorType;

        this.maxApt= charData.apt;
        this.currentApt = charData.apt;

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
        this.rangoBasico = 2
        this.areaBasico = 2
        this.gastoAPTBasico = 1

        this.freeExPoint = charData.freeExPoint
        this.mejorasAplicadas = charData.mejorasAplicadas

        this.inventario = charData.inventario

        this.reduccionDmg = 0

        this.arma = catalogoObjetos.armas[this.inventario.arma]
        this.armaduraSup = catalogoObjetos.armadurasSup[this.inventario.armaduraSup]
        this.armaduraInf = catalogoObjetos.armadurasInf[this.inventario.armaduraInf]
        this.amuleto = catalogoObjetos.amuletos[this.inventario.amuleto]
        //Acciones de personaje prototipo
        this.acciones = {Mover:{nombre: 'mover', rango: this.movementRange, accion: (areaSeleccion) => {if(this.realizarAccion(this.gastoAPTBasico)) this.mover(areaSeleccion[0])}, tipoSeleccion: 'Movimiento', index: 1 },
         AtaqueBasico: {nombre: 'atacar', objetivo: 'enemy' , rango: this.arma.rango, area: this.arma.area, accion: (areaSeleccion) =>{if(this.realizarAccion(this.arma.gastoAPT)) this.ataqueBasico(areaSeleccion) }, tipoSeleccion: 'Habilidad', index:3} }
         this.equiparObjetos()

        this.setVisible(true)
        this.crearAnimaciones()
       
    }
    
    equiparObjetos(){
        let addedHp = 0
        if(this.inventario.armaduraSup != -1){
            addedHp+=this.armaduraSup.hp
            this.reduccionDmg += this.armaduraSup.rdmg
        }
        if(this.inventario.armaduraInf != -1){
            addedHp+=this.armaduraInf.hp
            this.reduccionDmg += this.armaduraInf.rdmg
        }
        this.maxHp += addedHp
        this.currentHp += addedHp
        if(this.inventario.amuleto != -1){

        }
    }

    desequiparObjetos(){
        let addedHp = 0
        if(this.inventario.armaduraSup != -1){
            addedHp+=this.armaduraSup.hp
            this.reduccionDmg += this.armaduraSup.rdmg
        }
        if(this.inventario.armaduraInf != -1){
            addedHp+=this.armaduraInf.hp
            this.reduccionDmg += this.armaduraInf.rdmg
        }
        this.maxHp += addedHp
        this.currentHp += addedHp
        if(this.inventario.amuleto != -1){
            
        }
    }
    getData(){
        this.desequiparObjetos()
        return{name: this.name, maxHp: this.maxHp, movementRange: this.movementRange,
        armorType: this.armorType, apt: this.maxApt, suerte: this.suerte, inteligence: this.inteligence, strength: this.strength, desterity:this.desterity,
        spriteIndex: this.spriteIndex/8, ui_index:this.ui_icon,
        acciones: this.acciones,
        inventario: this.inventario,
        freeExPoint: this.freeExPoint, mejorasAplicadas:this.mejorasAplicadas
        }
    }
     
    /**
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t,dt)
    }

    getTileXY(){
        return {x:this.tileX, y:this.tileY}
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

    setAlpha(val){
        this.alpha = val
        this.barraVida.alpha = val
        this.barraVidaEx.alpha= val
    }

    getUi_icon(){return this.ui_icon}

    //----------------- UI y Animaciones ----------------------------
    crearAnimaciones(){
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

    activaUIdePersonaje(index){
        this.scene.botonesPersonajes[index].activar()
        this.barraVida = this.scene.add.sprite(this.scene.botonesPersonajes[index].x,this.scene.botonesPersonajes[index].y+ 10,'ui_barraVida',0)
        this.barraVidaEx = this.scene.add.sprite(this.scene.botonesPersonajes[index].x,this.scene.botonesPersonajes[index].y+ 10,'ui_barraVida_ex',0)
        this.barraVida.setDepth(this.scene.botonesPersonajes[index].depth-1)
        this.barraVidaEx.setDepth(this.scene.botonesPersonajes[index].depth)
        this.barraVida.setScale(0.9,0.5)
        this.barraVidaEx.setScale(1,0.5)

        this.indicadores_APT = []
        for(let i = 0; i < this.maxApt; i++){
            this.indicadores_APT.push(this.scene.add.sprite(this.scene.botonesPersonajes[index].x - 5 + (5*i),this.scene.botonesPersonajes[index].y+ 16,'ui_indicadorAPT',0))
            this.indicadores_APT[i].setDepth(this.scene.botonesPersonajes[index].depth)
            this.indicadores_APT[i].setScale(0.5,0.5)
        }

    }

    actualizaBarraDeVida(){
        let cpstep = this.maxHp/ 16
        let currCrop = this.currentHp/cpstep
        currCrop = Math.ceil(currCrop)
        this.barraVida.setCrop(0,0,currCrop,3)
    }
        
    actualizaUIApt()
    {
        let i = this.currentApt
        this.indicadores_APT.forEach(element => {
            if(i > 0)
                element.setTexture('ui_indicadorAPT',0)
            else
                element.setTexture('ui_indicadorAPT',1)

            i--
        });
    }
    
    // Colocar al personaje por primera vez en la escena
    /*  targetVec -> posicion de la casilla en tiles
        index -> indice en el array de personajes
     */
    desplegar(targetVec, index){
        this.indexCombatManager = index
        this.scene.add.existing(this);
        this.setScale(1,1);
        this.activaUIdePersonaje(index)
        
        this.orientaPersonajeyPlayAnimation('idle')

        this.mover(targetVec)
        this.desplegado = true
    }


    //------------------- Funciones de Accion -------------------------------------
    mover(targetVec){
        this.orientaPersonajeyPlayAnimation('idle',targetVec)
        this.tileX=targetVec.x;
        this.tileY=targetVec.y;
        this.x= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
        this.y= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom();

        

        this.setDepth(this.tileX+this.tileY)
    /*
        this.barraVida.setX(this.x)
        this.barraVida.setY(this.y -8)
        this.barraVidaEx.setX(this.x)
        this.barraVidaEx.setY(this.y-8)
        this.barraVida.setDepth(this.depth+20)
        this.barraVidaEx.setDepth(this.depth+20)
        */
    }

    ataqueBasico(areaSeleccion){
        areaSeleccion.forEach(targetVec => {
            console.log("Ataque en " + targetVec.x+ " "+ targetVec.y + " daño: " +(this.arma.dmg + this.arma.escalado * this[this.arma.tipoEscalado]))
            this.hacerDano(targetVec,(this.arma.dmg + this.arma.escalado * this[this.arma.tipoEscalado]))
        });
    }
    

    
    //------------------- Funciones de personajes -----------------------------

    isAlive(){
        return this.currentHp > 0;
    }
    resetTurno(){
        if(this.isAlive()){
            this.currentApt = this.maxApt
            this.actualizaUIApt()
        }
    }


    //Hacer daño en una casilla
    //Se puede extender para utilizar el area y los diferentes tipos de daño
    hacerDano(targetVec,dano){
        let ent = this.scene.combatManager.getEntityAt(targetVec)
        
        this.orientaPersonajeyPlayAnimation('atack', targetVec)
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE , 
            () => {
             this.orientaPersonajeyPlayAnimation('idle') })
        if(ent != null && ent.recibeDano){
            ent.recibeDano(dano)
        }
    }

    realizarCuracion(targetVec,val){
        let ent = this.scene.combatManager.getEntityAt(targetVec)
        
        this.orientaPersonajeyPlayAnimation('atack', targetVec)
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE , 
            () => {
             this.orientaPersonajeyPlayAnimation('idle') })
        if(ent != null && ent.recibeDano){
            ent.recibeCuracion(val)
        }
    }

    //Funcion necesaria para ser objetivo de un ataque
    //Se puede extender para incluir la defensa y el aplicado de estados
    //Evelua si el personaje muere
    recibeDano(num){
        this.currentHp -= num
        this.actualizaBarraDeVida()
        if(this.currentHp <= 0)
            this.muere()
    }

    recibeCuracion(num){
        if(this.currentHp + num >= this.maxHp){
            this.currentHp = this.maxHp
        }
        else{
            this.currentHp += num
        }
        this.actualizaBarraDeVida()
    }

   
    //Gestiona la muerte de un personaje
    //TODO
    muere(){
        this.scene.personajeMuerto(this)
        this.setVisible(false)
    }
    realizarAccion(numApt){
        if(this.currentApt >= numApt){
            this.currentApt -= numApt
            this.actualizaUIApt()
            return true
        }
        return false
    }
    //------------------- Funciones de mejoras -----------------------------
    quitarMejora(nombre){
        this.mejorasAplicadas.splice(this.mejorasAplicadas.indexOf(nombre), 1)
    }
    anadirMejora(nombre){
        this.mejorasAplicadas.push(nombre)
    }
    checkMejora(nombre){
        return this.mejorasAplicadas.indexOf(nombre) >= 0
    }

}

/**LISTA DE IDEAS Y TODOS:
 *  1: muerte
 *  2: Introducir mas habilidades
 *  3: objetos
 *  4: gestion de las acciones por turno
 *  5: pasivas 
 */

/**
 *  Acciones:
 *      Basicas: Mover y ataque basico -> en constructor y daño de arma equipado
 *      Array de habilidades especiales -> traducir a botones, hacer funciones
 */