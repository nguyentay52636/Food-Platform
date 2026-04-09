import baseApi from "./baseApi"

export enum IRole {
    ADMIN = 'admin',
    OWNER = 'owner',
}
export interface LoginDto {
    account: string
    password: string
}
export interface LoginResponseDto {
    access_token: string
    user: {
        _id: string
        username: string
        email: string
        role: IRole
        createdAt: string
        updatedAt: string
    }
}
export interface registerWithOwner {
    username: string
    email: string
    password: string
}
export interface ChangePasswordDto {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export const login = async (data: LoginDto) => {
    try {
        const response = await baseApi.post<LoginResponseDto>('/auth/login', data)
        return response.data
    } catch (error: any) {
        throw error.response?.data || error
    }
}

export const register = async (data: registerWithOwner) => {
    try {
        const response = await baseApi.post('/auth/register-owner', data)
        return response.data
    } catch (error: any) {
        throw error.response?.data || error
    }
}

export const changePassword = async (data: ChangePasswordDto) => {
    try {
        const response = await baseApi.post('/auth/change-password', data)
        return response.data
    } catch (error: any) {
        throw error.response?.data || error
    }
}