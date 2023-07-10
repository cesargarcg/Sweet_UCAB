const userForm = document.querySelector('#userForm')
//const updata = JSON.parse(sessionStorage.getItem("update"));
//console.log(updata)


let users = []

userForm.addEventListener('submit', async e => {
    e.preventDefault()

    let data = '{"username":"'+userForm['username'].value+'", "password":"'+userForm['password'].value+'","tipo" :"'+userForm['tipo'].value+'"}'
    const username = userForm['username'].value
    const password = userForm['password'].value
    const tipo = userForm['tipo'].value

    console.log(data)
    console.log(JSON.parse(data))
    console.log(username)
    console.log(password)
    console.log(tipo)

    if(tipo==1){
        sessionStorage.setItem("user",JSON.stringify(JSON.parse(data)))
        window.location.replace("http://localhost:5000/registroClnN"); 
    }else{
        if(tipo==2){
            sessionStorage.setItem("user",JSON.stringify(JSON.parse(data)))
            window.location.replace("http://localhost:5000/registroClnJ"); 
        }else{
            alert("Seleccione un tipo de cliente válido.")
        }
    }


});