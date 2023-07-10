const metodoPago = document.querySelector('#ppForm')
const user = JSON.parse(sessionStorage.getItem("userData"));
const fisico = JSON.parse(sessionStorage.getItem("fisico"));
console.log(fisico)

window.addEventListener("DOMContentLoaded", async () => {
    if(fisico==null){
        try {
            const response = await fetch(`/api/clienteNatural/${user.fk_cn_id}`);
            clienteaux= await response.json()
            if (clienteaux.cn_id != null) {
                cliente = clienteaux.cn_id
                console.log(FK_CN_ID) //hay que cambiarlo cuando tengamos clientes
            }else{
            }
            
            console.log(cliente)
        } catch (error) {
        }
        try {
            const response = await fetch(`/api/clienteJuridico/${user.fk_cj_id}`); 
            clienteaux= await response.json()
            if (clienteaux.cn_id != null) {
                cliente = clienteaux.cj_id
                console.log(FK_CJ_ID) //hay que cambiarlo cuando tengamos clientes
            }else{
            }
            
            console.log(cliente)
        } catch (error) {
        }
        console.log(cliente)
    }
    else{
        if(fisico.cj_id != null)
            console.log(fisico.cj_id)
        else
            console.log(fisico.cn_id)
    }
})

metodoPago.addEventListener('submit', async e=>{
    e.preventDefault()

    const MP_Nombre = metodoPago['nombrePaypal'].value
    const MP_Tipo_Tarjeta = null
    const MP_Numero_Tarjeta = null
    const MP_Correo_Zelle = null
    const MP_Banco_PagoMovil = null
    const MP_Correo_PayPal = metodoPago['correoPaypal'].value
    const MP_Nombre_PayPal = metodoPago['nombrePaypal'].value
    const MP_Tipo_Efectivo = null
    const MP_Cantidad_Puntos = null
    const MP_Tipo = "Paypal"
    if(fisico==null){
        var FK_CJ_ID = user.fk_cj_id
    }
    else{  
        if(fisico.cj_id != null)
            var FK_CJ_ID = fisico.cj_id
        else 
            var FK_CJ_ID = null
    }
    if(fisico==null){
        var FK_CN_ID = user.fk_cn_id //hay que cambiarlo cuando tengamos clientes
    }
    else{
        if(fisico.cn_id != null)
            var FK_CN_ID = fisico.cn_id
        else
            var FK_CN_ID = null
    } 

    const response = await fetch('/api/metodoPago',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
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
            FK_CN_ID,
            FK_CJ_ID}),
    })

    const data= await response.json()
    console.log(data)
    metodoPago.reset()

    if(fisico!=null)
        window.location.replace("/agregarPagoFisico")
});