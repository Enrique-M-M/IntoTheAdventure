import Player from './playerChar.js';
import Phaser from 'phaser'
import enemies_sp from '../assets/sprites/IsometricTRPGAssetPack_Entities.png'
import tileset from '../assets/sprites/Isometric_MedievalFantasy_Tiles.png'
import tilemap from '../assets/mapasTiles/Mapa_1.json'
import mapIndicators from '../assets/sprites/TRPGIsometricAssetPack_MapIndicators.png'
import characters_sp from '../assets/sprites/CharactersSprites.png'


import { neigbours } from './constants.js';
import { CombatManager } from './combatManager.js';
import {personajes  } from '../assets/CharactersInfo/CharactersDATA.js';
import PlayerChar from './playerChar.js';

/* 
 * @abstract 
 * @extends Phaser.Scene
 */
export default class Combate extends Phaser.Scene {

    playerCharacters = {}

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
        
    }

    create(){  
        console.log("create map");
        this.createMap('Mapa_1')
        this.createManager();
        this.configurarCamara()
        this.controlInputMouseClick()
    }
    
   
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
        
        this.capaSelect = this.map.createFromObjects('LayerInfo', {name: 'SelectIndicator',
                                                    classType: Phaser.GameObjects.Sprite})
        this.enemies = this.map.createFromObjects('Enemy_layer', {name: 'enemy', 
                                                    classType: Phaser.GameObjects.Sprite});
        this.enemies.map(en => {
                        en.setScale(1,1);
                        en.set
                        //en.x = this.capaSuelo.getTileAt(en.x,en.y,true).getCenterX()
                        en.setTexture('enemies_sp', 32) ;
                    });
        this.enemies.map(en => en.setVisible(true));               
        this.capaSelect.map(si => {
                        si.setTexture('mapIndicators', 4);
                        si.setScale(1,1);
                    });
        this.capaSelect.map(si => si.setVisible(false));
        this.despliegue.setVisible(false)

    }

    mostrarDespliegue(){
        this.despliegue.setVisible(true)
    }
    createManager(){
        
        this.playerTeam = [new PlayerChar(personajes.Caballero, this)]; 
        this.combatManager = new CombatManager(this.enemies,this.playerTeam,1,this);
        console.log("Creado personaje "+ this.playerTeam[0].name)
        this.combatManager.nextTurn();
    }

    configurarCamara(){
        this.cameras.main.setZoom(4);
        this.cameras.main.scrollX = -this.map.widthInPixels / 2 - 425;
        this.cameras.main.scrollY = -this.map.heightInPixels / 2 - 260;
        console.log("pos cameras " +this.cameras.main.scrollX +" " +this.cameras.main.scrollY );
    }

    controlInputMouseClick(){
  
        this.input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {
            const { worldX, worldY } = pointer;
    
            const targetVec = this.capaJuego.worldToTileXY(worldX, worldY);
            targetVec.x = Math.trunc(targetVec.x);
            targetVec.y = Math.trunc(targetVec.y);

            
            console.log("clicked on " + targetVec.x +" " + targetVec.y)
            if(targetVec.x === 8) {targetVec.x=7 
                targetVec.y--}
            if(targetVec.y === 8) {targetVec.y=7
                targetVec.x--
            }
            if(this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).index != -1){
                this.capaSelect.map(si =>{
                     si.setTexture('mapIndicators', 2)
                     si.y = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterY()+4;});
            }
            else{
                this.capaSelect.map(si => {
                    si.setTexture('mapIndicators', 4)
                    si.y = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom()+4;
                });
                
            }    
            this.capaSelect.map(si => {
                si.x = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
            });
            this.capaSelect.map(si => si.setVisible(true));
            this.capaJuego.forEachTile(tl => tl.setAlpha(1))
            for(let cords of neigbours){
                if( targetVec.x + cords[0] >= 0 && targetVec.x + cords[0] < this.map.height 
                    && targetVec.y + cords[1] >= 0 && targetVec.y + cords[1] < this.map.height 
                    && (this.capaJuego.getTileAt(targetVec.x + cords[0],targetVec.y +cords[1],true).index !== -1))
                    {
                        this.capaJuego.getTileAt(targetVec.x+ cords[0],targetVec.y +cords[1],true).setAlpha(0.6);
                    }
            }
            
            this.combatManager.clickOnTile(targetVec);
            // use startVec and targetVec
        })
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.off(Phaser.Input.Events.POINTER_UP)
        })
    }
}



        
