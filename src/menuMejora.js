import { catalogoObjetos } from "../assets/CharactersInfo/ObjectsDATA"
import { inventarioObj } from "./ClasesUI/inventarioObj"
import { TextButton } from "./ClasesUI/textButtom"
import { UpgradeButtom } from "./ClasesUI/upgradeButtom"
import { UpgradeButtomHabilidad } from "./ClasesUI/upgradeButtomHabilidad"

export default class MenuMejora {
    constructor(scene, playerTeam) {
        this.scene = scene
        this.playerTeam = playerTeam
        this.controlInventario()
        this.botonesMejoraPersonajes = []
        this.botonMenuMejora = new TextButton(this.scene, 900, 180, 'MEJORAR\nPERSONAES', { fill: '#FFF' }, () => this.scene.mostrarMenuTaberna(true), 'ui_buttons', 4, 20)
        this.ui_inventario = []
    }

    createUIInventario(obj, i) {
        var x = 220
        var y = 108 + 60 * i
        let objeto = catalogoObjetos[obj.tipo][obj.id]
        let ui_obj = new inventarioObj(objeto, x, y, this.scene, obj.tipo, obj.id)

        this.ui_inventario.push(ui_obj)
        ui_obj.setInteractive({ useHandCursor: true })
        this.scene.input.setDraggable(ui_obj)
    }

    reordenarInventario() {
        this.ui_inventario = this.ui_inventario.filter(function (element) {
            return element !== undefined;
        });
        var i = 0
        this.ui_inventario.forEach(element => {
            element.mover(220, 108 + 60 * i)
            i++
        });
    }

    actualizarUIMejora(i) {
        this.botonesMejoraPersonajes[i].textoPuntosDeMejora.setText("Exp - " + this.playerTeam[i].freeExPoint)
        this.botonesMejoraPersonajes[i].textoVida.setText("Vida - " + this.playerTeam[i].maxHp)
        this.botonesMejoraPersonajes[i].textoAPT.setText("Acciones - " + this.playerTeam[i].maxApt)
        this.botonesMejoraPersonajes[i].textoSTR.setText("Fue - " + this.playerTeam[i].strength)
        this.botonesMejoraPersonajes[i].textoINT.setText("Int - " + this.playerTeam[i].inteligence)
        this.botonesMejoraPersonajes[i].textoDES.setText("Des - " + this.playerTeam[i].desterity)
    }

    crearMenuMejoraPersonaje(i) {
        this.botonesMejoraPersonajes.push({})
        this.botonesMejoraPersonajes[i].textoPuntosDeMejora = this.scene.add.text(670, 245, "Exp - ", { fill: '#000' }).setDepth(7)

        this.botonesMejoraPersonajes[i].textoVida = this.scene.add.text(530, 245, "Vida - ", { fill: '#000' }).setDepth(7)
        this.botonesMejoraPersonajes[i].textoAPT = this.scene.add.text(530, 295, "Acciones - 2", { fill: '#000' }).setDepth(7)
        this.botonesMejoraPersonajes[i].textoSTR = this.scene.add.text(530, 345, "Fue - 1", { fill: '#000' }).setDepth(7)
        this.botonesMejoraPersonajes[i].textoINT = this.scene.add.text(530, 390, "Int - 1", { fill: '#000' }).setDepth(7)
        this.botonesMejoraPersonajes[i].textoDES = this.scene.add.text(530, 437, "Des - 1", { fill: '#000' }).setDepth(7)
    }

    //ELIMINAR
    actualizarUIMejora(i) {
        this.botonesMejoraPersonajes[i].textoPuntosDeMejora.setText("Exp - " + this.playerTeam[i].freeExPoint)
        this.botonesMejoraPersonajes[i].textoVida.setText("Vida - " + this.playerTeam[i].maxHp)
        this.botonesMejoraPersonajes[i].textoAPT.setText("Acciones - " + this.playerTeam[i].maxApt)
        this.botonesMejoraPersonajes[i].textoSTR.setText("Fue - " + this.playerTeam[i].strength)
        this.botonesMejoraPersonajes[i].textoINT.setText("Int - " + this.playerTeam[i].inteligence)
        this.botonesMejoraPersonajes[i].textoDES.setText("Des - " + this.playerTeam[i].desterity)
    }

