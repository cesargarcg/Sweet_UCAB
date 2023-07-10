const userForm = document.querySelector('#userForm')
var userData = []
var clienteData = JSON.parse(sessionStorage.getItem("update"));
console.log(clienteData)
userData = JSON.parse(sessionStorage.getItem("user"));
console.log(userData)
const username = userData.username
const password = userData.password

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

    let clienteData = '{"rif": "'+userForm['rif'].value+'", "dencom": "'+userForm['dencom'].value+'", "razsoc": "'+userForm['razsoc'].value 
                            +'", "pagina": "'+userForm['pagina'].value+'", "capital": "'+userForm['capital'].value+'", "fiscal": "'+document.getElementById("fiscal").value
                                +'", "principal": "'+document.getElementById("principal").value+'"}'

    
    let telefonoData = '{"te_cod_area": "'+userForm['codigo'].value+'", "te_numero": "'+userForm['telefono'].value+'"}'

    sessionStorage.setItem("userData", JSON.stringify(userData))
    sessionStorage.setItem("cliente", JSON.stringify(JSON.parse(clienteData)))
    sessionStorage.setItem("telefono", JSON.stringify(JSON.parse(telefonoData)))
    userForm.reset();
    window.location.replace("http://localhost:5000/agregarContacto"); 


    
});
}
else{

    userForm['rif'].value = clienteData.cj_rif
    userForm['dencom'].value = clienteData.cj_den_com
    userForm['razsoc'].value = clienteData.cj_raz_soc
    userForm['pagina'].value = clienteData.cj_pag_web
    userForm['capital'].value = clienteData.cj_capital
    
    userForm.addEventListener('submit', async e => {
      e.preventDefault()
      const rif = userForm['rif'].value
      const dencom= userForm['dencom'].value   
      const razsoc = userForm['razsoc'].value
      const pagina = userForm['pagina'].value
      const capital = userForm['capital'].value
  
      const fiscal = document.getElementById("fiscal").value
      const principal = document.getElementById("principal").value

      const te_cod_area = userForm['codigo'].value
      const te_numero = userForm['telefono'].value
      
      const response = await fetch(`/api/clienteJuridico/${clienteData.cj_id}`, {
          method: 'PUT',
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
              principal,
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