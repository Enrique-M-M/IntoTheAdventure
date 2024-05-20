import PlayerChar from "../playerChar";

export class Vampiro extends PlayerChar{


    constructor(char,scene,x,y){
        super(char,scene,x,y)
        if(this.mejorasAplicadas.indexOf('Habilidad1') != -1){
            this.acciones.Habilidad1 = this.Habilidad1()
        }
    }

    Habilidad1(){
        return {nombre: 'Golpe Sangriento', rango: 1,area:1, accion: (areaSeleccion) => {if(this.realizarAccion(2)){
        console.log('Golpe Sangriento')
        this.golpeSangriento(areaSeleccion)
        }}, tipoSeleccion: 'Habilidad', index: 4}
    }
    golpeSangriento(areaSeleccion){
        this.hacerDano(areaSeleccion[0],50)
        this.recibeCuracion(25)
    }
}
