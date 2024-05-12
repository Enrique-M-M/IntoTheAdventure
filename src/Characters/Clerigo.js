import PlayerChar from "../playerChar";

export class Clerigo extends PlayerChar{
    constructor(char,scene,x,y){
        super(char,scene,x,y)
        this.acciones.Habilidad1 = this.Habilidad1()
        if(this.mejorasAplicadas.indexOf('Habilidad1') != -1){
            this.acciones.Habilidad1 = this.Habilidad1()
        }
    }

    Habilidad1(){
        return {nombre: 'Curacion', rango: 2,area:1, accion: (areaSeleccion) => {if(this.realizarAccion(1)){
        console.log('Curacion')
        this.curacion(areaSeleccion)
        }}, tipoSeleccion: 'Habilidad', index: 2}
    }
    curacion(areaSeleccion){
        this.realizarCuracion(areaSeleccion[0],50)
    }
}