    setMenuMejoraPersonaje(i) {
        this.botonesMejoraPersonajes.push({})
        let depthBotones = 7
        let scaleXY = 2
        let posX_i = 600

        let diferencia_pos_x = 20
        let mejoraVida = 20


        this.botonesMejoraPersonajes[i].mejoraVida1 = new UpgradeButtom(this.scene, posX_i, 275, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'maxHp', 1, mejoraVida, 'mejoraVida1')

        this.botonesMejoraPersonajes[i].mejoraVida2 = new UpgradeButtom(this.scene, posX_i + diferencia_pos_x, 275, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'maxHp', 1, mejoraVida, 'mejoraVida2')

        this.botonesMejoraPersonajes[i].mejoraAPT = new UpgradeButtom(this.scene, posX_i, 328, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'maxApt', 2, 1, 'mejoraAPT1')

        this.botonesMejoraPersonajes[i].mejoraSTR1 = new UpgradeButtom(this.scene, posX_i, 375, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'strength', 1, 1, 'STR1')
        this.botonesMejoraPersonajes[i].mejoraSTR2 = new UpgradeButtom(this.scene, posX_i + diferencia_pos_x, 375, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'strength', 1, 1, 'STR2')
        this.botonesMejoraPersonajes[i].mejoraSTR3 = new UpgradeButtom(this.scene, posX_i + 2 * diferencia_pos_x, 375, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'strength', 1, 1, 'STR3')

        this.botonesMejoraPersonajes[i].mejoraINT1 = new UpgradeButtom(this.scene, posX_i, 418, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'inteligence', 1, 1, 'INT1')
        this.botonesMejoraPersonajes[i].mejoraINT2 = new UpgradeButtom(this.scene, posX_i + diferencia_pos_x, 418, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'inteligence', 1, 1, 'INT2')
        this.botonesMejoraPersonajes[i].mejoraINT3 = new UpgradeButtom(this.scene, posX_i + 2 * diferencia_pos_x, 418, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'inteligence', 1, 1, 'INT3')

        this.botonesMejoraPersonajes[i].mejoraDES1 = new UpgradeButtom(this.scene, posX_i, 465, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'desterity', 1, 1, 'DES1')
        this.botonesMejoraPersonajes[i].mejoraDES2 = new UpgradeButtom(this.scene, posX_i + diferencia_pos_x, 465, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'desterity', 1, 1, 'DES1')
        this.botonesMejoraPersonajes[i].mejoraDES3 = new UpgradeButtom(this.scene, posX_i + 2 * diferencia_pos_x, 465, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 'desterity', 1, 1, 'DES1')

        this.botonesMejoraPersonajes[i].armaPlaceholder = this.scene.add.sprite(736, 135, 'ui_buttons', 7)
        this.botonesMejoraPersonajes[i].armaPlaceholder.setDepth(30)
        this.botonesMejoraPersonajes[i].armaPlaceholder.tipoObj = 'armas'

        if (this.playerTeam[i].inventario.arma != -1) {
            this.botonesMejoraPersonajes[i].armaPlaceholder.setTexture('ui_iconosObjetos', this.playerTeam[i].arma.icono)
            this.botonesMejoraPersonajes[i].armaPlaceholder.setScale(7, 7)
        } else {
            this.botonesMejoraPersonajes[i].armaPlaceholder.setAlpha(0.1)
            this.botonesMejoraPersonajes[i].armaPlaceholder.setScale(4.5, 4.5)
        }

        this.botonesMejoraPersonajes[i].armaduraSupPlaceholder = this.scene.add.sprite(568, 135, 'ui_buttons', 7)
        this.botonesMejoraPersonajes[i].armaduraSupPlaceholder.setDepth(30)
        this.botonesMejoraPersonajes[i].armaduraSupPlaceholder.tipoObj = 'armadurasSup'

        if (this.playerTeam[i].inventario.armaduraSup != -1) {
            this.botonesMejoraPersonajes[i].armaduraSupPlaceholder.setTexture('ui_iconosObjetos', this.playerTeam[i].armaduraSup.icono)
            this.botonesMejoraPersonajes[i].armaduraSupPlaceholder.setScale(7, 7)
        } else {
            this.botonesMejoraPersonajes[i].armaduraSupPlaceholder.setAlpha(0.1)
            this.botonesMejoraPersonajes[i].armaduraSupPlaceholder.setScale(4.5, 4.5)
        }

        this.botonesMejoraPersonajes[i].armaduraInfPlaceholder = this.scene.add.sprite(568, 205, 'ui_buttons', 7)
        this.botonesMejoraPersonajes[i].armaduraInfPlaceholder.setDepth(30)
        this.botonesMejoraPersonajes[i].armaduraInfPlaceholder.tipoObj = 'armadurasInf'

        if (this.playerTeam[i].inventario.armaduraInf != -1) {
            this.botonesMejoraPersonajes[i].armaduraInfPlaceholder.setTexture('ui_iconosObjetos', this.playerTeam[i].armaduraInf.icono)
            this.botonesMejoraPersonajes[i].armaduraInfPlaceholder.setScale(7, 7)
        } else {
            this.botonesMejoraPersonajes[i].armaduraInfPlaceholder.setAlpha(0.1)
            this.botonesMejoraPersonajes[i].armaduraInfPlaceholder.setScale(4.5, 4.5)
        }

        this.botonesMejoraPersonajes[i].amuletoPlaceholder = this.scene.add.sprite(736, 205, 'ui_buttons', 7)
        this.botonesMejoraPersonajes[i].amuletoPlaceholder.setDepth(30)
        this.botonesMejoraPersonajes[i].amuletoPlaceholder.tipoObj = 'amuletos'

        if (this.playerTeam[i].inventario.armaduraInf != -1) {
            this.botonesMejoraPersonajes[i].amuletoPlaceholder.setTexture('ui_iconosObjetos', this.playerTeam[i].amuleto.icono)
            this.botonesMejoraPersonajes[i].amuletoPlaceholder.setScale(7, 7)
        } else {
            this.botonesMejoraPersonajes[i].amuletoPlaceholder.setAlpha(0.1)
            this.botonesMejoraPersonajes[i].amuletoPlaceholder.setScale(4.5, 4.5)
        }

        this.botonesMejoraPersonajes[i].habilidad1Sprt = this.scene.add.sprite(748, 314, 'ui_actions_icon', this.playerTeam[i].Habilidad1().index)
        this.botonesMejoraPersonajes[i].habilidad1Sprt.setDepth(30)
        this.botonesMejoraPersonajes[i].habilidad1Sprt.setScale(4, 4)


        this.botonesMejoraPersonajes[i].habilidad1Btn = new UpgradeButtomHabilidad(this.scene, 746, 344, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 2, 'Habilidad1')

        if (this.playerTeam[i].hasHbilidad2) {
            console.log(this.playerTeam[i].name)
            this.botonesMejoraPersonajes[i].habilidad2Sprt = this.scene.add.sprite(748, 384, 'ui_actions_icon', this.playerTeam[i].Habilidad2().index)
            this.botonesMejoraPersonajes[i].habilidad2Sprt.setDepth(30)
            this.botonesMejoraPersonajes[i].habilidad2Sprt.setScale(4, 4)


            this.botonesMejoraPersonajes[i].habilidad2Btn = new UpgradeButtomHabilidad(this.scene, 746, 414, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 2, 'Habilidad2')
        }

        if (this.playerTeam[i].pasiva) {
            console.log(this.playerTeam[i].name)
            this.botonesMejoraPersonajes[i].pasivaSprt = this.scene.add.sprite(748, 454, 'ui_actions_icon', this.playerTeam[i].Pasiva().index)
            this.botonesMejoraPersonajes[i].pasivaSprt.setDepth(30)
            this.botonesMejoraPersonajes[i].pasivaSprt.setScale(4, 4)


            this.botonesMejoraPersonajes[i].pasivaBtn = new UpgradeButtomHabilidad(this.scene, 746, 484, 'ui_indicadorAPT', 1, depthBotones, scaleXY, this.playerTeam[i], i, 2, 'Pasiva')
        }
        this.actualizarUIMejora(i)
    }

