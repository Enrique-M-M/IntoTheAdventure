    class accion{
        constructor(nombre,rango,accion,tipoSeleccion, gastoAPT){
            this.nombre = nombre
            this.rango = rango
            this.accion = accion
            this.tipoSeleccion = tipoSeleccion
            this.gastoAPT = gastoAPT
        }
    }
    
    lista_acciones =
    {
        mover:{nombre: 'mover', rango: this.movementRange, accion: (areaSeleccion) => {if(this.realizarAccion(this.gastoAPTBasico)) this.mover(areaSeleccion[0])}, tipoSeleccion: 'Movimiento' },
        atacar: {nombre: 'atacar', objetivo: 'enemy' , rango: this.rangoBasico, area: this.areaBasico, accion: (areaSeleccion) =>{if(this.realizarAccion(1)) this.ataqueBasico(areaSeleccion) }, tipoSeleccion: 'Habilidad'}
    }