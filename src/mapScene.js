import { SpriteButton } from "./ClasesUI/spriteButtom.js";
import { TextButton } from "./ClasesUI/textButtom.js";
import { personajes } from '../assets/CharactersInfo/CharactersDATA.js';
import PlayerChar from "./playerChar.js";
import Dungeon1_info from "../assets/Dungeons/Dungeon1_info.js";
import CharacterFactory from "./Characters/CharacterFactory.js";
import MenuMejora from "./menuMejora.js";

export default class Mapa extends Phaser.Scene {


    menuTabernaVisible

    menuSeleccionPersonajesVisible

    indiceSeleccionado
    numPersSeleccionados
    hayIndiceSeleccionado

    hayPartySeleccionada
    constructor() {
        super({ key: 'Mapa' });
    }

    init(data) {
        this.playerTeamDATA = data.personajesEquipo
        this.hayPartySeleccionada = this.playerTeamDATA != undefined
        this.inventario = [{ tipo: 'armas', id: 5 }, { tipo: 'armas', id: 6 }]
        if (this.hayPartySeleccionada) {
            this.playerTeam = []
            this.playerTeamDATA.forEach(cd => {
                this.playerTeam.push(new PlayerChar(cd, this, 0, 0))
            });
            this.inventario = data.inventario
        }
    }

    preload() {
        this.playerChars = personajes
    }
    create() {
        this.allCharacters = []
        for (var key in this.playerChars) {
            this.allCharacters.push(CharacterFactory.CreateCharacter(this.playerChars[key], this, 0, 0))
        }

        if (!this.hayPartySeleccionada) {
            this.menuSeleccionPersonajesVisible = true
            this.playerTeam = [0, 0, 0]
            this.numPersSeleccionados = 0
            this.vueltaEscena = false
        } else {
            this.vueltaEscena = true
        }
        this.indiceSeleccionado = -1
        this.hayIndiceSeleccionado = false
        this.menuMejora = new MenuMejora(this,this.playerTeam)
        this.menuMejora.seleccionarIndice(-1)
        this._createUIMapa()
    }

    _createUIMapa() {
        this.bcgnd_map = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'mapa_mundo')
        let scaleX = this.cameras.main.width / this.bcgnd_map.width
        let scaleY = this.cameras.main.height / this.bcgnd_map.height
        let scale = Math.max(scaleX, scaleY)
        this.bcgnd_map.setScale(scale).setScrollFactor(0)
        this.botonMazmorraBosque = new TextButton(this, 120, 490, 'Bosque', { fill: '#FFF' }, () => this.entraMazmorra(), 'ui_buttons', 4, 20)
        this.botonMazmorraCamino = new TextButton(this, 300, 280, 'Coliseo', { fill: '#FFF' }, () => this.entraMazmorra(), 'ui_buttons', 4, 20)
        this.botonMazmorraCastillo = new TextButton(this, 170, 150, 'Castillo', { fill: '#FFF' }, () => this.entraMazmorra(), 'ui_buttons', 4, 20)



        this._createUITaberna()

