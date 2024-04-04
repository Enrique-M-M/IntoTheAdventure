import Player from './playerChar.js';
import Phaser from 'phaser'
import enemies_sp from '../assets/sprites/IsometricTRPGAssetPack_Entities.png'
import tileset from '../assets/sprites/Isometric_MedievalFantasy_Tiles.png'
import tilemap from '../assets/mapasTiles/Mapa_1.json'
import mapIndicators from '../assets/sprites/TRPGIsometricAssetPack_MapIndicators.png'
import characters_sp from '../assets/sprites/CharactersSprites.png'
import tileSprites from '../assets/sprites/Isometric_MedievalFantasy_Tiles-copia.png'

import ui_characters from '../assets/sprites/CharacterFaceSprite.png'
import ui_buttons from '../assets/sprites/ButtonSprites.png'
import ui_actions_icon from '../assets/sprites/ActionsIcons.png'
import ui_barraVida from '../assets/sprites/LifeBar_UI.png'
import ui_barraVida_ex from '../assets/sprites/LifeBar_Exterior_UI.png'



import { TextButton } from './textButtom.js';
import {SpriteButton } from './spriteButtom.js'


import { neigbours, frontNeigbours, crossNeigbours, indexBadTileBackground } from './constants.js';
import { CombatManager } from './combatManager.js';
import { personajes  } from '../assets/CharactersInfo/CharactersDATA.js';
import PlayerChar from './playerChar.js';

/* 
 * @abstract 
 * @extends Phaser.Scene
 */
export default class Combate extends Phaser.Scene {


    constructor() {
        super({ key: 'Combate' });
    }
    preload(){
        console.log("preload");
        this.load.setPath('assets/sprites/');
        //nombre del archivo del tilemap usado para pintar en tiled
        this.load.image('Tiles_Map', tileset);    
        this.load.tilemapTiledJSON('Mapa_1', tilemap);
        this.load.spritesheet('mapIndicators',
                                mapIndicators,
                                {frameWidth: 16, frameHeight: 8 })
        this.load.spritesheet('enemies_sp',
                                enemies_sp,
                                {frameWidth: 16, frameHeight: 17 })
        this.load.spritesheet('characters_sp',
                                characters_sp,
                                {frameWidth: 16, frameHeight: 17 })     
        this.load.spritesheet('ui_buttons',
                                ui_buttons,
                                {frameWidth: 16, frameHeight: 16})
        this.load.spritesheet('ui_characters',
                                ui_characters,
                                {frameWidth: 8, frameHeight: 8})
        this.load.spritesheet('ui_actions_icon',
                                ui_actions_icon,
                                {frameWidth: 8, frameHeight:8})
                                
        this.load.spritesheet('Tiles_Map_Spr',
                                tileset,
                                {frameWidth: 16, frameHeight:17})
        this.load.spritesheet('ui_barraVida', 
                                ui_barraVida,
                                {frameWidth: 16, frameHeight:4})
        this.load.spritesheet('ui_barraVida_ex', 
                                ui_barraVida_ex,
                                {frameWidth: 16, frameHeight:8})
                                
        
    }

    create(){  
        console.log("create map");
        this.createMap('Mapa_1')
        this.createManager();
        this.configurarCamara()
        this.controlInputMouseClick()
        this.createUI()
    }
    
   //+++++++++++++ User Interface y Pintado Mapa +++++++++++++++++++++++++

