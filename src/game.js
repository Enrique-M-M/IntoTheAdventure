

import Combate from './CombatScene/combate.js';
import Boot from './boot.js';
import End from './end.js';
import Phaser from 'phaser'
import Mapa from './mapScene.js';
import Dungeon from './dungeonScene.js';

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    scene: [Boot, Mapa, Combate, Dungeon, End],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    }
};

new Phaser.Game(config);
