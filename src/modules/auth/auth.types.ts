export interface IUser {
    id: number;
    name: string;
    email: string;
    role: "contributor" | "maintainer";
    created_at: Date;
    updated_at: Date;
}

export interface IRegisterBody {
    name: string;
    email: string;
    password: string;
    role: "contributor" | "maintainer";
}

export interface ILoginBody {
    email: string;
    password: string;
}

export interface IJwtPayload {
    id: number;
    name: string;
    role: "contributor" | "maintainer";
}