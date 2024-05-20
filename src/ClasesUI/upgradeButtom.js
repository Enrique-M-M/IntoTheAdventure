export class UpgradeButtom extends Phaser.GameObjects.Sprite {
  
    
    constructor(scene, x, y, bckgnd, style, depth,scaleXY, char,charindex, stat,coste, valorMejora, nombreA) {
      super(scene, x, y, bckgnd, style);
      this.setDepth(depth)
      this.scene.add.existing(this)
      this.Aplied = char.checkMejora(nombreA)
      this.setScale(scaleXY,scaleXY)
      this.i = charindex

      this.tooltipBckgnd =  scene.add.sprite(x-30,y+30,'ui_buttons', 1)
      this.tooltipBckgnd.setDepth(20)
      this.tooltipBckgnd.setScale(4,3)
      this.tooltipBckgnd.setVisible(false)

      this.tooltipCoste = scene.add.text(x-55,y+10,coste + " Exp",{fill:'#000'})
      this.tooltipCoste.setDepth(21)
      this.tooltipCoste.setVisible(false)

      this.tooltipMejora = scene.add.text(x-55,y+30,"+ " + valorMejora,{fill:'#000'})
      this.tooltipMejora.setDepth(21)
      this.tooltipMejora.setVisible(false)

      if(this.Aplied) { this.setFrame(0)}

      this.char = char
      this.coste = coste
      this.val = valorMejora
      this.stat = stat

      this.nombreA = nombreA

      this.activo = true
      this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.muestraTooltip(true))
        .on('pointerout', () => this.muestraTooltip(false) )
        .on('pointerup', () => {
          if(this.Aplied){
            this.Aplied = false
            this.char[this.stat] -= this.val
            this.char.quitarMejora(this.nombreA)
            this.char.freeExPoint += this.coste
            this.scene.menuMejora.actualizarUIMejora(this.i)
            this.setFrame(1)
          } else if(this.char.freeExPoint >= this.coste){
            this.Aplied = true
            this.char.freeExPoint -= this.coste
            this.char[this.stat] += this.val
            this.char.anadirMejora(this.nombreA)
            this.scene.menuMejora.actualizarUIMejora(this.i)
            this.setFrame(0)
          }
          console.log(this.char[this.stat])
        });
    }
    

    muestraTooltip(v){
      this.tooltipCoste.setVisible(v)
      this.tooltipBckgnd.setVisible(v)
      this.tooltipMejora.setVisible(v)
    }
  }