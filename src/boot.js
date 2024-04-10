import Phaser from 'phaser'

import enemies_sp from '../assets/sprites/IsometricTRPGAssetPack_Entities.png'
import tileset from '../assets/sprites/Isometric_MedievalFantasy_Tiles.png'
import tilemap from '../assets/mapasTiles/Mapa_1.json'
import mapIndicators from '../assets/sprites/TRPGIsometricAssetPack_MapIndicators.png'
import characters_sp from '../assets/sprites/CharactersSprites.png'

import mapa_mundo from '../assets/imagenes/mapa_mundo.png'

import ui_characters from '../assets/sprites/CharacterFaceSprite.png'
import ui_buttons from '../assets/sprites/ButtonSprites.png'
import ui_actions_icon from '../assets/sprites/ActionsIcons.png'
import ui_barraVida from '../assets/sprites/LifeBar_UI.png'
import ui_barraVida_ex from '../assets/sprites/LifeBar_Exterior_UI.png'
import ui_indicadorAPT from '../assets/sprites/UI_IndicadorAPT.png'


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
        this.load.image('Tiles_Map', tileset);    
        this.load.image('mapa_mundo' , mapa_mundo)
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
        this.load.spritesheet('ui_indicadorAPT', 
                                ui_indicadorAPT,
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