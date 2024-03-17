export class CombatManager {
    enemyTeam;      
    enemySize;
    livingEnemies;  
    playerTeam;     
    teamSize;
    livingParty;  


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
    }


    nextTurn(){
        switch(this.currentTurn){
            case 'init':
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

    checkDespliegue(targetVec){
        return (this.combatScene.despliegue.getTileAt(targetVec.x,targetVec.y,true).index !== -1 );
    }
    clickOnTile(targetVec){
        switch(this.currentTurn){
            case 'init':
                if(this.checkDespliegue(targetVec)){
                    this.playerTeam[0].desplegar(targetVec);
                    this.playerTeam[0].play('idle',true)
                }
                
                break;
            case 'playerTurn':
                break;
        }
    }

}