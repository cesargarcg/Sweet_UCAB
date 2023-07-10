const userForm = document.querySelector('#userForm')
var userData = []
var clienteData = JSON.parse(sessionStorage.getItem("update"));
console.log(clienteData)

let lugar_data = []

window.addEventListener("DOMContentLoaded", async () => {
    //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
 
    //Estados
    const responseEstados = await fetch("/api/lugarEstados", {
      method: "GET",
    });
    const dataEstados = await responseEstados.json();
    lugar_data = dataEstados;
    console.log(dataEstados);
 
    lugar_data.forEach((estado) => {
 
      const select = document.querySelector("#fiscal");
      const select2 = document.querySelector("#principal");

      select.options.add(new Option(estado.l_nombre, estado.l_id));
      select2.options.add(new Option(estado.l_nombre, estado.l_id));
    });

  }); 

  if(clienteData == null){
    sessionStorage.removeItem("update");
    userForm.addEventListener('submit', async e => {
        e.preventDefault()

        const rif = userForm['rif'].value
        const dencom = userForm['dencom'].value
        const razsoc = userForm['razsoc'].value
        const pagina = userForm['pagina'].value
        const capital = userForm['capital'].value
        const fiscal = document.getElementById("fiscal").value
        const principal = document.getElementById("principal").value

        const te_cod_area = userForm['codigo'].value
        const te_numero = userForm['telefono'].value

        const response1 = await fetch(`/api/clienteJuridicoRif/${rif}`);
        const data = await response1.json()

        if(data.message!="Cliente not found"){
            sessionStorage.setItem("cliente",JSON.stringify(data))
            sessionStorage.setItem("fisico",JSON.stringify(data))
            window.location.replace("http://localhost:5000/agregarPagoFisico");
        }
        else{
            const response2 = await fetch('/api/clienteJuridico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },       
                body: JSON.stringify({
                    rif: rif,
                    dencom: dencom,
                    razsoc: razsoc,
                    pagina: pagina,
                    capital: capital,
                    fiscal: fiscal,
                    principal: principal
                })
            })


            const data2 = await response2.json()

            const fk_juridico = data2.cj_id
            const fk_natural = null
            const fk_pc_id = null

            const response3 = await fetch('/api/telefono', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fk_juridico,
                    fk_natural,
                    fk_pc_id,
                    te_cod_area,
                    te_numero
                })
            })
            const data3 = await response3.json()

            const MP_Nombre = dencom
            const MP_Tipo_Tarjeta = null
            const MP_Numero_Tarjeta = null
            const MP_Correo_Zelle = null
            const MP_Banco_PagoMovil = null
            const MP_Correo_PayPal = null
            const MP_Nombre_PayPal = null
            var MP_Tipo_Efectivo = "Dolares"
            const MP_Cantidad_Puntos = null
            const MP_Tipo = "Efectivo"
            const FK_CN_ID = null
            const FK_CJ_ID = data2.cj_id
        
            const response6 = await fetch('/api/metodoPago',{
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
        
            MP_Tipo_Efectivo = "Bolivares"
        
            const response7 = await fetch('/api/metodoPago',{
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

            sessionStorage.setItem("cliente",JSON.stringify(data2))
            sessionStorage.setItem("fisico",JSON.stringify(data2))
            alert("Cliente Juridico agregado con exito")
            window.location.replace("http://localhost:5000/agregarPagoFisico");
        }
    
    });
}