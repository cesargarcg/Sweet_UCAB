const userForm = document.querySelector('#userForm')
var userData = []
userData = JSON.parse(sessionStorage.getItem("userData"));
console.log(userData)
clienteData = JSON.parse(sessionStorage.getItem("cliente"));
console.log(clienteData)
telefonoData = JSON.parse(sessionStorage.getItem("telefono"));
console.log(telefonoData)

const username = userData.username
const password = userData.password

const rif = clienteData.rif
const dencom = clienteData.dencom
const razsoc = clienteData.razsoc
const pagina = clienteData.pagina
const capital = clienteData.capital
const fiscal = clienteData.fiscal
const principal = clienteData.principal



userForm.addEventListener('submit', async e => {
    e.preventDefault()

    const response = await fetch('/api/clienteJuridico', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },       
        body: JSON.stringify({
            rif,
            dencom,
            razsoc,
            pagina,
            capital,
            fiscal,
            principal
        })
    })
    
    const data = await response.json()
    console.log(data)
    console.log(data.cj_id)

    const fk_cn_id = null
    const fk_cj_id = data.cj_id
    const fk_ro_id = 2
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
    console.log(data2)

    const pc_nombre = userForm['nombre'].value
    const pc_apellido = userForm['apellido'].value

    const response3 = await fetch('/api/personaContacto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pc_nombre,
            pc_apellido,
            fk_cj_id
        })
    })
    
    const data3 = await response3.json()
    console.log(data3)

    var te_cod_area = userForm['codigo'].value
    var te_numero = userForm['telefono'].value

    var fk_pc_id = data3.pc_id
    const fk_natural = null
    var fk_juridico = null

    const response4 = await fetch('/api/telefono',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            te_cod_area,
            te_numero,
            fk_pc_id,
            fk_natural,
            fk_juridico
        })
    })

    const data4 = await response4.json()
    console.log(data4)

    te_cod_area = telefonoData.te_cod_area
    te_numero = telefonoData.te_numero
    fk_pc_id = null
    fk_juridico = fk_cj_id

    const response5 = await fetch('/api/telefono', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            te_cod_area,
            te_numero,
            fk_pc_id,
            fk_natural,
            fk_juridico
        })  
    })

    const data5 = await response5.json()
    console.log(data5)

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
    const FK_CJ_ID = data.cj_id

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

    alert("Cliente registrado con éxito.")
    window.location.href = "/"


    userForm.reset();
});