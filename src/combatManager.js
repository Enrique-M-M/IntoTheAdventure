export class CombatManager {
    enemyTeam;      
    enemySize;
    livingEnemies;  
    playerTeam;     
    teamSize;
    livingParty;  

    ultimoPersonajeSeleccionado;
    hayPersonajeSeleccionado;
    hayAccionSeleccionada;

    combatScene;

    currentTurn;
    _nextTurn;

    objectList;

    constructor(enemyTeam,playerTeam,partySize,scene, objectList){
        this.enemyTeam = enemyTeam;
        this.enemySize = enemyTeam.length;
        this.livingEnemies = this.enemySize;
        this.objectList = objectList

        this.playerTeam = playerTeam;
        this.teamSize = partySize;
        this.livingParty = partySize

        this.combatScene = scene;
        this._nextTurn = 'init'
        this.hayPersonajeSeleccionado = true;
        this.ultimoPersonajeSeleccionado = playerTeam[0]
        this.indexDespliegue = 0
    }


    nextTurn(){
        switch(this.currentTurn){
            case 'init':
                if(this.indexDespliegue<this.teamSize){
                    console.log("quedan peronajes que desplegar")
                    this._nextTurn = 'init'
                }else{
                    this.combatScene.hideUIDespliegue()
                    this.combatScene.mostrarDespliegue(false);
                }
                break;
            case 'enemyTurn':
                this.combatScene.pasarTurno_btn.setInteractive(true);
                this.combatScene.pasarTurno_btn.setTexture(this.combatScene.pasarTurno_btn.texture, 4)
                  
                break;
            case 'playerTurn':
                this.combatScene.pasarTurno_btn.setInteractive(false);
                this.combatScene.pasarTurno_btn.setTexture(this.combatScene.pasarTurno_btn.texture, 5)
                this.borraPersonajeSeleccionado()
                
                break;
            case 'resolveActions':
               
                break;
        }
        this.currentTurn = this._nextTurn
        switch(this._nextTurn){
            case 'init':
                console.log("****Init turn****")
                this.combatScene.mostrarDespliegue(true);
                this._nextTurn = 'enemyTurn'
                break;
            case 'enemyTurn':
                console.log("****enemy turn****")
                this.enemyTeam.forEach(element => {
                    element.takeTurn()
                });
                this._nextTurn = 'playerTurn'
                this.nextTurn()
                break;
            case 'playerTurn':
                console.log("****player turn****")
                this._nextTurn = 'resolveActions'
                
                break;
            case 'resolveActions':
                console.log("****resolveActions turn****")
                this._nextTurn = 'enemyTurn'
                this.nextTurn()
                break;
        }
        this.borraPersonajeSeleccionado() 
    }

    checkClickEnZonaDespliegue(targetVec){
        return (this.combatScene.despliegue.getTileAt(targetVec.x,targetVec.y,true).index !== -1 );
    }
    personajeClickado(targetVec){
        for(let i =0;i< this.teamSize;i++){
            if(this.playerTeam[i].getTileXY().x === targetVec.x && this.playerTeam[i].getTileXY().y ===targetVec.y)
                return this.playerTeam[i];
        }
        return null;
    }
    checkEnPersonajeAliadoEnCasilla(targetVec){
        for(let i =0;i<this.teamSize;i++){
            if(this.playerTeam[i].getTileXY().x === targetVec.x && this.playerTeam[i].getTileXY().y ===targetVec.y)
                return true;
        }
        return false;
    }

    checkEnPersonajeEnemigoEnCasilla(targetVec){
        for(let i =0;i<this.enemySize;i++){
            if(this.enemyTeam[i].getTileXY().x === targetVec.x && this.enemyTeam[i].getTileXY().y ===targetVec.y)
                return true;
        }
        return false;
    }

    casillaOcupada(targetVec){
        return this.checkEnPersonajeAliadoEnCasilla(targetVec) || this.checkEnPersonajeEnemigoEnCasilla(targetVec)
    }

    seleccionaPersonajeV(targetVec){ 
        this._selecccionaPersonaje(this.personajeClickado(targetVec))
        console.log('click en personaje ' + this.ultimoPersonajeSeleccionado.name)
    }

    seleccionaPersonajeC(char){
        this._selecccionaPersonaje(char)
        console.log('click en personaje ' + this.ultimoPersonajeSeleccionado.name)
    }

    borraPersonajeSeleccionado(){
        if(this.hayPersonajeSeleccionado){
        switch(this.currentTurn){
            case 'playerTurn':
                this.combatScene.showUIChar(this.playerTeam.indexOf(this.ultimoPersonajeSeleccionado),false)        
        }
        this.ultimoPersonajeSeleccionado.setSeleccionado(false)
        this.ultimoPersonajeSeleccionado = null
        this.hayPersonajeSeleccionado = false
     }
    }

    _selecccionaPersonaje(char){
        let previousChar = null

        if(this.hayPersonajeSeleccionado){
            if(this.hayAccionSeleccionada){
                this.deseleccionaAccion()
            }                
            previousChar = this.ultimoPersonajeSeleccionado
            if(previousChar === char){
                return
            }
            this.ultimoPersonajeSeleccionado.setSeleccionado(false)
        }
        this.ultimoPersonajeSeleccionado=char
        this.ultimoPersonajeSeleccionado.setSeleccionado(true)
        this.hayPersonajeSeleccionado=true;

        switch(this.currentTurn){
            case 'playerTurn':
                this.combatScene.showUIChar(this.playerTeam.indexOf(char),true)
                if(previousChar!==null)
                    this.combatScene.showUIChar(this.playerTeam.indexOf(previousChar),false)        
        }
    }


    seleccionaAccion(accion){
        if(this.hayAccionSeleccionada){
            let previousAction = this.ultimaAccionSeleccionada
            this.deseleccionaAccion()
            if(previousAction === accion){
                return false
            }
        }
        this.hayAccionSeleccionada = true
        this.ultimaAccionSeleccionada = accion
        console.log("Seleccionada Accion " +this.ultimaAccionSeleccionada.nombre)
        return true;
    }

    deseleccionaAccion(){
        console.log("Deseleccionada Accion " +this.ultimaAccionSeleccionada.nombre)
        this.combatScene._borrarCasillasMostradas()
        this.combatScene.findButtom(this.playerTeam.indexOf(this.ultimoPersonajeSeleccionado),this.ultimaAccionSeleccionada.nombre).unSelect()
        this.hayAccionSeleccionada = false
        this.ultimaAccionSeleccionada = null
    }

    realizaAccion(targetVec){
        this.ultimaAccionSeleccionada.accion(targetVec)
        this.deseleccionaAccion()
    }

    clickOnTile(targetVec){
        switch(this.currentTurn){
            case 'init':
                if(this.checkClickEnZonaDespliegue(targetVec)){
                    if(this.checkEnPersonajeAliadoEnCasilla(targetVec)){
                        this.seleccionaPersonajeV(targetVec)
                    }
                    else if(this.hayPersonajeSeleccionado){
                        this.ultimoPersonajeSeleccionado.mover(targetVec)
                        this.hayPersonajeSeleccionado=false;
                        this.ultimoPersonajeSeleccionado.setSeleccionado(false)
                    }
                    else if(this.indexDespliegue<this.teamSize){
                        this.playerTeam[this.indexDespliegue].desplegar(targetVec,this.indexDespliegue);
                        this.indexDespliegue++
                    } 
                }
                break;
            case 'playerTurn':
                if(!this.hayPersonajeSeleccionado){
                    if(this.checkEnPersonajeAliadoEnCasilla(targetVec)){
                        this.seleccionaPersonajeV(targetVec)
                       }
                } else {
                    if(this.checkEnPersonajeAliadoEnCasilla(targetVec) && this.personajeClickado(targetVec) !== this.ultimoPersonajeSeleccionado ){
                        this.seleccionaPersonajeV(targetVec)
                    }
                }
                break;
        }
    }

    getEntityAt(targetVec){
        let enc = false
        let ret = null
        this.enemyTeam.forEach(element => {
            if(element.tileX === targetVec.x && element.tileY === targetVec.y){
                enc = true
                ret = element
            }
        });
        this.playerTeam.forEach(element => {
            if(element.tileX === targetVec.x && element.tileY === targetVec.y){
                enc = true
                ret = element
            }
        });
        this.objectList.forEach(element => {
            if(element.tileX === targetVec.x && element.tileY === targetVec.y){
                enc = true
                ret = element
            }
        });

        return ret
    }

    resetrAlpha(){
        this.enemyTeam.forEach(element => {
                element.setAlpha(1)
        });
        this.playerTeam.forEach(element => {
                if(element.desplegado)element.setAlpha(1)
        });
        this.objectList.forEach(element => {
                element.sprite.setAlpha(1)
        });
    }

}