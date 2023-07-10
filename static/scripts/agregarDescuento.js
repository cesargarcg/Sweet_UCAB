const dulceForm = document.querySelector("#dulceForm");
const updata = JSON.parse(sessionStorage.getItem("desc"));

window.addEventListener("DOMContentLoaded", async () => {
  //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading

  const response = await fetch(`/api/descuento/${updata.p_id}`);
  const data2 = await response.json();
  let existe = false;
  data  = data2;

  if(data2.message != "Descuento not found"){
    existe = true;
  }

  descuentos(existe);
  


async function descuentos(existe){
  dulceForm["nombre"].value = updata.p_nombre
  dulceForm["precio"].value = updata.p_precio
  fk_p_id = updata.p_id
  fk_sf_id = 1

  if(existe == true){

    dulceForm["precioF"].value = data2.p_r_precio_oferta
    dulceForm.addEventListener("submit", async () => { //cuando tocamos el boton submit
        const p_r_precio_oferta = dulceForm["precioF"].value

        if ((p_r_precio_oferta < updata.p_precio)){
            if (p_r_precio_oferta == 0){ // aqui hacemos el delete de descuento
                const respuesta = await fetch(`/api/descuentoD/${updata.p_id}`,{
                    method: 'DELETE'
                })
                const eliminados = await respuesta.json();
                alert("Descuento eliminado")
                sessionStorage.removeItem("desc");
                window.location.replace("http://localhost:5000/productosCreados");
         }
            else{
                const resp = await fetch(`/api/descuentoP/${updata.p_id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json", //asi indicamos que el contenido es json
                    },
                    body: JSON.stringify({
                      p_r_precio_oferta
                    }), //enviamos la informacion al servidor
                  });
                  sessionStorage.removeItem("desc");
                  window.location.replace("http://localhost:5000/productosCreados");
                  dulceForm.clear();
            }
        }
    });
  }

  else{
    dulceForm.addEventListener("submit", async () => { //cuando tocamos el boton submit
        const p_r_precio_oferta = dulceForm["precioF"].value
        const resp1 = await fetch("/api/descuento", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", //asi indicamos que el contenido es json
            },
            body: JSON.stringify({
              //debemos enviarlo como json
               fk_p_id,
               fk_sf_id,
              p_r_precio_oferta,
            }), //enviamos la informacion al servidor
          });
          dulceForm.clear();
          sessionStorage.removeItem("desc");
          window.location.replace("http://localhost:5000/productosCreados");
    });
  }

}
  
});