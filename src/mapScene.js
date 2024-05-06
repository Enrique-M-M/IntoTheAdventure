import { SpriteButton } from "./Botones/spriteButtom.js";
import { TextButton } from "./Botones/textButtom.js";
import { personajes  } from '../assets/CharactersInfo/CharactersDATA.js';
import PlayerChar from "./playerChar.js";
import PruebaDungeon_info from "../assets/Dungeons/PruebaDungeon_info.js";
import { UpgradeButtom } from "./Botones/upgradeButtom.js";

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

    init (data)
    {
        this.playerTeamDATA = data.personajesEquipo
        this.hayPartySeleccionada = this.playerTeamDATA != undefined      
        this.inventario = []
        if(this.hayPartySeleccionada){
            this.playerTeam = []
            this.playerTeamDATA.forEach(cd => {
                this.playerTeam.push(new PlayerChar(cd,this,0,0))
            });
            this.inventario = data.inventario
        }
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
        if(!this.hayPartySeleccionada){
            this.menuSeleccionPersonajesVisible = true
            this.playerTeam = [0,0,0]
            this.numPersSeleccionados = 0
            this.vueltaEscena = false
        } else{
            this.vueltaEscena = true
        }
        this.indiceSeleccionado = -1
        this.hayIndiceSeleccionado = false
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
        
        this.botonesMejoraPersonajes = []
        for(let i = 0; i< 3;i++){
            this.crearMenuMejoraPersonaje(i)
            if(this.vueltaEscena){
                this.setMenuMejoraPersonaje(i)
            }
        }

        if(this.hayPartySeleccionada){
            for(let i = 0; i<3; i++ ){
                this.updateListaSeleccionados(this.playerTeam[i], i)
                
            }
            let i = 0
            this.inventario.forEach(obj => {
                this.createUIInventario(obj,i)
            });
        } 
   }

   createUIInventario(obj,i){

   }

   crearMenuMejoraPersonaje(i){
        this.botonesMejoraPersonajes.push({})
        this.botonesMejoraPersonajes[i].textoPuntosDeMejora = this.add.text(670,245,"Exp - ",{fill: '#000'}).setDepth(7)

        this.botonesMejoraPersonajes[i].textoVida = this.add.text(530,245,"Vida - ",{fill: '#000'}).setDepth(7)
        this.botonesMejoraPersonajes[i].textoAPT = this.add.text(530,295,"Acciones - 2",{fill: '#000'}).setDepth(7)
        this.botonesMejoraPersonajes[i].textoSTR = this.add.text(530,345,"Fue - 1",{fill: '#000'}).setDepth(7)
        this.botonesMejoraPersonajes[i].textoINT = this.add.text(530,390,"Int - 1",{fill: '#000'}).setDepth(7)
        this.botonesMejoraPersonajes[i].textoDES = this.add.text(530,437,"Des - 1",{fill: '#000'}).setDepth(7)
   }

   actualizarUIMejora(i){
    this.botonesMejoraPersonajes[i].textoPuntosDeMejora.setText("Exp - " + this.playerTeam[i].freeExPoint)
    this.botonesMejoraPersonajes[i].textoVida.setText("Vida - " + this.playerTeam[i].maxHp)
    this.botonesMejoraPersonajes[i].textoAPT.setText("Acciones - " +this.playerTeam[i].maxApt )
    this.botonesMejoraPersonajes[i].textoSTR.setText("Fue - " +this.playerTeam[i].strength )
    this.botonesMejoraPersonajes[i].textoINT.setText("Int - " +this.playerTeam[i].inteligence )
    this.botonesMejoraPersonajes[i].textoDES.setText("Des - " +this.playerTeam[i].desterity )



   }
   setMenuMejoraPersonaje(i){
        let depthBotones = 7
        let scaleXY = 2
        let posX_i = 600
        
        let diferencia_pos_x = 20
        let mejoraVida = 20


        this.botonesMejoraPersonajes[i].mejoraVida1 = new UpgradeButtom(this,posX_i, 275,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'maxHp' ,1, mejoraVida,'mejoraVida1')
  
        this.botonesMejoraPersonajes[i].mejoraVida2 = new UpgradeButtom(this,posX_i + diferencia_pos_x, 275,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'maxHp' ,1, mejoraVida,'mejoraVida2')
        
        this.botonesMejoraPersonajes[i].mejoraAPT = new UpgradeButtom(this,posX_i, 328,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i], i,'maxApt' ,2, 1,'mejoraAPT1')
        
        this.botonesMejoraPersonajes[i].mejoraSTR1 = new UpgradeButtom(this,posX_i, 375,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i], i,'strength' ,1, 1,'STR1')
        this.botonesMejoraPersonajes[i].mejoraSTR2 = new UpgradeButtom(this,posX_i+ diferencia_pos_x, 375,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'strength' ,1, 1,'STR2')
        this.botonesMejoraPersonajes[i].mejoraSTR3 = new UpgradeButtom(this,posX_i+ 2*diferencia_pos_x, 375,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'strength' ,1, 1,'STR3')
        
        this.botonesMejoraPersonajes[i].mejoraINT1 = new UpgradeButtom(this,posX_i, 418,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'inteligence' ,1, 1,'INT1')
        this.botonesMejoraPersonajes[i].mejoraINT2 = new UpgradeButtom(this,posX_i+ diferencia_pos_x, 418,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'inteligence' ,1, 1,'INT2')
        this.botonesMejoraPersonajes[i].mejoraINT3 = new UpgradeButtom(this,posX_i+ 2*diferencia_pos_x, 418,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'inteligence' ,1, 1,'INT3')

        this.botonesMejoraPersonajes[i].mejoraDES1 = new UpgradeButtom(this,posX_i, 465,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'desterity' ,1, 1,'DES1')
        this.botonesMejoraPersonajes[i].mejoraDES2 = new UpgradeButtom(this,posX_i+ diferencia_pos_x, 465,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'desterity' ,1, 1,'DES1')
        this.botonesMejoraPersonajes[i].mejoraDES3 = new UpgradeButtom(this,posX_i+ 2*diferencia_pos_x, 465,'ui_indicadorAPT',1,depthBotones,scaleXY,this.playerTeam[i],i, 'desterity' ,1, 1,'DES1')
        this.actualizarUIMejora(i)
    }

    setVisibleBotonesMejora(i,val){
        for (var key in this.botonesMejoraPersonajes[i]){
            this.botonesMejoraPersonajes[i][key].setVisible(val)
        }
    }

    

    entraMazmorra(){
        if(this.numPersSeleccionados === 3){
            let playerTeamDATA = []
            this.playerTeam.forEach(c => {
                playerTeamDATA.push(c.getData())
            });
            console.log(playerTeamDATA)
            this.scene.start('Dungeon',{mapa_info: PruebaDungeon_info, personajesEquipo: playerTeamDATA});
        }
    }
 
    mostrarMenuTaberna(v){
        this.menuTabernaVisible = v
        this.actualizarUI()
    }
    cerrarSeleccion(){
        this.menuSeleccionPersonajesVisible = false
        for(let i = 0; i < 3; i++){
            this.setMenuMejoraPersonaje(i)
        }
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
        this.menuPersonajeSimbolos.setVisible(this.menuTabernaVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0 && !this.menuSeleccionPersonajesVisible)
        this.menuPersonajesBcgnd.setVisible(this.menuTabernaVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0 && !this.menuSeleccionPersonajesVisible)
        

        for(let i = 0; i <this.allCharacters.length; i++){
            this.botonesSeleconarPersonajes[i].setVisible(this.menuSeleccionPersonajesVisible) 
        }
        for(let i = 0; i < 3; i++){
            this.botonesPersonajesSeleccionados[i].setVisible(this.menuTabernaVisible || this.menuSeleccionPersonajesVisible)
            this.setVisibleBotonesMejora(i,this.menuTabernaVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0 && !this.menuSeleccionPersonajesVisible && i == this.indiceSeleccionado)
        }
     
    }


    selecciona(char){
        if(this.isCharSelected(char)){
            return
        }
        if(this.hayIndiceSeleccionado){
            if( this.botonesPersonajesSeleccionados[this.indiceSeleccionado].icon.texture.key != 'ui_characters')
                this.numPersSeleccionados++
            this.updateListaSeleccionados(char,this.indiceSeleccionado)
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
