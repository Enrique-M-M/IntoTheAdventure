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
        this.map = this.make.tilemap({ 
            key: 'Mapa_1'
          });
          //nombre de la paleta de tiles usado para pintar en tiled 
          //Mantener nombres constantes al crear mapa -> Tiles_Map
          const tileset1 = this.map.addTilesetImage('Tiles_Map', 'Tiles_Map');
          this.backgroundLayer = this.map.createLayer('Capa_1', [tileset1]);
          this.SelectedCapa = this.map.createLayer('SelectedCapa', [tileset1]);
        
        
          this.cameras.main.setZoom(4);
          this.cameras.main.scrollX = -this.map.widthInPixels / 2 - 425;
          this.cameras.main.scrollY = -this.map.heightInPixels / 2 - 260;
          console.log("pos cameras " +this.cameras.main.scrollX +" " +this.cameras.main.scrollY );

          var sprite = this.add.sprite(0, 0, 'mapIndicators', 0);
          sprite.setVisible(false);

          this.input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {
            const { worldX, worldY } = pointer;
    
            const targetVec = this.SelectedCapa.worldToTileXY(worldX, worldY);

            console.log("Click en casilla " + Math.trunc(targetVec.x) +" " +Math.trunc(targetVec.y ) );
            console.log("Click en casilla " +worldX +" " +worldY );

            sprite.setPosition(this.SelectedCapa.getTileAtWorldXY(worldX,worldY,true,this.cameras.main).getCenterX(),this.SelectedCapa.getTileAtWorldXY(worldX,worldY,true,this.cameras.main).getCenterY()+9);
            sprite.setVisible(true);
            // use startVec and targetVec
        })
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.off(Phaser.Input.Events.POINTER_UP)
        })

}
}