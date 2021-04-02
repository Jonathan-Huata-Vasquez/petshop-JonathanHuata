
class ItemCarrito {
    constructor(id, titulo, cantidad, precio, imagen, stock) {
        this.id = id;
        this.titulo = titulo;
        this.cantidad = cantidad;
        this.precio = precio;
        this.imagen = imagen;
        this.stock = stock;
    }
}


var carrito = [];
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    programaCarrito();
}
actualizarNotificacionCantidadArticulosCarrito();

if (document.getElementById("farmacia.html") || document.getElementById("juguetes.html")) {
    fetch("https://apipetshop.herokuapp.com/api/articulos")
        .then(unaRespuesta => {
            unaRespuesta.json()
                .then((data) => {
                    programaFarmaciaJuguete(data.response);
                })
                .catch(error => console.log(error + "aqui dice error"))
        })
} else if (document.getElementById("contactenos.html")) {
    const botonEnviar = document.getElementById("btnEnviar")
    botonEnviar.addEventListener("click", (e) => {
        e.preventDefault();
        enviar();
    });
}

function programaCarrito(){
    dibujarCarrito(carrito);
    const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
    const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
    btnFinalizarCompra.addEventListener("click",()=>{
        mostrarToastFinalizarCompra();
        carrito.forEach(unArticulo => {
            eliminarItemCarritoHTMLElemento(unArticulo);
        });
    });

    btnVaciarCarrito.addEventListener("click",()=>{
        carrito.forEach(unArticulo => {
            eliminarItemCarritoHTMLElemento(unArticulo);
        });
    });
}

