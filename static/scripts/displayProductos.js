let users = []
let dataColor = []
let dataSabor = []
let valoresC = []
let valoresS = []
sessionStorage.removeItem("update")

const rubro = { 
    1 : "Chupeta",
    2 : "Caramelo Duro",
    3 : "Chicle",
    4 : "Regaliz",
    5 : "Caramelo Blando"
}

window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/productos'); 
    const data = await response.json()
    users = data

    const responseColor = await fetch(`/api/productoColor`); 
    dataColor = await responseColor.json()

    const responseSabor = await fetch(`/api/productoSabor`); 
    dataSabor = await responseSabor.json()

    renderUser(users)
});

async function renderUser(users ) {
    const userTable = document.querySelector('#table')
    
    userTable.innerHTML = ''
    var i = 0
     users.forEach( user => {
        valoresC = []
        valoresS = []
        var rid
        switch(user.fk_r_id) {
            case 1:
                rid = "Chupeta"
            break;
            case 2:
                rid = "Caramelo Duro"
            break;
            case 3:
                rid = "Chicle"
            break;
            case 4:
                rid = "Regaliz"
            break;
            case 5:
                rid = "Caramelo Blando"
            break;      
        }

        var fid
        switch(user.fk_f_id) {
            case 1:
                fid = "Cuadrada"
            break;
            case 2:
                fid = "Circular"
            break;
            case 3:
                fid = "Triangular"
            break;
            case 4:
                fid = "Ovalada"
            break;
            case 5:
                fid = "Margarita"
            break;
            case 6:
                fid = "Pastilla"
            break;
            case 7:
                fid = "Corazon"
            break;
            case 8:
                fid = "Alargado"
            break;
            case 9:
                fid = "Bola"
            break;       
        }
        var cid
        try {
            var p_colores = dataColor.filter(color=> color.fk_p_id == user.p_id)
            for (let i = 0; i < p_colores.length; i++) {
                switch(p_colores[i].fk_c_id) {
                    case 1:
                        cid = "Blanco "
                    break;
                    case 2:
                        cid = "Negro "
                    break;
                    case 3:
                        cid = "Verde "
                    break; 
                    case 4:
                        cid = "Naranja "
                    break;
                    case 5:
                        cid = "Rojo "
                    break;
                    case 6:
                        cid = "Rosado "
                    break;
                    case 7:
                        cid = "Morado "
                     break;    
                    case 8:
                        cid = "Azul "
                    break;     
                }
                valoresC.push(cid)
            }
        } catch (error) {
            
        }
        var sid
        try {
            console.log(dataSabor)
            var p_sabores = dataSabor.filter(sabor=> sabor.fk_p_id == user.p_id)
            console.log("p_sabores")
            console.log(p_sabores)
            for (let i = 0; i < p_sabores.length; i++) {
                switch(p_sabores[i].fk_s_id) {
                    case 1:
                        sid = "Chocolate "
                    break;
                    case 2:
                        sid = "Menta "
                    break;
                    case 3:
                        sid = "Acido "
                    break;
                    case 4:
                        sid = "Fresa "
                    break;
                    case 5:
                        sid = "Lima "
                    break;
                    case 6:
                        sid = "Naranja "
                    break;
                    case 7:
                        sid = "Cola "
                     break;    
                    case 8:
                        sid = "Melocoton "
                    break;
                    case 9:
                        sid = "Patilla "
                    break;
                    case 10:
                        sid = "Manzana "
                    break;
                    case 11:
                        sid = "Picante "
                    break;
                    case 12:
                        sid = "Eucalipto "
                    break;
                    case 13:
                        sid = "Miel "
                    break;
                    case 14:
                        sid = "Mentol "
                    break;
                    case 15:
                        sid = "Limon "
                     break;    
                    case 16:
                        sid = "Melisa "
                    break;
                    case 17:
                        sid = "Xylitol "
                    break;     
                }
                valoresS.push(sid)
            }
        } catch (error) {
            
        } 


        const userItem = document.createElement('tr')
        if((i)%2!=0){
            userItem.classList = 'table-secondary'
        }else{
            userItem.classList = ''
        }
        userItem.innerHTML = `
            <th scope="row">${user.p_id}</th>
            <td>${user.p_nombre}</td>
            <td>${user.p_precio}</td>
            <td>${user.p_descripcion}</td>
            <td>${user.p_peso}</td>
            <td>${rid}</td>
            <td>${fid}</td>
            <td>${user.fk_t_id}</td> 
            <td>${valoresC}</td>
            <td>${valoresS}</td>   
            <td><button class="btn-descuento btn btn-secondary btn-sm"> Descuento</button></td>                     
            <td><button class="btn-edit btn btn-secondary btn-sm">edit</button></td> 
            <td><button class="btn-delete btn btn-danger btn-sm">delete</button></td>            
            `        
            const btnDesc = userItem.querySelector('.btn-descuento')
            btnDesc.addEventListener('click', async () => {
                const response1 = await fetch(`/api/productos/${user.p_id}`);
                const data3 = await response1.json();
                sessionStorage.setItem("desc",JSON.stringify(data3))
                window.location.replace("http://localhost:5000/static/agregarDescuento.html");
            });

        const btnDelete = userItem.querySelector('.btn-delete')
        btnDelete.addEventListener('click', async () => {
            const response = await fetch(`/api/productos/${user.p_id}`,{
                method: 'DELETE'
            })
            const data2 = await response.json()
            
            users = users.filter(user => user.p_id !== data2.p_id)
            renderUser(users)
        });

        const btnEdit = userItem.querySelector('.btn-edit')
        btnEdit.addEventListener('click', async (e) => {
            const response = await fetch(`/api/productos/${user.p_id}`);
            const data2 = await response.json();
            sessionStorage.setItem("update",JSON.stringify(data2))
            window.location.replace("http://localhost:5000/crearProducto"); 
        });

        userTable.append(userItem)
    })

}