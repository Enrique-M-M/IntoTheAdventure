import PlayerChar from "../playerChar"
import { Vampiro } from "./Vampiro"

export default class CharacterFactory{

    static CreateCharacter(char, scene, x, y){
        switch(char.name){
            case 'Vampiro':
                return new Vampiro(char,scene,x,y)
            default: 
                return new PlayerChar(char,scene,x,y)
        }
    }
}