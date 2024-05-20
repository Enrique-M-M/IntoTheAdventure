import PlayerChar from "../playerChar";

var valoresHabilidad1 = {dano: 30,rango:3, area: 2, coste:2}

var valoresHabilidad2 = {curacion: 20,rango:1, coste:1}

export class Ranger extends PlayerChar{
    constructor(char,scene,x,y){
        super(char,scene,x,y)
        if(this.mejorasAplicadas.indexOf('Habilidad1') != -1){
            this.acciones.Habilidad1 = this.Habilidad1()
        }
        if(this.mejorasAplicadas.indexOf('Habilidad2') != -1){
            this.acciones.Habilidad2 = this.Habilidad2()
        }
        this.hasHbilidad2 = true
    }

    Habilidad1(){
        return {nombre: 'Lluvia de flechas', rango: valoresHabilidad1.rango,area:valoresHabilidad1.area, accion: (areaSeleccion) => {if(this.realizarAccion(valoresHabilidad1.coste)){
        console.log('Lluvia de flechas')
        this.Lluviadeflechas(areaSeleccion)
        }}, tipoSeleccion: 'Habilidad', index: 6,
        texto: 'Daña a los enemigos en cruz\nRango: ' + valoresHabilidad1.rango + ' Daño: '+valoresHabilidad1.dano}
    }

    Habilidad2(){
        return {nombre: 'Curacion', rango: valoresHabilidad2.rango ,area:1, accion: (areaSeleccion) => {if(this.realizarAccion(valoresHabilidad2.coste)){
        console.log('Curacion')
        this.curacion(areaSeleccion)
        }}, tipoSeleccion: 'Habilidad', index:5,
        texto: 'Cura ' + valoresHabilidad2.curacion + 'hp a un personaje\nRango: ' + valoresHabilidad2.rango}
    }
    Lluviadeflechas(areaSeleccion){
        areaSeleccion.forEach(casilla => {
            this.hacerDano(casilla,valoresHabilidad1.dano)
        });
    }

    curacion(areaSeleccion){
        this.realizarCuracion(areaSeleccion[0],valoresHabilidad2.curacion)
    }
}