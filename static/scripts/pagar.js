const pagarForm = document.querySelector("#pagarForm");
const user = JSON.parse(sessionStorage.getItem("userData"));
const detalle = JSON.parse(sessionStorage.getItem("detalle"));
const cliente = JSON.parse(sessionStorage.getItem("cliente"));
const total = JSON.parse(sessionStorage.getItem("total"));

let productos = []; //array to store user data


window.addEventListener("DOMContentLoaded", async () => {
  //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading

  if (user.fk_ro_clave==1) {
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
        if(metodo.mp_tipo != "Efectivo"){
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
        }
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
        if(metodo.mp_tipo != "Efectivo"){
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
        }
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

    console.log(fk_cn_id)
    console.log(fk_cj_id)

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
    
    if (chequeo == true){

      const responsePO = await fetch('/api/pedidoOnline', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },       
        body: JSON.stringify({
          total,
          fk_cn_id,
          fk_cj_id
        })     
      })
      const dataPO = await responsePO.json()

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
      console.log(dataPO)
      console.log(dataPO[0])
      const fk_pe_online_id = dataPO[0]
      for (let i = 0; i < detalle.length; i++) {
        const fk_p_id = detalle[i].id;
        const dp_cantidad = detalle[i].cantidad;
        const responseDP = await fetch('/api/detallePedido', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },       
          body: JSON.stringify({
            dp_id,
            fk_p_id,
            dp_cantidad,
            fk_pe_online_id
          })     
        })
        const dataDP = await responseDP.json()
      }


      const es_pe_fecha = null
      const responseEPO = await fetch('/api/estatusPedidoOnline', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },       
          body: JSON.stringify({
            fk_pe_online_id,
            es_pe_fecha
          })     
        })
        const dataEPO = await responseEPO.json()



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

          const responseDP = await fetch('/api/metodopago_online', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },       
            body: JSON.stringify({
              fk_mp_id,
              fk_pe_online_id,
              mp_monto_cancelado
            })     
          })
          const dataDP = await responseDP.json()
        }
      
      alert("Pedido realizado")

    
      sessionStorage.setItem("userData", JSON.stringify(user));
      sessionStorage.setItem("detalle", JSON.stringify(detalle));
      sessionStorage.setItem("cliente",JSON.stringify(cliente));
      sessionStorage.setItem("total",total);
      window.location.replace("http://localhost:5000/pdfPedido")
  }
  else{
    alert("El cliente no posee la cantidad de puntos ingresada")
    window.location.replace("http://localhost:5000/pagar")
  }
  
});