import PlayerChar from "../playerChar";

export class Vampiro extends PlayerChar{


    constructor(char,scene,x,y){
        super(char,scene,x,y)
        this.acciones.Habilidad1 = this.Habilidad1()
        if(this.mejorasAplicadas.indexOf('Habilidad1') != -1){
            this.acciones.Habilidad1 = this.Habilidad1()
        }
    }

    Habilidad1(){
        return {nombre: 'Escudo', rango: 1,area:1, accion: (areaSeleccion) => {if(this.realizarAccion(1)){
        console.log('Golpe Sangriento')
        this.golpeSangriento(areaSeleccion)
        }}, tipoSeleccion: 'Habilidad', index: 4}
    }
    golpeSangriento(areaSeleccion){
        this.hacerDano(areaSeleccion[0],50)
        this.recibeCuracion(25)
    }
}
