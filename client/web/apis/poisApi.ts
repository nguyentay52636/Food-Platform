import baseApi from "./baseApi";

export interface IPOI {
    _id?: string
    tenPOI: string,
    loaiPOI: string,
    // maNgonNgu?: string,
    // maOwner?: string,
    moTa: string,
    latitude: number,
    longitude: number,
    rangeTrigger: number,
    thumbnail: string,
    ngayTao?: string,
    images: string[],
    address: string

}

export const createPoi = async ({ tenPOI, loaiPOI, moTa, latitude, longitude, rangeTrigger, thumbnail, images, address }: IPOI) => {
    const newPoi = {
        tenPOI,
        loaiPOI,
        moTa,
        latitude,
        longitude,
        rangeTrigger,
        thumbnail,
        images,
        address
    }
    try {
        const response = await baseApi.post("/poi", newPoi)
        return response.data
    } catch (error: any) {
        throw error
    }
}
export const getAllPois = async () => {
    try {
        const response = await baseApi.get("/poi")
        return response.data
    } catch (error: any) {
        throw error
    }
}
