const userForm = document.querySelector('#userForm')
const updata = JSON.parse(sessionStorage.getItem("update"));
console.log(updata)

let users = []

if (updata==null){
    document.getElementById("PagTxt").textContent="Creando usuario"
    userForm.addEventListener('submit', async e => {
        e.preventDefault()
        
        const username= userForm['username'].value
        const password= userForm['password'].value
        const fk_cn_id = null
        const fk_cj_id = null
        const fk_ro_id = null
        const fk_e_id = null
        const fk_ti_id = null
    
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },       
            body: JSON.stringify({
                username,
                password,
                fk_cn_id,
                fk_cj_id,
                fk_ro_id,
                fk_e_id,
                fk_ti_id
            })
        })
    
        const data = await response.json()
        console.log(data)

        sessionStorage.removeItem("update")
    
        userForm.reset();
    
    });
}else{
    document.getElementById("PagTxt").textContent="Actualizando usuario"
    userForm['username'].value = updata.u_nombre
    userForm.addEventListener('submit', async e => {
        e.preventDefault()
        
        const username= userForm['username'].value
        const password= userForm['password'].value
        const rol= null
        const empl= null
        const clnN= null
        const clnJ= null
        const tind= null
    
    
        const response = await fetch(`/api/users/${updata.u_clave}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },       
            body: JSON.stringify({
                username,
                password,
                rol,
                empl,
                clnN,
                clnJ,
                tind
            })
        })
    
        const data = await response.json()
        console.log(data)
        
        sessionStorage.removeItem("update");
        userForm.reset();
    
    });
}


