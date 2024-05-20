import { catalogoObjetos } from "../assets/CharactersInfo/ObjectsDATA";
import CharacterFactory from "./Characters/CharacterFactory";
import { inventarioObj } from "./ClasesUI/inventarioObj";
import { SpriteButton } from "./ClasesUI/spriteButtom";
import MenuMejora from "./menuMejora";

export default class Dungeon extends Phaser.Scene {
    
    
    salaActual
    salasRecorridas

    constructor() {
        super({ key: 'Dungeon' });
    }
    init (data)
    {
        this.mapa_info = data.mapa_info
        this.personajesEquipo = data.personajesEquipo
        this.salaActual = data.salaActual
        this.inventario = data.inventario
        this.victoriaEnCombate = this.salaActual != undefined
        this.salasRecorridas = data.salasRecorridas
    }

    preload(){
        this.load.setPath('assets/sprites/');
    }

    create(){  
        this.correccion_y = 150
        this.correccion_x = 500
        this.playerTeam = []
        for(let i = 0; i< 3; i++){
            this.playerTeam.push(CharacterFactory.CreateCharacter(this.personajesEquipo[i],this,0,0))
        } 
        this.menuMejora = new MenuMejora(this, this.playerTeam)
        
        this.menuMejora.playerTeam = this.playerTeam
        this.crearMapa()
        this.crearMenuMejora()
        this.recompensasVisible = false


        if(this.victoriaEnCombate){//Victoria en combate
            this.salasRecorridas.push(this.salaActual)
            this.haySalaSeleccionada = true
            this.menuRecompensas = this.make.tilemap({
                    key: 'menu_recompensas_dungeon'
            })
            const tiles_menu = this.menuRecompensas.addTilesetImage('UI_patrones_menu','tilesMenuSet')
            this.pantallaRecompensas = []
            this.pantallaRecompensas.push(this.menuRecompensas.createLayer('capa1',tiles_menu))
            this.pantallaRecompensas.push(this.menuRecompensas.createLayer('capa2',tiles_menu))
            this.pantallaRecompensas.push(this.menuRecompensas.createLayer('capa3',tiles_menu))
        
            
            this.pantallaRecompensas.forEach(capa => {
                capa.setScale(1.5,1.5)             
                capa.setX(this.correccion_x-200) 
                capa.setY(this.correccion_y)   
                capa.setDepth(20)
            });
            this.recompensasVisible = true
            this.uiRecompensas = []
            this.uiRecompensas.push(this.add.text(330,170 ,"VICTORIA",{fill:'#000',fontStyle:'bold',fontSize:30}))
            let cerrarBtn = new SpriteButton(this,300,150,'ui_indicadorAPT',1,()=>this.cerrarRecompensas(),'ui_indicadorAPT',1,false,'cerrarTaberna')
            cerrarBtn.icon.setVisible(false)
            cerrarBtn.setScale(2,2)
            this.uiRecompensas.push(cerrarBtn)
            
            
            
            for (var key in this.mapa_info.Grafo[this.salaActual].recompensa){
                if(key == 'exp'){
                    this.uiRecompensas.push(this.add.text(330,200 ,"EXP GANADO - " + this.mapa_info.Grafo[this.salaActual].recompensa[key],{fill:'#000',fontStyle:'bold',fontSize:20}))

                    for(let i = 0; i < 3 ; i++){
                        this.playerTeam[i].freeExPoint += this.mapa_info.Grafo[this.salaActual].recompensa[key]
                    }
                }
                if(key == 'items'){
                    this.uiRecompensas.push(this.add.text(330,220 ,"OBJETOS OBTENIDOS:",{fill:'#000',fontStyle:'bold',fontSize:16}))
                    this.uiRecompensasObj = []
                    let i = 0
                    this.mapa_info.Grafo[this.salaActual].recompensa.items.forEach(item => {
                        let obj = catalogoObjetos[item.tipo][item.id]
                        let uiObj = new inventarioObj(obj,420,260 + 80 * i,this,item.tipo,item.id)
                        uiObj.escalar(10,3,16,14)
                        this.uiRecompensasObj.push(uiObj)
                        this.inventario.push(item)
                        i++
                    });
                }
            }
            this.uiRecompensas.forEach(element => {
                element.setDepth(21)
            });
        } else{
            this.salasRecorridas = []
            this.haySalaSeleccionada = false

        }


        
        this.indicadorSalaActual = this.add.sprite(0, 0, 'mapIndicators', 4)
        this.actualizarSimboloSala()
        this.actualizarUI()
    }

