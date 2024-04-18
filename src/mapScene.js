import { SpriteButton } from "./spriteButtom";
import { TextButton } from "./textButtom";
import { personajes  } from '../assets/CharactersInfo/CharactersDATA.js';
import PlayerChar from "./playerChar.js";

export default class Mapa extends Phaser.Scene {


    menuTabernaVisible
    
    menuSeleccionPersonajesVisible

    indiceSeleccionado
    numPersSeleccionados
    hayIndiceSeleccionado
    constructor() {
        super({ key: 'Mapa' });
    }
    
    preload(){
        this.playerChars = personajes
        
    }
    create(){
        this.allCharacters = [new PlayerChar(this.playerChars.Caballero, this),
            new PlayerChar(this.playerChars.Guerrero, this),
            new PlayerChar(this.playerChars.Vampiro, this),
            new PlayerChar(this.playerChars.Mago, this),
            new PlayerChar(this.playerChars.Picaro, this),
            new PlayerChar(this.playerChars.Brujo, this),
            new PlayerChar(this.playerChars.Ranger, this),
            new PlayerChar(this.playerChars.Clerigo, this)
        ]
        this.playerTeam = [0,0 ,0 ]

        this.indiceSeleccionado = -1
        this.numPersSeleccionados = 0
        this.hayIndiceSeleccionado = false
        this.menuSeleccionPersonajesVisible = true
        this._createUIMapa()
       }

    _createUIMapa(){
        this.bcgnd_map = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2,'mapa_mundo')
        let scaleX = this.cameras.main.width / this.bcgnd_map.width 
        let scaleY = this.cameras.main.height / this.bcgnd_map  .height 
        let scale = Math.max(scaleX, scaleY) 
        this.bcgnd_map.setScale(scale).setScrollFactor(0)
        this.botonMazmorra = new TextButton(this,150,50,'Entrar a Mazmorra',  {fill: '#FFF'}, () => this.entraMazmorra(),'ui_buttons',4, 20)
        this.botonTaberna =  new TextButton(this,900,180,'TABERNA',  {fill: '#FFF'}, () => this.mostrarMenuTaberna(true),'ui_buttons',4, 20)
        
        
        this._createUITaberna()

