export interface IRouter {

}
export interface createRouterDto {
    tenRouter: string,
    moTa: string,
    thoiGianDuKien: string,
    thumbnail: string,
    pois: [
        {
            maPoi: string,
            thuTu: number
        }
    ]
}