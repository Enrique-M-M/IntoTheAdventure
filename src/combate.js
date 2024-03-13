import Platform from './platform.js';
import Player from './player.js';
import Phaser from 'phaser'

import tileset from '../assets/sprites/Isometric_MedievalFantasy_Tiles.png'
import tilemap from '../assets/mapasTiles/Mapa_1.json'

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
        this.load.image('Tiles_Map', tileset);    
        this.load.tilemapTiledJSON('Mapa_1', tilemap);
    }

    create(){   
        console.log("create");
        this.map = this.make.tilemap({ 
            key: 'Mapa_1'
          });
          const tileset1 = this.map.addTilesetImage('Tiles_Map', 'Tiles_Map');
          this.backgroundLayer = this.map.createLayer('Capa_1', [tileset1]);
          this.cameras.main.setZoom(4);
          this.cameras.main.scrollX = -this.map.widthInPixels / 2 - 425;
          this.cameras.main.scrollY = -this.map.heightInPixels / 2 - 260;

}
}