export class UpgradeButtom extends Phaser.GameObjects.Sprite {
  
    
    constructor(scene, x, y, bckgnd, style, depth,scaleXY, char, stat,coste, valorMejora, nombreA) {
      super(scene, x, y, bckgnd, style);
      this.setDepth(depth)
      this.scene.add.existing(this)
      this.Aplied = char.checkMejora(nombreA)
      this.setScale(scaleXY,scaleXY)
      
      if(this.Aplied) { this.setFrame(0)}

      this.char = char
      this.coste = coste
      this.val = valorMejora
      this.stat = stat

      this.nombreA = nombreA

      this.activo = true
      this.setInteractive({ useHandCursor: true })
        .on('pointerup', () => {
          if(this.Aplied){
            this.Aplied = false
            this.char[this.stat] -= this.val
            this.char.quitarMejora(this.nombreA)
            this.char.freeExPoint += this.coste
           // this.scene.actualizarUICoste()
            this.setFrame(1)
          } else if(this.char.freeExPoint >= this.coste){
            this.Aplied = true
            this.char.freeExPoint -= this.coste
            this.char[this.stat] += this.val
            this.char.anadirMejora(this.nombreA)
            //this.scene.actualizarUICoste()
            this.setFrame(0)
          }
          console.log(this.char[this.stat])
        });
    }
    
  }