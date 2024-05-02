import PruebaDungeon_info from "../assets/Dungeons/PruebaDungeon_info";
import { SpriteButton } from "./spriteButtom";

export default class Dungeon extends Phaser.Scene {
    
    haySalaSeleccionada
    salaActual

    constructor() {
        super({ key: 'Dungeon' });
    }
    init (data)
    {
        this.mapa_info = data.mapa_info
        this.playerTeam = data.peronajesEquipo
        this.salaActual = data.salaActual
        this.haySalaSeleccionada = this.salaActual != undefined
        console.log(this.haySalaSeleccionada)
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
                    this.salaActual =  hab + 1
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
    compruebaCamino(hab){
        return this.mapa_info.Grafo[this.salaActual - 1].caminos.findIndex(i => i == hab + 1) != -1
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
        this.botonesSprite[this.salaActual - 1 ].forEach(t => {
            isaX += t.x
            isaY += t.y
            NumCasillas++
        });
        this.indicadorSalaActual.x = isaX/NumCasillas
        this.indicadorSalaActual.y = isaY/NumCasillas
        this.indicadorSalaActual.setScale(NumCasillas/2)
    }

    seleccionarHabitacion(hab){
        this.scene.start('Combate',{mapa_id: hab.ruta, peronajesEquipo: this.playerTeam,sala:this.salaActual, mapa:this.mapa_info});
    }
    salirDeLaMazmorra(){
        this.scene.start('Mapa',{peronajesEquipo: this.playerTeam});
    }

}