    setVisibleBotonesMejora(i, val) {
        for (var key in this.botonesMejoraPersonajes[i]) {
            this.botonesMejoraPersonajes[i][key].setVisible(val)
        }
    }

    seleccionarIndice(i) {
        this.indiceSeleccionado = i
        this.hayIndiceSeleccionado = (i != -1)
    }
    controlInventario() {
        this.scene.input.on('dragstart', (pointer, gameObject) => {
            if (this.hayIndiceSeleccionado) {
                this.dragedOriginX = gameObject.x
                this.dragedOriginY = gameObject.y
            }
        })
        this.scene.input.on('drag', (activePointer, gameObject, dragX, dragY) => {
            if (this.hayIndiceSeleccionado) {
                gameObject.mover(dragX, dragY)
            }
        })
        this.scene.input.on('dragend', (pointer, gameObject) => {
            if (this.hayIndiceSeleccionado) {
                let placeholder = this.getPlaceholder(gameObject.tipoObj)
                if (Phaser.Geom.Intersects.RectangleToRectangle(gameObject.getBounds(), placeholder.getBounds())) {
                    this.objetoEnPlaceholder(gameObject, placeholder)
                    Phaser.Utils.Array.Remove(this.ui_inventario, gameObject)
                    gameObject.destruir()

                    this.reordenarInventario()

                } else {
                    gameObject.mover(this.dragedOriginX, this.dragedOriginY)
                }
            }
        })
    }

    objetoEnPlaceholder(obj, placeholder) {
        switch (placeholder.tipoObj) {
            case 'armas':
                this.botonesMejoraPersonajes[this.indiceSeleccionado].armaPlaceholder.setTexture('ui_iconosObjetos', obj.obj.icono)

                let armaAnterior = this.playerTeam[this.indiceSeleccionado].inventario.arma
                this.playerTeam[this.indiceSeleccionado].arma = obj.obj
                this.playerTeam[this.indiceSeleccionado].inventario.arma = obj.index

                if (armaAnterior != -1) {
                    console.log(1)
                    this.createUIInventario({ tipo: 'armas', id: armaAnterior }, this.ui_inventario.indexOf(obj))
                }
        }
    }

    getPlaceholder(tipoObj) {
        switch (tipoObj) {
            case 'armas':
                return this.botonesMejoraPersonajes[this.indiceSeleccionado].armaPlaceholder
        }
    }

    setVisibleInventario(val) {
        this.ui_inventario.forEach(objUI => {
            objUI.setvisible(val)
        });
    }
}