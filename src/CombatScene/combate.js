import Player from '../playerChar.js';
import Phaser from 'phaser'




import { TextButton } from '../textButtom.js';
import {SpriteButton } from '../spriteButtom.js'


import { neigbours, frontNeigbours, crossNeigbours, indexBadTileBackground } from '../constants.js';
import { CombatManager } from './combatManager.js';
import PlayerChar from '../playerChar.js';
import EnemyChar from '../EnemyChar.js';
import { enemigos } from '../../assets/CharactersInfo/EnemyDATA.js';
/* 
 * @abstract 
 * @extends Phaser.Scene
 * 
 * Input data = {
 *  mapa_id: NOMBRE_ARCHIVO_MAPA
 *  allyTeam: array de charData de personajes elegidos
 *  
 * }
 */
export default class Combate extends Phaser.Scene {


    constructor() {
        super({ key: 'Combate' });
    }
    init (data)
    {
        console.log('init', data);
        this.mapa_id = data.mapa_id 
        this.charData = data.peronajesEquipo
    }

    preload(){
        this.load.setPath('assets/sprites/');
    }

    create(){  
        console.log("create map");
        this.createMap()
        this.createManager();
        this.configurarCamara()
        this.controlInputMouseClick()
        this.createUI()
    }
    
   //+++++++++++++ User Interface y Pintado Mapa +++++++++++++++++++++++++

    configurarCamara(){
        this.cameras.main.setZoom(4);
        this.cameras.main.scrollX = -this.map.widthInPixels / 2 - 465;
        this.cameras.main.scrollY = -this.map.heightInPixels / 2 - 260;
        console.log("pos cameras " +this.cameras.main.scrollX +" " +this.cameras.main.scrollY );
    }
    createUI(){
        //@indicatorTile -> Indicador al clickar en una casilla
        this.indicatorTile = this.add.sprite(0,0,'mapIndicators',4) ;
        this.indicatorTile.setVisible(false);
        this.indicatorTile.setScale(1,1);
        
        //@hoverIndicatorTile -> Indicador al mover el raton sobre un area resaltada
        this.hoverIndicatorTile = this.add.sprite(0,0,'mapIndicators',5) ;
        this.hoverIndicatorTile.setVisible(false);
        this.hoverIndicatorTile.setScale(1,1);

        //@emempezarCombate_btn -> boton para pasar el primer turno en el despliegue
        this.empezarCombate_btn = new TextButton(this, -122,-44, 'Iniciar', {fill: '#FFF'}, () => this.pasarTurno(),'ui_buttons',4)

        //@pasarTurno_btn -> boton para pasar el turno
        this.pasarTurno_btn = new TextButton(this, -116,-44, 'Fin Turno', {fill: '#FFF'}, () => this.pasarTurno(),'ui_buttons',4)
        this.pasarTurno_btn.setVisible(false)
        this.pasarTurno_btn.setInteractive(false)

        //@casillasSeleccionadas -> array de sprites que resaltan un area de seleccion. Si no hay accion seleccionada se vacia
        this.casillasSeleccionadas = []
        this.areaSeleccion = []
        this.areaSeleccionIndex = []

        //@botonPersonaje1 2 3 -> Boton con la cara del personaje. Al clickar selecciona al personaje asignado segun el orden del playerTeam
        let botonPersonaje1 = new SpriteButton(this, -140, -20, 'ui_buttons', 1, () => this.selecciona(this.playerTeam[0]), 'ui_characters', this.playerTeam[0].getUi_icon(),false)
        
        let botonPersonaje2 = new SpriteButton(this, -140, 10, 'ui_buttons', 1, () => this.selecciona(this.playerTeam[1]), 'ui_characters', this.playerTeam[1].getUi_icon(),false)
    
        let botonPersonaje3 = new SpriteButton(this, -140, 40, 'ui_buttons', 1, () => this.selecciona(this.playerTeam[2]), 'ui_characters', this.playerTeam[2].getUi_icon(),false)
        
        //@botonesPersonajes -> Array que contiene los botones en orden de los personajes
        this.botonesPersonajes = [botonPersonaje1, botonPersonaje2, botonPersonaje3]
        this.botonesPersonajes.forEach(element => {
            element.desactivar() //inician desactivados hasta el despliegue
        })

        //@botonerasPersonajes -> Matriz de botones de accion de los personajes. La primera coordenada indica el index del personaje.
        //La segunda coordenada recorre los botones de las acciones. 
        this.botonerasPersonajes = []
        for(let i = 0; i < 3; i++){
            //TODO: Refactor de la creaccion para comodarse al array de acciones
            let botonera = [new SpriteButton(this, this.botonesPersonajes[i].x + 17, this.botonesPersonajes[i].y, 'ui_buttons', 1, () => {this.seleccionaAccion(this.playerTeam[i].acciones.Mover, i)}, 'ui_actions_icon', 1,true, this.playerTeam[i].acciones.Mover.nombre),
            new SpriteButton(this, this.botonesPersonajes[i].x + 16*2 +1, this.botonesPersonajes[i].y, 'ui_buttons', 1, () => {this.seleccionaAccion(this.playerTeam[i].acciones.AtaqueBasico,i)}, 'ui_actions_icon', 3, true, this.playerTeam[i].acciones.AtaqueBasico.nombre)]
            botonera.forEach(btn => {
                btn.setScale(0.8,0.8)
                btn.setVisible(false)
            });
           this.botonerasPersonajes.push(botonera) 
        }
    }

