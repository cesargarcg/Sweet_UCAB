let users = []
let dataEstatus = []
let valoresE = []
sessionStorage.removeItem("update")

async function getNombre(user){
    if(user.fk_cn_id != null){
        const responseNaturales = await fetch(`/api/clienteNatural/${user.fk_cn_id}`);
        const dat = await responseNaturales.json()
        return(dat.cn_prim_nom)
    }
    else{
        const responseJuridicos = await fetch(`/api/clienteJuridico/${user.fk_cj_id}`);
        const dat = await responseJuridicos.json()
        return(dat.cj_den_com)
    }
}


window.addEventListener('DOMContentLoaded', async () => {

    const responsePedidos = await fetch('/api/pedidos');
    const data1 = await responsePedidos.json()
    users = data1

    


    const responseEstatus = await fetch(`/api/estatusPedidos`);
    dataEstatus = await responseEstatus.json()
    console.log(dataEstatus)
    renderUser(users)
});

async function renderUser(users ) {
    const userTable = document.querySelector('#table')
    
    userTable.innerHTML = ''
    var i = 0
    
    for (let i = 0; i < users.length; i++){
        const user = users[i]
        var nombre = await getNombre(user)
        var eid
        valoresE = []

        switch (dataEstatus[i].fk_es_clave){
            case 1:
                eid = "Pagado"
            break;
            case 2:
                eid = "Procesado"
            break;
            case 3:
                eid = "Listo para entrega"
            break;
            case 4:
                eid = "Entregado"
            break;
            case 5:
                eid = "Presupuesto"
            break;
        }
           
        console.log(eid)
        

        const userItem = document.createElement('tr')
        if((i)%2!=0){
            userItem.classList = 'table-secondary'
        }else{
            userItem.classList = ''
        }



        userItem.innerHTML = `
            <th scope="row">${dataEstatus[i].fk_pe_id}</th>
            <td>${user.pe_numero_orden}</td>
            <td>${nombre}</td>
            <td>${user.pe_fecha}</td>
            <td>${user.pe_monto_total}</td>
            <td>${eid}</td>                        
            <td><button class="btn-edit btn btn-secondary btn-sm">Cambiar estatus</button></td>            
            `        

        const btnEdit = userItem.querySelector('.btn-edit')
        btnEdit.addEventListener('click', async (e) => {
            const response = await fetch(`/api/pedidos/${user.pe_id}`);
            const data2 = await response.json();
            sessionStorage.setItem("update",JSON.stringify(data2))
            window.location.replace("http://localhost:5000/cambiarEstatus"); 
        });

        userTable.append(userItem)
    }

}