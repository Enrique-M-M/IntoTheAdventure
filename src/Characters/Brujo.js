import PlayerChar from "../playerChar";


export class Brujo extends PlayerChar{

    constructor(char,scene,x,y){
        super(char,scene,x,y)
        this.pasiva = true
        if(this.mejorasAplicadas.indexOf('Habilidad1') != -1){
            this.acciones.Habilidad1 = this.Habilidad1()
        }

        if(this.mejorasAplicadas.indexOf('Pasiva') != -1){
            this.cheatDeath = true
        }
    }

    muere(){
        if(this.cheatDeath){
            this.cheatDeath = false
            this.currentHp = this.maxHp
        } else{
            this.scene.personajeMuerto(this)
            this.setVisible(false)
        }
    }
    //TODO
    Habilidad1(){
        return {nombre: 'Golpe Sangriento', rango: 1,area:1, accion: (areaSeleccion) => {if(this.realizarAccion(2)){
        console.log('Golpe Sangriento')
        this.golpeSangriento(areaSeleccion)
        }}, tipoSeleccion: 'Habilidad', index: 4}
    }

    Pasiva(){
        return {nombre: 'Engañaar a la Muerte', texto: 'Una vez por combate cuando\nvaya a morir, revive con\ntoda la vida', coste: 2, index: 7}
    }
    golpeSangriento(areaSeleccion){
        this.hacerDano(areaSeleccion[0],50)
        this.recibeCuracion(25)
    }
}