        this.actualizarUI()
    }

   _createUITaberna(){
        this.menuTaberna = this.make.tilemap({
            key: "tilesMenuTabernaSeleccion"
        });
        const tiles_desp = this.menuTaberna.addTilesetImage('UI_patrones_menu','tilesMenuSet')
        this.menuTabernaSeleccionBcgnd = this.menuTaberna.createLayer('Seleccion_Personajes', [tiles_desp])
        this.menuTabernaSeleccionadosBcgnd = this.menuTaberna.createLayer('Personajes_Seleccionados', [tiles_desp])
        this.menuPersonajeSimbolos = this.menuTaberna.createLayer('Simbolos', [tiles_desp])
        this.menuPersonajesBcgnd = this.menuTaberna.createLayer('DetallesDePersonaje', [tiles_desp])

        this.menuTabernaSeleccionBcgnd.setScale(3,3)
        this.menuTabernaSeleccionBcgnd.setX(100) 
        this.menuTabernaSeleccionBcgnd.setY(50) 
        this.menuTabernaSeleccionBcgnd.setDepth(5)
        
        this.menuTabernaSeleccionadosBcgnd.setScale(3,3)
        this.menuTabernaSeleccionadosBcgnd.setX(100) 
        this.menuTabernaSeleccionadosBcgnd.setY(50) 
        this.menuTabernaSeleccionadosBcgnd.setDepth(4)

        this.menuPersonajeSimbolos.setScale(3,3)
        this.menuPersonajeSimbolos.setX(100) 
        this.menuPersonajeSimbolos.setY(50) 
        this.menuPersonajeSimbolos.setDepth(4)

        this.menuPersonajesBcgnd.setScale(3,3)
        this.menuPersonajesBcgnd.setX(100) 
        this.menuPersonajesBcgnd.setY(50) 
        this.menuPersonajesBcgnd.setDepth(3)

        this.menuTabernaBotonCerrar = new SpriteButton(this,100,50, 'ui_buttons', 1,()=>this.mostrarMenuTaberna(false),'ui_indicadorAPT',1,false,'cerrarTaberna')
        this.menuTabernaBotonCerrar.setDepth(6)
        this.menuTabernaBotonCerrar.icon.setScale(1.5,1.5)


        this.menuSeleccionBotonCerrar = new TextButton(this,450,350,'COMENZAR',  {fill: '#FFF'}, () => this.cerrarSeleccion(),'ui_buttons',4, 35)
        this.menuSeleccionBotonCerrar.setDepth(6)

        this.botonesSeleconarPersonajes = []
        
        
        for(let i = 0; i <this.allCharacters.length; i++){
            this.botonesSeleconarPersonajes.push(new SpriteButton(this, 160, 110 + (51 * i), 'ui_buttons', 1, () => this.selecciona(this.allCharacters[i]), 'ui_characters', this.allCharacters[i].getUi_icon(),false))
            this.botonesSeleconarPersonajes[i].setScale(3,3)
            this.botonesSeleconarPersonajes[i].icon.setScale(3,3)
            this.botonesSeleconarPersonajes[i].setDepth(6)
        }
    
        this.botonesPersonajesSeleccionados = []
        for(let i = 0; i < 3; i++){ 
            this.botonesPersonajesSeleccionados.push(new SpriteButton(this, 415, 110 + (70*i), 'ui_buttons', 7, () => this.seleccionaSlot(i), 'ui_buttons', 9,true))        
            this.botonesPersonajesSeleccionados[i].setScale(4,4)
            this.botonesPersonajesSeleccionados[i].icon.setScale(4,4)
            this.botonesPersonajesSeleccionados[i].setDepth(6)

        }
                
   }
    entraMazmorra(){
        if(this.numPersSeleccionados === 3)
        this.scene.start('Combate',{mapa_id: 'Mapa_1', peronajesEquipo: this.playerTeam});
    }

    mostrarMenuTaberna(v){
        this.menuTabernaVisible = v
        this.actualizarUI()
    }
    cerrarSeleccion(){
        this.menuSeleccionPersonajesVisible = false
        this.actualizarUI()
    }

    actualizarUI(){
        this.menuTabernaSeleccionBcgnd.setVisible(this.menuTabernaVisible || this.menuSeleccionPersonajesVisible)
        this.menuTabernaSeleccionadosBcgnd.setVisible(this.menuTabernaVisible || this.menuSeleccionPersonajesVisible)

        let visibleBotonesMapa = !this.menuTabernaVisible && !this.menuSeleccionPersonajesVisible
        this.botonMazmorra.setVisible(visibleBotonesMapa)
        this.botonTaberna.setVisible(visibleBotonesMapa)

        this.menuSeleccionBotonCerrar.setVisible(this.menuSeleccionPersonajesVisible && this.numPersSeleccionados === 3)

        this.menuTabernaBotonCerrar.setVisible(this.menuTabernaVisible)
        this.menuPersonajeSimbolos.setVisible(this.menuTabernaVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0)
        this.menuPersonajesBcgnd.setVisible(this.menuTabernaVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0)


        for(let i = 0; i <this.allCharacters.length; i++){
            this.botonesSeleconarPersonajes[i].setVisible(this.menuSeleccionPersonajesVisible) 
        }
        for(let i = 0; i < 3; i++){
            this.botonesPersonajesSeleccionados[i].setVisible(this.menuTabernaVisible || this.menuSeleccionPersonajesVisible)
        }
    }


    selecciona(char){
        if(this.isCharSelected(char)){
            return
        }
        if(this.hayIndiceSeleccionado){
            this.updateListaSeleccionados(char,this.indiceSeleccionado)
            if(this.numPersSeleccionados < 3)
                this.numPersSeleccionados++
        }
        else if(this.numPersSeleccionados < 3){
            let i = 0;
            while(i < 2 && this.playerTeam[i] !== 0){
                i++
            }
            this.updateListaSeleccionados(char,i)
            this.numPersSeleccionados++
        }
        this.actualizarUI()
    }

    updateListaSeleccionados(char, i){
        this.botonesPersonajesSeleccionados[i].icon.setTexture('ui_characters', char.getUi_icon())
        this.playerTeam[i] = char

    }
    seleccionaSlot(i){
        if(this.hayIndiceSeleccionado){
            this.botonesPersonajesSeleccionados[this.indiceSeleccionado].unSelect()
        }
        if(this.indiceSeleccionado === i){
            this.hayIndiceSeleccionado = false
            this.indiceSeleccionado = -1
        } else{
            this.indiceSeleccionado = i
            this.hayIndiceSeleccionado = true
        }
        this.actualizarUI()
    }

    isCharSelected(char){
        let r = false
        this.playerTeam.forEach(ptc => {
            if(char.name === ptc.name )
                r = true
        });
        return r
    }
}
