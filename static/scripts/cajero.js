var home = document.getElementById["home"]
const user = JSON.parse(sessionStorage.getItem("userData"));
console.log(user)
var cliente
var clienteaux

async function getTienda() {
    try {
        const response = await fetch(`/api/tiendas/${user.fk_ti_id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}


async function renderTienda(){
    const tienda = await getTienda();
    console.log(tienda)
    document.getElementById("PagTxt").textContent=tienda.ti_nombre
    sessionStorage.setItem("tienda", JSON.stringify(tienda));

}

document.addEventListener('DOMContentLoaded', async () => {
   
renderTienda();

    // Variables
    var baseDeDatos = [];

    const response = await fetch('/api/productos'); 
    const data = await response.json()
    baseDeDatos = data


    let carrito = [];
    var carritoJson;
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonprocesar = document.querySelector('#procesar');
    const miLocalStorage = window.localStorage;

    // Funciones

    /**
    * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
    */
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.p_nombre;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            if(info.p_imagen != null)
                miNodoImagen.setAttribute('src', info.p_imagen);
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.p_precio}${divisa}`;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.p_id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    /**
    * Evento para añadir un producto al carrito de la compra
    */
    function anyadirProductoAlCarrito(evento) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(evento.target.getAttribute('marcador'))
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }

    /**
    * Dibuja todos los productos guardados en el carrito
    */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {

            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.p_id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].p_nombre} - ${miItem[0].p_precio}${divisa}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);});
        // Renderizamos el precio total en el HTML
        DOMtotal.textContent = calcularTotal();
    }

    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();

    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.p_id === parseInt(item);
            });
            // Los sumamos al total
            return total + (miItem[0].p_precio)/1;
        },0);
    }
        

    


    /**
    * Varia el carrito y vuelve a dibujarlo
    */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.clear();

    }

    function guardarCarritoEnLocalStorage () {
        sessionStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (sessionStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(sessionStorage.getItem('carrito'));
        }
    }

     async function procesarCarrito(){
      const car = JSON.parse(sessionStorage.getItem('carrito'));
      let carritoFinal = [];

      const monto = total;
      var pos = -1;
      var cantF;
    
      if(car != null){
      carritoFinal = [{"id":car[0], "cantidad":1}];
     
    if (car.length>1){
    for (let i = 1; i < car.length; i++) {
        for(let j =0 ; j<carritoFinal.length;j++){
            if(car[i] == carritoFinal[j].id){
                pos = j;
                break;
            }
        }

        if (pos!=-1) {
            cantF = carritoFinal[pos].cantidad + 1
            carritoFinal.splice(pos, 1, {"id":carritoFinal[pos].id,"cantidad":cantF});}
        else{
            carritoFinal.splice(car[i], 0, {"id":car[i],"cantidad":1});
        }
        pos=-1;
        cantf = 0;
      }
      
    }

    console.log(carritoFinal);
    carritoJson = JSON.stringify(carritoFinal);
    sessionStorage.setItem("total", total.textContent);
    sessionStorage.setItem("detalle", carritoJson);
    sessionStorage.setItem("userData",JSON.stringify(user));
    //sessionStorage.setItem("cliente",JSON.stringify(cliente));
    window.location.replace("http://localhost:5000/seleccionarTipoFisico")

    }

    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMbotonprocesar.addEventListener('click',procesarCarrito);

    // Iniciop
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();

});