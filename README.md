# PropManager - API

## CURSO BASICO DE LA API

Para utilizar los **servicios** el usuario debera estar **registrado** por un admin, e **iniciar sesion** desde el cliente.
❗❗❗Es importante saber que para crear **contratos**, primero se debe contar con una **propiedad existente** en el sistema y con **2 usuarios** registrados en la bbdd (un usuario inquilino y un usuario inmobiliaria). También para crear un nuevo **servicio mensual** se debe crear previamente un **contrato** para poder asignarselo. El ***codigo_catastral*** , ***id_inquilino*** e ***id_inmobiliaria*** conformarán el nuevo contrato. Al nuevo contrato se le podran asignar varios ***servicios_mensuales***. ❗❗❗

**Inicio de sesion**

Se debe ejecutar el metodo/verbo **POST** a la url **dominioDEAPI/auth**. Auth sería el recurso.

**/auth** : En el __**body**__ de la consulta a este endpoint, se deberá incluir un objeto JSON con los datos de email y contraseña del usuario con este formato:

{
    "email": "admin-manager@gmail.com",
    "contrasenia": "manager2024"
}

Si el usuario esta previamente registrado por un admin o es un admin quien lo ejecuta, retornará un **objeto JSON** que contiene un mensaje de bienvenida y un usuario. Dentro del campo usuario se encontrará un **token** que se deberá incluir en el head, seccion **autorizacion bearer token** en las promesas/consultas siguientes para poder utilizar todos los servicios.

El **token** contiene datos de **id** y **rol** del **usuario** que está haciendo las consultas y **dura por 8 horas**.
Al contener datos de **id** y **rol**, la api puede identificar que datos puede/debe suministrarle al usuario en particular en las futuras consultas.

__**Por ejemplo**__. Si el usuario es **admin** podrá acceder a funciones(servicios) de crear contratos, ver todos los contratos, ver todas las propiedades, etc. Si el usuario es **basic** podrá acceder solo a los recursos que tengan asociado su **id** de usuario.

Ejemplo de retorno **post /auth**

{
    "message": "Bienvenido",
    "usuario": {
        "info": {
            "usuario": "admin-manager@gmail.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsInJvbCI6ImEiLCJpYXQiOjE3MTM1ODY5NzYsImV4cCI6MTcxMzYxNTc3Nn0.lgzwTKJT_zIMRIDirXYplYoa910lBcETTZ5UgwS-zEw"
        }
    }
}


**No se podra acceder a los servicios si no se esta previamente registrado y logueado**

## SERVICIOS

**USUARIOS "BASICOS"**(__'inquilinos'__).

* **GET**

    ***/contratos*** : Retorna un **arreglo de objetos JSON** con los contratos que tiene asociados el usuario-iquilino a su nombre. Ejemplo del arreglo (en este caso de 1 elemento):

    [
        {
        "id_contrato": 2,
        "id_inquilino": 2,
        "id_inmobiliaria": 1,
        "codigo_catastral_prop": "AS2763DF228930",
        "fecha_inicio": "2024-04-12T00:00:00.000Z",
        "duracion_en_meses": 24,
        "contrato_digital": null,
        "total_mensual_pesos": 200000,
        "estado_contrato": false,
        "margen_aumento_trimestral": 3.5
        }
    ]

    ***/contratos/:id*** : Retorna un objeto JSON con los detalles de un contrato con determinado id que esté asociado al usuario mas los **servicios del mes asociados**, si los hubiera. Ejemplo del objeto:

    {
    "contrato": {
        "id_contrato": 2,
        "id_inquilino": 2,
        "id_inmobiliaria": 1,
        "codigo_catastral_prop": "AS2763DF228930",
        "fecha_inicio": "2024-04-12T00:00:00.000Z",
        "duracion_en_meses": 24,
        "contrato_digital": null,
        "total_mensual_pesos": 200000,
        "estado_contrato": true,
        "margen_aumento_trimestral": 3.5,
        "servicios_contrato": [
            {
                "id_serv_mensual": 1,
                "id_contrato": 2,
                "tipo_servicio": "GAS",
                "total_mensual_pesos": 13500,
                "detalle": "factura de gas emitida n°9973",
                "fecha_emision": "2024-04-05T00:00:00.000Z",
                "estado_pago": 0
            }
        ]
    }
    }

    * El campo **contrato digital** puede ser **null** o un archivo **.pdf**.
    * El campo **estado_contrato** retorna *true* / *false* dependiendo si el contrato esta vigente o no ACTUALIZADO AL DIA QUE SE EJECUTA LA CONSULTA. (Se implementa una funcion internamente que retorna el estado del contrato al dia.)


