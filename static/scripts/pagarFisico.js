const pagarForm = document.querySelector("#pagarForm");
const detalle = JSON.parse(sessionStorage.getItem("detalle"));
const cliente = JSON.parse(sessionStorage.getItem("cliente"));
console.log(cliente)
const total = JSON.parse(sessionStorage.getItem("total"));
const user = JSON.parse(sessionStorage.getItem("userData"));

var data1 = []

let productos = []; //array to store user data


window.addEventListener("DOMContentLoaded", async () => {
  //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading

  if (cliente.cn_id != null) {
    const responseMetodosP = await fetch(`/api/metodoPagoCN/${cliente.cn_id}`, {
      method: "GET",
    });
    const dataMetodoPagos = await responseMetodosP.json();
    mtdPg = dataMetodoPagos;
    var i = 1;
    const options = document.getElementById("fieldset")
    mtdPg.forEach(metodo => {

        const metodoItem = document.createElement('div')
        metodoItem.classList = 'form control my-1 '
        if(metodo.mp_tipo != "Puntos"){
            metodoItem.innerHTML = `
                <input type="checkbox" id='${metodo.mp_id}' name="radio" value=${metodo.mp_id}>
                <label for="usuarios">${metodo.mp_tipo} ${metodo.mp_nombre}</label>
                <input name="pago" style="float:right"size="3" id='total${i}'></input>        
                `
            options.append(metodoItem)
        }
        else{
            metodoItem.innerHTML = `
                <input type="checkbox" id='${metodo.mp_id}' name="radio" value=${metodo.mp_id}>
                <label for="usuarios">${metodo.mp_tipo} ${metodo.mp_nombre}</label>
                <input name="pago" style="float:right"size="3" id='total${i}'></input> 
                <label for="cantidad"> (Cantidad: ${metodo.mp_cantidad_puntos})</label>       
                `
            options.append(metodoItem)
        }
        i = i+1
    })

    pagarForm["nombre"].value =cliente.cn_prim_nom + " "+ cliente.cn_prim_ap
    document.getElementById("labelNmb").textContent = "Nombre del Cliente"
    pagarForm["rif"].value = cliente.cn_rif
    document.getElementById("labelRif").textContent = "RIF"
    pagarForm["montoTotal"].value = total;

  
  
  }else{
    pagarForm["nombre"].value =cliente.cj_den_com
    document.getElementById("labelNmb").textContent = "Denominación Comercial"
    pagarForm["rif"].value = cliente.cj_rif
    document.getElementById("labelRif").textContent = "RIF"
    pagarForm["montoTotal"].value = total;

    const responseMetodosP = await fetch(`/api/metodoPagoCJ/${cliente.cj_id}`, {
      method: "GET",
    });
    const dataMetodoPagos = await responseMetodosP.json();
    mtdPg = dataMetodoPagos;
    var i = 1;
    const options = document.getElementById("fieldset")
    mtdPg.forEach(metodo => {

        const metodoItem = document.createElement('div')
        metodoItem.classList = 'form control my-1 '
        if(metodo.mp_tipo != "Puntos"){
            metodoItem.innerHTML = `
                <input type="checkbox" id='${metodo.mp_id}' name="radio" value=${metodo.mp_id}>
                <label for="usuarios">${metodo.mp_tipo} ${metodo.mp_nombre}</label>
                <input name="pago" style="float:right"size="3" id='total${i}'></input>        
                `
            options.append(metodoItem)
        }
        else{
            metodoItem.innerHTML = `
                <input type="checkbox" id='${metodo.mp_id}' name="radio" value=${metodo.mp_id}>
                <label for="usuarios">${metodo.mp_tipo} ${metodo.mp_nombre}</label>
                <input name="pago" style="float:right"size="3" id='total${i}'></input> 
                <label for="cantidad"> (Cantidad: ${metodo.mp_cantidad_puntos})</label>       
                `
            options.append(metodoItem)
        }
        i = i+1
    })
  }

  var checkBox = document.querySelector('input[type="checkbox"]');
  var textInput = document.querySelector('input[name="pago"]');

function toggleRequired() {

    if (textInput.hasAttribute('required') !== true) {
        textInput.setAttribute('required','required');
    }

    else {
        textInput.removeAttribute('required');  
    }
}

checkBox.addEventListener('change',toggleRequired,false);

  



});


