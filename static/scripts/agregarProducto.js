const dulceForm = document.querySelector("#dulceForm");
const updata = JSON.parse(sessionStorage.getItem("update"));
console.log(updata)

let dulces = []; //array to store user data
let editing = false; //variable para saber si estamos editando o no
let dulceId = null;

let Rubros = []; 
let Formas = [];
let Tamanos = [];
let Colores = [];
let Sabores = [];

function ObtenerCheckboxes(nombrecheck) {
  let array = [];
  var checkboxes = document.querySelectorAll("input[name=" + nombrecheck + "]:checked");
  for (var i = 0; i < checkboxes.length; i++) {
    array.push(checkboxes[i].value);
  }
  console.log(array);
  return array;
}

window.addEventListener("DOMContentLoaded", async () => {
  //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading

  if (updata!=null) {
    dulceForm["nombre"].value =updata.p_nombre
    dulceForm["precio"].value = updata.p_precio
    dulceForm["descripcion"].value = updata.p_descripcion
    dulceForm["peso"].value = updata.p_peso
    document.getElementById("tamano").value = updata.fk_t_id
    document.getElementById("rubro").value = updata.fk_r_id
    document.getElementById("forma").value = updata.fk_f_id
  }
  
  
  const responseTipos = await fetch("/api/rubros", {
    method: "GET",
  });
  const dataRubros = await responseTipos.json();
  Rubros = dataRubros;

  Rubros.forEach((rubro) => {
    //llenamos el select de tipo de dulce
    const select = document.querySelector("#rubro");
    //opciones para el formulario tipo
    select.options.add(new Option(rubro.r_nombre, rubro.r_id, rubro.r_descripcion));
  });


  //Formas
  const responseFormas = await fetch("/api/formas", {
    method: "GET",
  });
  const dataFormas = await responseFormas.json();
  Formas = dataFormas;

  Formas.forEach((forma) => {
    const select = document.querySelector("#forma");
    //opciones para el formulario tipo
    select.options.add(new Option(forma.f_nombre, forma.f_id));
  });

  //Catalogo de tamanos
  const responseTamanos = await fetch("/api/tamanos", {
    method: "GET",
  });
  const dataTamanos = await responseTamanos.json();
  Tamanos = dataTamanos;

  Tamanos.forEach((tamano) => {

    const select = document.querySelector("#tamano");
    //opciones para el formulario tipo
    select.options.add(new Option(tamano.t_valor, tamano.t_id));
  });

  //Catalogo de colores
  const responseColores = await fetch("/api/colores", {
    method: "GET",
  });
  const dataColores = await responseColores.json();
  Colores = dataColores;

  Colores.forEach((color) => { //chebox dinamico para los colores
    // create the necessary elements
    var label = document.createElement("label");
    var description = document.createTextNode(color.c_nombre);
    var checkbox = document.createElement("input");

    checkbox.type = "checkbox"; // make the element a checkbox
    checkbox.name = "checkcolor"; // give it a name we can check on the server side
    checkbox.value = color.c_id; // make its value "pair"

    label.appendChild(checkbox); // add the box to the element
    label.appendChild(description); // add the description to the element

    // add the label element to your div
    document.getElementById("colordiv").appendChild(label);
  });

  //Catalogo de sabores
  const responseSabores = await fetch("/api/sabores", {
    method: "GET",
  });
  const dataSabores = await responseSabores.json();
  Sabores = dataSabores;

  Sabores.forEach((sabor) => { //chebox dinamico para los sabores
    // create the necessary elements
    var label = document.createElement("label");
    var description = document.createTextNode(sabor.s_nombre);
    var checkbox = document.createElement("input");

    checkbox.type = "checkbox"; // make the element a checkbox
    checkbox.name = "checksabor"; // give it a name we can check on the server side
    checkbox.value = sabor.s_id; // make its value "pair"

    label.appendChild(checkbox); // add the box to the element
    label.appendChild(description); // add the description to the element

    // add the label element to your div
    document.getElementById("sabordiv").appendChild(label);
  });
});

