const createRolForm = document.querySelector('#createRolForm')
const updata = JSON.parse(sessionStorage.getItem("update"));
console.log(updata)

let users = []

window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/acciones'); 
    const acciones = await response.json()
    const options = document.getElementById("fieldset")
    acciones.forEach(accion => {
        const accionItem = document.createElement('div')
        accionItem.innerHTML = `
            <input type="checkbox" id='${accion.a_clave}' name="radio" value=${accion.a_clave}>
            <label for="usuarios">${accion.a_nombre}</label>          
            `
        options.append(accionItem)
    })
});


if (updata==null){
    sessionStorage.removeItem("update");
    createRolForm.addEventListener('submit', async e => {
        e.preventDefault()
        const nombre = document.getElementById("nombre").value
        const desc   = document.getElementById("desc").value
        const radios = document.getElementsByName("radio");    
        console.log(nombre)
        console.log(desc)
        const response = await fetch('/api/roles', {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },       
                body: JSON.stringify({
                    nombre,
                    desc
            })
        })
        const data = await response.json()
        console.log(data)
    
        let ro_id = data.ro_clave
    
        var response2
        for (var i = 0; i <  radios.length; i++) {
            if (radios[i].checked) {
                console.log(radios[i].value)
                console.log(radios)   
            let accid = radios[i].value
            response2 = fetch('/api/rol_accion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },       
                body: JSON.stringify({
                    ro_id,
                    accid
            })
        })
            }
        }
        createRolForm.reset();
        alert("Rol creado con exito")
        window.location.replace("http://localhost:5000/rolesCreados");

    });
}else{
    console.log(updata)
    console.log(updata.ro_nombre)
    createRolForm['name'].value = updata.ro_nombre
    createRolForm['descripcion'].value = updata.ro_descripcion

    createRolForm.addEventListener('submit', async e => {
        e.preventDefault()
        const nombre = document.getElementById("nombre").value
        const desc   = document.getElementById("desc").value
        const radios = document.getElementsByName("radio");    
        console.log(nombre)
        console.log(desc)
        const response = await fetch(`/api/roles/${updata.ro_clave}`, {
            method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },       
                body: JSON.stringify({
                    nombre,
                    desc
            })
        })
        const data = await response.json()
        console.log(data)
    
        let ro_id = updata.ro_clave

        const responseDelete = await fetch(`/api/rol_accion/${updata.ro_clave}`,{
            method: 'DELETE'
        });
        const data2 = await responseDelete.json();
        console.log(data2)

        var response2
        for (var i = 0; i <  radios.length; i++) {
            if (radios[i].checked) {
                console.log(radios[i].value)
                console.log(radios)   
            let accid = radios[i].value
            response2 = fetch(`/api/rol_accion/${updata.ro_clave}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },       
                body: JSON.stringify({
                    ro_id,
                    accid
            })
        })
            }
        }
        sessionStorage.removeItem("update");
        createRolForm.reset();
        alert("Rol actualizado con exito")
        window.location.replace("http://localhost:5000/rolesCreados");
    
    });
    
}

























