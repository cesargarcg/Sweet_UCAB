const userForm = document.querySelector('#userForm')
var clienteData = JSON.parse(sessionStorage.getItem("update"));
console.log(clienteData)
const user = JSON.parse(sessionStorage.getItem("user"));
console.log(user)
const username = user.username
const password = user.password


let lugar_data = []

window.addEventListener("DOMContentLoaded", async () => {
    //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
 
    if (clienteData!=null) {
        userForm["rif"].value = clienteData.cn_rif
        userForm["id"].value = clienteData.cn_ci
        userForm["Pn"].value = clienteData.cn_prim_nom
        userForm["Sn"].value = clienteData.cn_seg_nom
        userForm["Pa"].value = clienteData.cn_prim_ap
        userForm["Sa"].value = clienteData.cn_seg_ap
        userForm["email"].value = clienteData.cn_correo
      }
    //Estados
    const responseEstados = await fetch("/api/lugarEstados", {
      method: "GET",
    });
    const dataEstados = await responseEstados.json();
    lugar_data = dataEstados;
 
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
    
        const response = await fetch('/api/clienteNatural', {
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
        
        const data = await response.json()
    
        const fk_cn_id = data.cn_id
        const fk_cj_id = null
        const fk_pc_id = null
        const fk_ro_id = 1
        const fk_e_id = null
        const fk_ti_id = null
    
        const response2 = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },       
            body: JSON.stringify({
                username,
                password,
                fk_cn_id,
                fk_cj_id,
                fk_ro_id,
                fk_e_id,
                fk_ti_id
            })
        })
    
        const data2 = await response2.json()
        const fk_juridico = null
        const fk_natural = data.cn_id
    
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
        const FK_CN_ID = data.cn_id
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
    
        alert("Cliente registrado con éxito.")
        window.location.href = "/"
    
    
        userForm.reset();
    });
    
}else{

    userForm['id'].value = clienteData.cn_ci
    userForm['rif'].value = clienteData.cn_rif
    userForm['Pn'].value = clienteData.cn_prim_nom
    if(clienteData.cn_seg_nom != null){
        userForm['Sn'].value = clienteData.cn_seg_nom
    }
    userForm['Pa'].value = clienteData.cn_prim_ap
    if(clienteData.cn_seg_ap != null){
        userForm['Sa'].value = clienteData.cn_seg_ap
    }
    userForm['email'].value = clienteData.cn_correo

    userForm.addEventListener('submit', async e => {
        e.preventDefault()
    const ci = userForm['id'].value
    const rif= userForm['rif'].value   
    const Pn = userForm['Pn'].value
    const Sn = userForm['Sn'].value
    const Pa = userForm['Pa'].value
    const Sa = userForm['Sa'].value
    const email = userForm['email'].value
    const l_id = document.getElementById("estado").value

    const te_cod_area = userForm['codigo'].value
    const te_numero = userForm['telefono'].value
    
    const response = await fetch(`/api/clienteN/${clienteData.cn_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },       
        body: JSON.stringify({
            ci,
            rif,
            Pn,
            Sn,
            Pa,
            Sa,
            email,
            l_id,
            te_cod_area,
            te_numero
        })
    })

    const data = await response.json()
    console.log(data)
    sessionStorage.removeItem("update");
    alert("Cliente actualizado con éxito.")
    window.location.href = "/hub"
    userForm.reset();

    })
}  
