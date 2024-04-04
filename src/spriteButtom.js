export class SpriteButton extends Phaser.GameObjects.Sprite {
  
    
    constructor(scene, x, y, bckgnd, style, callback, iconSprite, num, togle, nombreA) {
      super(scene, x, y, bckgnd, style);
      this.icon = new Phaser.GameObjects.Sprite(scene,x,y,iconSprite,num)
      this.setDepth(1)

      this.scene.add.existing(this)
      this.scene.add.existing(this.icon)
      this.icon.setDepth(2)
      this.index = style

      this.togle = togle;
      this.clicked = false

      this.nombreA = nombreA
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
      if(!this.togle)
        this.setTexture(this.texture, this.index)
      
    }
  
    enterButtonActiveState() {
      if(!this.togle)
       this.setTexture(this.texture, this.index - 1)
      else{
        this.clicked = !this.clicked
        if(this.clicked){
          this.setTexture(this.texture, this.index - 1)
        }else{
          this.setTexture(this.texture, this.index )
        }
      }
    }

    activar(){
      this.setInteractive()
      this.index--
      this.setTexture(this.texture, this.index)
    }

    setVisible(val){
      this.visible = val
      this.icon.visible = val
    }

    unSelect(){
      if(this.togle){
        this.clicked=false
        this.setTexture(this.texture, this.index)
      }
    }

    desactivar(){
      this.unSelect()
      this.setInteractive(false)
      this.index++
      this.setTexture(this.texture, this.index)
    }
  }