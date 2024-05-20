export var Dungeon1_info = {
    id: 'Dungeon1',
    Grafo: [{
            id:0, inicio: true, final: false,
            caminos: [1]
    },{
        id:1, inicio: false, final: false, ruta: 'd1_mapa1',
        caminos:[2,3], recompensa: {exp: 1, items: []}
    },{
        id:2, inicio: false, final: false, ruta: 'd1_mapa2',
        caminos:[1], recompensa: {exp: 1, items: [{tipo:'armas', id:2}]}
    },{
        id:3, inicio: false, final: false, ruta: 'd1_mapa3',
        caminos:[4], recompensa: {exp: 2, items: []}
    },{
        id:4, inicio: false, final: true
    }
    ]
}