import Phaser from 'phaser'

export default class tile extends Phaser.GameObjects.Sprite {
     /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {Phaser.GameObjects.Group} tileGroup Grupo en el que se incluirá la base creada por la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   * @param {string} tileType Tipo de casilla
   */

     constructor(scene, tileGroup, x, y, tileType) {
        super(scene, x, y, tileType);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true);
      }
}