    selecciona(char){
        this.combatManager.seleccionaPersonajeC(char)
        this.indicatorTile.setVisible(false)
    }

    showUIChar(index,val){
        this.botonerasPersonajes[index].forEach(btn => {
            btn.setVisible(val)
            btn.setInteractive(val)
        });
    }

    hideUIDespliegue(){
        this.empezarCombate_btn.setVisible(false)
        this.empezarCombate_btn.setInteractive(false)
        this.pasarTurno_btn.setVisible(true)
        this.pasarTurno_btn.setInteractive(true)
    }

    mostrarDespliegue(val){
        this.despliegue.setVisible(val)
    }

    //Reduce la opacidad de los objetos entre la camara y la seleccion
    visibilidadSeleccion(targetVec){
        for(let cords of frontNeigbours){
            if(this.checkCasillaEnTablero({x: targetVec.x + cords[0], y:targetVec.y +cords[1]}))
                this.spritesEnCapaJuego.forEach(tile =>{ 
                    if(tile.x === targetVec.x +cords[0] && tile.y === targetVec.y +cords[1]){
                        tile.sprite.setAlpha(0.6)
                    }     
                })
        }
    }

    //-------------- Algoritmo para mostrar el rango para la seleccion de casillas de una accion --------------------------
    mostrarRangoAccion(char, range,area, tipoSeleccion){
        this.combatManager.resetrAlpha()
        let tilesChecked = []
        let tilesToCheck = []
        let targetVec = new Phaser.Math.Vector2(char.tileX, char.tileY)
        console.log("Personaje en " + targetVec.x + " " +targetVec.y)
        this._mostrarRango(targetVec,targetVec,range,area,0, tipoSeleccion,tilesToCheck,tilesChecked)
    }

    //Recorre recursivamente las casillas vecina de una casilla y si entran dentro del rango llama a _CasillaAMostrar
    _mostrarRango(originVec, targetVec, range,area, dist = 0, tipoSeleccion, tilesToCheck, tilesChecked){
        if(!this._arrayContieneVector(tilesChecked,targetVec)){
            
            this._casillaAMostrar(targetVec, tipoSeleccion, area)
        }
        tilesChecked.push({x: targetVec.x, y: targetVec.y, di: dist});
        let newVec = new Phaser.Math.Vector2()
        for (let cords of crossNeigbours){
            newVec.x = targetVec.x + cords[0]
            newVec.y =  targetVec.y + cords[1]
            if(this.checkCasillaEnTablero(newVec) && range > dist
             && (!this._arrayContieneVector(tilesChecked,newVec) || !this._arrayObjetoEnVector(tilesChecked,newVec).di < dist + 1 )
            ){
                if((tipoSeleccion != 'Movimiento' 
                    || (!indexBadTileBackground.find(i => i === this.capaSuelo.getTileAt(newVec.x, newVec.y, true).index) && !this.casillaOcupada(newVec)))
                    ){
                        if(this.capaJuego.getTileAt(newVec.x,newVec.y,true).index === -1 ){
                            this._mostrarRango(originVec, newVec, range, area, dist + 1,  tipoSeleccion,tilesToCheck, tilesChecked)
                        }
                    }
                }
        }
        
    }

