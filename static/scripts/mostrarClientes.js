sessionStorage.removeItem("update")
let users = []
sessionStorage.removeItem("update")

window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/clientesNaturales'); 
    const data = await response.json()

    const response2 = await fetch('/api/clientesJuridicos'); 
    const data2 = await response2.json()
    
    clientesN = data
    clientesJ = data2

    renderUser(clientesN,clientesJ)


});

function renderUser(clientesN,clientesJ) {
    const userTable = document.querySelector('#table')
    userTable.innerHTML = ''

if(clientesN !=null){
    clientesN.forEach(cliente => {
        const userItem = document.createElement('tr')
        if((cliente.cn_id)%2!=0){
            userItem.classList = '"table table-primary"'
        }else{
            userItem.classList = '"table table-Secondary"'
        }
        userItem.innerHTML = `
            <td>${cliente.cn_id}</td>
            <td>${cliente.cn_prim_nom}</td>
            <td>Cliente Natural</td>
            <td>${cliente.cn_rif}</td>            
            <td><button class="btn-edit btn btn-secondary btn-sm">edit</button></td> 
            <td><button class="btn-delete btn btn-danger btn-sm">delete</button></td>            
            `        

        const btnDelete = userItem.querySelector('.btn-delete')
        btnDelete.addEventListener('click', async () => {
            const response = await fetch(`/api/clienteN/${cliente.cn_id}`,{
                method: 'DELETE'
            })
            const data3 = await response.json()
            
            clientesN = clientesN.filter(cliente => cliente.cn_id !== data3.cn_id)
            renderUser(clientesN,clientesJ)
        });

        const btnEdit = userItem.querySelector('.btn-edit')
        btnEdit.addEventListener('click', async (e) => {
            const response = await fetch(`/api/clienteNatural/${cliente.cn_id}`);
            const data5 = await response.json();
            sessionStorage.setItem("update",JSON.stringify(data5))
            console.log(data5)
            console.log(data5.cn_id)
            window.location.replace("http://localhost:5000/registroClnN"); 
        });

        userTable.append(userItem)
    })
}
if(clientesJ!=null){

        clientesJ.forEach(cliente => {
            const userItem2 = document.createElement('tr')
        if((cliente.cj_id)%2!=0){
            userItem2.classList = '"table table-primary"'
            }else{
                userItem2.classList = '"table table-Secondary"'
            }
        userItem2.innerHTML = `
            <td>${cliente.cj_id}</td>
            <td>${cliente.cj_den_com}</td>
            <td>Cliente Juridico</td>
            <td>${cliente.cj_rif}</td>            
            <td><button class="btn-edit btn btn-secondary btn-sm">edit</button></td> 
            <td><button class="btn-delete btn btn-danger btn-sm">delete</button></td>            
            `        

        const btnDelete = userItem2.querySelector('.btn-delete')
        btnDelete.addEventListener('click', async () => {
            const response = await fetch(`/api/clienteJ/${cliente.cj_id}`,{
                method: 'DELETE'
            })
            const data4 = await response.json()
            
            clientesJ = clientesJ.filter(cliente => cliente.cj_id !== data4.cj_id)
            renderUser(clientesN,clientesJ)
        });

        const btnEdit = userItem2.querySelector('.btn-edit')
        btnEdit.addEventListener('click', async (e) => {
            const response = await fetch(`/api/clienteJuridico/${cliente.cj_id}`);
            const data2 = await response.json();
            sessionStorage.setItem("update",JSON.stringify(data2))
            window.location.replace("http://localhost:5000/registroClnJ"); 
        });


        userTable.append(userItem2)
    })
}
}