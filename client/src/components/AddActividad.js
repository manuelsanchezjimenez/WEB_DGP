/* #newDesrAct {
    text-align: center;
} */

.inputLine,
input,
textarea {
    width: 100%;
    text-align: left;
    margin-bottom: 5px;
}

/* Formulario */
.formulario {
    min-width: 600px;
    /* min-width: 1085px; */
    width: 100%;
    /* background-color: cadetblue; */
    /* float:left;
    width: 40%; */
}

/* Parte pictogramas */
.secuenciaPicto {
    width: 100%;
    min-height: 300px;
    /* background-color: plum; */
    vertical-align: middle;
    text-align: center;
}

.scroll {
    /* background-color: #c9deec; */
    overflow-y: scroll;
    max-height: 1000px;
    border-color: #c9deec;
    border-style: groove;
    border-width: 1px;
    border-radius: 20px;
}

.contImage {
    /* width: 30px; */
    width: 150px;
    height: 150px;
    vertical-align: middle;
    justify-content: center;
    text-align: center;
    align-items: center;
    background-color: white;
    border-style: groove;
    border-color: #4198d2;
    border-width: 2px;
    overflow: hidden;
    display: flex;

}

.contenedorPicto {
    vertical-align: middle;
    justify-content: center;
    text-align: center;
    align-items: center;

    background-color: white;
    border-style: groove;
    border-color: #4198d2;
    border-width: 2px;
    overflow: hidden;
    display: flex;

}

/* Botones */
.parteBotones {
    overflow: visible;
    /* background-color: yellow; */
    /* width: 8px; */
    margin: 15px;
    text-align: right;
    /* float: right; */
}

.botonAcciones {
    font-size: 20px;
    width: 200px;
    height: 50px;
    margin: 5px;
    text-align: center;

}

.verde {
    background-color: rgb(148, 240, 148);
}

.rojo {
    background-color: rgb(223, 124, 124);
}

/* Configuración de imagen genérica */
.imagen {
    width: 100%;
    /* height: 100%; */
    height: auto;
    object-fit: contain;
}

/* Para que los objetos se alinéen en bloque en la misma línea */
.objectline {
    display: inline-block;
    justify-content: space-between;
    /* vertical-align: middle; */
    vertical-align: top;

}

h2 {
    color: #4198d2;
    font-size: 30px;
    text-align: center;
}

.web-container {
    /* text-align: center; */
    vertical-align: text-top;
}

@media screen and (min-width: 1085px) {

    /* Formulario */
    .formulario {
        min-width: 600px;
        width: 30%;
        /* background-color: blueviolet; */
        /* float:left;
    width: 40%; */
    }

    .secuenciaPicto {
        width: 55%;
        /* background-color: plum; */
        vertical-align: middle;
        text-align: center;
    }

    .both {
        display: flex;
        /* equal height of the children */
    }

    .parte {
        flex: 1;
        /* additionally, equal width */
    }
}
