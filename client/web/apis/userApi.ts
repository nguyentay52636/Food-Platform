import { IRole } from "./authApi"

export interface IUser {
    _id?: string
    username: string
    email: string
    role: IRole
}
