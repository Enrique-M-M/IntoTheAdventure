import PlayerChar from "../playerChar";

export class Caballero extends PlayerChar{
    constructor(char,scene,x,y){
        super(char,scene,x,y)
        this.acciones.Habilidad1 = this.Habilidad1()
        if(this.mejorasAplicadas.indexOf('Habilidad1') != -1){
            this.acciones.Habilidad1 = this.Habilidad1()
        }
    }

    Habilidad1(){
        return {nombre: 'Golpe Con Escudo', rango: 1,area:1, accion: (areaSeleccion) => {if(this.realizarAccion(1)){
        console.log('Golpe Con Escudo')
        this.golpeEscudo(areaSeleccion)
        }}, tipoSeleccion: 'Habilidad', index: 2}
    }
    golpeEscudo(areaSeleccion){
       this.hacerDano(areaSeleccion[0],10)
       let vect = {x: areaSeleccion[0].x - this.tileX,y:areaSeleccion[0].y -this.tileY}
       
       let ent = this.scene.combatManager.getEntityAt(areaSeleccion[0])
       let posFin = {x:ent.tileX + vect.x,y:ent.tileY + vect.y}
       let ent2 = this.scene.combatManager.getEntityAt(posFin)
       
       if(ent2 == null)
        ent.mover(posFin)
       else{
        ent.recibeDano(20)
        ent2.recibeDano(20)
       }
    }
}