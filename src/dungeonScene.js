import { catalogoObjetos } from "../assets/CharactersInfo/ObjectsDATA";
import PruebaDungeon_info from "../assets/Dungeons/PruebaDungeon_info";
import { inventarioObj } from "./ClasesUI/inventarioObj";
import { SpriteButton } from "./ClasesUI/spriteButtom";

export default class Dungeon extends Phaser.Scene {
    
    
    salaActual

    constructor() {
        super({ key: 'Dungeon' });
    }
    init (data)
    {
        this.mapa_info = data.mapa_info
        this.playerTeam = data.personajesEquipo
        this.salaActual = data.salaActual
        this.inventario = data.inventario
        this.haySalaSeleccionada = this.salaActual != undefined
    }

    preload(){
        this.load.setPath('assets/sprites/');
    }

    create(){  

        this.correccion_y = 150
        this.correccion_x = 500

        this.mapa_id = this.mapa_info.id
        this.map = this.make.tilemap({ 
            key: this.mapa_id
          });

        //nombre de la paleta de tiles usado para pintar en tiled 
        //Mantener nombres constantes al crear mapa -> Tiles_Map
        const tiles_map = this.map.addTilesetImage('Tiles_Map', 'Tiles_Map');
        this.mapaDungeon = this.map.createLayer('MapaDungeon', [tiles_map]);        
        this.mapaDungeon.setScale(1.5,1.5) 
        this.mapaDungeon.setX(this.correccion_x) 
        this.mapaDungeon.setY(this.correccion_y)   
        

        if(this.haySalaSeleccionada){//Victoria en combate
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
        }

        this.botonesDungeon = this.map.createLayer('botones',[tiles_map]);
        this.botonesDungeon.setScale(1.5,1.5) 
        this.botonesDungeon.setX(this.correccion_x) 
        this.botonesDungeon.setY(this.correccion_y)   
        this.botonesDungeon.setVisible(false)
        this.botonesSprite = []
        this.botonesDungeon.forEachTile((tile) => {

            if(tile.index == -1) return;
            
           
            let spr = this.add.sprite(tile.getCenterX(),tile.getCenterY(),'Tiles_Map_Spr',tile.index)
            spr.setAlpha(0.1)
            let hab = this.mapa_info.Grafo.findIndex((h) => 
                h.id === tile.index)

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
                .on('pointerdown', () => this.salirDeLaMazmorra() )
            } else{
                spr.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.entrarASala(hab) )
            }
            this.botonesSprite[hab].push(spr)
        
        })
        console.log(this.salaActual)

        
        this.indicadorSalaActual = this.add.sprite(0, 0, 'mapIndicators', 4)
        this.actualizarSimboloSala()
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
        
    }
    compruebaCamino(hab){
        return this.mapa_info.Grafo[this.salaActual].caminos.findIndex(i => i == hab + 1) != -1
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
        this.botonesSprite[this.salaActual].forEach(t => {
            isaX += t.x
            isaY += t.y
            NumCasillas++
        });
        this.indicadorSalaActual.x = isaX/NumCasillas
        this.indicadorSalaActual.y = isaY/NumCasillas
        this.indicadorSalaActual.setScale(NumCasillas/2)
    }

    seleccionarHabitacion(hab){
        this.scene.start('Combate',{mapa_id: hab.ruta, personajesEquipo: this.playerTeam,sala:this.salaActual, mapa:this.mapa_info, inventario:this.inventario});
    }
    salirDeLaMazmorra(){
        this.scene.start('Mapa',{personajesEquipo: this.playerTeam, inventario:this.inventario});
    }

}