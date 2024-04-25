# PropManager - API

> Esta documentacion cuenta de 3 partes **INICIO DE SESION**, **SERVICIOS** (del usuario-administrador y del usuario-basico) y **CONSIDERACIONES EXTRAS** es importante leerlas todas para una óptima comprensión de la API.


## INICIO DE SESION

Para utilizar los **servicios** el usuario debera estar **registrado** por un admin, e **iniciar sesion** desde el cliente.

> Es importante saber que para crear **contratos**, primero se debe contar con una **propiedad existente** en el sistema y con **2 usuarios** registrados en la bbdd (un usuario inquilino y un usuario inmobiliaria). También para crear un nuevo **servicio mensual** se debe crear previamente un **contrato** para poder asignarselo. El ***codigo_catastral*** , ***id_inquilino*** e ***id_inmobiliaria*** conformarán el nuevo contrato. Al nuevo contrato se le podran asignar varios ***servicios_mensuales***. 


* **POST** 

    ***/auth*** : En el __**body**__ de la consulta a este endpoint, se deberá incluir un **objeto JSON** con los datos de email y contraseña del usuario con este formato:

    ```json
    {
        "email": "admin-manager@gmail.com",
        "contrasenia": "manager2024"
    }
    ```

> Si el usuario esta previamente registrado por un admin o es un admin quien lo ejecuta, retornará un **objeto JSON** que contiene un mensaje de bienvenida y un usuario. Dentro del campo usuario se encontrará un **token** que se deberá incluir en el head, seccion **autorizacion bearer token** en las promesas/consultas siguientes para poder utilizar todos los servicios.

- El **token** contiene datos de **id** y **rol** del **usuario** que está haciendo las consultas y **dura por 8 horas**.

- Al contener datos de **id** y **rol**, la API puede identificar que datos puede/debe suministrarle al usuario en particular en las futuras consultas.

> __**Ejemplo**__. Si el usuario es **admin** podrá acceder a funciones(servicios) de crear contratos, ver todos los contratos, ver todas las propiedades, etc. Si el usuario es **basic** podrá acceder solo a los recursos que tengan asociado su **id** de usuario.

Ejemplo de retorno ***/auth***

```json
    {
        "message": "Bienvenido",
        "usuario": {
            "info": {
            "usuario": "admin-manager@gmail.com",
            "token": "eJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsInJvbCI6ImEiLCJpYXQiOjE3MTM1ODY5NzYsImV4cCI6MTcxMzYxNTc3n0.lgzwTKJT_zIMRIDirXYplYoa910lBcETTZ5UgwS-zEw"
            }
        }
    }
```


***************************************************************************************************************************************************************************************

## SERVICIOS

>**No se podra acceder a los servicios si no se esta previamente registrado y logueado**


**USUARIOS "BASICOS"**(__'inquilinos'__).

