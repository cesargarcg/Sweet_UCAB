const metodoPago = document.querySelector('#pagoForm');

function Redireccion(){
    metodoPago.addEventListener('submit', async e=>{
        e.preventDefault()
        console.log(document.querySelector('input[name="metodo"]:checked').id)

        if(document.querySelector('input[name="metodo"]:checked').id === "TC"){
            location.href = "/static/agregarCredito.html";
        }
        else 
            if(document.querySelector('input[name="metodo"]:checked').id === "TD"){
                location.href = "/static/agregarDebito.html";
            }
            else 
                if(document.querySelector('input[name="metodo"]:checked').id === "Zelle"){
                    location.href = "/static/agregarZelle.html";
                }
                else 
                    if(document.querySelector('input[name="metodo"]:checked').id === "PayPal"){
                        location.href = "/static/agregarPaypal.html";
                    }
                    else
                        if(document.querySelector('input[name="metodo"]:checked').id === "PagoMovil"){
                            location.href = "/static/agregarPagomovil.html";
                        }
    });
}

function Redireccion2(){
    metodoPago.addEventListener('submit', async e=>{
        e.preventDefault()
        location.href = "/pagarFisico"
    });
}