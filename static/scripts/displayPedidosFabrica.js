let users = []
let dataEstatus = []
let valoresE = []
sessionStorage.removeItem("update")


async function getTienda(t) {
    try {
        const response = await fetch(`/api/tiendas/${t}`);
        const data = await response.json();
        return data.ti_nombre;
    } catch (error) {
        console.log(error);
    }
}

async function getDetallePedido(pf){
    try {
        const response = await fetch(`/api/detallesPedidosFabrica/${pf}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function getProducto(p) {
    try {
        const response = await fetch(`/api/productos/${p}`);
        const data = await response.json();
        return data.p_nombre;
    } catch (error) {
        console.log(error);
    }
}


window.addEventListener('DOMContentLoaded', async () => {

    const responsePedidos = await fetch('/api/pedidosFabrica');
    const data1 = await responsePedidos.json()
    users = data1

    
    const responseEstatus = await fetch(`/api/estatusPedidosFabrica`);
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
        var tienda = await getTienda(user.fk_ti_id)
        var detalle = await getDetallePedido(user.pf_id)
        console.log(detalle)
        var producto = await getProducto(detalle.fk_p_id)
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
            <th scope="row">${user.pf_numero_orden}</th>
            <td>${tienda}</td>
            <td>${user.pf_cantidad}</td>
            <td>${user.pf_fecha}</td>
            <td>${producto}</td>
            <td><button class="btn-aceptar btn btn-secondary btn-sm">Aceptar</button></td> 
            <td>${eid}</td>                        
            <td><button class="btn-edit btn btn-secondary btn-sm">Cambiar estatus</button></td>            
            `        

        const btnEdit = userItem.querySelector('.btn-edit')
        btnEdit.addEventListener('click', async (e) => {
            const response = await fetch(`/api/pedidosFabrica/${user.pf_id}`);
            const data2 = await response.json();
            sessionStorage.setItem("update",JSON.stringify(data2))
            window.location.replace("http://localhost:5000/cambiarEstatusFabrica"); 
        });

        const btnAceptar = userItem.querySelector('.btn-aceptar')
        btnAceptar.addEventListener('click', async (e) => {

            if(eid != "Entregado"){

                p = await getDetallePedido(user.pf_id)
                console.log(p)

                console.log(p.fk_p_id)

                
                const sumarAlmacen = await fetch(`/api/sumarAlmacen/${p.fk_p_id}/${user.fk_ti_id}/${user.pf_cantidad}`, {
                    method: "PUT",
                });

                const sumarInventario = await fetch(`/api/sumarInventario/${p.fk_p_id}/${user.fk_ti_id}/${user.pf_cantidad}`, {
                    method: "PUT",
                });

                t = await getTienda(user.fk_ti_id)
                console.log(t)

                pr = await getProducto(p.fk_p_id)
                console.log(pr)

                sessionStorage.setItem("tienda",t)
                sessionStorage.setItem("producto",pr)

                alert("Pedido aceptado, por favor cambie el estatus a ENTREGADO")
                window.location.replace("http://localhost:5000/pdfFabrica");
            }
        });

        userTable.append(userItem)
    }

}