function programaFarmaciaJuguete(articulos) {
    let propiedad = (document.getElementById("farmacia.html") ? "Medicamento" : "Juguete");
    let articulosFiltrados = articulos.filter(unArticulo => unArticulo.tipo === propiedad)
    
    const selectOrdenamiento = document.getElementById("selectOrdenamiento");
    selectOrdenamiento.addEventListener("change", () => {
        dibujarTarjetas(articulosFiltrados, selectOrdenamiento.value);
        aplicarFuncionalidadAgregarCarrito(articulosFiltrados);
    });
    dibujarTarjetas(articulosFiltrados, "");
    aplicarFuncionalidadAgregarCarrito(articulosFiltrados);
}
function aplicarFuncionalidadAgregarCarrito(articulosFiltrados) {
    /*añado funcionalidad a los botones de añadir al carrito*/
    articulosFiltrados.forEach(unArticulo => {
        btnAniadirAlCarrito = document.getElementById(unArticulo._id);
        btnAniadirAlCarrito.addEventListener("click", (e) => {
            //busco si existe el articulo en el carrito
            let articuloCarrito = carrito.find(unItemCarrito => unItemCarrito.id === e.target.id);
            if (articuloCarrito) {
                if (articuloCarrito.stock > articuloCarrito.cantidad) {
                    articuloCarrito.cantidad++;
                    mostrarToastAgregarCarrito(articuloCarrito, "Se ha añadido al carrito", "bg-success");
                }
                else {
                    mostrarToastAgregarCarrito(articuloCarrito, "Se ha alcanzado la maxima cantidad de este articulo", "bg-danger");
                }
            }

            else {
                articuloCarrito = new ItemCarrito(unArticulo._id, unArticulo.nombre, 1, unArticulo.precio, unArticulo.imagen, unArticulo.stock);
                carrito.push(articuloCarrito);
                mostrarToastAgregarCarrito(articuloCarrito, "Se ha añadido al carrito", "bg-success");
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            dibujarCarrito(carrito);
            actualizarNotificacionCantidadArticulosCarrito();
        });
    });
}

function ordenarArticulos(articulos, criterioOrdenamiento) {
    if (criterioOrdenamiento === "")
        return articulos;
    else if (criterioOrdenamiento === "mayorPrecio")
        return articulos.sort((a, b) => parseInt(b.precio) - parseInt(a.precio));
    else
        return articulos.sort((a, b) => parseInt(a.precio) - parseInt(b.precio));
}


function dibujarTarjetas(articulos, criterioOrdenamiento) {

    let articulosOrdenasFiltrados = ordenarArticulos(articulos, criterioOrdenamiento)
    const contenedorTarjetas = document.getElementById("contenedorTarjetas");
    contenedorTarjetas.innerHTML = '';
    const cantPocoStock = 5;

    articulosOrdenasFiltrados.forEach(unArticulo => {

        let tituloArticulo = unArticulo.nombre;
        let descripcionArticulo = unArticulo.descripcion;


        let idCartaImagen = `img-carta-${unArticulo._id}`;
        let idVistaImagen = `vista-img-carta-${unArticulo._id}`;
        let idModal = `modal-${unArticulo._id}`;

        let imgPocoStock = (unArticulo.stock < cantPocoStock ? `<img src="assets/farmaciaYJuguetes/ultimas-unidades.png" alt="" class="imagen-pocoStock">` : "");
        let vistaImgPocoStock = (unArticulo.stock < cantPocoStock ? `<img src="assets/farmaciaYJuguetes/ultimas-unidades.png" alt="" class="imagen-pocoStock">` : "");


        contenedorTarjetas.innerHTML += `
        <div class="col-4 mt-5 " >
            <div class="card " style="width: 18rem; ">
                <div class="carta-imagen">
                    <div class="contenedorImgArticuloYSinStock" id="${idCartaImagen}">
                        ${imgPocoStock}
                    </div>
                </div>
            
                <div class="card-body">
                    <div class="carta-titulo"> 
                        <h5 class="card-title" data-bs-toggle="tooltip" data-bs-placement="top" title="${tituloArticulo}">${tituloArticulo}</h5>
                    </div>
                </div>
                <ul class="list-group list-group-flush ">
                    <li class="list-group-item ">Precio: $ ${unArticulo.precio}</li>
                    <li class="list-group-item">Stock: ${unArticulo.stock}</li>
                </ul>
                
                <div class="card-body carta-botones">
                    <button type="button" class="btn btn-sm btn-dark "data-bs-toggle="modal" data-bs-target="#${idModal}">Ver Más</button>
                    <button type="button" class="btn btn-sm btn-success" id = ${unArticulo._id}>Añadir al carrito</button>
                </div>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="${idModal}"  data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header d-flex justify-content-between align-items-start">        
                            <div class="vista-carta-imagen">
                                <div class="vista-contenedorImgArticuloYSinStock" id= "${idVistaImagen}">
                                    ${vistaImgPocoStock}
                                </div>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    
                        <div class="modal-body">
                            <h5 class="modal-title" >${tituloArticulo}</h5>
                            <p>${descripcionArticulo}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK!</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        `;

        document.getElementById(idCartaImagen).style.backgroundImage = `url(${unArticulo.imagen})`;
        document.getElementById(idVistaImagen).style.backgroundImage = `url(${unArticulo.imagen})`;

        inicializarTooltipsBootstrap();

    });

}

function enviar() {
    let retorno = true;
    const bootstrapClaseInvalidacion = "is-invalid";

    //le saco la clase de bootstrap is-invalid a todos los elementos con que debo verificar
    let elementos = Array.from(document.getElementsByClassName(bootstrapClaseInvalidacion))
    elementos.forEach(unElemento => unElemento.classList.remove(bootstrapClaseInvalidacion));

    const fieldNombre = document.getElementById("nombres");
    const fieldApellido = document.getElementById("apellidos");
    const fieldEmail = document.getElementById("email");
    const fieldTelefono = document.getElementById("telefono");

    if (estaVacioInputText(fieldNombre, bootstrapClaseInvalidacion))
        retorno = false;
    if (estaVacioInputText(fieldApellido, bootstrapClaseInvalidacion))
        retorno = false;
    if (estaVacioInputText(fieldEmail, bootstrapClaseInvalidacion))
        retorno = false;

    //Verificacion de checkBoxs
    let labelCheckboxes = document.getElementById("labelGrupoCheckboxs");
    let checkboxes = Array.from(document.getElementsByName("tiposMascotas"))
    let cantidadChecked = 0;

    checkboxes.forEach(unCheck => {
        if (unCheck.checked) {
            cantidadChecked++;
        }
    });
    if (cantidadChecked === 0) {
        checkboxes.forEach(unCheck => {
            unCheck.classList.add(bootstrapClaseInvalidacion);
        });
        labelCheckboxes.classList.add(bootstrapClaseInvalidacion);
        retorno = false;
    }


    //validacion del boton select
    const botonSelelct = document.getElementById("razonConsulta");
    if (botonSelelct.value === "") {
        botonSelelct.classList.add(bootstrapClaseInvalidacion);
        retorno = false;
    }

    //validacion del textArea
    const textAreaMensaje = document.getElementById("textAreaMensaje");
    if (textAreaMensaje.value == "") {
        textAreaMensaje.classList.add(bootstrapClaseInvalidacion);
        retorno = false;
    }



    //mostrar mensaje de confirmacion
    if (retorno) {
        let modalConfirmacion = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
        modalConfirmacion.show();
        fieldNombre.value = "";
        fieldApellido.value = "";
        fieldEmail.value = "";
        fieldTelefono.value = "";
        checkboxes.forEach(unCheck => unCheck.checked = false);
        botonSelelct.selectedIndex = 0;
        textAreaMensaje.value = "";


    }
    return retorno;
}

function estaVacioInputText(input, bootstrapClaseInvalidacion) {
    if (input.value == "") {
        input.classList.add(bootstrapClaseInvalidacion);
        return true;
    }
    return false;
}


//Funciones para el Carrito


function dibujarCarrito() {
    const listaItemsCarrito = document.getElementById("listaItemsCarrito");
    listaItemsCarrito.innerHTML = "";

    carrito.forEach((unItem) => {
        const idbtnQuitar = `btnQuitar-${unItem.id}`;
        const idBtnAumentarCantidad = `btnAumentar-${unItem.id}`;
        const idBtnDisminuirCantidad = `btnDisminuir-${unItem.id}`;
        const idLblCantidadUnitaria = `cantidadUnitaria-${unItem.id}`;
        const idlblSubTotalUnitario = `subTotalUnitario-${unItem.id}`;
        let articuloCarrito = document.createElement("div");
        articuloCarrito.classList.add("item-carrito");
        articuloCarrito.innerHTML = `
        <div class="porta-foto-btnQuitar " >
              <div class="porta-imagen-carrito">
                <img src="${unItem.imagen}" alt="" class="w-100">
              </div>
              <button type="button" class="btn btn-sm btn-danger mt-3" id="${idbtnQuitar}">Quitar</button>
          </div>
          <div class="porta-titulo-precio " >
              <h5>${unItem.titulo}</h5>
              <p style="font-size: 0.8em;">cantidad:
                <button class="botonAumentarDisminuirCantidad" id="${idBtnDisminuirCantidad}">-</button>
                <span class="cantidadDeUnItemCarrito" id= "${idLblCantidadUnitaria}">${unItem.cantidad}</span>
                <button class="botonAumentarDisminuirCantidad" id="${idBtnAumentarCantidad}">+</button>
                x  <span class="carrito-precioIndividualTotal">$${unItem.precio}</span>  = <span class="carrito-precioIndividualTotal" id="${idlblSubTotalUnitario}">$${calcularSubTotal(unItem)}</span> 
                </p>
          </div>
        </div>
        `;
        listaItemsCarrito.appendChild(articuloCarrito);
        agregarFuncionalidadBtnQuitarCarrito(document.getElementById(idbtnQuitar));
        agregarFuncionaliadBotonesAumentarDisminuir(unItem, document.getElementById(idBtnAumentarCantidad), document.getElementById(idBtnDisminuirCantidad));
    });
    actualizarTotalPrecioCarrito();
}

function agregarFuncionaliadBotonesAumentarDisminuir(unItem, btnAumentar, btnDisminuir) {
    btnAumentar.addEventListener("click", () => AumentarDisminuirCantidadItemCarrito(unItem, "+"));
    btnDisminuir.addEventListener("click", () => AumentarDisminuirCantidadItemCarrito(unItem, "-"));
}

function AumentarDisminuirCantidadItemCarrito(unItem, operacion) {
    const lblCantidadUnitaria = document.getElementById(`cantidadUnitaria-${unItem.id}`);
    const lblSubTotalUnitario = document.getElementById(`subTotalUnitario-${unItem.id}`);
    if (operacion === "+") {
        if (unItem.stock > unItem.cantidad)
            unItem.cantidad++;
    }
    else {
        if (unItem.cantidad > 1)
            unItem.cantidad--;
    }


    actualizarNotificacionCantidadArticulosCarrito();
    lblCantidadUnitaria.innerText = `${unItem.cantidad}`;
    lblSubTotalUnitario.innerText = `$${calcularSubTotal(unItem)}`;
    actualizarTotalPrecioCarrito();
}
function actualizarTotalPrecioCarrito() {
    const precioTotalCarrito = document.getElementById("precioTotalCarrito");
    let total = 0;
    carrito.forEach(unArticulo => total += calcularSubTotal(unArticulo));
    precioTotalCarrito.innerText = `Total: $ ${total}`;
}

function agregarFuncionalidadBtnQuitarCarrito(btnQuitar) {
    btnQuitar.addEventListener("click", (event) => {
        let itemBuscado = carrito.find(item => ("btnQuitar-" + item.id) === event.target.id);
        eliminarItemCarritoHTMLElemento(itemBuscado);
    });

}

function calcularSubTotal(unItemCarrito) {
    return unItemCarrito.cantidad * unItemCarrito.precio;
}
function actualizarNotificacionCantidadArticulosCarrito() {
    const elmenttoHTMLcantidadArticulosCarrito = document.getElementById("cantidadArticulosCarrito")
    var cantidadArticulosCarrito = 0;
    carrito.forEach(unArticulo => cantidadArticulosCarrito += unArticulo.cantidad);
    elmenttoHTMLcantidadArticulosCarrito.innerText = `${cantidadArticulosCarrito}`;
}

//Bootstrap
function inicializarTooltipsBootstrap() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    })
}

