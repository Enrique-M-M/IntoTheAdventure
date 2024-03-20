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

    constructor(enemyTeam,playerTeam,partySize,scene){
        this.enemyTeam = enemyTeam;
        this.enemySize = enemyTeam.length;
        this.livingEnemies = this.enemySize;

        this.playerTeam = playerTeam;
        this.teamSize = partySize;
        this.livingParty = partySize

        this.combatScene = scene;
        this.currentTurn = 'init';
        this.hayPersonajeSeleccionado = false;
    }


    nextTurn(){
        switch(this.currentTurn){
            case 'init':
                this.indexDespliegue = 0
                this.combatScene.mostrarDespliegue();
                break;
            case 'enemyTurn':
                break;
            case 'playerTurn':
                break;
            case 'resolveActions':
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

    seleccionaPersonaje(targetVec){
        this.ultimoPersonajeSeleccionado=this.personajeClickado(targetVec)
        this.ultimoPersonajeSeleccionado.setSeleccionado()
        this.personajeSeleccionado=true;
        console.log('click en personaje ' + this.ultimoPersonajeSeleccionado.name)
    }

    clickOnTile(targetVec){
        switch(this.currentTurn){
            case 'init':
                if(this.checkClickEnZonaDespliegue(targetVec)){
                    if(this.checkClickEnPersonaje(targetVec)){
                        this.seleccionaPersonaje(targetVec)
                    }
                    else if(this.personajeSeleccionado){
                        this.ultimoPersonajeSeleccionado.mover(targetVec)
                        this.personajeSeleccionado=false;
                    }
                    else if(this.indexDespliegue<this.teamSize){
                        this.playerTeam[this.indexDespliegue].desplegar(targetVec);
                        this.indexDespliegue++
                    } 
                }
                
                break;
            case 'playerTurn':
                break;
        }
    }

}