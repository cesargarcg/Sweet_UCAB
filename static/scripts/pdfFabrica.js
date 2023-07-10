document.addEventListener("DOMContentLoaded", async () =>{

    const producto = sessionStorage.getItem('producto');
    console.log(producto)
    const tienda = sessionStorage.getItem("tienda");
    console.log(tienda)
  
    
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    date = "<b>" + cDay + "/" + cMonth + "/" + cYear + "</b>";


    const pedidoItem = document.querySelector("#insertar"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    pedidoItem.classList = "list-group-item "; //le agrega una clase
    pedidoItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
                <h5>FABRICA SWEET UCAB</h5>
              <h6>Pedido de: ${tienda} </h6>
            </fieldset>
        </header>
        <center>
        <p></p>
        <h6>Fecha = ${date}</h6>
        <p></p>
        <p></p>
        </div>
        <h4>Detalles del Pedido: Producto ${producto}</h4>
        <h4>Cantidad: 10.000</h4>
        </center>
        `;

    const boton = document.querySelector("#generar");
    boton.addEventListener("click", () => {
        const elementoParaConvertir = document.body;
        html2pdf()
            .set({
                margin: 3,
                filename: 'Pedido.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: window.devicePixelRatio, windowWidth: elementoParaConvertir.clientWidth, windowHeight: elementoParaConvertir.clientHeight, scrollX: Window.innerWidth, scrollY: Window.innerHeight },
                jsPDF: { unit: 'mm', format: 'tabloid', orientation: 'landscape' , compress: false, precision:2 },
                optimize_layout: true,
                page_size: 'Tabloid',
                zoom_level: 0,

            })
            .from(elementoParaConvertir)
            .save()
            .catch(err => console.error(err))
            .then(() => {
                alert("Se ha generado el PDF")
                sessionStorage.removeItem("producto")
                sessionStorage.removeItem("tienda")
                location.href = "/pedidosFabricaCreados"
            });
    }); 



})