        this.actualizarUI()
    }

    _crearUIInventario() {
        let i = 0
        this.inventario.forEach(obj => {
            this.menuMejora.createUIInventario(obj, i)
            i++
        });
    }
    _createUITaberna() {
        this.menuTaberna = this.make.tilemap({
            key: "tilesMenuTabernaSeleccion"
        });
        const tiles_desp = this.menuTaberna.addTilesetImage('UI_patrones_menu', 'tilesMenuSet')
        this.menuTabernaSeleccionBcgnd = this.menuTaberna.createLayer('Seleccion_Personajes', [tiles_desp])
        this.menuTabernaSeleccionadosBcgnd = this.menuTaberna.createLayer('Personajes_Seleccionados', [tiles_desp])
        this.menuPersonajeSimbolos = this.menuTaberna.createLayer('Simbolos', [tiles_desp])
        this.menuPersonajesBcgnd = this.menuTaberna.createLayer('DetallesDePersonaje', [tiles_desp])

        this.menuTabernaSeleccionBcgnd.setScale(3, 3)
        this.menuTabernaSeleccionBcgnd.setX(100)
        this.menuTabernaSeleccionBcgnd.setY(50)
        this.menuTabernaSeleccionBcgnd.setDepth(5)

        this.menuTabernaSeleccionadosBcgnd.setScale(3, 3)
        this.menuTabernaSeleccionadosBcgnd.setX(100)
        this.menuTabernaSeleccionadosBcgnd.setY(50)
        this.menuTabernaSeleccionadosBcgnd.setDepth(4)

        this.menuPersonajeSimbolos.setScale(3, 3)
        this.menuPersonajeSimbolos.setX(100)
        this.menuPersonajeSimbolos.setY(50)
        this.menuPersonajeSimbolos.setDepth(4)

        this.menuPersonajesBcgnd.setScale(3, 3)
        this.menuPersonajesBcgnd.setX(100)
        this.menuPersonajesBcgnd.setY(50)
        this.menuPersonajesBcgnd.setDepth(3)

        this.menuTabernaBotonCerrar = new SpriteButton(this, 100, 50, 'ui_buttons', 1, () => this.mostrarMenuTaberna(false), 'ui_indicadorAPT', 1, false, 'cerrarTaberna')
        this.menuTabernaBotonCerrar.setDepth(6)
        this.menuTabernaBotonCerrar.icon.setScale(1.5, 1.5)


        this.menuSeleccionBotonCerrar = new TextButton(this, 450, 350, 'COMENZAR', { fill: '#FFF' }, () => this.cerrarSeleccion(), 'ui_buttons', 4, 35)
        this.menuSeleccionBotonCerrar.setDepth(6)

        this.botonesSeleconarPersonajes = []
        this.textoSeleccionPersonajes = []
        this.textoSeleccionPersonajes.push(this.add.text(122, 30, 'SELECCIONA 3 PERSONAJES', { fontSize: 20, fontStyle: 'bold', resolution: 20 }))
        this.textoSeleccionPersonajes[0].setDepth(20)
        this.textoSeleccionPersonajes.push(this.add.sprite(260, 38, 'ui_buttons', 4))
        this.textoSeleccionPersonajes[1].setScale(20, 2)

        for (let i = 0; i < this.allCharacters.length; i++) {
            this.botonesSeleconarPersonajes.push(new SpriteButton(this, 160, 110 + (51 * i), 'ui_buttons', 1, () => this.selecciona(this.allCharacters[i]), 'ui_characters', this.allCharacters[i].getUi_icon(), false))
            this.botonesSeleconarPersonajes[i].setScale(3, 3)
            this.botonesSeleconarPersonajes[i].icon.setScale(3, 3)
            this.botonesSeleconarPersonajes[i].setDepth(6)

            this.textoSeleccionPersonajes.push(this.add.text(190, 90 + (51 * i), this.allCharacters[i].name, { fontSize: 16, fontStyle: 'bold', resolution: 20, fill: '#000' }))
            this.textoSeleccionPersonajes[2 + i * 2].setDepth(20)
            this.textoSeleccionPersonajes.push(this.add.text(190, 110 + (51 * i), this.allCharacters[i].arma.nombre, { fontSize: 14, fontStyle: 'bold', resolution: 20, fill: '#000' }))
            this.textoSeleccionPersonajes[2 + (i * 2 + 1)].setDepth(20)

        }

        this.botonesPersonajesSeleccionados = []
        for (let i = 0; i < 3; i++) {
            this.botonesPersonajesSeleccionados.push(new SpriteButton(this, 415, 110 + (70 * i), 'ui_buttons', 7, () => this.seleccionaSlot(i), 'ui_buttons', 9, true))
            this.botonesPersonajesSeleccionados[i].setScale(4, 4)
            this.botonesPersonajesSeleccionados[i].icon.setScale(4, 4)
            this.botonesPersonajesSeleccionados[i].setDepth(6)

        }

        for (let i = 0; i < 3; i++) {
            this.menuMejora.crearMenuMejoraPersonaje(i)

            if (this.vueltaEscena) {
                this.menuMejora.setMenuMejoraPersonaje(i)
            }
        }

        this.ui_inventario = []
        if (this.hayPartySeleccionada) {
            for (let i = 0; i < 3; i++) {
                this.updateListaSeleccionados(this.playerTeam[i], i)

            }
            this._crearUIInventario()
        }
    }

    setVisibleBotonesMejora(i, val) {
        for (var key in this.botonesMejoraPersonajes[i]) {
            this.botonesMejoraPersonajes[i][key].setVisible(val)
        }
    }



    entraMazmorra() {
        if (this.numPersSeleccionados === 3) {
            let playerTeamDATA = []
            this.playerTeam.forEach(c => {
                playerTeamDATA.push(c.getData())
            });
            console.log(playerTeamDATA)
            this.scene.start('Dungeon', { mapa_info: Dungeon1_info, personajesEquipo: playerTeamDATA, inventario: this.inventario });
        }
    }

    mostrarMenuTaberna(v) {
        this.menuTabernaVisible = v
        this.actualizarUI()
    }
    cerrarSeleccion() {
        this.menuSeleccionPersonajesVisible = false
        this.menuMejora.playerTeam = this.playerTeam
        for (let i = 0; i < 3; i++) {
            this.menuMejora.setMenuMejoraPersonaje(i)
        }
        this._crearUIInventario()

        this.actualizarUI()
    }

    actualizarUI() {
        this.menuTabernaSeleccionBcgnd.setVisible(this.menuTabernaVisible || this.menuSeleccionPersonajesVisible)
        this.menuTabernaSeleccionadosBcgnd.setVisible(this.menuTabernaVisible || this.menuSeleccionPersonajesVisible)

        let visibleBotonesMapa = !this.menuTabernaVisible && !this.menuSeleccionPersonajesVisible
        this.botonMazmorraBosque.setVisible(visibleBotonesMapa)
        this.botonMazmorraCamino.setVisible(visibleBotonesMapa)
        this.botonMazmorraCastillo.setVisible(visibleBotonesMapa)
        this.menuMejora.botonMenuMejora.setVisible(visibleBotonesMapa)

        this.menuSeleccionBotonCerrar.setVisible(this.menuSeleccionPersonajesVisible && this.numPersSeleccionados === 3)

        this.menuTabernaBotonCerrar.setVisible(this.menuTabernaVisible)
        this.menuPersonajeSimbolos.setVisible(this.menuTabernaVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0 && !this.menuSeleccionPersonajesVisible)
        this.menuPersonajesBcgnd.setVisible(this.menuTabernaVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0 && !this.menuSeleccionPersonajesVisible)

        for (let i = 0; i < this.allCharacters.length; i++) {
            this.botonesSeleconarPersonajes[i].setVisible(this.menuSeleccionPersonajesVisible)
        }
        this.textoSeleccionPersonajes.forEach(elem => {
            elem.setVisible(this.menuSeleccionPersonajesVisible)
        });
        for (let i = 0; i < 3; i++) {
        this.botonesPersonajesSeleccionados[i].setVisible(this.menuTabernaVisible || this.menuSeleccionPersonajesVisible)

        this.menuMejora.setVisibleBotonesMejora(i, this.menuTabernaVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0 && !this.menuSeleccionPersonajesVisible && i == this.indiceSeleccionado)
        }
        this.menuMejora.setVisibleInventario(this.menuTabernaVisible)
    }


    selecciona(char) {
        if (this.isCharSelected(char)) {
            return
        }
        if (this.hayIndiceSeleccionado) {
            if (this.botonesPersonajesSeleccionados[this.indiceSeleccionado].icon.texture.key != 'ui_characters')
                this.numPersSeleccionados++
            this.updateListaSeleccionados(char, this.indiceSeleccionado)
        }
        else if (this.numPersSeleccionados < 3) {
            let i = 0;
            while (i < 2 && this.playerTeam[i] !== 0) {
                i++
            }
            this.updateListaSeleccionados(char, i)
            this.numPersSeleccionados++
        }
        this.actualizarUI()
    }

    updateListaSeleccionados(char, i) {
        this.botonesPersonajesSeleccionados[i].icon.setTexture('ui_characters', char.getUi_icon())
        this.playerTeam[i] = char

    }
    seleccionaSlot(i) {
        if (this.hayIndiceSeleccionado) {
            this.botonesPersonajesSeleccionados[this.indiceSeleccionado].unSelect()
        }
        if (this.indiceSeleccionado === i) {
            this.hayIndiceSeleccionado = false
            this.menuMejora.seleccionarIndice(-1)
            this.indiceSeleccionado = -1
        } else {
            this.indiceSeleccionado = i
            this.hayIndiceSeleccionado = true
            this.menuMejora.seleccionarIndice(i)
        }
        this.actualizarUI()
    }

    isCharSelected(char) {
        let r = false
        this.playerTeam.forEach(ptc => {
            if (char.name === ptc.name)
                r = true
        });
        return r
    }
}