* **GET**

    ***/contratos*** : Retorna un **arreglo de objetos JSON** con los contratos que tiene asociados el usuario-iquilino a su nombre mas los servicios asignados y quejas realizadas. Ejemplo del arreglo (en este caso de 1 elemento):

    ```json
    [
        {
        "id_contrato": 2,
        "id_inmobiliaria": 1,
        "codigo_catastral_prop": "AS2763DF228930",
        "fecha_inicio": "2024-04-12T00:00:00.000Z",
        "duracion_en_meses": 24,
        "contrato_digital": null,
        "total_mensual_pesos": 200000,
        "estado_contrato": true,
        "margen_aumento_trimestral": 3.5,
        "id_inquilino": 2,
        "servicios": [
            {
                "id_serv_mensual": 1,
                "id_contrato": 2,
                "tipo_servicio": "GAS",
                "total_mensual_pesos": 13500,
                "detalle": "factura de gas n° 2238",
                "fecha_emision": "2024-04-05T00:00:00.000Z",
                "estado_pago": 0
            },
            {
                "id_serv_mensual": 2,
                "id_contrato": 2,
                "tipo_servicio": "LUZ",
                "total_mensual_pesos": 10500,
                "detalle": "factura de luz emitida n°73",
                "fecha_emision": "2024-04-05T00:00:00.000Z",
                "estado_pago": 0
            },
            {
                "id_serv_mensual": 3,
                "id_contrato": 2,
                "tipo_servicio": "EXPENSAS",
                "total_mensual_pesos": 12500,
                "detalle": "factura de servicio de expensas n°9973",
                "fecha_emision": "2024-04-05T00:00:00.000Z",
                "estado_pago": 0
            }
        ],
        "quejas": [
            {
                "id_queja": 6,
                "id_usuario": 2,
                "id_contrato": 2,
                "descripcion": "se rompio el caleactor",
                "estado": "Atendido",
                "tipo": "Reparacion"
            }
        ]
        }
    ]
    ``` 
    ***/contratos/:id*** : Retorna un **objeto JSON 'contrato'** con los detalles de un contrato con determinado id que esté asociado al usuario mas los **servicios del mes asociados** y **quejas**. Estos ultimos 2 si los hubiera. Ejemplo del objeto:

    ```json
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
            "servicios": [
                {
                    "id_serv_mensual": 1,
                    "id_contrato": 2,
                    "tipo_servicio": "GAS",
                    "total_mensual_pesos": 13500,
                    "detalle": "factura de gas n° 2238",
                    "fecha_emision": "2024-04-05T00:00:00.000Z",
                    "estado_pago": 0
                },
                {
                    "id_serv_mensual": 2,
                    "id_contrato": 2,
                    "tipo_servicio": "LUZ",
                    "total_mensual_pesos": 10500,
                    "detalle": "factura de luz emitida n°73",
                    "fecha_emision": "2024-04-05T00:00:00.000Z",
                    "estado_pago": 0
                },
                {
                    "id_serv_mensual": 3,
                    "id_contrato": 2,
                    "tipo_servicio": "EXPENSAS",
                    "total_mensual_pesos": 12500,
                    "detalle": "factura de servicio de expensas n°9973",
                    "fecha_emision": "2024-04-05T00:00:00.000Z",
                    "estado_pago": 0
                }
            ],
            "quejas": [
                {
                    "id_queja": 6,
                    "id_usuario": 2,
                    "id_contrato": 2,
                    "descripcion": "se rompio el caleactor",
                    "estado": "Atendido",
                    "tipo": "Reparacion"
                }
            ]
        }
    }
    ```
    * El campo **contrato digital** puede ser **null** o un archivo **.pdf**.
    * El campo **estado_contrato** retorna *true* / *false* dependiendo si el contrato esta vigente o no ACTUALIZADO AL DIA QUE SE EJECUTA LA CONSULTA. (Se implementa una funcion internamente que retorna el estado del contrato al dia.)

    ***/quejas***: Retorna un **arreglo de objetos JSON** con las quejas realizadas con determinado id que esté asociado al usuario. Retornará las quejas realizadas por el usuario el cual inició sesión. Ejemplo del arreglo:

    ```json
    [
        {
            "id_queja": 6,
            "id_usuario": 2,
            "id_contrato": 2,
            "descripcion": "se rompio el caleactor",
            "estado": "Atendido",
            "tipo": "Reparacion"
        },
        {
            "id_queja": 8,
            "id_usuario": 2,
            "id_contrato": 2,
            "descripcion": "filtrado de agua",
            "estado": "Pendiente",
            "tipo": "Reparacion"
        }
    ]
    ```

    ***/quejas/:id***: Retorna un **objeto JSON** de una queja en particular. Esta queja debe estar asociada al usuario que inicio sesion. Ejemplo del objeto:

    ```json
    {
        "id_queja": 6,
        "id_usuario": 2,
        "id_contrato": 2,
        "descripcion": "se rompio el caleactor",
        "estado": "Atendido",
        "tipo": "Reparacion"
    }
    ```

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**USUARIO/S "ADMIN"**(__'inmobiliaria'__).

>**Pueden ejecutar todos los servicios de CONTRATOS detallados en usuario 'basic'** pero pudiendo acceder a la totalidad de los contratos y quejas independientemente del id de usuario. Puede ver toda la informacion de todos los usuarios. Por ser admin NO podrá crear ***QUEJAS***, solo leerlas a todas y modificar su ***estado***. 


* **GET**

    ***/propiedades***: Retorna un **arreglo JSON** con todas las propiedades en su poder/cargadas al sistema. Un ejemeplo de lo que retorna con solo 1 propiedad creada: 

    ```json
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
    ```

    * El campo **direc_piso** admite valores numericos o letras "pb", "PB". 


    ***/propiedades/?=:dni_propietario***: Un metodo de busqueda que retorna un **arreglo JSON** con las propiedades que sean correspondientes al dni del propietario (:dni_propietario). Ejemplo de respuesta:

    ```json
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
    ```

    ***/propiedades/:codigo_catastral*** : Retorna un **objeto JSON** con los detalles de la propiedad. Similar al funcionamiento al /propiedades pero este retorna objeto y no arreglo. Ejemplo de retorno:

    ```json
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
    ```

    ***/usuarios***: Retorna un **arreglo JSON** con los usuarios **BASIC** registrados y las quejas que tiene asociadas dicho usuario (si las hubiera). Ejemplo del arreglo con **usuarios que tienen quejas realizadas y con los que no**: 

    ```json
    [
        {
            "id_usuario": 2,
            "email": "emailprueba@gmail.com",
            "dni": 37245783,
            "nombre": "juan",
            "apellido": "ortega",
            "telefono": 1122501309,
            "quejas": [
                {
                    "id_queja": 6,
                    "id_usuario": 2,
                    "id_contrato": 2,
                    "descripcion": "se rompio el caleactor",
                    "estado": "Atendido",
                    "tipo": "Reparacion"
                }
            ]
        },
        {
            "id_usuario": 10,
            "email": "leov@gmail.com",
            "dni": 33367849,
            "nombre": "leo",
            "apellido": "casla",
            "telefono": 1563389533
        },
    ]
    ```

    ***/usuarios/:id***: Retorna un **objeto JSON** con los datos y quejas del usuario (si las hubiera). Aqui se puede acceder al propio perfil del administrador. Ejemplo del objeto retornado:

     ```json
     {
        "id_usuario": 2,
        "dni": 37245783,
        "nombre": "juan",
        "apellido": "ortega",
        "telefono": 1122501309,
        "email": "emailprueba@gmail.com",
        "rol": "b",
        "quejas": [
            {
                "id_queja": 6,
                "id_usuario": 2,
                "id_contrato": 2,
                "descripcion": "se rompio el caleactor",
                "estado": "Atendido",
                "tipo": "Reparacion"
            }
        ]
    }
    ```



