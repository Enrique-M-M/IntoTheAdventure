import PlayerChar from "../playerChar"
import { Caballero } from "./Caballero"
import { Clerigo } from "./Clerigo"
import { Vampiro } from "./Vampiro"

export default class CharacterFactory{

    static CreateCharacter(char, scene, x, y){
        switch(char.name){
            case 'Vampiro':
                return new Vampiro(char,scene,x,y)
            case 'Clerigo':
                return new Clerigo(char,scene,x,y)
            case 'Caballero':
                return new Caballero(char,scene,x,y)
            default: 
                return new PlayerChar(char,scene,x,y)
        }
    }
}