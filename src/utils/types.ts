export interface Propiedad {
    codigo_catastral: string,
    direc_calle: string | number,
    direc_numero: number,
    direc_piso: number | string | null,
    direc_puerta: string | number | null,
    dni_propietario: number,
}


export interface ContratoAlquilerCompleto{
    id_contrato:number,
    id_usuario:number,
    id_inmobiliaria:number,
    codigo_catastral_prop:string,
    fecha_inicio:Date,
    duracion_en_meses:number,
    contrato_digital: string | null,
    total_mensual_pesos:number,
    estado_contrato:boolean,
    margen_aumento_trimestral:number,
    servicios: Array<ServiciosAsocContrato>
}

export type ContratoAlquiler=Omit<ContratoAlquilerCompleto,'servicios'>;

export interface SensitiveUser{
    id_usuario:number,
    email:string,
    contrasenia:string,
    rol:Role
}

export interface ServiciosAsocContrato{
    id_serv_mensual:number,
    id_contrato:number,
    tipo_servicio:string,
    total_mensual_pesos:number,
    detalle:string | null,
    fecha_emision: Date,
    estado_pago:number
}

export type ServiciosAsocEntry=Omit<ServiciosAsocContrato,'id_serv_mensual'>;

export type ContratoAlquilerEntry=Omit<ContratoAlquiler,'id_contrato'|'estado_contrato'>;
// export enum Type_service{
//     Agua= 'agua',
//     Gas= 'gas',
//     Luz= 'luz',
//     Internet= 'internet',
//     Seguros= 'seguros',
//     Tasas='tasas',
//     Otro='otro'
// detalle_servicio:string | null
// }

export enum Role{ ADMIN= 'a', BASIC='b'};



export type User = Omit<SensitiveUser, 'id_usuario' | 'rol'>;
export type UserRequest=Omit<SensitiveUser, 'email' | 'contrasenia'>;



export enum typeClaim {
    Reparacion = 'Reparacion',
    Queja = 'Queja'
}

export enum stateClaim {
    Pendiente = 'Pendiente',
    Atendido = 'Atendido',
    Completado = 'Completado'
}

export interface Claim {
    id_queja: number;
    id_usuario: number;
    id_contrato: number;
    descripcion: string;
    estado: stateClaim;
    tipo: typeClaim;
}

export interface Inquilino {
    nombre: string,
    apellido: string,
    dni: number,
    telefono: number | null,
}

//todavia no lo utilizo
export interface Inmobiliaria {
    nombre: string,
    direc_calle: string | number,
    direc_numero: number,
    direc_piso: number | null,
    direc_puerta: string | number | null,
    dni_propietario: number,
    hora_apertura: number,
    hora_cierre: number,
    descripcion: string
}