if (updata == null) {
  sessionStorage.removeItem("update");
  dulceForm.addEventListener("submit", async (e) => { //cuando tocamos el boton submit

    e.preventDefault(); //cancela el comportamiento por defecto del formulario
  
    const nombre = dulceForm["nombre"].value; //obtiene el valor del campo username
    const precio = dulceForm["precio"].value;
    const descripcion = dulceForm["descripcion"].value;
    const peso = dulceForm["peso"].value;
    const imagen = dulceForm["imagen"].value;
    const TaClave = document.getElementById("tamano").value;
    const FoClave = document.getElementById("forma").value;
    const CDClave = document.getElementById("rubro").value;
  
    var ColoresSeleccionados = []; //obtenemos los colores seleccionados
    ColoresSeleccionados = ObtenerCheckboxes("checkcolor")
  
    var SaboresSeleccionados = []; //obtenemos los sabores seleccionados
    SaboresSeleccionados = ObtenerCheckboxes("checksabor");
  
    if (!editing) {
      //si no estamos editando
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //asi indicamos que el contenido es json
        },
        body: JSON.stringify({
          //debemos enviarlo como json
          nombre,
          precio,
          descripcion,
          peso,
          imagen,
          TaClave,
          FoClave,
          CDClave,
          ColoresSeleccionados,
          SaboresSeleccionados
        }), //enviamos la informacion al servidor
      });
  
      const data = await response.json(); //obtenemos la respuesta del servidor
      dulces.unshift(data); //agregamos el usuario al array
      console.log(data);
  
    } else {
  
      //si estamos editando
      const response = await fetch(`/api/dulce/${dulceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", //asi indicamos que el contenido es json
        },
        body: JSON.stringify({
          //debemos enviarlo como json
          nombre,
          precio,
          descripcion,
          peso,
          imagen,
        }), //enviamos la informacion al servidor
      });
  
      editing = false;
      dulceId = null;
    }
  
    dulceForm.reset(); //limpia el formulario
  });
}else{
  editing = true;
  dulceForm.addEventListener("submit", async (e) => { //cuando tocamos el boton submit
    e.preventDefault(); //cancela el comportamiento por defecto del formulario
    

    const idP = updata.p_id
    const nombre = dulceForm["nombre"].value; //obtiene el valor del campo username
    const precio = dulceForm["precio"].value;
    const descripcion = dulceForm["descripcion"].value;
    const peso = dulceForm["peso"].value;
    const imagen = dulceForm["imagen"].value;
    const TaClave = document.getElementById("tamano").value;
    const FoClave = document.getElementById("forma").value;
    const CDClave = document.getElementById("rubro").value;
  
    var ColoresSeleccionados = []; //obtenemos los colores seleccionados
    ColoresSeleccionados = ObtenerCheckboxes("checkcolor")
  
    var SaboresSeleccionados = []; //obtenemos los sabores seleccionados
    SaboresSeleccionados = ObtenerCheckboxes("checksabor");
  
    if (!editing) {
      //si no estamos editando
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //asi indicamos que el contenido es json
        },
        body: JSON.stringify({
          //debemos enviarlo como json
          nombre,
          precio,
          descripcion,
          peso,
          imagen,
          TaClave,
          FoClave,
          CDClave,
          ColoresSeleccionados,
          SaboresSeleccionados
        }), //enviamos la informacion al servidor
      });
  
      const data = await response.json(); //obtenemos la respuesta del servidor
      dulces.unshift(data); //agregamos el usuario al array
      console.log(data);
  
    } else {
  
      //si estamos editando
      const response = await fetch(`/api/productos/${idP}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", //asi indicamos que el contenido es json
        },
        body: JSON.stringify({
          //debemos enviarlo como json
          idP,
          nombre,
          precio,
          descripcion,
          peso,
          imagen,
          TaClave,
          FoClave,
          CDClave,
          ColoresSeleccionados,
          SaboresSeleccionados
        }), //enviamos la informacion al servidor
      });
  
      editing = false;
      dulceId = null;
    }
    
    sessionStorage.removeItem("update");
    dulceForm.reset(); //limpia el formulario
  });
}
