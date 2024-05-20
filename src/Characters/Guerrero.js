import PlayerChar from "../playerChar";

export class Guerrero extends PlayerChar{

    constructor(char,scene,x,y){
        super(char,scene,x,y)
        if(this.mejorasAplicadas.indexOf('Habilidad1') != -1){
            this.acciones.Habilidad1 = this.Habilidad1()
        }
        this.pasiva = true
    }

    hacerDano(targetVec,dano){
        let ent = this.scene.combatManager.getEntityAt(targetVec)
        
        this.orientaPersonajeyPlayAnimation('atack', targetVec)
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE , 
            () => {
             this.orientaPersonajeyPlayAnimation('idle') })
        if(ent != null && ent.recibeDano){
            ent.recibeDano(dano)
            if(this.mejorasAplicadas.indexOf('Pasiva') != -1 && !ent.isAllive()){
                this.currentApt++
            }
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
        return {nombre: 'Rabia', texto: 'Cada vez que mate a un\nenemigo recupera un\n punto de accion', coste: 2, index: 8}
    }
    golpeSangriento(areaSeleccion){
        this.hacerDano(areaSeleccion[0],50)
        this.recibeCuracion(25)
    }
}
