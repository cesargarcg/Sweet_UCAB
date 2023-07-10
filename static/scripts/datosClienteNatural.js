const userForm = document.querySelector('#userForm')
var clienteData = JSON.parse(sessionStorage.getItem("update"));
console.log(clienteData)



let lugar_data = []

window.addEventListener("DOMContentLoaded", async () => {
    //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
 
    const responseEstados = await fetch("/api/lugarEstados", {
      method: "GET",
    });
    const dataEstados = await responseEstados.json();
    lugar_data = dataEstados;
    console.log(lugar_data)
 
    lugar_data.forEach((estado) => {
 
      const select = document.querySelector("#estado");

      select.options.add(new Option(estado.l_nombre, estado.l_id));
    });

  }); 


if (clienteData == null) {
    sessionStorage.removeItem("update");
    userForm.addEventListener('submit', async e => {
        e.preventDefault()
    
        const id = userForm['id'].value
        const rif= userForm['rif'].value   
        const Pn = userForm['Pn'].value
        const Sn = userForm['Sn'].value
        const Pa = userForm['Pa'].value
        const Sa = userForm['Sa'].value
        const email = userForm['email'].value
        const l_id = document.getElementById("estado").value
    
        const te_cod_area = userForm['codigo'].value
        const te_numero = userForm['telefono'].value
    
        const response1 = await fetch(`/api/clienteNaturalRif/${rif}`);
        const data = await response1.json()
        console.log(data)

        if(data.message!="Cliente not found"){
            sessionStorage.setItem("cliente",JSON.stringify(data))
            sessionStorage.setItem("fisico",JSON.stringify(data))
            window.location.replace("http://localhost:5000/agregarPagoFisico");
        }
        else{
            const response2 = await fetch('/api/clienteNatural', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },       
                body: JSON.stringify({
                    id,
                    rif,
                    Pn,
                    Sn,
                    Pa,
                    Sa,
                    email,
                    l_id
                })
            })
            const data2 = await response2.json()

            const fk_juridico = null
            const fk_natural = data2.cn_id
            const fk_pc_id = null
    
            const response3 = await fetch('/api/telefono', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    te_cod_area,
                    te_numero,
                    fk_juridico,
                    fk_natural,
                    fk_pc_id
                })
        
            })

            const data3 = await response3.json()
            console.log(data3)

            const MP_Nombre = Pn
            const MP_Tipo_Tarjeta = null
            const MP_Numero_Tarjeta = null
            const MP_Correo_Zelle = null
            const MP_Banco_PagoMovil = null
            const MP_Correo_PayPal = null
            const MP_Nombre_PayPal = null
            var MP_Tipo_Efectivo = "Dolares"
            const MP_Cantidad_Puntos = null
            const MP_Tipo = "Efectivo"
            const FK_CN_ID = data2.cn_id
            const FK_CJ_ID = null
    
            const response4 = await fetch('/api/metodoPago',{
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

            sessionStorage.setItem("cliente",JSON.stringify(data2))
            sessionStorage.setItem("fisico",JSON.stringify(data2))
            alert("Cliente registrado correctamente")
            window.location.replace("http://localhost:5000/agregarPagoFisico");
        }
    });
    
}