    createUI(){

        this.indicatorTile = this.add.sprite(0,0,'mapIndicators',4) ;
        this.indicatorTile.setVisible(false);
        this.indicatorTile.setScale(1,1);
        
        this.hoverIndicatorTile = this.add.sprite(0,0,'mapIndicators',5) ;
        this.hoverIndicatorTile.setVisible(false);
        this.hoverIndicatorTile.setScale(1,1);


        this.empezarCombate_btn = new TextButton(this, -122,-44, 'Iniciar', {fill: '#FFF'}, () => this.pasarTurno(),'ui_buttons',4)
        this.pasarTurno_btn = new TextButton(this, -116,-44, 'Fin Turno', {fill: '#FFF'}, () => this.pasarTurno(),'ui_buttons',4)
        this.pasarTurno_btn.setVisible(false)
        this.pasarTurno_btn.setInteractive(false)

        this.casillasSeleccionadas = []

        console.log("ui icon 1 " + this.playerTeam[0].getUi_icon())
        console.log("ui icon 2 " + this.playerTeam[1].getUi_icon())
        console.log("ui icon 3 " + this.playerTeam[2].getUi_icon())
        let botonPersonaje1 = new SpriteButton(this, -140, -20, 'ui_buttons', 1, () => this.selecciona(this.playerTeam[0]), 'ui_characters', this.playerTeam[0].getUi_icon(),false)
        
        let botonPersonaje2 = new SpriteButton(this, -140, 10, 'ui_buttons', 1, () => this.selecciona(this.playerTeam[1]), 'ui_characters', this.playerTeam[1].getUi_icon(),false)
    
        let botonPersonaje3 = new SpriteButton(this, -140, 40, 'ui_buttons', 1, () => this.selecciona(this.playerTeam[2]), 'ui_characters', this.playerTeam[2].getUi_icon(),false)
        this.botonesPersonajes = [botonPersonaje1, botonPersonaje2, botonPersonaje3]
        this.botonesPersonajes.forEach(element => {
            element.desactivar()
        })
        this.botonerasPersonajes = []
        for(let i = 0; i < 3; i++){
            let botonera = [new SpriteButton(this, this.botonesPersonajes[i].x + 17, this.botonesPersonajes[i].y, 'ui_buttons', 1, () => {this.seleccionaAccion(this.playerTeam[i].acciones.Mover, i)}, 'ui_actions_icon', 1,true, this.playerTeam[i].acciones.Mover.nombre),
            new SpriteButton(this, this.botonesPersonajes[i].x + 16*2 +1, this.botonesPersonajes[i].y, 'ui_buttons', 1, () => {this.seleccionaAccion(this.playerTeam[i].acciones.AtaqueBasico,i)}, 'ui_actions_icon', 3, true, this.playerTeam[i].acciones.AtaqueBasico.nombre)]
            botonera.forEach(btn => {
                btn.setScale(0.8,0.8)
                btn.setVisible(false)
            });
           this.botonerasPersonajes.push(botonera) 
        }
    }

    findButtom(indexChar, accion){
        let ret
        this.botonerasPersonajes[indexChar].forEach(btn => {
            if(accion === btn.nombreA)
                ret= btn
        });
        return ret
    }

    selecciona(char){
        this.combatManager.seleccionaPersonajeC(char)
        this.indicatorTile.setVisible(false)
    }

    showUIChar(index,val){
        this.botonerasPersonajes[index].forEach(btn => {
            btn.setVisible(val)
            btn.setInteractive(val)
        });
    }

    hideUIDespliegue(){
        this.empezarCombate_btn.setVisible(false)
        this.empezarCombate_btn.setInteractive(false)
        this.pasarTurno_btn.setVisible(true)
        this.pasarTurno_btn.setInteractive(true)
    }

    configurarCamara(){
        this.cameras.main.setZoom(4);
        this.cameras.main.scrollX = -this.map.widthInPixels / 2 - 465;
        this.cameras.main.scrollY = -this.map.heightInPixels / 2 - 260;
        console.log("pos cameras " +this.cameras.main.scrollX +" " +this.cameras.main.scrollY );
    }

    
    mostrarDespliegue(val){
        this.despliegue.setVisible(val)
    }

    visibilidadSeleccion(targetVec){
            for(let cords of frontNeigbours){
                if(this.checkCasillaEnTablero({x: targetVec.x + cords[0], y:targetVec.y +cords[1]}))
                    this.spritesEnCapaJuego.forEach(tile =>{ 
                        if(tile.x === targetVec.x +cords[0] && tile.y === targetVec.y +cords[1]){
                            tile.sprite.setAlpha(0.6)

                        }     
                    })
                }
            }
    

    mostrarRangoAccion(char, range, tipoSeleccion){
        
            this.combatManager.resetrAlpha()
        let tilesToCheck = []
        let tilesChecked = []
        let targetVec = new Phaser.Math.Vector2(char.tileX, char.tileY)
        console.log("Personaje en " + targetVec.x + " " +targetVec.y)
        this._mostrarRango(targetVec,range, 0, tipoSeleccion,tilesToCheck,tilesChecked)
        
    }

