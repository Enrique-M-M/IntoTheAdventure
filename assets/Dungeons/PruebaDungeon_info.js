export default dungeonPrueba = {
    id: 'PruebaDungeon',
    Grafo: [{
            id:1, inicio: true, final: false,
            caminos: [2,3]
    },{
        id:2, inicio: false, final: false, ruta: 'Mapa_1',
        caminos:[1,3,4]
    },{
        id:3, inicio: false, final: false, ruta: 'Mapa_1',
        caminos:[1,2,4]
    },{
        id:4, inicio: false, final: true,
        caminos:[2,3]
    }
    ]
}