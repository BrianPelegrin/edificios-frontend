interface IAuthCredentials{
    email: string;
    password: string;
}

interface IUser{
    id:number;
    codigo: string;
    nombre:string;
    email:string;
    clave:string;
}

interface ILoginResponse {
    user:IUser;
    token: string;
}


export type {
    IAuthCredentials,
    IUser,
    ILoginResponse
}