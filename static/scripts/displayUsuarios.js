let users = []
sessionStorage.removeItem("update")
const user = JSON.parse(sessionStorage.getItem("userData"));
console.log(user)


window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/users'); 
    const data = await response.json()
    users = data
    renderUser(users)
});

function renderUser(users) {
    const userTable = document.querySelector('#table')
    userTable.innerHTML = ''
    var i = 0
    users.forEach(user => {
        const userItem = document.createElement('tr')
        if((i)%2!=0){
            userItem.classList = 'table-secondary'
        }else{
            userItem.classList = ''
        }
        userItem.innerHTML = `
            <th scope="row">${user.u_clave}</th>
            <td>${user.u_nombre}</td>
            <td>${user.fk_ro_clave}</td>
            <td><button class="btn-rol btn btn-primary btn-sm">rol</button></td>                        
            <td><button class="btn-edit btn btn-secondary btn-sm">edit</button></td> 
            <td><button class="btn-delete btn btn-danger btn-sm">delete</button></td>            
            `        
        const btnRol = userItem.querySelector('.btn-rol')
        btnRol.addEventListener('click', async (e) => {
            const response = await fetch(`/api/users/${user.u_clave}`);
            const data2 = await response.json();
            sessionStorage.setItem("update",JSON.stringify(data2))
            window.location.replace("http://localhost:5000/asignRol"); 
        });

        const btnDelete = userItem.querySelector('.btn-delete')
        btnDelete.addEventListener('click', async () => {
            const response = await fetch(`/api/users/${user.u_clave}`,{
                method: 'DELETE'
            })
            const data2 = await response.json()
            
            users = users.filter(user => user.u_clave !== data2.u_clave)
            renderUser(users)
        });

        const btnEdit = userItem.querySelector('.btn-edit')
        btnEdit.addEventListener('click', async (e) => {
            const response = await fetch(`/api/users/${user.u_clave}`);
            const data2 = await response.json();
            sessionStorage.setItem("update",JSON.stringify(data2))
            window.location.replace("http://localhost:5000/crearUsuarios"); 
        });

        userTable.append(userItem)
        i= i +1
    })

}