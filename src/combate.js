import Player from './playerChar.js';
import Phaser from 'phaser'
import enemies_sp from '../assets/sprites/IsometricTRPGAssetPack_Entities.png'
import tileset from '../assets/sprites/Isometric_MedievalFantasy_Tiles.png'
import tilemap from '../assets/mapasTiles/Mapa_1.json'
import mapIndicators from '../assets/sprites/TRPGIsometricAssetPack_MapIndicators.png'
import characters_sp from '../assets/sprites/CharactersSprites.png'

import ui_characters from '../assets/sprites/CharacterFaceSprite.png'
import ui_buttons from '../assets/sprites/ButtonSprites.png'



import { TextButton } from './textButtom.js';
import {SpriteButton } from './spriteButtom.js'


import { neigbours, frontNeigbours } from './constants.js';
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
        this.empezarCombate_btn = new TextButton(this, -82,-44, 'Iniciar', {fill: '#FFF'}, () => this.pasarTurno(),'ui_buttons',4)
        this.pasarTurno_btn = new TextButton(this, -76,-44, 'Fin Turno', {fill: '#FFF'}, () => this.pasarTurno(),'ui_buttons',4)
        this.pasarTurno_btn.setVisible(false)
        this.pasarTurno_btn.setInteractive(false)
        console.log("ui icon 1 " + this.playerTeam[0].getUi_icon())
        console.log("ui icon 2 " + this.playerTeam[1].getUi_icon())
        console.log("ui icon 3 " + this.playerTeam[2].getUi_icon())
        let botonPersonaje1 = new SpriteButton(this, -100, -22, 'ui_buttons', 2, () => this.selecciona(this.playerTeam[0]), 'ui_characters', this.playerTeam[0].getUi_icon())
        
        let botonPersonaje2 = new SpriteButton(this, -100, -4, 'ui_buttons', 2, () => this.selecciona(this.playerTeam[1]), 'ui_characters', this.playerTeam[1].getUi_icon())
    
        let botonPersonaje3 = new SpriteButton(this, -100, 14, 'ui_buttons', 2, () => this.selecciona(this.playerTeam[2]), 'ui_characters', this.playerTeam[2].getUi_icon())
        this.botonesPersonajes = [botonPersonaje1, botonPersonaje2, botonPersonaje3]
        this.botonesPersonajes.forEach(element => {
            element.disableInteractive()
        })
    }

    selecciona(char){
        this.combatManager.seleccionaPersonajeC(char)
        this.indicatorTile.setVisible(false)
    }

    hideUIDespliegue(){
        this.empezarCombate_btn.setVisible(false)
        this.empezarCombate_btn.setInteractive(false)
        this.pasarTurno_btn.setVisible(true)
        this.pasarTurno_btn.setInteractive(true)
    }

    configurarCamara(){
        this.cameras.main.setZoom(4);
        this.cameras.main.scrollX = -this.map.widthInPixels / 2 - 425;
        this.cameras.main.scrollY = -this.map.heightInPixels / 2 - 260;
        console.log("pos cameras " +this.cameras.main.scrollX +" " +this.cameras.main.scrollY );
    }

    
    mostrarDespliegue(val){
        this.despliegue.setVisible(val)
    }

    visibilidadSeleccion(targetVec){
        this.capaJuego.forEachTile(tl => tl.setAlpha(1))
            for(let cords of frontNeigbours){
                if( targetVec.x + cords[0] >= 0 && targetVec.x + cords[0] < this.map.height 
                    && targetVec.y + cords[1] >= 0 && targetVec.y + cords[1] < this.map.height 
                    && (this.capaJuego.getTileAt(targetVec.x + cords[0],targetVec.y +cords[1],true).index !== -1))
                    {
                        this.capaJuego.getTileAt(targetVec.x+ cords[0],targetVec.y +cords[1],true).setAlpha(0.6 );
                    }
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
        this.despliegue = this.map.createLayer('CapaDespliegue', [tiles_desp]);
        
        this.indicatorTile = this.add.sprite(0,0,'mapIndicators',4) ;
        this.indicatorTile.setVisible(false);
        this.indicatorTile.setScale(1,1);
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
                                new PlayerChar(personajes.Picaro, this),
                                new PlayerChar(personajes.Brujo, this)
        ]; 
        this.combatManager = new CombatManager(this.enemies,this.playerTeam,3 ,this);
        console.log("Creado personaje "+ this.playerTeam[0].name)
        this.combatManager.nextTurn();
    }
    
    pasarTurno(){
        this.combatManager.nextTurn()
        this.indicatorTile.setVisible(false)
    }


   
     //+++++++++++++ Controles +++++++++++++++++++++++++
    
    controlInputMouseClick(){
        this.input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {

            //Consigue Index XY de la tile de la capaJuego
            const { worldX, worldY } = pointer;
            const targetVec = this.calculaTileXYClicked(worldX,worldY);
            if(targetVec.x >7 || targetVec.x < 0 || targetVec.y > 7 || targetVec.y < 0){
                return;
            }
            if(this.combatManager.checkClickEnPersonaje(targetVec)){
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
            }
            
            this.combatManager.clickOnTile(targetVec);
            this.visibilidadSeleccion(targetVec)
            // use startVec and targetVec
        })
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.off(Phaser.Input.Events.POINTER_UP)
        })
    }

    

}



        
