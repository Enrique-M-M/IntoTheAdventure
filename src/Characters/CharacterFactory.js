import PlayerChar from "../playerChar"
import { Brujo } from "./Brujo"
import { Caballero } from "./Caballero"
import { Clerigo } from "./Clerigo"
import { Guerrero } from "./Guerrero"
import { Mago } from "./Mago"
import { Picaro } from "./Picaro"
import { Ranger } from "./Ranger"
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
            case 'Ranger':
                return new Ranger(char,scene,x,y)
            case 'Mago':
                return new Mago(char,scene,x,y)
            case 'Guerrero':
                return new Guerrero(char,scene,x,y)     
            case 'Picaro':
                return new Picaro(char,scene,x,y)
            case 'Brujo':
                return new Brujo(char,scene,x,y)
            default: 
                return new PlayerChar(char,scene,x,y)
        }
    }
}