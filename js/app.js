const criptomonedasSelect = document.getElementById('criptomonedas')
const monedaSelect = document.getElementById('moneda')
const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')

const objBusqueda = {
  moneda: '',
  criptomoneda: '',
}

// crear un Promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas)
  })

document.addEventListener('DOMContentLoaded', () => {
  consultarCriptomonedas()
  formulario.addEventListener('submit', submitFomulario)
  criptomonedasSelect.addEventListener('change', leerValor)
  monedaSelect.addEventListener('change', leerValor)
})

function consultarCriptomonedas() {
  const urlApi = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`


  fetch(urlApi)
    .then((resp) => resp.json())
    .then((json) => obtenerCriptomonedas(json.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo
    const option = document.createElement('option')
    option.value = Name
    option.textContent = FullName
    criptomonedasSelect.appendChild(option)
  })
}
function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value
  console.log(objBusqueda)
}

function submitFomulario(e) {
  e.preventDefault()

  // validar
  const { moneda, criptomoneda } = objBusqueda
  if (moneda === '' || criptomoneda === '') {
    mostrarAlerta('Ambos campos son obligatorios')
    return
  }
  consultarAPI()
}

function mostrarAlerta(mensaje) {
  if (!document.querySelector('.error')) {
    const divMensaje = document.createElement('div')
    divMensaje.className = 'error'
    divMensaje.innerHTML = mensaje

    formulario.appendChild(divMensaje)
    setTimeout(() => {
      divMensaje.remove()
    }, 3000)
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
 
  mostrarSpinner()
  fetch(url)
    .then((resp) => resp.json())
    .then((json) => mostrarCotizacionHTML(json.DISPLAY[criptomoneda][moneda]))
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML(resultado)
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion
  resultado.innerHTML = `
  <p> El precio es: <span>${PRICE}</span></p>
  <p> Precio más alto del día: <span>${HIGHDAY}</span></p>
  <p> Precio más bajo del día: <span>${LOWDAY}</span></p>
  <p> Variación en las últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>
  <p> Última actualización: <span>${LASTUPDATE}</span></p>
  
  `
  
}

function limpiarHTML(div){
  while(div.firstChild){
    div.removeChild(div.firstChild)
  }
}

function mostrarSpinner(){
  limpiarHTML(resultado)
  const divSpinner = document.createElement('div')

  divSpinner.className = "spinner"
  resultado.appendChild(divSpinner)

}