function mostrarToastAgregarCarrito(unArticulo, tituloTostada, claseEstilo) {
    const tostadaHTMLElemento = document.getElementById("agregarCarritoToast");
    const tostadaNombreHTMLElemento = document.getElementById("toastNombreArticulo");
    const tostadaImagenHTMLElemnto = document.getElementById("toastImagen");
    const tituloTostadaHTMLElemento = document.getElementById("tituloTostada");

    tituloTostadaHTMLElemento.innerText = tituloTostada;
    tostadaHTMLElemento.classList.remove("bg-success");
    tostadaHTMLElemento.classList.remove("bg-danger");
    tostadaHTMLElemento.classList.add(claseEstilo);
    tostadaNombreHTMLElemento.innerText = unArticulo.titulo;
    tostadaImagenHTMLElemnto.setAttribute("src", unArticulo.imagen);

    var tostadaElemento = new bootstrap.Toast(tostadaHTMLElemento);

    tostadaElemento.show();

}
function mostrarToastFinalizarCompra(){
    const tostadaHTMLElemento = document.getElementById("finalizarCompra");
    var tostadaElemento = new bootstrap.Toast(tostadaHTMLElemento);
    tostadaElemento.show();
    console.log("holo 2");
}

function eliminarItemCarritoHTMLElemento(unArticuloCarrito) {
    const btnQuitar = document.getElementById(`btnQuitar-${unArticuloCarrito.id}`);
    let contenedorItem = btnQuitar.parentElement.parentElement;
    contenedorItem.classList.add("d-none");
    carrito = carrito.filter(item => {
        if (item.id != unArticuloCarrito.id)
            return true;
    });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarNotificacionCantidadArticulosCarrito();
    actualizarTotalPrecioCarrito();
}