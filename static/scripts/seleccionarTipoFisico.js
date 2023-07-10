const userForm = document.querySelector('#userForm')
//const updata = JSON.parse(sessionStorage.getItem("update"));
//console.log(updata)


let users = []

userForm.addEventListener('submit', async e => {
    e.preventDefault()

    const tipo = userForm['tipo'].value

    if(tipo==1){
        window.location.replace("http://localhost:5000/datosClienteNatural"); 
    }else{
        if(tipo==2){
            window.location.replace("http://localhost:5000/datosClienteJuridico"); 
        }else{
            alert("Seleccione un tipo de cliente válido.")
        }
    }


});