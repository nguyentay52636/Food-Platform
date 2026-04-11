import { IRole } from "./authApi"
import baseApi from "./baseApi"

export interface IUser {
    _id?: string
    username: string

    email: string
    role: IRole
}

export const getAllOwner = async () => {
    try {
        const response = await baseApi.get("/user/owners")
        return response.data
    } catch (error: any) {
        throw error
    }
}
