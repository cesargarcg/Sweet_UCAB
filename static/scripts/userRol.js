const userForm = document.querySelector('#userForm')
const updata = JSON.parse(sessionStorage.getItem("update"));
console.log(updata)

let users = []
userForm['name'].value = updata.u_nombre
document.getElementById("PagTxt").textContent="Asignando Rol"

window.addEventListener("DOMContentLoaded", async () => {
    //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
 
    //Roles
    const responseRoles = await fetch("/api/roles", {
      method: "GET",
    });
    const dataRoles = await responseRoles.json();
    roles_data = dataRoles;
    console.log(dataRoles);
 
    roles_data.forEach((rol) => {
 
      const select = document.querySelector("#rol");

      select.options.add(new Option(rol.ro_nombre, rol.ro_nombre));
    });

  }); 


userForm.addEventListener('submit', async e => {
    e.preventDefault()
    
    const username= userForm['name'].value
    const rol_name= document.getElementById("rol").value
    console.log(rol_name)
    const response1 = await fetch(`/api/roles/${rol_name}`);
    const data = await response1.json();
    console.log(data.message)
    if(data.message!="Rol not found"){
        
        const rol = data.ro_clave
        const password= updata.u_contrasena
        const empl= updata.fk_e_clave
        const clnN= updata.fk_cn_id
        const clnJ= updata.fk_cj_id
        const tind= updata.fk_ti_id
    
    
        const response = await fetch(`/api/users/${updata.u_clave}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },       
            body: JSON.stringify({
                username,
                password,
                rol,
                empl,
                clnN,
                clnJ,
                tind
            })
        })
    
        const data2 = await response.json()
        console.log(data2)
    
        userForm.reset();
        
    }else{
        alert("El rol no existe")
        window.location.replace("http://localhost:5000/usuariosCreados");
    }

    console.log(data)
    sessionStorage.removeItem("update");
    userForm.reset();

});



