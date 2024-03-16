import Platform from './platform.js';
import Player from './player.js';
import Phaser from 'phaser'

import tileset from '../assets/sprites/Isometric_MedievalFantasy_Tiles.png'
import tilemap from '../assets/mapasTiles/Mapa_1.json'
import mapIndicators from '../assets/sprites/TRPGIsometricAssetPack_MapIndicators.png'
import tileSelected from './tileSelected.js';


/* 
 * @abstract 
 * @extends Phaser.Scene
 */
export default class Combate extends Phaser.Scene {

    neigbours = [[1,1],[0,1],[-1,1],[1,0],[0,0],[-1,0],[1,-1],[0,-1],[-1,-1]]

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
    }

    create(){   
        console.log("create map");
        this.createMap('Mapa_1')
        this.configurarCamara()
        this.controlInputMouseClick()
    }
    
   
    createMap(nombreMapa){
        this.map = this.make.tilemap({ 
            key: nombreMapa
          });
          //nombre de la paleta de tiles usado para pintar en tiled 
          //Mantener nombres constantes al crear mapa -> Tiles_Map
          const tileset1 = this.map.addTilesetImage('Tiles_Map', 'Tiles_Map');
          this.capaSuelo = this.map.createLayer('Suelo', [tileset1]);
          
          this.capaSelect = this.map.createFromObjects('SelectLayer', {name: 'SelectIndicator',
                                                        classType: Phaser.GameObjects.Sprite})
          this.capaJuego = this.map.createLayer('CapaJuego', [tileset1]);
          this.capaSelect.map(si => {
            si.setTexture('mapIndicators', 4);
            si.setScale(1,1);
        });
          this.capaSelect.map(si => si.setVisible(false));

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
            console.log("clicked on " + targetVec.x +" " + targetVec.y)
            for(let cords of this.neigbours){
                if( targetVec.x + cords[0] >= 0 && targetVec.x + cords[0] < this.map.height 
                    && targetVec.y + cords[1] >= 0 && targetVec.y + cords[1] < this.map.height 
                    && (this.capaJuego.getTileAt(targetVec.x + cords[0],targetVec.y +cords[1],true).index !== -1))
                    {
                        this.capaJuego.getTileAt(targetVec.x+ cords[0],targetVec.y +cords[1],true).setAlpha(0.6);
                    }
            }
            // use startVec and targetVec
        })
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.off(Phaser.Input.Events.POINTER_UP)
        })
    }
}