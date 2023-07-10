document.addEventListener("DOMContentLoaded", async () =>{

    const response = await fetch(`/api/descuento`);
    const data2 = await response.json();
  
    let d_clave
    const  date = new Date();
    const dd = date.getDate();
    const mm = date.getMonth();
    const yyyy = date.getFullYear();
    const de_fechainicio = new Date(yyyy, mm, dd);
    const aux = new Date (yyyy, mm, dd);
    const de_fechafin = new Date(aux.setDate(de_fechainicio.getDate() + 20));
    console.log(de_fechafin);

    
    const pedidoItem = document.querySelector("#insertar"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    pedidoItem.classList = "list-group-item "; //le agrega una clase
    pedidoItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
            </fieldset>
        </header>
        <center>
        <p></p>
        <h6>Fecha Fin = ${de_fechafin}</h6>
        <p></p>
        <p></p>
        </div>
        <h4>Detalles Ofertas</h4>
            <div>
                <form action=""></form>
                <ul id="dulceList" class="list-group"></ul> 
            </div>
        </center>
        `;

        let detallePedido = [];
        detallePedido = data2;
        const detalleList = pedidoItem.querySelector("#dulceList");
        for (const detalle of detallePedido){
            const response = await fetch(`/api/productos/${detalle.fk_p_id}`,{
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
                        <p>Precio Oferta: ${detalle.p_r_precio_oferta}</p>

                        `;

        detalleList.append(productItem); //se agregam los elementos recien creados a pedidoList
    }

    const boton = document.querySelector("#generar");
    boton.addEventListener("click", () => {
        const elementoParaConvertir = document.body;
        html2pdf()
            .set({
                margin: 3,
                filename: 'SweetFlyer.pdf',
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
                location.href = "/hub"
            });
    }); 



})