    casillaOcupada(targetVec){
        return this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).index != -1 || this.combatManager.casillaOcupada(targetVec)
    }

    _mostrarRango(targetVec, range, i,  tipoSeleccion, tilesToCheck, tilesChecked){
        tilesChecked.push(targetVec);

       
        this._casillaAMostrar(targetVec, tipoSeleccion)

        let newVec = new Phaser.Math.Vector2()
        for (let cords of crossNeigbours){
            newVec.x = targetVec.x + cords[0]
            newVec.y =  targetVec.y + cords[1]
            
            if(this.checkCasillaEnTablero(newVec) && !tilesChecked.find(vec => {vec.x === newVec.x && vec.y === newVec.y}) ){
                if(range >= i + 1
                    && (tipoSeleccion !== 'Movimiento' 
                    || (!indexBadTileBackground.find(ind => ind === this.capaSuelo.getTileAt(newVec.x, newVec.y, true).index) && !this.casillaOcupada(newVec)))
                    ){
                        if(this.capaJuego.getTileAt(newVec.x,newVec.y,true).index === -1 )
                         tilesToCheck.push(new Phaser.Math.Vector2(newVec.x, newVec.y))
                    }
                }
        }
        while(tilesToCheck.length > 0){
            let tile = tilesToCheck.pop()
            this._mostrarRango({x: tile.x, y: tile.y}, range, i, tipoSeleccion,tilesToCheck, tilesChecked)
        }
    }

    _casillaAMostrar(targetVec,tipoSeleccion){
        let cS;
        let tileCJ = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true)
        if(tipoSeleccion === 'Movimiento'){
            cS = new Phaser.GameObjects.Sprite(this,tileCJ.getCenterX(), tileCJ.getBottom() +5,'mapIndicators',0)
            cS.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.hoverIndicatorTile.x = cS.x
                this.hoverIndicatorTile.y = cS.y
                this.hoverIndicatorTile.setDepth(cS.depth+1)
                this.hoverIndicatorTile.setVisible(true)
                } )
            .on('pointerout', () => this.hoverIndicatorTile.setVisible(false) )
            .on('pointerdown', () => {this.combatManager.realizaAccion({x: targetVec.x, y: targetVec.y}) 
                    this.hoverIndicatorTile.setVisible(false)
            }
            );
        }
        else{
            cS = new Phaser.GameObjects.Sprite(this,tileCJ.getCenterX(), tileCJ.getBottom() +5,'mapIndicators',1)
            cS.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.hoverIndicatorTile.x = cS.x
                this.hoverIndicatorTile.y = cS.y
                this.hoverIndicatorTile.setDepth(cS.depth+1)
                this.hoverIndicatorTile.setVisible(true)
                } )
            .on('pointerout', () => this.hoverIndicatorTile.setVisible(false) )
            .on('pointerdown', () => {
                this.combatManager.realizaAccion({x: targetVec.x, y: targetVec.y}) 
                this.hoverIndicatorTile.setVisible(false)
                }
            );
        }
        
        this.visibilidadSeleccion(targetVec)
        cS.setDepth(0)
        this.casillasSeleccionadas.push(cS)        
        this.add.existing(cS)
    }

    _borrarCasillasMostradas(){
        while(this.casillasSeleccionadas.length > 0){
        let sp = this.casillasSeleccionadas.pop()
        sp.destroy(true)
        }

    }

    //+++++++++++++ Tile Map +++++++++++++++++++++++++

    createMap(nombreMapa){  
        this.map = this.make.tilemap({ 
            key: nombreMapa
          });

        //nombre de la paleta de tiles usado para pintar en tiled 
        //Mantener nombres constantes al crear mapa -> Tiles_Map
        const tiles_map = this.map.addTilesetImage('Tiles_Map', 'Tiles_Map');
        const tiles_desp = this.map.addTilesetImage('TileIndicators','mapIndicators')
        this.capaSuelo = this.map.createLayer('Suelo', [tiles_map]);                               
        this.capaJuego = this.map.createLayer('CapaJuego', [tiles_map]);
        this.spritesEnCapaJuego = []
        
        for(let j = 0; j < this.map.height; j++ ){
            for (let i = 0; i < this.map.width; i++){
                let obj = this.capaJuego.getTileAt(i,j,true)
                if(obj!= null && obj.index != -1){
                    let spr = this.add.sprite(obj.getCenterX(),obj.getCenterY(),'Tiles_Map_Spr',obj.index -1 )
                    spr.setDepth(i+j)
                    this.spritesEnCapaJuego.push({x: i, y: j, sprite: spr })
                }
            }
        }
        this.capaJuego.setVisible(false)
        

        this.despliegue = this.map.createLayer('CapaDespliegue', [tiles_desp]);
    
        this.enemies = this.map.createFromObjects('Enemy_layer', {name: 'enemy',
                                                    classType: Phaser.GameObjects.Sprite});
        this.enemies.map(en => {
                        en.setScale(1,1);
                        en.set
                        //en.x = this.capaSuelo.getTileAt(en.x,en.y,true).getCenterX()
                        en.setTexture('enemies_sp', 32) ;
                    });
        this.enemies.map(en => en.setVisible(true));               
        this.despliegue.setVisible(false)

    }

    calculaTileXYClicked(worldX, worldY){
        const targetVec = this.capaJuego.worldToTileXY(worldX, worldY,true);
        targetVec.x = Math.trunc(targetVec.x);
        targetVec.y = Math.trunc(targetVec.y);

        //Corrige por abajo para + comodidad
        if(targetVec.x === 8) {targetVec.x=7 
            targetVec.y--}
        if(targetVec.y === 8) {targetVec.y=7
            targetVec.x--
        }

        return targetVec
    }

     //+++++++++++++ Combat Manager +++++++++++++++++++++++++

    createManager(){
        //input del player
        this.playerTeam = [new PlayerChar(personajes.Caballero, this),
                                new PlayerChar(personajes.Guerrero, this),
                                new PlayerChar(personajes.Brujo, this)
        ]; 
        this.combatManager = new CombatManager(this.enemies,this.playerTeam,3 ,this,this.spritesEnCapaJuego);
        console.log("Creado personaje "+ this.playerTeam[0].name)
        this.combatManager.nextTurn();
    }

    pasarTurno(){
        this.combatManager.nextTurn()
        this.indicatorTile.setVisible(false)
        this.botonerasPersonajes.forEach(btns => {
            btns.forEach(btn => {
                btn.unSelect()
            })
        })
    }

    seleccionaAccion(accion, indexChar){

        if(!this.combatManager.accionSeleccionada){
            if(this.combatManager.seleccionaAccion(accion, indexChar))
            this.mostrarRangoAccion(this.playerTeam[indexChar],accion.rango, accion.tipoSeleccion)
        }
        else if(this.combatManager.accionSeleccionada && this.combatManager.ultimaAccionSeleccionada === accion ){
            this.combatManager.deseleccionaAccion()
        } else {
            findButton({indexP: indexChar, nombreA: accion.nombre}).unSelect()
            if(this.combatManager.seleccionaAccion(accion, indexChar))
            this.mostrarRangoAccion(this.playerTeam[indexChar],accion.rango,accion.tipoSeleccion)
        }
      
    }

    personajeMuerto(char){
        let index = this.combatManager.personajeMuerto(char)
        this.botonerasPersonajes[index].forEach(btn => btn.setInteractive(false))
        this.botonesPersonajes[index].desactivar()
    }
   
     //+++++++++++++ Controles +++++++++++++++++++++++++
    
    controlInputMouseClick(){
        this.input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {

            //Consigue Index XY de la tile de la capaJuego
            const { worldX, worldY } = pointer;
            const targetVec = this.calculaTileXYClicked(worldX,worldY);
            if(!this.checkCasillaEnTablero(targetVec)){
                return;
            }
            if(this.combatManager.checkEnPersonajeAliadoEnCasilla(targetVec)){
                this.indicatorTile.setVisible(false);
            } else{
                if(this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).index != -1){
                    this.indicatorTile.setTexture('mapIndicators', 2)
                    this.indicatorTile.y = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterY()+4;
                }
                else{
                    this.indicatorTile.setTexture('mapIndicators', 4)
                    this.indicatorTile.y = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom()+4; 
                }
                this.indicatorTile.x = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
                this.indicatorTile.setVisible(true);
                this.indicatorTile.setDepth(targetVec.x + targetVec.y)
            }
            
            this.combatManager.clickOnTile(targetVec);
            
            this.combatManager.resetrAlpha()
            this.visibilidadSeleccion(targetVec)
            // use startVec and targetVec
        })
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.off(Phaser.Input.Events.POINTER_UP)
        })
    }

    checkCasillaEnTablero(targetVec){
       return !(targetVec.x >= this.map.width || targetVec.x < 0 || targetVec.y >= this.map.height || targetVec.y < 0)
    }
    

}



        
