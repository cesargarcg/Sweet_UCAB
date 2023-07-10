let ventas = []
var trim1 = 0; var trim2 = 0; var trim3 = 0; var trim4 = 0
var Paypal = 0; var PagoMv = 0; var Tarjeta = 0; var Zelle = 0; var puntos = 0; var efectivo = 0; var total = 0;
let tiendas = []
let tiendasNombres = []
let tiendasCantidad = []

window.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/ventasPorMes');
  const ventas = await response.json()
  console.log(ventas)

  const response2 = await fetch('/api/topProducto');
  const topProducto = await response2.json()

  const response3 = await fetch('/api/worseProducto');
  const worseProducto = await response3.json()

  const responsemtd = await fetch('/api/topMetodoPago');
  const mtdPago = await responsemtd.json()

  const responseEnL = await fetch('/api/ventasEnLinea');
  const ventasEnL = await responseEnL.json()

  const responseF = await fetch('/api/ventasFisico');
  const ventasF = await responseF.json()

  const responseP = await fetch('/api/statsPuntos');
  const statsPuntos = await responseP.json()




  mtdPago.forEach(metodo => {
    total = total + parseInt(metodo.sum)
    switch (metodo.mp_tipo) {
      case 'Paypal':
        Paypal = Paypal + parseInt(metodo.sum)
        break;
      case 'Tarjeta':
        Tarjeta = Tarjeta + parseInt(metodo.sum)
        break;
      case 'Zelle':
        Zelle = Zelle + parseInt(metodo.sum)
        break;
      case 'PagoMovil':
        PagoMv = PagoMv + parseInt(metodo.sum)
        break;
      case 'Puntos':
        puntos = puntos + parseInt(metodo.sum)
        break;
      case 'Efectivo':
        efectivo = efectivo + parseInt(metodo.sum)
        break;
      default:
        break;
    }
  })


  ventasF.forEach(venta => {
    tiendasNombres.push(venta.ti_nombre)
    tiendasCantidad.push(venta.count)
  })

  ventas.forEach(venta => {
    console.log(venta.date_part)
    if (venta.date_part == 1 || venta.date_part == 2 || venta.date_part == 3) {
      trim1=trim1 +parseInt(venta.sum)
    } else {
      if (venta.date_part == 4 || venta.date_part == 5 || venta.date_part == 6) {
        trim2=trim2 +parseInt(venta.sum)
      } else {
        if (venta.date_part == 7 || venta.date_part == 8 || venta.date_part == 9) {
          trim3=trim3 +parseInt(venta.sum)
        } else {
          if (venta.date_part == 10 || venta.date_part == 11 || venta.date_part == 12) {
            trim4=trim4 +parseInt(venta.sum)
        }
      }
    }
  }
  });


  var ctxP = document.getElementById("myChart1").getContext('2d');
  var myPieChart = new Chart(ctxP, {
    type: 'pie',
    data: {
      labels: ["1er trim", "2do trim", "3er trim", "4to trim"],
      datasets: [{
        data: [trim1, trim2, trim3, trim4],
        backgroundColor: ["#38D7E7", "#f7ac4a", "#EE316B", "#5ae8d0"],
        hoverBackgroundColor: ["#227d87", "#b57e36", "#801737", "#49baa7"]
      }]
    },
    options: {
      responsive: true,
    }
  });

  var h3TopProducto = document.getElementById("topProducto")
  h3TopProducto.textContent = topProducto.p_nombre
  var h3TopProductoCant = document.getElementById("topProductoCant")
  h3TopProductoCant.textContent = "Cantidad vendidas: " + topProducto.sum

  var h3WorseProducto = document.getElementById("worseProducto")
  h3WorseProducto.textContent = worseProducto.p_nombre
  var h3WorseProductoCant = document.getElementById("worseProductoCant")
  h3WorseProductoCant.textContent = "Cantidad vendidas: " + worseProducto.sum

  var ctx4 = document.getElementById("myChart4").getContext('2d');
  var myChart = new Chart(ctx4, {
    type: 'bar',
    data: {
      labels: ["Paypal", "Tarjeta", "Zelle", "Pago Movil", "Puntos", "Efectivo"],
      datasets: [{
        label: 'Porcentaje de usos',
        data: [Math.trunc(Paypal * 100 / total), Math.trunc(Tarjeta * 100 / total), Math.trunc(Zelle * 100 / total), Math.trunc(PagoMv * 100 / total), Math.trunc(puntos * 100 / total), Math.trunc(efectivo * 100 / total)],
        backgroundColor: ["#38D7E7", "#f7ac4a", "#EE316B", "#5ae8d0", "#842D72", "#65ebb3"],
        hoverBackgroundColor: ["#227d87", "#b57e36", "#801737", "#49baa7", "#5e2152", "#3c8c6b"],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  //doughnut
  var ventasOn = document.getElementById("ventasEnlinea")
  ventasOn.textContent = "Ventas en Línea"
  var ventasOnCant = document.getElementById("ventasEnlineaCant")
  ventasOnCant.textContent = "Cantidad de ventas: " + ventasEnL.count

  var ctxD = document.getElementById("myChart5").getContext('2d');
  var myLineChart = new Chart(ctxD, {
    type: 'doughnut',
    data: {
      labels: ["Gastados", "Otorgados"],
      datasets: [{
        data: [statsPuntos.gastados, statsPuntos.otorgados.toString()],
        backgroundColor: ["#38D7E7", "#f7ac4a"],
        hoverBackgroundColor: ["#227d87", "#b57e36"]
      }]
    },
    options: {
      responsive: true
    }
  });


  var ctx7 = document.getElementById("myChart7").getContext('2d');
  var myChart = new Chart(ctx7, {
    type: 'bar',
    data: {
      labels: tiendasNombres,
      datasets: [{
        label: '# of Votes',
        data: tiendasCantidad,
        backgroundColor: ["#38D7E7", "#f7ac4a", "#EE316B", "#5ae8d0", "#842D72", "#65ebb3", "#d06bff", "#38D7E7", "#f7ac4a", "#EE316B", "#5ae8d0", "#842D72", "#65ebb3", "#d06bff"],
        hoverBackgroundColor: ["#227d87", "#b57e36", "#801737", "#49baa7", "#5e2152", "#3c8c6b", "#974cba", "#227d87", "#b57e36", "#801737", "#49baa7", "#5e2152", "#3c8c6b", "#974cba"],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

});



