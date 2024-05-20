import { indexBadTileBackground } from "../constants";
import PlayerChar from "../playerChar";
var valoresHabilidad1 = {dano: 30,rango:3, area: 2, coste:2}

export class Picaro extends PlayerChar{

    constructor(char,scene,x,y){
        super(char,scene,x,y)
        if(this.mejorasAplicadas.indexOf('Habilidad1') != -1){
            this.acciones.Habilidad1 = this.Habilidad1()
        }
        if(this.mejorasAplicadas.indexOf('Pasiva')!= -1){
            this.numAtaquesPasiva = 0
            this.pasivaActiva = false
        }
        this.pasiva = true
    }

    //TODO
    Habilidad1(){
        return {nombre: 'Golpe Rápido', rango: 3,area:1, accion: (areaSeleccion) =>
             {if(this.realizarAccionGR(2,areaSeleccion)){
        this.golpeRapido(areaSeleccion)
        }}, tipoSeleccion: 'Habilidad', index: 9,
        formaSeleccion: 'cruz'}
    }
    realizarAccionGR(numApt,areaSeleccion){
        if(this.currentApt >= numApt && this.scene.casillaValidaMovimiento(this.calcularNPos(areaSeleccion[0]))){
            this.currentApt -= numApt
            this.actualizaUIApt()
            return true
        }
        return false
    }

    calculaDanoPasiva(dano){
        let rd = dano
        if(this.mejorasAplicadas.indexOf('Pasiva')!= -1){
            this.numAtaquesPasiva++
            this.pasivaActiva = this.numAtaquesPasiva == 3
            if(this.numAtaquesPasiva == 4){
                rd *= 2
            }
        }
        console.log('Ataque num ' + this.numAtaquesPasiva + " dano " + rd)
        return rd
    }
    
    golpeRapido(areaSeleccion){
        
        let ent = this.scene.combatManager.getEntityAt(areaSeleccion[0])
        let nx = this.tileX > ent
        let posFin = this.calcularNPos(areaSeleccion[0])

        this.mover(posFin)

        this.hacerDano(areaSeleccion[0],this.calculaDanoPasiva(valoresHabilidad1.dano))
    }

    ataqueBasico(areaSeleccion){
        let dano = this.calculaDanoPasiva((this.arma.dmg + this.arma.escalado * this[this.arma.tipoEscalado]))
        areaSeleccion.forEach(targetVec => {
            this.hacerDano(targetVec,dano)
        });
    }
    calcularNPos(targetVec){
        if(targetVec.x == this.tileX){
            return targetVec.y > this.tileY ? {x: targetVec.x, y: targetVec.y - 1} : {x: targetVec.x, y: targetVec.y + 1} 
        }else {
            return targetVec.x > this.tileX ? {x: targetVec.x - 1, y: targetVec.y} : {x: targetVec.x + 1, y: targetVec.y} 
        }
    }
    Pasiva(){
        return {nombre: 'Combo', texto: 'Despues de 3 ataques\n el cuarto hace el doble de daño', coste: 2, index: 10}
    }
}
