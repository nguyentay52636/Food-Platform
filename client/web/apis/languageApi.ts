import baseApi from "./baseApi";

export interface ILanguage {
    _id?: string;
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    createdAt?: string;
    updatedAt?: string;
}
export const getAllLanguage = async () => {
    try {
        const response = await baseApi.get<ILanguage[]>("/languages");
        return response.data;
    } catch (error: any) {
        throw error;
    }
}