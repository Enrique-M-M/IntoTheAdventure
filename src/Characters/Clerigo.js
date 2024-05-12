import PlayerChar from "../playerChar";

var valoresHabilidad1 = {curacion: 50, rango: 2}

export class Clerigo extends PlayerChar{
    constructor(char,scene,x,y){
        super(char,scene,x,y)
        if(this.mejorasAplicadas.indexOf('Habilidad1') != -1){
            this.acciones.Habilidad1 = this.Habilidad1()
        }
    }

    Habilidad1(){
        return {nombre: 'Curacion', rango: valoresHabilidad1.rango,area:1, accion: (areaSeleccion) => {if(this.realizarAccion(1)){
        console.log('Curacion')
        this.curacion(areaSeleccion)
        }}, tipoSeleccion: 'Habilidad', index: 5, 
        texto: 'Cura ' + valoresHabilidad1.curacion + 'hp a un personaje\nRango: ' + valoresHabilidad1.rango}
    }
    curacion(areaSeleccion){
        this.realizarCuracion(areaSeleccion[0],valoresHabilidad1.curacion)
    }
}