**USUARIO/S "ADMIN"**(__'inmobiliaria'__).

   Pueden ejecutar los servicios de usuarios 'basic' y les retornara **todos** los contratos creados(/contratos) y el detalle de un contrato en particular(/contratos/:id).

* **GET**

    ***/propiedades***: Retorna un arreglo JSON con todas las propiedades en su poder/cargadas al sistema. Un ejemeplo de lo que retorna con solo 1 propiedad creada: 

    [
        {
        "codigo_catastral": "AS2763DF228930",
        "direc_calle": "calle falsa",
        "direc_numero": 728,
        "direc_piso": 1,
        "direc_puerta": "33",
        "dni_propietario": 35777777
        }
    ]

    ***/propiedades/?=:dni_propietario***: Un metodo de busqueda que retorna un arreglo JSON con las propiedades que sean correspondientes al dni del propietario (:dni_propietario). Ejemplo de respuesta:

    [
        {
        "codigo_catastral": "AS2763DF228930",
        "direc_calle": "calle falsa",
        "direc_numero": 728,
        "direc_piso": 1,
        "direc_puerta": "33",
        "dni_propietario": 35777777
        }
    ]

    ***/propiedades/:codigo_catastral*** : Retorna un objeto JSON con los detalles de la propiedad. Similar al funcionamiento al /propiedades pero este retorna objeto y no arreglo. Ejemplo de retorno:

    {
    "propiedad": {
        "codigo_catastral": "AS2763DF228930",
        "direc_calle": "calle falsa",
        "direc_numero": 728,
        "direc_piso": 1,
        "direc_puerta": "33",
        "dni_propietario": 35777777
        }
    }

* **POST**

    ***/propiedades***: Se ejecuta para crear una propiedad. Ejemplo de lo que debe incluir el body de la ejecucion:

    {
        "codigo_catastral": "AS2763DF228930",
        "direc_calle": "calle falsa",
        "direc_numero": 728,
        "direc_piso": 1,
        "direc_puerta":33,
        "dni_propietario":35777777
    }  

    * Los campos **direc_piso** y **direc_puerta** pueden ser nulos.

    ***/contratos***: Se ejecuta para crear un contrato.**DEBE EXISTIR LA PROPIEDAD(codigo_catastral_prop) Y LOS USUARIOS ASOCIADOS A id_inquilino E id_inmobiliaria**, ya que tienen que ser datos veridicos y comprobables en la base de datos. Ejemplo de uso:

    {
        "id_inquilino": 2,
        "id_inmobiliaria": 1,
        "codigo_catastral_prop": "AS2763DF228930",
        "fecha_inicio":"2024-04-12",
        "duracion_en_meses":24,
        "contrato_digital":null,
        "total_mensual_pesos":200000,
        "margen_aumento_trimestral":3.5
    }

    * El campo **contrato digital** puede ser **null** o un archivo **.pdf**.

    ***/servicios***: Se ejecuta para asociar un cobro servicio mensual a un determinado contrato de alquiler. **DEBE EXISTIR EL CONTRATO(id_contrato) Y EL RUBRO DEL SERVICIO(tipo_servicio) EN LA BBDD**. Ejemplo de uso:

    {
        "id_contrato":2,
        "tipo_servicio":"GAS",
        "total_mensual_pesos": 13500,
        "fecha_emision":"2024-04-05",
        "detalle":"factura de gas emitida n°9973",
        "estado_pago":0
    }

    * El campo **detalle** admite valor **null**.
    * el campo **estado_pago** es un valor entre -1 y 2.
        -1 : Factura impaga/con mucho retrazo.
         0 : Factura en situacion normal.
         1 : Factura proxima a vencer.
         2 : Factura paga.


* **PUT**

    ***/propiedades/:id***: Para editar/actualizar algun campo de una propiedad en particular(:id). Se utiliza el mismo objeto JSON que el detallado en **POST** solo que incluyendo ademas el id (codigo catastral) de la propiedad en la URL. Ejemplo de la URL:
    ***/propiedades/AS2763DF228930***.

    ***/contratos/:id***: Para editar/actualizar algun campo de un contrato en particular(:id). Se utiliza el mismo objeto JSON que el detallado en **POST** solo que incluyendo ademas el id del contrato en la URL. Ejemplo de la URL:
    ***/contratos/2***.

    ***/servicios/:id***: Para editar/actualizar algun campo de un servicio asociado en particular(:id). Se utiliza el mismo objeto JSON que el detallado en **POST** solo que incluyendo ademas el id del servicio mensual en la URL. Se puede acceder a este recurso a traves de los detalles del contrato. Ejemplo de la URL:
    ***/servicios/2***.

* **DELETE**

    ***MISMAS URL QUE EL METODO *POST* SOLO QUE SIN CONTENIDO EN EL BODY Y EJECUTANDO EL METODO *DELETE***






 




