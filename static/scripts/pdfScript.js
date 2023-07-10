document.addEventListener("DOMContentLoaded", async () =>{

    const carrito = JSON.parse(sessionStorage.getItem("detalle"));
    const user = JSON.parse(sessionStorage.getItem("userData"));
    const total = sessionStorage.getItem("total");
    const cliente = JSON.parse(sessionStorage.getItem("cliente"));
    const fisico = JSON.parse(sessionStorage.getItem("fisico"));
  
    
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    date = "<b>" + cDay + "/" + cMonth + "/" + cYear + "</b>";
    
    console.log(carrito)
    console.log(user)
    console.log(total)
    console.log(date)


    var nombre = '';

    if(cliente.cn_id != null){
         nombre =  cliente.cn_prim_nom + " " + cliente.cn_prim_ap
    }
    else{
        nombre = "Denominacion Comercial : " + cliente.cj_den_com
    }

    const pedidoItem = document.querySelector("#insertar"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    pedidoItem.classList = "list-group-item "; //le agrega una clase
    pedidoItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h6>Pedido de: ${nombre} </h6>
            </fieldset>
        </header>
        <center>
        <p></p>
        <h6>Monto = ${total}$</h6>
        <h6>Fecha = ${date}</h6>
        <p></p>
        <p></p>
        </div>
        <h4>Detalles del Pedido</h4>
            <div>
                <form action=""></form>
                <ul id="dulceList" class="list-group"></ul> 
            </div>
        </center>
        `;

        let detallePedido = [];
        detallePedido = carrito;
        const detalleList = pedidoItem.querySelector("#dulceList");
        for (const detalle of detallePedido){
            const response = await fetch(`/api/productos/${detalle.id}`,{
                method: "GET",
            });


        const data = await response.json();
        producto = data;
      

      //  const detalleList = pedidoItem.querySelector("#dulceList");

        const productItem = document.createElement("li");
        productItem.classList = "list-group-item "; //le agrega una clase
        productItem.innerHTML = `
                        <header class="d-flex justify-content-between align-items-center">
                            <fieldset>
                            <p><small>${producto.p_nombre}</small> </p>
                            </fieldset>
                        </header>
                        <p>Precio : ${producto.p_precio}$ </p>        
                        <p>Cantidad : ${detalle.cantidad}</p>

                        `;

        detalleList.append(productItem); //se agregam los elementos recien creados a pedidoList
    }

    const boton = document.querySelector("#generar");
    boton.addEventListener("click", () => {
        const elementoParaConvertir = document.body;
        html2pdf()
            .set({
                margin: 3,
                filename: 'Factura.pdf',
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
                sessionStorage.clear()
                sessionStorage.setItem("userData", JSON.stringify(user));
                location.href = "/hub"
            });
    });  



})