let roles = []
sessionStorage.removeItem("update")

window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/roles'); 
    const data = await response.json()
    roles = data
    renderRoles(roles)
});

function renderRoles(roles) {
    const rolTables = document.querySelector('#table')
    rolTables.innerHTML = ''
    var i = 0
    roles.forEach(rol => {
        const rolItem = document.createElement('tr')
        if((i)%2!=0){
            rolItem.classList = 'table-secondary'
        }else{
            rolItem.classList = ''
        }
        rolItem.innerHTML = `
            <th scope="row">${rol.ro_clave}</th>
            <td>${rol.ro_nombre}</td>
            <td>${rol.ro_descripcion}</td>                      
            <td><button class="btn-edit btn btn-secondary btn-sm">edit</button></td> 
            <td><button class="btn-delete btn btn-danger btn-sm">delete</button></td>            
            `        

        const btnDelete = rolItem.querySelector('.btn-delete')
        btnDelete.addEventListener('click', async () => {
            const response = await fetch(`/api/roles/${rol.ro_clave}`,{
                method: 'DELETE'
            })
            const data2 = await response.json()
            
            roles = roles.filter(rol => rol.ro_clave !== data2.ro_clave)
            renderRoles(roles)
        });

        const btnEdit = rolItem.querySelector('.btn-edit')
        btnEdit.addEventListener('click', async (e) => {
            const response = await fetch(`/api/rolesI/${rol.ro_clave}`);
            const data2 = await response.json();
            sessionStorage.setItem("update",JSON.stringify(data2))
            console.log(data2)
            console.log(rol.ro_clave)
            window.location.replace("http://localhost:5000/crearRol"); 
        });

        rolTables.append(rolItem)
        i=i+1
    })

}