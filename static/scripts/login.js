const userForm = document.querySelector('#userForm')

userForm.addEventListener('submit', async e => {
    e.preventDefault()
    
    const username= userForm['username'].value
    const password= userForm['password'].value
    

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },       
        body: JSON.stringify({
            username,
            password,
        })
    })
    
    const data = await response.json()
    if (data.message != "User not found") {
        sessionStorage.setItem("userData",JSON.stringify(data))
        window.location.replace("http://localhost:5000/hub");
    } else {
        alert("Usuario no encontrado")
        userForm.reset()
    }
    

});

