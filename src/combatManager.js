export class CombatManager {
    enemyTeam;      
    enemySize;
    livingEnemies;  
    playerTeam;     
    teamSize;
    livingParty;  

    ultimoPersonajeSeleccionado;
    hayPersonajeSeleccionado;
    
    combatScene;

    currentTurn;
    _nextTurn;

    constructor(enemyTeam,playerTeam,partySize,scene){
        this.enemyTeam = enemyTeam;
        this.enemySize = enemyTeam.length;
        this.livingEnemies = this.enemySize;

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
                break;
            case 'playerTurn':
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
    checkClickEnPersonaje(targetVec){
        for(let i =0;i<this.teamSize;i++){
            //console.log('Revisando personaje ' +this.playerTeam[i].name + ' en tile ' + this.playerTeam[i].getTileXY().x + " "+ this.playerTeam[i].getTileXY().y)
            if(this.playerTeam[i].getTileXY().x === targetVec.x && this.playerTeam[i].getTileXY().y ===targetVec.y)
                return true;
        }
        return false;
    }

    seleccionaPersonajeV(targetVec){
        if(this.personajeSeleccionado){
            this.ultimoPersonajeSeleccionado.setSeleccionado(false)
        }
        this.ultimoPersonajeSeleccionado=this.personajeClickado(targetVec)
        this.ultimoPersonajeSeleccionado.setSeleccionado(true)
        this.personajeSeleccionado=true;
        console.log('click en personaje ' + this.ultimoPersonajeSeleccionado.name)
    }

    seleccionaPersonajeC(char){
        if(this.personajeSeleccionado){
            this.ultimoPersonajeSeleccionado.setSeleccionado(false)
        }
        this.ultimoPersonajeSeleccionado=char
        this.ultimoPersonajeSeleccionado.setSeleccionado(true)
        this.personajeSeleccionado=true;
        console.log('click en personaje ' + this.ultimoPersonajeSeleccionado.name)
    }


    clickOnTile(targetVec){
        switch(this.currentTurn){
            case 'init':
                if(this.checkClickEnZonaDespliegue(targetVec)){
                    if(this.checkClickEnPersonaje(targetVec)){
                        this.seleccionaPersonajeV(targetVec)
                    }
                    else if(this.personajeSeleccionado){
                        this.ultimoPersonajeSeleccionado.mover(targetVec)
                        this.personajeSeleccionado=false;
                        this.ultimoPersonajeSeleccionado.setSeleccionado(false)
                    }
                    else if(this.indexDespliegue<this.teamSize){
                        this.playerTeam[this.indexDespliegue].desplegar(targetVec,this.indexDespliegue);
                        this.indexDespliegue++
                    } 
                }
                break;
            case 'playerTurn':
                break;
        }
    }

}