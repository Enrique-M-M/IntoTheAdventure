export class inventarioObj extends Phaser.GameObjects.Sprite{

    constructor(obj, x, y, scene, tipoObj, index){
        super(scene,x,y,'ui_buttons', 7)
        this.obj = obj
        this.tipoObj = tipoObj
        this.index = index

        this.setScale(12,4)
        this.setDepth(20)

        this.nombre = new Phaser.GameObjects.Text(scene, x - 40, y - 20,obj.nombre ,{fill: '#000', fontSize: 20})
        this.nombre.setFontStyle('bold')
        this.nombre.setDepth(21)

        this.icon = new Phaser.GameObjects.Sprite(scene,x - 70 ,y,'ui_iconosObjetos',this.obj.icono)
        this.icon.setScale(5,5)
        this.icon.setDepth(21)

        this.tipoEscalado = new Phaser.GameObjects.Text(scene, x + 50, y - 18, obj.tipoEscalado.slice(0,3) ,{fill: '#000', fontSize: 16})
        this.tipoEscalado.setFontStyle('bold')
        this.tipoEscalado.setDepth(21)
        
        
        this.info = new Phaser.GameObjects.Text(scene, x - 40, y + 5,"dmg: " + obj.dmg + " R: " +obj.rango,{fill: '#000', fontSize: 16})
        this.info.setFontStyle('bold')
        this.info.setDepth(21)

        this.componentes = [ 
            {comp: this.nombre, deltaX:-40, deltaY:-20},  
            {comp: this.icon, deltaX:-70, deltaY:0}, 
            {comp: this.tipoEscalado, deltaX:50, deltaY:-18},
            {comp: this.info, deltaX:-40, deltaY:5},
            {comp: this, deltaX:0, deltaY:0}]

        scene.add.existing(this)
        scene.add.existing(this.icon)
        scene.add.existing(this.nombre)
        scene.add.existing(this.tipoEscalado)
        scene.add.existing(this.info)
    }

    mover(x,y){
        this.componentes.forEach(c => {
            c.comp.x = x + c.deltaX
            c.comp.y = y + c.deltaY
        });
    }
    setvisible(v){
        this.componentes.forEach(c => {
            c.comp.setVisible(v)
        }); 
    }

    destruir(){
        this.icon.destroy()
        this.nombre.destroy()
        this.tipoEscalado.destroy()
        this.info.destroy()
        this.destroy()
    }
}