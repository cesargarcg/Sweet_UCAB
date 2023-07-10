const user = JSON.parse(sessionStorage.getItem("userData"));
console.log(user)
console.log(user)
let acciones = []

let links = []

 links = JSON.parse(`{
    "Crear Usuario" : "https//:localhost:5000/crearUsuarios",
    "Modificar Usuarios" : "https//:localhost:5000/usuariosCreados",
    "Borrar Usuarios" : "https//:localhost:5000/usuariosCreados",
    "Crear Producto" : "https//:localhost:5000/crearProductos",
    "Modificar Producto" : "https//:localhost:5000/productosCreados",
    "Borrar Producto" : "https//:localhost:5000/productosCreados",
    "Agregar Metodo Pago" : "https//:localhost:5000/metodoPago",
    "Realizar Compra" : "https//:localhost:5000/carrito",
    "Ver Mis Pedidos" : "https//:localhost:5000/"
}`)

window.addEventListener('DOMContentLoaded', async () => {        
    try {
        const response = await fetch(`/api/roles_accion/${user.fk_ro_clave}`);
        const data2 = await response.json()
        acciones = data2
        render(acciones) 
    } catch (error) {
        
    }
    
    
});

function render(acciones) {
    const acc_col = (acciones.length/3)+1;
    var i
    var nombre
    acciones.forEach(accion => {
        var accionCard = document.createElement('div')
        var data2 = getAccion(accion.fk_a_clave)
        data2.then(value => {
            nombre = value.a_nombre
            if((value.a_clave%4)==1){
                var columna = document.getElementById('col1')
            }
            if((value.a_clave%4)==2){
                var columna = document.getElementById('col2')
            }
            if((value.a_clave%4)==3){
                var columna = document.getElementById('col3')
            }
            if((value.a_clave%4)==0){
                var columna = document.getElementById('col4')
            }
            
            accionCard.classList = '"card text-white bg-primary mb-3 my-2"'
            accionCard.style = '"width: 5%;"'
            accionCard.innerHTML = `
            <div class="card-header">${nombre}</div>
            <div class="card-body">
            <button id="btn" class="btn-acc btn btn-dark">${nombre}</button>
            </div>       
            `
            
            const btnAcc = accionCard.querySelector('.btn-acc')
            btnAcc.addEventListener('click', async (e) => {
                console.log(value.a_nombre)
                switch (value.a_nombre) {
                    case "Crear Usuario":
                        window.location.replace("/crearUsuarios");
                        break;
                    case "Manipular Usuario":
                        window.location.replace("/usuariosCreados");
                        break;
                    case "Crear Rol":
                        window.location.replace("/crearRol");
                        break;
                    case "Manipular Rol":
                        window.location.replace("/rolesCreados");
                        break;
                    case "Crear Producto":
                        window.location.replace("/crearProducto");
                        break;
                    case "Manipular Producto":
                        window.location.replace("/productosCreados");
                        break;
                    case "Manipular Cliente":
                        window.location.replace("/mostrarClientes");
                        break;
                    case "Agregar Metodo Pago":
                        window.location.replace("/mtdPago");
                        break;
                    case "Manipular Status":
                        window.location.replace("/pedidosCreados");
                        break; 
                    case "Realizar Compra":
                        window.location.replace("/carrito");
                        break; 
                    case "Cajero":
                        window.location.replace("/cajero"); 
                        break;
                    case "Registrar Empleado":
                        window.location.replace("/registroEmpleado");
                        break;
                    case "Status Fisico":
                        window.location.replace("/pedidosFisicosCreados");
                        break;
                    case "Cargar Archivo":
                        window.location.replace("/asistencia");
                        break;
                    case "Pedidos Fabrica":
                        window.location.replace("/pedidosFabricaCreados");
                        break;
                    case "Ver Descuentos":
                        window.location.replace("/verDescuentos");
                        break;
                    case "Ver Dashboard":
                        window.location.replace("/dashboard");
                        break;
                    case "Talento Humano":
                        window.location.replace("/verReportes");
                        break;
                    case "Alertas Pasillo":
                        window.location.replace("/pedidosPasillo");
                        break;
                    default:
                        break;
                }
                //window.location.replace(); 
            });




            columna.append(accionCard)



          }).catch(err => {
            console.log(err);
          });
        
    });

}

async function getAccion(id) {
    const response = await fetch(`/api/accion/${id}`); 
    const data2 = await response.json()
    return data2
}