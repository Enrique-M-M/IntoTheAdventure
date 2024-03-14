import Phaser from 'phaser'

export default class tileSelected extends Phaser.GameObjects.Sprite {
     /**
   * Constructor de la Plataforma
   * @param {Phaser.Scene} scene Escena a la que pertenece la plataforma
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */

     constructor(scene, x, y, tileSheet) {
        super(scene, x, y, tileSheet, 0);
        this.visible = false;


        this.input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {
            const { worldX, worldY } = pointer
    
            const targetVec = this.backgroundLayer.worldToTileXY(worldX, worldY)
            console.log("Click en casilla " + Math.trunc(targetVec.x + 1) +" " +Math.trunc(targetVec.y + 1) );
            this.x = Math.trunc(targetVec.x + 1);
            this.y = Math.trunc(targetVec.y + 1);
            this.visible = true;
            // use startVec and targetVec
        })
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
        })
      }

}