* **POST**

    ***/propiedades***: Se ejecuta para crear una propiedad. Ejemplo de lo que debe incluir el **body** de la ejecucion:

    ```json
    {
        "codigo_catastral": "AS2763DF228930",
        "direc_calle": "calle falsa",
        "direc_numero": 728,
        "direc_piso": 1,
        "direc_puerta":33,
        "dni_propietario":35777777
    } 
    ```

    * Los campos **direc_piso** y **direc_puerta** pueden ser nulos.

    ***/contratos***: Se ejecuta para crear un contrato.**DEBE EXISTIR LA PROPIEDAD(codigo_catastral_prop) Y LOS USUARIOS ASOCIADOS A id_inquilino E id_inmobiliaria**, ya que tienen que ser datos veridicos y comprobables en la base de datos. Ejemplo de uso:

    ```json
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
    ```

    * El campo **contrato digital** puede ser **null** o un archivo **.pdf**.

    ***/servicios***: Se ejecuta para asociar un cobro servicio mensual a un determinado contrato de alquiler. **DEBE EXISTIR EL CONTRATO(id_contrato) Y EL RUBRO DEL SERVICIO(tipo_servicio) EN LA BBDD**. Ejemplo de uso:

    ```json
    {
        "id_contrato":2,
        "tipo_servicio":"GAS",
        "total_mensual_pesos": 13500,
        "fecha_emision":"2024-04-05",
        "detalle":"factura de gas emitida n°9973",
        "estado_pago":0
    }
    ```

    * El campo **detalle** admite valor **null**.
    * el campo **estado_pago** es un valor entre -1 y 2.
       - -1 : Factura impaga/con mucho retrazo.
       -  0 : Factura en situacion normal.
       -  1 : Factura proxima a vencer.
       -  2 : Factura paga.
       

    ***/usuarios***: Se ejecuta para crear un nuevo usuario de tipo **BASIC**. En el **body** de la consulta se debe incluir un JSON con este formato:

    ```json
    {
        "email":"juanpedro2024@gmail.com",
        "contrasenia":"passwordfake420",
        "nombre":"pedro",
        "apellido":"flores",
        "dni":33367849,
        "telefono":1122501309
    }
    ```




* **PUT**

    >Para las ediciones (PUT) se utilizan los mismos JSON que en el POST, con la diferencia que los **id** se incluyen en la **URL** de la entidad a modificar.


    ***/propiedades/:id***: Para editar/actualizar algun campo de una **propiedad** en particular(:id).El **id** en este caso es el **codigo_catastral** de la **propiedad** Ejemplo de la URL:

    > ***/propiedades/AS2763DF228930***.

    ***/contratos/:id***: Para editar/actualizar algun campo de un contrato en particular(:id). El **id** es el atributo **id_contrato**. Ejemplo de la URL:

    > ***/contratos/2***.

    ***/servicios/:id***: Para editar/actualizar algun campo de un servicio asociado en particular(:id). El **id** es el atributo **id_servicio**. Ejemplo de la URL:

    > ***/servicios/2***.

    ***/usuarios/:id***: Para editar/actualizar algun campo de un usuario en particular (:id). El **id** es el atributo **id_usuario**. Ejemplo de la URL:

    >***/usuarios/2***



* **DELETE**

    > Mismas URL que las del metodo **PUT** pero **sin incluir ningun JSON en el body**. Para el **MVP** de esta **API** no fueron implementados dado que **eliminar** una **entidad** puede conllevar a eliminar otras **entidades asociadas** . Es por esto que se decidió ajustarlo a las necesidades de cada cliente.


---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## CONSIDERACIONES EXTRAS

> La API viene precargada con 2 usuarios. Uno **ADMIN** y uno **BASICO** para realizar pruebas. Se pueden asociar contratos y realizar quejas con el usuario basico. Ademas tiene precargados ***RUBROS*** de los **servicios mensuales**. Estos ***RUBROS*** es una forma de agrupar los servicios que se van a asociar a los **contratos**, los siguientes rubros enlistados son la **clave primaria** de la tabla **rubro_servicio**. Cada **servicio mensual** contiene un atributo **tipo_servicio** que es una **clave foranea** apuntando a su **RUBRO**.Para esta version, ***RUBROS*** NO posee servicios, solo estan para una mejor escalabilidad y agrupacion. Los rubros que vienen precargados son:

- "LUZ"
- "AGUA"
- "EXPENSAS"
- "INTERNET"
- "SEGUROS"
- "GAS"







 




