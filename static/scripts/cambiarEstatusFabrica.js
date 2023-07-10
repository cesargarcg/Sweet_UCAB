const userForm = document.querySelector('#userForm')
const updata = JSON.parse(sessionStorage.getItem("update"));
console.log(updata)

let users = []
userForm['numero'].value = updata.pf_numero_orden
document.getElementById("PagTxt").textContent="Asignando estatus"

window.addEventListener("DOMContentLoaded", async () => {
    //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
 
    //Roles
    const responseEstatus = await fetch("/api/estatus", {
      method: "GET",
    });
    const dataEstatus = await responseEstatus.json();
    estatus_data = dataEstatus;
    console.log(dataEstatus);
 
    estatus_data.forEach((estatus) => {
 
      const select = document.querySelector("#estatus");

      select.options.add(new Option(estatus.es_nombre, estatus.es_clave));
    });

  }); 


userForm.addEventListener('submit', async e => {
    e.preventDefault()

    const estatus = document.getElementById("estatus").value


    const response = await fetch(`/api/estatusPedidosFabrica/${updata.pf_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },       
        body: JSON.stringify({
            estatus
        })
    })

    const data2 = await response.json()
    console.log(data2)

    userForm.reset();

    alert("Estatus actualizado")
    
    sessionStorage.removeItem("update");

    window.location.replace("http://localhost:5000/pedidosFabricaCreados");

});