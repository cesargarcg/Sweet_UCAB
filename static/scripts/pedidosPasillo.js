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

    const responsePedidos = await fetch('/api/pedidosPasillo');
    const data1 = await responsePedidos.json()
    users = data1

    renderUser(users)
});

async function renderUser(users ) {
    const userTable = document.querySelector('#table')
    
    userTable.innerHTML = ''
    var i = 0
    
    for (let i = 0; i < users.length; i++){
        const user = users[i]
        var tienda = await getTienda(user.fk_ti_id)
        var producto = await getProducto(user.fk_p_id)
        valoresE = []
        

        const userItem = document.createElement('tr')
        if((i)%2!=0){
            userItem.classList = 'table-secondary'
        }else{
            userItem.classList = ''
        }



        userItem.innerHTML = `
            <th scope="row">${user.pp_id}</th>
            <td>${tienda}</td>
            <td>${user.fk_ti_id}</td>
            <td>${user.fk_p_id}</td>
            <td>${producto}</td>
            <td><button class="btn-aceptar btn btn-secondary btn-sm">Reponer</button></td>             
            `        

        const btnAceptar = userItem.querySelector('.btn-aceptar')
        btnAceptar.addEventListener('click', async (e) => {

            var movimiento = 100

            var cantidadAlmacen = await fetch(`/api/productoAlmacen/${user.fk_p_id}/${user.fk_ti_id}`)
            var dataCantidadAlmacen = await cantidadAlmacen.json();
            console.log(dataCantidadAlmacen)

            if(dataCantidadAlmacen.zal_cantidad_disp > 100){
                const sacarAlmacen = await fetch(`/api/restarAlmacen/${user.fk_p_id}/${user.fk_ti_id}/${movimiento}`,{
                    method: 'PUT',
                })

                const sumarPasillo = await fetch(`/api/sumarPasillo/${user.fk_p_id}/${user.fk_ti_id}/${movimiento}`, {
                    method: "PUT",
                });

                cantidadAlmacen = await fetch(`/api/productoAlmacen/${user.fk_p_id}/${user.fk_ti_id}`)
                dataCantidadAlmacen = await cantidadAlmacen.json();

                if(dataCantidadAlmacen.zal_cantidad_disp <= 100){
                    //REALIZO UN PEDIDO A LA FABRICA POR 10MIL UNIDADES DEL PRODUCTO
                    const pe_cantidad = 10000
                    const fk_ti_id = user.fk_ti_id

                    const responsePFAB = await fetch('/api/pedidoFabrica', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pe_cantidad,
                            fk_ti_id
                        }),
                    });

                    const dataPFAB = await responsePFAB.json();
                    console.log(dataPFAB)

                    var dataUlDP
                    const responseUlDP = await fetch ('/api/ultimoDetallePedido/')
                    dataUlDP = await responseUlDP.json()
                    if (dataUlDP.length < 1) {
                    dataUlDP = 1
                    }else{
                    try{
                    dataUlDP = Number(dataUlDP[0].dp_id) +1
                    }catch(error){}
                    }

                    const dp_id = dataUlDP
                    const fk_pf_id = dataPFAB[0]
                    console.log(fk_pf_id)

                    var fk_p_id = user.fk_p_id
                    
                    const responseDPFAB = await fetch('/api/detallePedidoFabrica', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            dp_id,
                            fk_p_id,
                            pe_cantidad,
                            fk_pf_id,
                            fk_ti_id
                        }),
                    });

                    const es_pe_fecha = null

                    const responseEPFAB = await fetch('/api/estatusPedidoFabrica', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                fk_pf_id,
                                es_pe_fecha,
                                fk_ti_id
                                }),
                    });

                    alert("Se ha realizado un pedido a la fabrica, notifique al responsable de area de compras")
                }

                alert("Se ha repuesto el producto en el pasillo por 100 unidades!")
                const eliminarAlerta = await fetch (`/api/pedidosPasillo/${user.pp_id}`, {
                    method: "DELETE",
                });

                window.location.replace("http://localhost:5000/hub");
            }else{
                alert("No hay suficiente producto en almacen para reponer, avise al responsable de area de compras que debe aceptar el pedido a la fabrica")
            }
            
        });

        userTable.append(userItem)
    }

}


