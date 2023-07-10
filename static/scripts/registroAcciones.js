const userForm = document.querySelector('#userForm')

let users = []

window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/acciones'); 
    const data = await response.json()
    users = data
    renderUser(users)
});

userForm.addEventListener('submit', async e => {
    e.preventDefault()
    
    const nombreA= userForm['nombreA'].value
    const desc= userForm['desc'].value

    console.log(desc)
    const response = await fetch('/api/acciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },       
        body: JSON.stringify({
            nombreA,
            desc
        })
    })
    const data = await response.json()
    console.log(data)

    userForm.reset();

});

function renderUser(users) {
    const userList = document.querySelector('#userlist')

    users.forEach(user => {
        const userItem = document.createElement('li')
        userItem.classList = 'list-group-item list-group-item-dark my-2'
        userItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <h3>${user.a_nombre}</h3>
            <div>
                <button class="btn btn-danger btn-sm">delete</button>
                <button class="btn btn-secondary btn-sm">edit</button>
            </div>
        </header>
        <p>${user.a_clave}</p>
        <p>${user.a_descripcion}</p>
        `
        userList.append(userItem)
    })

}