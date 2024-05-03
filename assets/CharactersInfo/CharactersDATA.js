export var personajes = {
    Caballero: {
        name: 'Caballero', maxHp: 50, movementRange: 2,
        armorType: 3, apt: 2,suete: 0, inteligence:0, strength: 1, desterity:0,
        spriteIndex: 0, ui_index: 2,
        acciones: ['mover', 'atacar'],
        inventario: {arma: -1, armaduraSup: -1, armaduraInf: -1, amuleto: -1},
        freeExPoint: 2 , mejorasAplicadas:[]
    },
    Vampiro: {
        name: 'Vampiro', maxHp: 50, movementRange: 3,
        armorType: 3, apt: 2, suerte: 0, inteligence: 0, strength: 1, desterity:0,
        spriteIndex: 7, ui_index: 7,
        acciones: ['mover', 'atacar'],
        inventario: {arma: -1, armaduraSup: -1, armaduraInf: -1, amuleto: -1} ,
        freeExPoint: 0, mejorasAplicadas:[]
    },
    Clerigo:{
        name: 'Clerigo', maxHp: 30, movementRange: 4,
        armorType: 1, apt: 3, suerte: 0, inteligence:1,strength:0,desterity:0,
        spriteIndex:6, ui_index: 6,
        acciones: ['mover', 'atacar'],
        inventario: {arma: -1, armaduraSup: -1, armaduraInf: -1, amuleto: -1} ,
        freeExPoint: 0, mejorasAplicadas:[]
    },
    Ranger:{
        name:'Ranger', maxHp:30, movementRange:4,
        armorType: 2, apt: 3, suerte:0,inteligence:0,strength:0,desterity:1,
        spriteIndex:2, ui_index: 3,
        acciones: ['mover', 'atacar'],
        inventario: {arma: -1, armaduraSup: -1, armaduraInf: -1, amuleto: -1},
        freeExPoint: 0 , mejorasAplicadas:[]
    },
    Guerrero:{
        name:'Guerrero',maxHp:40,movementRange:3,
        armorType:3,apt:3,suerte:1,inteligence:0,strength:1,desterity:1,
        spriteIndex:1, ui_index: 1,
        acciones: ['mover', 'atacar'],
        inventario: {arma: -1, armaduraSup: -1, armaduraInf: -1, amuleto: -1} ,
        freeExPoint: 0, mejorasAplicadas:[]
    },
    Mago:{
        name:'Mago',maxHp:30,movementRange:3,
        armorType:1,apt:3,suerte:0,inteligence:1,strength:0,desterity:0,
        spriteIndex:4, ui_index: 0,
        acciones:['mover', 'atacar'],
        inventario: {arma: -1, armaduraSup: -1, armaduraInf: -1, amuleto: -1} ,
        freeExPoint: 0, mejorasAplicadas:[]
    },
    Picaro:{
        name:'Picaro', maxHp:25, movementRange:4,
        armorType: 2, apt: 4, suerte:1,inteligence:0,strength:0,desterity:1,
        spriteIndex:3, ui_index:4,
        acciones: ['mover', 'atacar'],
        inventario: {arma: -1, armaduraSup: -1, armaduraInf: -1, amuleto: -1} ,
        freeExPoint: 0, mejorasAplicadas:[]
    },
    Brujo:{
        name:'Brujo',maxHp:35,movementRange:3,
        armorType:1,apt:3,suerte:0,inteligence:1,strength:0,desterity:0,
        spriteIndex:5, ui_index: 5,
        acciones: ['mover', 'atacar'],
        inventario: {arma: -1, armaduraSup: -1, armaduraInf: -1, amuleto: -1},
        freeExPoint: 0, mejorasAplicadas:[]
    
    }
}

//Estructura Accion:
//{NOMBRE_ACCION:{nombre: 'NOMBRE_ACCION', rango: RANGO_SELECCION_ACCION, area: AREA_SELECCION, accion: (targetVec) => {if(this.realizarAccion(GASTO_ACCIONES_POR_TURNO)) FUNCION_ACCION_DEFINIDA_EN_CHAR}, tipoSeleccion: 'Habilidad' },