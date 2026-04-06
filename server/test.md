{
  "_id": "67f1a7b7f2f86cd799439011",
  "tenPOI": "Nhà hàng Biển Xanh",
  "loaiPOI": "restaurant",
  "latitude": 10.7758,
  "longitude": 106.7009,
  "rangeTrigger": 120,
  "thumbnail": "https://cdn.example.com/poi/blue-sea/thumb.jpg",
  "ngayTao": "2026-04-06T06:22:09.664Z",
  "poiNgonNgu": {
    "_id": "67f1a8a3f2f86cd799439201",
    "ngonNgu": {
      "_id": "67f1a5d1f2f86cd799439099",
      "tenNgonNgu": "English"
    },
    "tieuDe": "Blue Sea Restaurant",
    "moTa": "Fresh seafood with city view.",
    "audio": {
      "_id": "67f1aa11f2f86cd7994392ff",
      "audioUrl": "https://cdn.example.com/audio/poi/blue-sea/en.mp3",
      "thoiLuong": 84
    }
  }
}

File đã sửa
src/modules/poi/poi.service.ts
src/modules/poi/poi.controller.ts
src/modules/poi/dto/poi-content-response.dto.ts
src/modules/poi/dto/patch-poi-translation.dto.ts (mới)
Cách gọi API chính
POST /poi?maNgonNgu=<languageId>
GET /poi?maNgonNgu=<languageId>
GET /poi/:id?maNgonNgu=<languageId>
PATCH /poi/:id?maNgonNgu=<languageId>
PATCH /poi/:id/translations với body:
maNgonNgu (required)
tieuDe, moTa, audioUrl, audioDurationSec (optional)