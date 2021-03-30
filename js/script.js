class ItemCarrito {
    constructor(id, titulo, cantidad, precio, imagen) {
        this.id = id;
        this.titulo = titulo;
        this.cantidad = cantidad;
        this.precio = precio;
        this.imagen = imagen;
    }
    
}

var carrito = [];
if(localStorage.getItem("carrito")){
    carrito = JSON.parse(localStorage.getItem("carrito")) ;
    dibujarCarrito(carrito);
}
    

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



function programaFarmaciaJuguete(articulos) {
    
    let propiedad = (document.getElementById("farmacia.html") ? "Medicamento" : "Juguete");
    let articulosFiltrados = articulos.filter(unArticulo => unArticulo.tipo === propiedad)
    const selectOrdenamiento = document.getElementById("selectOrdenamiento");
    selectOrdenamiento.addEventListener("change", () => {
        dibujarTarjetas(articulosFiltrados, selectOrdenamiento.value);
    });
    dibujarTarjetas(articulosFiltrados, "");

    /*añado funcionalidad a los botones de añadir al carrito*/
    articulosFiltrados.forEach(unArticulo => {
        btnAniadirAlCarrito = document.getElementById(unArticulo._id);

        btnAniadirAlCarrito.addEventListener("click", (e) => {
            //busco si existe el articulo en el carrito
            let articuloBuscado = carrito.find(unItemCarrito => unItemCarrito.id === e.target.id);
            if (articuloBuscado)
                articuloBuscado.cantidad++;
            else {
                let itemCarrito = new ItemCarrito(unArticulo._id, unArticulo.nombre, 1, unArticulo.precio, unArticulo.imagen);
                carrito.push(itemCarrito);
            }
            localStorage.setItem("carrito",JSON.stringify(carrito));
            dibujarCarrito(carrito);
        });
    });

}


function ordenarArticulos(articulos, criterioOrdenamiento) {
    if (criterioOrdenamiento === "")
        return articulos;
    else if (criterioOrdenamiento === "mayorPrecio")
        return [...articulos].sort((a, b) => parseInt(b.precio) - parseInt(a.precio));
    else
        return [...articulos].sort((a, b) => parseInt(a.precio) - parseInt(b.precio));
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

        let imgPocoStock = (unArticulo.stock < cantPocoStock ? `<img src="assets/farmacia y juguetes/ultimas-unidades.png" alt="" class="imagen-pocoStock">` : "");
        let vistaImgPocoStock = (unArticulo.stock < cantPocoStock ? `<img src="assets/farmacia y juguetes/ultimas-unidades.png" alt="" class="imagen-pocoStock">` : "");


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
                    <button type="button" class="btn btn-sm btn-dark "data-bs-toggle="modal" data-bs-target="#${idModal}">Revision rapida</button>
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

function inicializarTooltipsBootstrap() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    })
}



function dibujarCarrito() {
    const listaItemsCarrito = document.getElementById("listaItemsCarrito");
    const precioTotalCarrito = document.getElementById("precioTotalCarrito");
    let total = 0;
    listaItemsCarrito.innerHTML = "";


    carrito.forEach((unItem) => {
        const idbtnQuitar = `btnQuitar-${unItem.id}`;
        let articuloCarrito = document.createElement("div");
        articuloCarrito.classList.add("item-carrito");
        articuloCarrito.style.border = "1px solid";
        articuloCarrito.innerHTML = `
        <div class="porta-foto-btnQuitar " style="border: 1px solid;">
              <div class="porta-imagen-carrito">
                <img src="${unItem.imagen}" alt="" class="w-100">
              </div>
              <button type="button" class="btn btn-sm btn-danger mt-3" id="${idbtnQuitar}">Quitar</button>
          </div>
          <div class="porta-titulo-precio " >
              <h5>${unItem.titulo}</h5>
              <p>cantidad: ${unItem.cantidad} x <span class="carrito-precioIndividualTotal">$${unItem.precio}</span>  = <span class="carrito-precioIndividualTotal">$${calcularTotal(unItem)}</span> </p>
          </div>
        </div>
        `;
        total += calcularTotal(unItem);
        listaItemsCarrito.appendChild(articuloCarrito);
        agregarFuncionalidadBtnQuitarCarrito(document.getElementById(idbtnQuitar));
    });
    precioTotalCarrito.innerText = `Total: $${total}`;
}

function agregarFuncionalidadBtnQuitarCarrito(btnQuitar) {
    const precioTotalCarrito = document.getElementById("precioTotalCarrito");
    let total = 0;
    btnQuitar.addEventListener("click", (event) => {
        let itemBuscado = carrito.find(item => ("btnQuitar-" + item.id) === event.target.id);
        carrito = carrito.filter(item => {
            if (item.id != itemBuscado.id) {
                total += calcularTotal(item);
                return true;
            }
        });
        let contenedorItem = event.target.parentElement.parentElement;
        contenedorItem.classList.add("d-none");
        precioTotalCarrito.innerText = `Total: $${total}`;
        localStorage.setItem("carrito",JSON.stringify(carrito));
    });
    
}

function calcularTotal(unItemCarrito) {
    return unItemCarrito.cantidad * unItemCarrito.precio;
}