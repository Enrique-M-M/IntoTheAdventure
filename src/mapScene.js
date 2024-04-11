import { SpriteButton } from "./spriteButtom";
import { TextButton } from "./textButtom";
import { personajes  } from '../assets/CharactersInfo/CharactersDATA.js';

export default class Mapa extends Phaser.Scene {


    constructor() {
        super({ key: 'Mapa' });
    }
    
    preload(){
        this.playerChars = personajes
        
    }
    create(){
        this._createUIMapa()
        this.playerTeam = {personaje1: this.playerChars.Mago
            ,personaje2: this.playerChars.Brujo
            ,personaje3: this.playerChars.Vampiro}
       }

    _createUIMapa(){
        this.bcgnd_map = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2,'mapa_mundo')
        let scaleX = this.cameras.main.width / this.bcgnd_map.width 
        let scaleY = this.cameras.main.height / this.bcgnd_map  .height 
        let scale = Math.max(scaleX, scaleY) 
        this.bcgnd_map.setScale(scale).setScrollFactor(0)
        new TextButton(this,150,50,'Entrar a Mazmorra',  {fill: '#FFF'}, () => this.entraMazmorra(),'ui_buttons',4, 20)
        new TextButton(this,500,500,'TABERNA',  {fill: '#FFF'}, () => this.mostrarMenuTaberna(),'ui_buttons',4, 20)
   }
    entraMazmorra(){
        console.log("click")
        this.scene.start('Combate',{mapa_id: 'Mapa_1', peronajesEquipo: this.playerTeam});
    }

    mostrarMenuTaberna(){

    }
}
