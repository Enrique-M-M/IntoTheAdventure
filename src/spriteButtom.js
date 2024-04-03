export class SpriteButton extends Phaser.GameObjects.Sprite {
  
    
    constructor(scene, x, y, bckgnd, style, callback, iconSprite, num) {
      super(scene, x, y, bckgnd, style);
      this.icon = new Phaser.GameObjects.Sprite(scene,x,y,iconSprite,num)
      this.setDepth(1)

      this.scene.add.existing(this)
      this.scene.add.existing(this.icon)
      this.icon.setDepth(2)


      this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => {
          this.enterButtonHoverState();
          callback();
        });
    }
    
    enterButtonHoverState() {
      
    }
  
    enterButtonRestState() {
        this.setTexture(this.texture, 1)
       
    }
  
    enterButtonActiveState() {
      this.setTexture(this.texture, 0)
      
    }

    activar(){
      this.setInteractive()
      this.setTexture(this.texture, 1)
    }
  }