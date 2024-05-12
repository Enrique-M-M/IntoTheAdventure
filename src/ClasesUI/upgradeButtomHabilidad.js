export class UpgradeButtomHabilidad extends Phaser.GameObjects.Sprite {
  
    
    constructor(scene, x, y, bckgnd, style, depth,scaleXY, char,charindex, coste, nombreA) {
      super(scene, x, y, bckgnd, style);
      this.setDepth(depth)
      this.scene.add.existing(this)
      this.Aplied = char.checkMejora(nombreA)
      this.setScale(scaleXY,scaleXY)
      this.i = charindex

      switch (nombreA){
        case 'Habilidad1':
            this.habilidad = char.Habilidad1()
            break
        case 'Habilidad2':
            this.habilidad = char.Habilidad2()
            break
        case 'Pasiva':
            this.habilidad = char.Pasiva()  
            break
      }

      this.tooltipBckgnd =  scene.add.sprite(x-120,y+50,'ui_buttons', 1)
      this.tooltipBckgnd.setDepth(20)
      this.tooltipBckgnd.setScale(18,6)
      this.tooltipBckgnd.setVisible(false)

      this.tooltipCoste = scene.add.text(x-245,y+10,coste + ' EXP',{fill:'#000'})
      this.tooltipCoste.setDepth(21)
      this.tooltipCoste.setVisible(false)

      this.tooltipMejora = scene.add.text(x-245,y+30,this.habilidad.nombre,{fill:'#000'})
      this.tooltipMejora.setDepth(21)
      this.tooltipMejora.setVisible(false)

      this.tooltipTextoHab = scene.add.text(x-245,y+50,this.habilidad.texto,{fill:'#000'})
      this.tooltipTextoHab.setDepth(21)
      this.tooltipTextoHab.setVisible(false)

      if(this.Aplied) { this.setFrame(0)}

      this.char = char
      this.coste = coste

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
        });
    }
    

    muestraTooltip(v){
      this.tooltipCoste.setVisible(v)
      this.tooltipBckgnd.setVisible(v)
      this.tooltipMejora.setVisible(v)
      this.tooltipTextoHab.setVisible(v)
    }
  }