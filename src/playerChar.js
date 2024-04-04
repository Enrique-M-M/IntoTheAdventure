import Phaser from 'phaser'

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
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
            frameRate: 2, // Velocidad de la animación
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
            frameRate: 2, // Velocidad de la animación
            repeat: 1    // Animación en bucle
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
            frameRate: 2, // Velocidad de la animación
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
            repeat: 1    // Animación en bucle
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
        this.mover(targetVec)
        this.setScale(1,1);
        console.log("Desplegando " +this.name +" en " + this.x + " " + this.y);
        this.play('idle_'+this.name);
        this.scene.botonesPersonajes[index].activar()
        this.desplegado = true
    }

    mover(targetVec){
        console.log("Mover " +this.name+" a " +targetVec.x +" "+targetVec.y)
        this.tileX=targetVec.x;
        this.tileY=targetVec.y;
        this.x= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
        this.y= this.scene.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom();
        this.setDepth(this.tileX+this.tileY)

    }

    ataqueBasico(targetVec){
        console.log("Ataque en " + targetVec.x+ " "+ targetVec.y)
        //this.scene.getEnemyAt(targetVec).recibirAtaque(1)
    }
    getTileXY(){
        return {x:this.tileX, y:this.tileY}
    }

    playIdleAnim(){
        if(this.seleccionado){
            this.play('idle_s_'+this.name)
        } else{
            this.play('idle_'+this.name)
        }
    }

    setSeleccionado(val){
        console.log('selecciona '+ this.name + ' seleccionado ' + this.seleccionado)
        if(val !== this.seleccionado) {
            this.seleccionado = val
        }
        this.playIdleAnim();
    }
    getUi_icon(){return this.ui_icon}
}
