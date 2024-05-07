import Phaser from 'phaser'

import enemies_sp from '../assets/sprites/IsometricTRPGAssetPack_Entities.png'
import tileset from '../assets/sprites/Isometric_MedievalFantasy_Tiles.png'
import tilemap from '../assets/mapasTiles/Mapa_1.json'

import d1_mapa1 from '../assets/tiled/Combate/D1_Mapa_1.json'
import d1_mapa2 from '../assets/tiled/Combate/D1_Mapa_2.json'
import d1_mapa3 from '../assets/tiled/Combate/D1_Mapa_3.json'


import PruebaDungeon from '../assets/Dungeons/PruebaDungeon.json'

import Dungeon1 from '../assets/tiled/Dungeons/Dungeon1.json'

import mapIndicators from '../assets/sprites/TRPGIsometricAssetPack_MapIndicators.png'
import characters_sp from '../assets/sprites/CharactersSprites.png'

import tilesMenuSet from '../assets/GUI/GUI_1x.png' 
import tilesMenuTabernaSeleccion from '../assets/tiled/Menus/tilesMenuTabernaSeleccion.json'
import menu_recompensas_dungeon from '../assets/tiled/Menus/menu_recompensas_dungeon.json'

import mapa_mundo from '../assets/imagenes/mapa_mundo.png'

import ui_characters from '../assets/sprites/CharacterFaceSprite.png'
import ui_buttons from '../assets/sprites/ButtonSprites.png'
import ui_actions_icon from '../assets/sprites/ActionsIcons.png'
import ui_barraVida from '../assets/sprites/LifeBar_UI.png'
import ui_barraVida_ex from '../assets/sprites/LifeBar_Exterior_UI.png'
import ui_indicadorAPT from '../assets/sprites/UI_IndicadorAPT.png'
import ui_iconosObjetos from '../assets/sprites/Ui_iconos_objetos.png'


/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una 
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class Boot extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'boot' });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    this.load.image('mapa_mundo' , mapa_mundo)

        this.load.image('Tiles_Map', tileset);  
        this.load.tilemapTiledJSON('Mapa_1', tilemap);


        this.load.tilemapTiledJSON('PruebaDungeon', PruebaDungeon);
        this.load.tilemapTiledJSON('Dungeon1', Dungeon1);

        this.load.tilemapTiledJSON('d1_mapa1', d1_mapa1);
        this.load.tilemapTiledJSON('d1_mapa2', d1_mapa2);
        this.load.tilemapTiledJSON('d1_mapa3', d1_mapa3);
        
        d1_mapa1
        this.load.tilemapTiledJSON('tilesMenuTabernaSeleccion', tilesMenuTabernaSeleccion);
        this.load.tilemapTiledJSON('menu_recompensas_dungeon', menu_recompensas_dungeon);

        this.load.image('tilesMenuSet', tilesMenuSet);  

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
        this.load.spritesheet('ui_indicadorAPT', 
                                ui_indicadorAPT,
                                {frameWidth: 8, frameHeight:8})
        this.load.spritesheet('ui_iconosObjetos', 
                                ui_iconosObjetos,
                                {frameWidth: 8, frameHeight:8})



    //MAPASTILES
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    
    this.scene.start('Mapa');
  }
}