pagarForm.addEventListener("submit", async (e) => { //cuando tocamos el boton submit
    e.preventDefault(); //cancela el comportamiento por defecto del formulario

    const nombre = pagarForm["nombre"].value; //obtiene el valor del campo username
    const rif = pagarForm["rif"].value;
    const montoTotal = pagarForm["montoTotal"].value;


    let metodosP = [];
    
    var checkboxes = document.querySelectorAll('input[name="radio"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
      metodosP.push(checkboxes[i].value);      
    }
    console.log(metodosP)

    var cobro = 0
    let array = [];
    var checkboxes = document.querySelectorAll('input[name="pago"]');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].value == '') {
        console.log("no")
      }else{
        array.push(checkboxes[i].value);  
      }
      
      cobro = Number(cobro) + Number(checkboxes[i].value)
    }
    
    console.log(array)

    var fk_cn_id
    if (cliente.cn_id != null) {
      fk_cn_id = cliente.cn_id
    }else{
      fk_cn_id = null
    }

    var fk_cj_id
    if (cliente.cj_id != null) {
      fk_cj_id = cliente.cj_id
    }else{
      fk_cj_id = null
    }
    var fk_ti_id = user.fk_ti_id

    console.log(fk_cn_id)
    console.log(fk_cj_id)
    console.log(fk_ti_id)


    var chequeo = true
    for (let i = 0; i < metodosP.length; i++) {
        const fk_mp_id = metodosP[i];
        const mp_monto_cancelado = array[i];
        
        const response10 = await fetch(`/api/metodoPago/${fk_mp_id}`)
        const data10 = await response10.json();
        console.log(data10)

        if(data10.mp_tipo == "Puntos"){
            if(data10.mp_cantidad_puntos < mp_monto_cancelado){
                chequeo = false
            }
        }

      }

    if(chequeo == true){

        var chequeo1 = true

        //EN ESTE FOR HACEMOS TODO EL MOVIMIENTO DE INVENTARIO
        for (let i = 0; i < detalle.length; i++) {
            const fk_p_id = detalle[i].id;
            const dp_cantidad = detalle[i].cantidad;
    
            const chequeoPasillo = await fetch(`/api/productoPasillo/${fk_p_id}/${user.fk_ti_id}`)
            const dataChequeo = await chequeoPasillo.json();
            console.log(dataChequeo)
    
            if(dataChequeo.zp_cantidad_disp < dp_cantidad){
                const chequeoAlmacen = await fetch(`/api/productoAlmacen/${fk_p_id}/${user.fk_ti_id}`)
                const dataChequeo1 = await chequeoAlmacen.json();
                console.log(dataChequeo1)

                if(dataChequeo1.zal_cantidad_disp < dp_cantidad){
                    chequeo1 = false
                }
                else{
                    const responseRestaAlmacen = await fetch(`/api/restarAlmacen/${fk_p_id}/${user.fk_ti_id}/${dp_cantidad}`,{
                        method: 'PUT',
                    })

                    const responseRestaInventario = await fetch(`/api/restarInventario/${fk_p_id}/${user.fk_ti_id}/${dp_cantidad}`, {
                        method: "PUT",
                    });

                    const cantidadAlmacen = await fetch(`/api/productoAlmacen/${fk_p_id}/${user.fk_ti_id}`)
                    const dataCantidadAlmacen = await cantidadAlmacen.json();
                    console.log(dataCantidadAlmacen)

                    if(dataCantidadAlmacen.zal_cantidad_disp <= 100){
                        //REALIZO UN PEDIDO A LA FABRICA POR 10MIL UNIDADES DEL PRODUCTO
                        const pe_cantidad = 10000
                        const fk_ti_id = user.fk_ti_id

                        const responsePFAB = await fetch('/api/pedidoFabrica', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                pe_cantidad,
                                fk_ti_id
                            }),
                        });

                        const dataPFAB = await responsePFAB.json();
                        console.log(dataPFAB)

                        var dataUlDP
                        const responseUlDP = await fetch ('/api/ultimoDetallePedido/')
                        dataUlDP = await responseUlDP.json()
                        if (dataUlDP.length < 1) {
                        dataUlDP = 1
                        }else{
                        try{
                        dataUlDP = Number(dataUlDP[0].dp_id) +1
                        }catch(error){}
                        }

                        const dp_id = dataUlDP
                        const fk_pf_id = dataPFAB.pf_id
                        console.log(fk_pf_id)
                        
                        const responseDPFAB = await fetch('/api/detallePedidoFabrica', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                dp_id,
                                fk_p_id,
                                pe_cantidad,
                                fk_pf_id,
                                fk_ti_id
                            }),
                        });

                        const es_pe_fecha = null

                        const responseEPFAB = await fetch('/api/estatusPedidoFabrica', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    fk_pf_id,
                                    es_pe_fecha,
                                    fk_ti_id
                                    }),
                        });

                        alert("Se ha realizado un pedido a la fabrica, por favor notificar al responsable de area de compras")

                        /*
                        const sumarAlmacen = await fetch(`/api/sumarAlmacen/${fk_p_id}/${user.fk_ti_id}/${pe_cantidad}`, {
                            method: "PUT",
                        });

                        const sumarInventario = await fetch(`/api/sumarInventario/${fk_p_id}/${user.fk_ti_id}/${pe_cantidad}`, {
                            method: "PUT",
                        });
                        */

                    }
                }
            }   
            else{
                const responseRestaPasillo = await fetch(`/api/restarPasillo/${fk_p_id}/${user.fk_ti_id}/${dp_cantidad}`, {
                    method: "PUT",
                });

                const responseRestaInventario = await fetch(`/api/restarInventario/${fk_p_id}/${user.fk_ti_id}/${dp_cantidad}`, {
                    method: "PUT",
                });

                const cantidadPasillo = await fetch(`/api/productoPasillo/${fk_p_id}/${user.fk_ti_id}`)
                const dataCantidadPasillo = await cantidadPasillo.json();
                console.log(dataCantidadPasillo)

                var fk_ti_id = user.fk_ti_id

                if(dataCantidadPasillo.zp_cantidad_disp <= 20){
                    var movimiento = 100

                    const pedidoPasillo = await fetch('/api/pedidosPasillo', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                fk_p_id,
                                fk_ti_id
                            }),
                    });

                    alert("Se necesita reposicion de un producto en una zona del pasillo, favor notificar al jefe de pasillos")


                    /*const sacarAlmacen = await fetch(`/api/restarAlmacen/${fk_p_id}/${user.fk_ti_id}/${movimiento}`,{
                        method: 'PUT',
                    })

                    const sumarPasillo = await fetch(`/api/sumarPasillo/${fk_p_id}/${user.fk_ti_id}/${movimiento}`, {
                        method: "PUT",
                    });

                    const cantidadAlmacen = await fetch(`/api/productoAlmacen/${fk_p_id}/${user.fk_ti_id}`)
                    const dataCantidadAlmacen = await cantidadAlmacen.json();
                    console.log(dataCantidadAlmacen)

                    if(dataCantidadAlmacen.zal_cantidad_disp <= 100){
                        //REALIZO UN PEDIDO A LA FABRICA POR 10MIL UNIDADES DEL PRODUCTO
                        const pe_cantidad = 10000
                        const fk_ti_id = user.fk_ti_id

                        const responsePFAB = await fetch('/api/pedidoFabrica', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                pe_cantidad,
                                fk_ti_id
                            }),
                        });

                        const dataPFAB = await responsePFAB.json();
                        console.log(dataPFAB)

                        var dataUlDP
                        const responseUlDP = await fetch ('/api/ultimoDetallePedido/')
                        dataUlDP = await responseUlDP.json()
                        if (dataUlDP.length < 1) {
                        dataUlDP = 1
                        }else{
                        try{
                        dataUlDP = Number(dataUlDP[0].dp_id) +1
                        }catch(error){}
                        }

                        const dp_id = dataUlDP
                        const fk_pf_id = dataPFAB[0]
                        console.log(fk_pf_id)
                        
                        const responseDPFAB = await fetch('/api/detallePedidoFabrica', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                dp_id,
                                fk_p_id,
                                pe_cantidad,
                                fk_pf_id,
                                fk_ti_id
                            }),
                        });

                        const es_pe_fecha = null

                        const responseEPFAB = await fetch('/api/estatusPedidoFabrica', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    fk_pf_id,
                                    es_pe_fecha,
                                    fk_ti_id
                                    }),
                        });

                        /*
                        const sumarAlmacen = await fetch(`/api/sumarAlmacen/${fk_p_id}/${user.fk_ti_id}/${pe_cantidad}`, {
                            method: "PUT",
                        });

                        const sumarInventario = await fetch(`/api/sumarInventario/${fk_p_id}/${user.fk_ti_id}/${pe_cantidad}`, {
                            method: "PUT",
                        });
                        
                    }*/
                }

            }
        }

        if(chequeo1 == true){


            const responsePF = await fetch('/api/pedidoFisico', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },       
            body: JSON.stringify({
                total,
                fk_cn_id,
                fk_cj_id,
                fk_ti_id
            })     
            })
            const dataPF = await responsePF.json()

            var dataUlDP
            const responseUlDP = await fetch ('/api/ultimoDetallePedido/')
            dataUlDP = await responseUlDP.json()
            if (dataUlDP.length < 1) {
            dataUlDP = 1
            }else{
            try{
            dataUlDP = Number(dataUlDP[0].dp_id) +1
            }catch(error){}
            }

            const dp_id = dataUlDP
            console.log(dataPF)
            console.log(dataPF[0])
            const fk_pe_fisico_id = dataPF[0]
            for (let i = 0; i < detalle.length; i++) {
            const fk_p_id = detalle[i].id;
            const dp_cantidad = detalle[i].cantidad;
            const responseDP = await fetch('/api/detallePedidoFisico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },       
                body: JSON.stringify({
                dp_id,
                fk_p_id,
                dp_cantidad,
                fk_pe_fisico_id,
                fk_ti_id
                })     
            })
            const dataDP = await responseDP.json()
            }


            const es_pe_fecha = null
            const responseEPF = await fetch('/api/estatusPedidoFisico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },       
                body: JSON.stringify({
                fk_pe_fisico_id,
                es_pe_fecha
                })     
            })
            const dataEPF = await responseEPF.json()



            for (let i = 0; i < metodosP.length; i++) {
                const fk_mp_id = metodosP[i];
                const mp_monto_cancelado = array[i]
                console.log(fk_mp_id)
                console.log(mp_monto_cancelado)

                const response11 = await fetch(`/api/metodoPago/${fk_mp_id}`)
                const data11 = await response11.json();
                console.log(data11)

                if(data11.mp_tipo == "Puntos"){
                    for(let j = 0; j < mp_monto_cancelado; j++){
                        if(cliente.cn_id != null){
                            const response12 = await fetch(`/api/restarPuntoCN/${cliente.cn_id}`,{
                                method: 'PUT',
                            })
                        }
                        else{
                            const response12 = await fetch(`/api/restarPuntoCJ/${cliente.cj_id}`,{
                                method: 'PUT',
                            })
                        }
                    }
                }

                const responseDP = await fetch('/api/metodopago_fisico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },       
                body: JSON.stringify({
                    fk_mp_id,
                    fk_pe_fisico_id,
                    mp_monto_cancelado
                })     
                })
                const dataDP = await responseDP.json()
            }
            
            
            if(cliente.cn_id != null){
                const response1 = await fetch(`/api/metodoPuntosCN/${cliente.cn_id}`);
                data1 = await response1.json()
                console.log(data1)
                if(data1.message == "Metodo not found"){
                    var MP_Nombre = cliente.cn_prim_nom
                    var MP_Tipo_Tarjeta = null
                    var MP_Numero_Tarjeta = null
                    var MP_Correo_Zelle = null
                    var MP_Banco_PagoMovil = null
                    var MP_Correo_PayPal = null
                    var MP_Nombre_PayPal = null
                    var MP_Tipo_Efectivo = null
                    var MP_Cantidad_Puntos = 1
                    var MP_Tipo = "Puntos"
                    var FK_CJ_ID = null
                    var FK_CN_ID = cliente.cn_id

                    const response2 = await fetch('/api/metodoPago',{
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            MP_Nombre,
                            MP_Tipo_Tarjeta,
                            MP_Numero_Tarjeta,
                            MP_Correo_Zelle,
                            MP_Banco_PagoMovil,
                            MP_Correo_PayPal,
                            MP_Nombre_PayPal,
                            MP_Tipo_Efectivo,
                            MP_Cantidad_Puntos,
                            MP_Tipo,
                            FK_CJ_ID,
                            FK_CN_ID}),
                    })

                }
                else{
                    const response3 = await fetch(`/api/sumarPuntoCN/${cliente.cn_id}`,{
                        method: 'PUT',
                    })
                    const data3 = await response3.json()
                    console.log(data3)
                }
            }
            else{
                
                const response4 = await fetch(`/api/metodoPuntosCJ/${cliente.cj_id}`);
                const data4 = await response4.json()
                console.log(data4)
                if(data4.message == "Metodo not found"){
                    var MP_Nombre = cliente.cj_den_com
                    var MP_Tipo_Tarjeta = null
                    var MP_Numero_Tarjeta = null
                    var MP_Correo_Zelle = null
                    var MP_Banco_PagoMovil = null
                    var MP_Correo_PayPal = null
                    var MP_Nombre_PayPal = null
                    var MP_Tipo_Efectivo = null
                    var MP_Cantidad_Puntos = 1
                    var MP_Tipo = "Puntos"
                    var FK_CJ_ID = cliente.cj_id
                    var FK_CN_ID = null

                    const response5 = await fetch('/api/metodoPago',{
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            MP_Nombre,
                            MP_Tipo_Tarjeta,
                            MP_Numero_Tarjeta,
                            MP_Correo_Zelle,
                            MP_Banco_PagoMovil,
                            MP_Correo_PayPal,
                            MP_Nombre_PayPal,
                            MP_Tipo_Efectivo,
                            MP_Cantidad_Puntos,
                            MP_Tipo,
                            FK_CJ_ID,
                            FK_CN_ID}),
                    })

                }
                else{
                    const response6 = await fetch(`/api/sumarPuntoCJ/${cliente.cj_id}`,{
                        method: 'PUT',
                    })
                    const data6 = await response6.json()
                    console.log(data6)
                }

            }
            alert("Pedido realizado, se le ha otorgado un punto al cliente")

        
            sessionStorage.setItem("userData", JSON.stringify(user));
            sessionStorage.setItem("detalle", JSON.stringify(detalle));
            sessionStorage.setItem("cliente",JSON.stringify(cliente));
            sessionStorage.setItem("total",total);
            window.location.replace("http://localhost:5000/pdfFisico")
        }
        else{
            alert("La tienda no posee la cantidad de productos solicitados")
            sessionStorage.clear()
            sessionStorage.setItem("userData", JSON.stringify(user));
            window.location.replace("http://localhost:5000/hub")
        }
    }
    else{
        alert("El cliente no posee la cantidad de puntos ingresada")
        window.location.replace("http://localhost:5000/agregarPagoFisico")
    }
  
});