    //Crea un sprite en la posicion targetVec. 
    _casillaAMostrar(targetVec,tipoSeleccion, area){
        let cS;
        let tileCJ = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true)
        if(tipoSeleccion === 'Movimiento'){
            cS = new Phaser.GameObjects.Sprite(this,tileCJ.getCenterX(), tileCJ.getBottom() +5,'mapIndicators',0)
        }
        else{
            cS = new Phaser.GameObjects.Sprite(this,tileCJ.getCenterX(), tileCJ.getBottom() +5,'mapIndicators',1)
        }

        cS.setInteractive({ useHandCursor: true })
        .on('pointerover', () => {this.moveHoverToSprite(cS,area)} )
        .on('pointerout', () =>{ this.hoverIndicatorTile.setVisible(false); this._borrarArea() })
        .on('pointerdown', () => {this.combatManager.realizaAccion(this.areaSeleccionIndex); this._borrarArea()}
        );
        this.visibilidadSeleccion(targetVec)
        cS.setDepth(0)
        this.casillasSeleccionadas.push(cS)        
        this.add.existing(cS)
    }

    moveHoverToSprite(tile,area){
        this.hoverIndicatorTile.x = tile.x
        this.hoverIndicatorTile.y = tile.y
        this.hoverIndicatorTile.setDepth(tile.depth+1)
        this.hoverIndicatorTile.setVisible(true)
        let targetVec = {x: this.capaJuego.getTileAtWorldXY(this.hoverIndicatorTile.x, this.hoverIndicatorTile.y,true).x,y: this.capaJuego.getTileAtWorldXY(this.hoverIndicatorTile.x, this.hoverIndicatorTile.y,true).y}
        this.mostrarAreaAccion(targetVec,area)
    }

    mostrarAreaAccion(targetVec, area){
        this._borrarArea()
        let tilesChecked = []
        let tilesToCheck = []
        console.log("Area mostrada en casilla " + targetVec.x, +" "+ targetVec.y)
        this._mostarArea(targetVec,targetVec,area,1,tilesToCheck,tilesChecked)
    
    }
    _mostarArea(originVec, targetVec, area, dist, tilesToCheck, tilesChecked){
        if(!this._arrayContieneVector(tilesChecked,targetVec)){
            this._areaAmostrar(targetVec)
        }
        tilesChecked.push({x: targetVec.x, y: targetVec.y, di: dist});
        let newVec = new Phaser.Math.Vector2()
        for (let cords of crossNeigbours){
            newVec.x = targetVec.x + cords[0]
            newVec.y =  targetVec.y + cords[1]
            if(this.checkCasillaEnTablero(newVec) && area > dist
            && (!this._arrayContieneVector(tilesChecked,newVec) || !this._arrayObjetoEnVector(tilesChecked,newVec).di < dist + 1 )
            ){
                if(this.capaJuego.getTileAt(newVec.x,newVec.y,true).index === -1 ){
                    this._mostarArea(originVec, newVec, area, dist + 1,tilesToCheck, tilesChecked)
                }
            }
            }
    }
    

    _areaAmostrar(targetVec)
    {
        let tileCJ = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true)
        let spt = this.add.sprite(tileCJ.getCenterX(), tileCJ.getBottom() +5,'mapIndicators',5)
        spt.setVisible(true)
        this.hoverIndicatorTile.setDepth(tileCJ.depth+1)
        this.areaSeleccion.push(spt)
        this.areaSeleccionIndex.push({x:targetVec.x, y: targetVec.y})

    }

    _borrarCasillasMostradas(){
        while(this.casillasSeleccionadas.length > 0){
            let sp = this.casillasSeleccionadas.pop()
            sp.destroy(true)
        }
        this.hoverIndicatorTile.setVisible(false)
    }
    _borrarArea(){
        
        console.log("+++++++++++++++Area mostrada borrada")
        while(this.areaSeleccion.length > 0){
            let sp = this.areaSeleccion.pop()
            this.areaSeleccionIndex.pop()
            sp.destroy(true)
        }
    }

    //+++++++++++++ Tile Map +++++++++++++++++++++++++

    createMap(){  
        this.map = this.make.tilemap({ 
            key: this.mapa_id
          });

        //nombre de la paleta de tiles usado para pintar en tiled 
        //Mantener nombres constantes al crear mapa -> Tiles_Map
        const tiles_map = this.map.addTilesetImage('Tiles_Map', 'Tiles_Map');
        const tiles_desp = this.map.addTilesetImage('TileIndicators','mapIndicators')
        this.capaSuelo = this.map.createLayer('Suelo', [tiles_map]);                               
        this.capaJuego = this.map.createLayer('CapaJuego', [tiles_map]);
        this.spritesEnCapaJuego = []
        
        //Los tiles de la capa de juego se gestionaran como sprites para permitir el renderizado en orden de los personajes.
        for(let j = 0; j < this.map.height; j++ ){
            for (let i = 0; i < this.map.width; i++){
                let obj = this.capaJuego.getTileAt(i,j,true)
                if(obj!= null && obj.index != -1){
                    let spr = this.add.sprite(obj.getCenterX(),obj.getCenterY(),'Tiles_Map_Spr',obj.index -1 )
                    spr.setDepth(i+j)
                    this.spritesEnCapaJuego.push({x: i, y: j, sprite: spr })
                }
            }
        }
        this.capaJuego.setVisible(false)
        

        this.despliegue = this.map.createLayer('CapaDespliegue', [tiles_desp]);
    
        this.enemies = [];
        for (const objeto of this.map.getObjectLayer('Enemy_layer').objects) {
            // `objeto.name` u `objeto.type` nos llegan de las propiedades del
            // objeto en Tiled
            //  console.log(objeto.name);
              let enemy_name = objeto.name;
             // console.log(enemigos[enemy_name])
              let enemypj = new EnemyChar (enemigos[enemy_name],this, objeto.x, objeto.y);
              console.log(enemypj);
              this.enemies.push(enemypj);
        }
        
        //this.enemies.map(en => en.setVisible(true));               
        this.despliegue.setVisible(false)

    }


     //+++++++++++++ Combat Manager +++++++++++++++++++++++++

    createManager(){
        //input del player
        this.playerTeam = [new PlayerChar(this.charData.personaje1, this),
                                new PlayerChar(this.charData.personaje2, this),
                                new PlayerChar(this.charData.personaje3, this)
        ]; 
        this.combatManager = new CombatManager(this.enemies,this.playerTeam,3 ,this,this.spritesEnCapaJuego);
        console.log("Creado personaje "+ this.playerTeam[0].name)
        this.combatManager.nextTurn();
    }

    pasarTurno(){
        //LLAMA A COMBATMANAGER
        this.combatManager.nextTurn()
        //RESETEA LA UI AL INICIO DEL TURNO
        this.indicatorTile.setVisible(false)
        this.botonerasPersonajes.forEach(btns => {
            btns.forEach(btn => {
                btn.unSelect()
            })
        })
    }

    //gestionar la ui de un personaje que ha muerto
    personajeMuerto(char){
        let index = this.combatManager.personajeMuerto(char)
        this.botonerasPersonajes[index].forEach(btn =>{btn.setVisible(false); btn.setInteractive(false)})
        this.botonesPersonajes[index].desactivar()

    }

    derrotaCombate(){
        console.log("HAN MUERTO TODOS LOS PERSONAJES")
    }

     //+++++++++++++ Controles +++++++++++++++++++++++++
    
     //TODO?: Si se clicka en una casilla para seleccion de una habilidad no hacer visible el marcador
    controlInputMouseClick(){
        this.input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {
            
            //Consigue Index XY de la tile de la capaJuego
            const { worldX, worldY } = pointer;
            const targetVec = this.calculaTileXYClicked(worldX,worldY);
            if(!this.checkCasillaEnTablero(targetVec)){
                return;
            }
            this.combatManager.clickOnTile(targetVec);

            if(this.combatManager.checkEnPersonajeAliadoEnCasilla(targetVec)){
                this.indicatorTile.setVisible(false);
            } else{
                if(this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).index != -1){
                    this.indicatorTile.setTexture('mapIndicators', 2)
                    this.indicatorTile.y = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterY()+4;
                }
                else{
                    this.indicatorTile.setTexture('mapIndicators', 4)
                    this.indicatorTile.y = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getBottom()+4; 
                }
                this.indicatorTile.x = this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).getCenterX();
                this.indicatorTile.setVisible(true);
                this.indicatorTile.setDepth(targetVec.x + targetVec.y)
            }
            
            
            this.combatManager.resetrAlpha()
            this.visibilidadSeleccion(targetVec)
            // use startVec and targetVec
        })
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.off(Phaser.Input.Events.POINTER_UP)
        })
    }

    //----------------------------- Seleccion en Combate ---------------------------------------------------------


    seleccionaAccion(accion, indexChar){
        if(!this.combatManager.accionSeleccionada){
            if(this.combatManager.seleccionaAccion(accion, indexChar))
            this.mostrarRangoAccion(this.playerTeam[indexChar],accion.rango,accion.area, accion.tipoSeleccion)
        }
        else if(this.combatManager.accionSeleccionada && this.combatManager.ultimaAccionSeleccionada === accion ){
            this.combatManager.deseleccionaAccion()
        } else {
            findButton({indexP: indexChar, nombreA: accion.nombre}).unSelect()
            if(this.combatManager.seleccionaAccion(accion, indexChar))
            this.mostrarRangoAccion(this.playerTeam[indexChar],accion.rango,accion.area,accion.tipoSeleccion)
        }
    }


    //----------------------------- Funciones de busqueda y utilidades -------------------------------------------
    
    checkCasillaEnTablero(targetVec){
        return !(targetVec.x >= this.map.width || targetVec.x < 0 || targetVec.y >= this.map.height || targetVec.y < 0)
     }

    casillaOcupada(targetVec){
        return this.capaJuego.getTileAt(targetVec.x,targetVec.y,true).index != -1 || this.combatManager.casillaOcupada(targetVec)
    }
     


    calculaTileXYClicked(worldX, worldY){
        const targetVec = this.capaJuego.worldToTileXY(worldX, worldY,true);
        targetVec.x = Math.trunc(targetVec.x);
        targetVec.y = Math.trunc(targetVec.y);

        //Corrige por abajo para + comodidad
        if(targetVec.x === 8) {targetVec.x=7 
            targetVec.y--}
        if(targetVec.y === 8) {targetVec.y=7
            targetVec.x--
        }

        return targetVec
    }
    


    _arrayContieneVector(array, vector){
        let ret = false
        array.forEach(val => {
            if(val.x == vector.x && val.y == vector.y) {
                ret = true
            }
        })
        return ret
    }

    _arrayObjetoEnVector(array, vector){
        let ret = null
        array.forEach(val => {
            if(val.x == vector.x && val.y == vector.y) {
                ret = val
            }
        })
        return ret
    }



    findButtom(indexChar, accion){
        let ret
        this.botonerasPersonajes[indexChar].forEach(btn => {
            if(accion === btn.nombreA)
                ret= btn
        });
        return ret
    }
}