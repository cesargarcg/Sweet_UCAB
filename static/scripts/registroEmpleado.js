const userForm = document.querySelector('#userForm')
const updata = JSON.parse(sessionStorage.getItem("update"));
console.log(updata)

let users = []

let tienda_data = []

window.addEventListener("DOMContentLoaded", async () => {
    //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
 
    //Tiendas
    const responseTiendas = await fetch("/api/tiendas", {
      method: "GET",
    });
    const dataTiendas = await responseTiendas.json();
    tienda_data = dataTiendas;
 
    tienda_data.forEach((tienda) => {
 
      const select = document.querySelector("#tienda");

      select.options.add(new Option(tienda.ti_nombre,tienda.ti_id));
    });

  }); 

    document.getElementById("PagTxt").textContent="Creando usuario"
    userForm.addEventListener('submit', async e => {
        e.preventDefault()
        
        const nombre = userForm['nombre'].value
        const apellido = userForm['apellido'].value
        const cedula = userForm['cedula'].value
        const salario = userForm['salario'].value
        const fk_ti_id = document.getElementById("tienda").value

        const response1 = await fetch('/api/empleados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                e_nombre: nombre,
                e_apellido: apellido,
                e_ci: cedula,
                e_salario: salario,
                fk_ti_id: fk_ti_id
            })
        })

        const data1 = await response1.json()
        console.log(data1)
        console.log(data1[0])
        const id = data1[0]

        const username = userForm['username'].value
        const password = userForm['password'].value
        const fk_cn_id = null
        const fk_cj_id = null
        const fk_ro_id = null
        const fk_e_id = id
    
        const response2 = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },       
            body: JSON.stringify({
                username: username,
                password: password,
                fk_cn_id: fk_cn_id,
                fk_cj_id: fk_cj_id,
                fk_ro_id: fk_ro_id,
                fk_e_id: fk_e_id,
                fk_ti_id: fk_ti_id
            })
        })
    
        const data = await response2.json()
        console.log(data)

        sessionStorage.removeItem("update")

        alert("Empleado registrado correctamente")
        window.location.href = "/hub"
        userForm.reset();
    
    });