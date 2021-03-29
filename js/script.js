
if(document.getElementById("farmacia.html")||document.getElementById("juguetes.html")){
    fetch("https://apipetshop.herokuapp.com/api/articulos")
    .then(unaRespuesta =>{
        unaRespuesta.json()
        .then((data)=>{
            programaFarmaciaJuguete(data.response);
        })
        .catch(error=> console.log(error + "aqui dice error"))        
    })
}else if(document.getElementById("contactenos.html")){
    const botonEnviar = document.getElementById("btnEnviar")
    botonEnviar.addEventListener("click",(e)=>{
        e.preventDefault();        
        enviar();
    });
}



function programaFarmaciaJuguete(articulos){
    const selectOrdenamiento = document.getElementById("selectOrdenamiento");
    console.log(selectOrdenamiento);
    selectOrdenamiento.addEventListener("change",()=>{
        dibujarTarjetas(articulos,selectOrdenamiento.value);
    });
    dibujarTarjetas(articulos,"");
}


function ordenarArticulos(articulos, criterioOrdenamiento){
    if(criterioOrdenamiento ==="")
        return articulos;
    else if(criterioOrdenamiento === "mayorPrecio")
        return [...articulos].sort((a,b)=>parseInt(b.precio)- parseInt(a.precio));
    else
    return [...articulos].sort((a,b)=>parseInt(a.precio)-parseInt(b.precio));
}


function dibujarTarjetas(articulos,criterioOrdenamiento){
    let propiedad = (document.getElementById("farmacia.html") ? "Medicamento": "Juguete");
    let articulosOrdenasFiltrados = ordenarArticulos(articulos.filter(unArticulo => unArticulo.tipo ===propiedad),criterioOrdenamiento)
    const contenedorTarjetas =  document.getElementById("contenedorTarjetas");
    contenedorTarjetas.innerHTML='';

    const topeTitulo = 27;
    const cantPocoStock = 5;
    
    articulosOrdenasFiltrados.forEach(unArticulo =>{
        
        let tituloArticulo = unArticulo.nombre;
        let descripcionArticulo = unArticulo.descripcion;
        let tituloCarta = (tituloArticulo.length < topeTitulo ?  tituloArticulo :  tituloArticulo.slice(0,topeTitulo)+"...");

        
        let idCartaImagen = `img-carta-${unArticulo._id}`;  
        let idVistaImagen = `vista-img-carta-${unArticulo._id}`;  
        let idModal = `modal-${unArticulo._id}`;  

        let imgPocoStock = (unArticulo.stock < cantPocoStock ? `<img src="assets/farmacia y juguetes/ultimas-unidades.png" alt="" class="imagen-pocoStock">` : "" );
        let vistaImgPocoStock = (unArticulo.stock < cantPocoStock ? `<img src="assets/farmacia y juguetes/ultimas-unidades.png" alt="" class="imagen-pocoStock">` : "" );

        
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
                    <button type="button" class="btn btn-sm btn-success">Añadir al carrito</button>
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

        document.getElementById(idCartaImagen).style.backgroundImage =`url(${unArticulo.imagen})`;
        document.getElementById(idVistaImagen).style.backgroundImage = `url(${unArticulo.imagen})`;
        inicializarTooltipsBootstrap();
        
    });
    console.log("holo3");
}

function enviar(){
    let retorno = true;
    const bootstrapClaseInvalidacion = "is-invalid";

    //le saco la clase de bootstrap is-invalid a todos los elementos con que debo verificar
    let elementos = Array.from(document.getElementsByClassName(bootstrapClaseInvalidacion))
    elementos.forEach(unElemento=>unElemento.classList.remove(bootstrapClaseInvalidacion));

    const fieldNombre = document.getElementById("nombres");
    const fieldApellido = document.getElementById("apellidos");
    const fieldEmail = document.getElementById("email");

    if( estaVacioInputText(fieldNombre,bootstrapClaseInvalidacion) )
        retorno = false;
    if(estaVacioInputText(fieldApellido,bootstrapClaseInvalidacion) )
        retorno = false;
    if(estaVacioInputText(fieldEmail,bootstrapClaseInvalidacion))
        retorno = false;
    
    //Verificacion de checkBoxs
    let labelCheckboxes = document.getElementById("labelGrupoCheckboxs");
    let checkboxes = Array.from(document.getElementsByName("tiposMascotas")) 
    let cantidadChecked = 0;

    checkboxes.forEach(unCheck=>{        
        if(unCheck.checked){
            cantidadChecked ++;
        }
    });
    if(cantidadChecked === 0){
        checkboxes.forEach(unCheck=>{
            unCheck.classList.add(bootstrapClaseInvalidacion);
        });
        labelCheckboxes.classList.add(bootstrapClaseInvalidacion);
        retorno = false;
    }


    //validacion del boton select
    const botonSelelct = document.getElementById("razonConsulta");
    if(botonSelelct.value ===""){
        botonSelelct.classList.add(bootstrapClaseInvalidacion);
        retorno = false;
    }

    //validacion del textArea
    const textAreaMensaje = document.getElementById("textAreaMensaje");
    if(textAreaMensaje.value == ""){
        textAreaMensaje.classList.add(bootstrapClaseInvalidacion);
        retorno = false;
    }
        
    

    //mostrar mensaje de confirmacion
    if(retorno){
        let modalConfirmacion = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
        modalConfirmacion.show();
    }
    return retorno;
}

function estaVacioInputText(input,bootstrapClaseInvalidacion){
    if(input.value ==""){
        input.classList.add(bootstrapClaseInvalidacion);
        return true;
    }
    return false;
}

function inicializarTooltipsBootstrap(){
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    })
}