    crearMapa(){
        this.mapa_id = this.mapa_info.id
        this.map = this.make.tilemap({ 
            key: this.mapa_id
          });
          const tiles_map = this.map.addTilesetImage('Tiles_Map', 'Tiles_Map');
        
        //nombre de la paleta de tiles usado para pintar en tiled 
        //Mantener nombres constantes al crear mapa -> Tiles_Map
        this.mapaDungeon = this.map.createLayer('MapaDungeon', [tiles_map]);        
        this.mapaDungeon.setScale(1.5,1.5) 
        this.mapaDungeon.setX(this.correccion_x) 
        this.mapaDungeon.setY(this.correccion_y)   
        this.Decoracion1 = this.map.createLayer('Decoracion1', [tiles_map]);        
        this.Decoracion1.setScale(1.5,1.5) 
        this.Decoracion1.setX(this.correccion_x) 
        this.Decoracion1.setY(this.correccion_y)   
        this.Decoracion2 = this.map.createLayer('Decoracion2', [tiles_map]);        
        this.Decoracion2.setScale(1.5,1.5) 
        this.Decoracion2.setX(this.correccion_x) 
        this.Decoracion2.setY(this.correccion_y)  

        
        this.botonesDungeon = this.map.createLayer('botones',[tiles_map]);
        this.botonesDungeon.setScale(1.5,1.5) 
        this.botonesDungeon.setX(this.correccion_x) 
        this.botonesDungeon.setY(this.correccion_y - 12)   
        this.botonesDungeon.setVisible(false)
        this.botonesSprite = []
        this.botonesDungeon.forEachTile((tile) => {

            if(tile.index == -1) return;
            
           
            let spr = this.add.sprite(tile.getCenterX(),tile.getCenterY(),'Tiles_Map_Spr',tile.index)
            spr.setAlpha(0.1)
            let hab = this.mapa_info.Grafo.findIndex((h) => 
                h.id === tile.index -1)

            if(this.botonesSprite[hab] == undefined){
                    this.botonesSprite[hab] = []
                }
            if(this.mapa_info.Grafo[hab].inicio){
                if(!this.haySalaSeleccionada){
                    this.salaActual =  hab
                    this.haySalaSeleccionada = true
                }
            }else if (this.mapa_info.Grafo[hab].final){
                spr.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.salirDeLaMazmorra(hab) )
            } else{
                spr.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.entrarASala(hab) )
            }
            this.botonesSprite[hab].push(spr)
        
        })
        console.log(this.salaActual)
    }
    _crearUIInventario() {
        let i = 0
        this.inventario.forEach(obj => {
            this.menuMejora.createUIInventario(obj, i)
            i++
        });
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
crearMenuMejora(){
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

    this.menuMejoraBotonCerrar = new SpriteButton(this, 100, 50, 'ui_buttons', 1, () => this.mostrarMenuTaberna(false), 'ui_indicadorAPT', 1, false, 'cerrarTaberna')
    this.menuMejoraBotonCerrar.setDepth(6)
    this.menuMejoraBotonCerrar.icon.setScale(1.5, 1.5)

    this.botonesPersonajesSeleccionados = []
    for (let i = 0; i < 3; i++) {
        this.botonesPersonajesSeleccionados.push(new SpriteButton(this, 415, 110 + (70 * i), 'ui_buttons', 7, () => this.seleccionaSlot(i), 'ui_buttons', 9, true))
        this.botonesPersonajesSeleccionados[i].setScale(4, 4)
        this.botonesPersonajesSeleccionados[i].icon.setScale(4, 4)
        this.botonesPersonajesSeleccionados[i].setDepth(6)

    }

    for (let i = 0; i < 3; i++) {
        this.menuMejora.crearMenuMejoraPersonaje(i)
        this.menuMejora.setMenuMejoraPersonaje(i)            
    }

    this.ui_inventario = []
        for (let i = 0; i < 3; i++) {
            this.updateListaSeleccionados(this.playerTeam[i], i)

        }
        this._crearUIInventario()

    }
    setVisibleBotonesMejora(i, val) {
        for (var key in this.botonesMejoraPersonajes[i]) {
            this.botonesMejoraPersonajes[i][key].setVisible(val)
        }
    }
    mostrarMenuTaberna(v) {
        this.menuMejoraVisible = v
        this.actualizarUI()
    }
    updateListaSeleccionados(char, i) {
        this.botonesPersonajesSeleccionados[i].icon.setTexture('ui_characters', char.getUi_icon())
        this.playerTeam[i] = char

    }

    actualizarUI(){
        this.menuTabernaSeleccionBcgnd.setVisible(this.menuMejoraVisible)
        this.menuTabernaSeleccionadosBcgnd.setVisible(this.menuMejoraVisible)
        this.menuMejora.botonMenuMejora.setVisible(!this.recompensasVisible && !this.menuMejoraVisible)
        this.menuMejoraBotonCerrar.setVisible(this.menuMejoraVisible)
        this.menuPersonajeSimbolos.setVisible(this.menuMejoraVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0 && !this.menuSeleccionPersonajesVisible)
        this.menuPersonajesBcgnd.setVisible(this.menuMejoraVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0 && !this.menuSeleccionPersonajesVisible)
        for (let i = 0; i < 3; i++) {
            this.botonesPersonajesSeleccionados[i].setVisible(this.menuMejoraVisible || this.menuSeleccionPersonajesVisible)
    
            this.menuMejora.setVisibleBotonesMejora(i, this.menuMejoraVisible && this.hayIndiceSeleccionado && this.playerTeam[this.indiceSeleccionado] != 0 && !this.menuSeleccionPersonajesVisible && i == this.indiceSeleccionado)
            }
        this.menuMejora.setVisibleInventario(this.menuMejoraVisible)
    }

    cerrarRecompensas(){
        this.uiRecompensas.forEach(e => {
            e.setVisible(false)
        })
        this.pantallaRecompensas.forEach(e => {
            e.setVisible(false)
        })
        this.uiRecompensasObj.forEach(e => {
            e.setvisible(false)
        })
        this.recompensasVisible = false
        
    }
    compruebaCamino(hab){
        return this.mapa_info.Grafo[this.salaActual].caminos.findIndex(i => i == hab) != -1
    }

    entrarASala(hab){
        console.log(hab + " " + this.salaActual)
        if(this.compruebaCamino(hab)){
            this.salaActual = hab
            this.seleccionarHabitacion(this.mapa_info.Grafo[hab])
        }

    }

    actualizarSimboloSala(){
        let isaX = 0, isaY = 0, NumCasillas = 0
        console.log(this.botonesSprite[this.salaActual])
        this.botonesSprite[this.salaActual].forEach(t => {
            isaX += t.x
            isaY += t.y
            NumCasillas++
        });
        this.indicadorSalaActual.x = isaX/NumCasillas
        this.indicadorSalaActual.y = isaY/NumCasillas -20
        this.indicadorSalaActual.setScale(5,5)
    }

    seleccionarHabitacion(hab){
        if(this.salasRecorridas.indexOf(hab.id) == -1){
            this.scene.start('Combate',{mapa_id: hab.ruta, personajesEquipo: this.personajesEquipo,sala:this.salaActual,salasRecorridas: this.salasRecorridas, mapa:this.mapa_info, inventario:this.inventario});
        } else{
            this.salaActual=hab.id
            this.actualizarSimboloSala()
        }
    }
    salirDeLaMazmorra(hab){
        if(this.compruebaCamino(hab)){
            this.scene.start('Mapa',{personajesEquipo: this.personajesEquipo, inventario:this.inventario});
        }
    }

}