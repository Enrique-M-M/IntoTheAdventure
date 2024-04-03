export class TextButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, text, style, callback, bckgnd, num) {
      super(scene, x, y, bckgnd,num)
      this.text = new Phaser.GameObjects.Text(scene, x,y, text, style);
      this.text.setDepth(2)
      this.text.setFontSize(10); 
      this.displayWidth = this.text.width+10;
      this.text.x = this.getTopLeft().x+5
      this.text.y= this.getTopLeft().y +2
      this.setDepth(1);
      this.scene.add.existing(this)
      this.scene.add.existing(this.text)
  
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
      this.text.setStyle({ fill: '#ff0'});
    }
  
    enterButtonRestState() {
      this.text.setStyle({ fill: '#FFF'});
    }
  
    enterButtonActiveState() {
      this.text.setStyle({ fill: '#000' });
    }

    setVisible(val){
      this.visible = val
      this.text.visible = val
    }
    

  }