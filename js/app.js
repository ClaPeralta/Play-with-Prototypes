//constructores
function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

//hace la cotizacion con los datos asignados
Seguro.prototype.cotizarSeguro = function () {
  /* Indices de costo de seguro
    1 = Standard    1.15
    2 = Gama Baja   1.05
    3 = Gama Alta   1.35
  */

  let cantidad;
  const base = 2500;
  //console.log(this.marca);

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;
    default:
      break;
  }

  //leer el year
  const diferencia = new Date().getFullYear() - this.year;

  // cada year q la diferencia es mayor, el costo va a reducirse 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*
    Si el seguro es basico multiplica un 30% mas
    Si el seguro es completo multiplica un 50% mas
  */

  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }
  return cantidad;
};

function UI() {
  //llena las opciones de anios
  UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
      min = max - 20;

    const selectYear = document.querySelector("#year");

    for (let i = max; i > min; i--) {
      let option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      selectYear.appendChild(option);
    }
  };
}

//muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = document.createElement("div");
  if (tipo === "error") {
    div.classList.add("error"); //las clases 'error' y 'correcto' estan en el custom.css
  } else {
    div.classList.add("correcto");
  }

  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;

  //inserto en el HTML
  const formulario = document.querySelector("#cotizar-seguro"); //ojo xq esta declaracion de variable es igual q la del eventListener pero estan en otro lado, hay una cuestion de scope, bien podria ponerle otro nombre pero lo mas representativo es el q tiene ahora y que no va a salir del ambito de esta funcion.
  formulario.insertBefore(div, document.querySelector("#resultado"));

  setTimeout(() => {
    div.remove();
  }, 2000);
};

UI.prototype.mostrarResultado = (total, seguro) => {
  const { marca, year, tipo } = seguro;

  let textoMarca;

  switch (marca) {
    case "1":
      textoMarca = "Standard";
      break;

    case "2":
      textoMarca = "Gama Baja";
      break;

    case "3":
      textoMarca = "Gama Alta";
      break;

    default:
      break;
  }

  //creo el resultado
  const div = document.createElement("div");
  div.classList.add("mt-10");

  div.innerHTML = `
  <p class="header">Su Resumen</p>
  <p class="font-bold">Gama:<span class="font-normal"> ${textoMarca} </span></p>
  <p class="font-bold">Año:<span class="font-normal"> ${year} </span></p>
  <p class="font-bold">Tipo:<span class="font-normal"> ${tipo} </span></p>
  <p class="font-bold">Total:<span class="font-normal"> $ ${total} </span></p>
  `;

  const resultadoDiv = document.querySelector("#resultado");

  //mostrar spinner
  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none"; // se borra el spinner e inmediatamente despues se muestra el resultado
    resultadoDiv.appendChild(div);
  }, 2000);
};

//instancio
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones(); //llena el select de los anios
});

eventListeners();
function eventListeners() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

//como es un submit vamos a poner el evento como parametro en la fn cotizarSeguro
function cotizarSeguro(e) {
  e.preventDefault();

  //leer marca
  const marca = document.querySelector("#marca").value;
  //leer year
  const year = document.querySelector("#year").value;
  //leer cobertura
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  //validamos con un if
  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }
  ui.mostrarMensaje("Cotizando...", "exito");

  //ocultar resultados previos
  const resultados = document.querySelector("#resultado div"); //aca selecciono el div q esta dentro de resultado
  if (resultados != null) {
    resultados.remove();
  }

  // instancio el seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();

  //utilizar el prototype q va a cotizar
  ui.mostrarResultado(total, seguro);
}
