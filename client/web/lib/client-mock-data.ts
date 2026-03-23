import type { ClientPOI, ClientTour } from "./client-types"

export const CLIENT_MOCK_POIS: ClientPOI[] = [
    {
        id: "poi-1",
        name: {
            vi: "Cầu Rồng",
            en: "Dragon Bridge",
            zh: "龙桥",
            ja: "ドラゴンブリッジ",
        },
        description: {
            vi: "Cầu Rồng là biểu tượng của thành phố Đà Nẵng hiện đại. Cầu dài 666m, có hình dáng một con rồng khổng lồ vắt qua sông Hàn. Vào cuối tuần, cầu phun lửa và nước vào lúc 21h.",
            en: "Dragon Bridge is an iconic symbol of modern Da Nang. The 666m bridge is shaped like a giant dragon spanning the Han River. On weekends, it breathes fire and water at 9 PM.",
            zh: "龙桥是现代岘港的标志性象征。这座666米长的桥梁形如一条巨龙横跨汉江。每逢周末晚上9点，龙桥会喷火和喷水。",
            ja: "ドラゴンブリッジは、近代的なダナンの象徴的なシンボルです。全長666mの橋は、ハン川に架かる巨大な龍の形をしています。週末の午後9時には火と水を噴きます。",
        },
        category: "major",
        latitude: 16.0611,
        longitude: 108.2278,
        images: [
            "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
        ],
        address: "An Hai Tay, Son Tra, Da Nang",
        rating: 4.8,
        reviewCount: 2450,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                duration: 180,
                transcript: "Cầu Rồng là biểu tượng của thành phố Đà Nẵng...",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                duration: 175,
                transcript: "Dragon Bridge is an iconic symbol of modern Da Nang...",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                duration: 170,
                transcript: "龙桥是现代岘港的标志性象征...",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                duration: 185,
                transcript: "ドラゴンブリッジは、近代的なダナンの象徴的なシンボルです...",
            },
        },
    },
    {
        id: "poi-2",
        name: {
            vi: "Ngũ Hành Sơn",
            en: "Marble Mountains",
            zh: "五行山",
            ja: "五行山（マーブルマウンテン）",
        },
        description: {
            vi: "Ngũ Hành Sơn là cụm 5 ngọn núi đá vôi và cẩm thạch, tượng trưng cho ngũ hành: Kim, Mộc, Thủy, Hỏa, Thổ. Nơi đây có nhiều hang động và chùa chiền cổ kính.",
            en: "The Marble Mountains are a cluster of five marble and limestone hills, representing the five elements: Metal, Wood, Water, Fire, and Earth. The site features caves and ancient pagodas.",
            zh: "五行山是五座大理石和石灰岩山丘的群落，代表五行：金、木、水、火、土。这里有许多洞穴和古老的宝塔。",
            ja: "五行山は、金・木・水・火・土の五行を表す5つの大理石と石灰岩の丘の集まりです。洞窟や古代の仏塔があります。",
        },
        category: "major",
        latitude: 16.0034,
        longitude: 108.2634,
        images: [
            "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop",
        ],
        address: "Hoa Hai, Ngu Hanh Son, Da Nang",
        rating: 4.6,
        reviewCount: 1820,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                duration: 240,
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                duration: 235,
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
                duration: 230,
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
                duration: 245,
            },
        },
    },
    {
        id: "poi-3",
        name: {
            vi: "Bãi biển Mỹ Khê",
            en: "My Khe Beach",
            zh: "美溪海滩",
            ja: "ミーケービーチ",
        },
        description: {
            vi: "Bãi biển Mỹ Khê được tạp chí Forbes bình chọn là một trong những bãi biển đẹp nhất hành tinh. Bãi biển trải dài với cát trắng mịn và làn nước trong xanh.",
            en: "My Khe Beach was voted by Forbes as one of the most beautiful beaches on the planet. The beach stretches with fine white sand and crystal-clear water.",
            zh: "美溪海滩被《福布斯》杂志评为世界上最美丽的海滩之一。海滩绵延，白沙细腻，海水清澈。",
            ja: "ミーケービーチは、フォーブス誌により世界で最も美しいビーチの一つに選ばれました。きめ細やかな白い砂と透き通った水が広がるビーチです。",
        },
        category: "major",
        latitude: 16.0544,
        longitude: 108.2478,
        images: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
        ],
        address: "Phuoc My, Son Tra, Da Nang",
        rating: 4.7,
        reviewCount: 3150,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                duration: 150,
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                duration: 145,
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
                duration: 140,
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
                duration: 155,
            },
        },
    },
    {
        id: "poi-4",
        name: {
            vi: "Quầy vé Ngũ Hành Sơn",
            en: "Marble Mountains Ticket Booth",
            zh: "五行山售票处",
            ja: "五行山チケット売り場",
        },
        description: {
            vi: "Quầy bán vé chính tại cổng vào Ngũ Hành Sơn.",
            en: "Main ticket counter at the entrance of Marble Mountains.",
            zh: "五行山入口处的主要售票柜台。",
            ja: "五行山入口のメインチケットカウンター。",
        },
        category: "minor",
        subCategory: "ticket",
        latitude: 16.0038,
        longitude: 108.2638,
        images: [],
        address: "Marble Mountains Entrance",
        audio: {}
    },
    {
        id: "poi-5",
        name: {
            vi: "Bãi đỗ xe Mỹ Khê",
            en: "My Khe Parking Lot",
            zh: "美溪停车场",
            ja: "ミーケー駐車場",
        },
        description: {
            vi: "Bãi đỗ xe công cộng gần bãi biển Mỹ Khê.",
            en: "Public parking lot near My Khe Beach.",
            zh: "美溪海滩附近的公共停车场。",
            ja: "ミーケービーチ近くの公共駐車場。",
        },
        category: "minor",
        subCategory: "parking",
        latitude: 16.055,
        longitude: 108.2485,
        images: [],
        address: "Vo Nguyen Giap Street",
        audio: {}
    },
    {
        id: "poi-6",
        name: {
            vi: "Nhà vệ sinh - Cầu Rồng",
            en: "Restroom - Dragon Bridge",
            zh: "洗手间 - 龙桥",
            ja: "トイレ - ドラゴンブリッジ",
        },
        description: {
            vi: "Nhà vệ sinh công cộng gần đầu cầu Rồng.",
            en: "Public restroom near Dragon Bridge.",
            zh: "龙桥附近的公共洗手间。",
            ja: "ドラゴンブリッジ近くの公衆トイレ。",
        },
        category: "minor",
        subCategory: "wc",
        latitude: 16.0615,
        longitude: 108.228,
        images: [],
        address: "Tran Hung Dao Street",
        audio: {}
    },
    {
        id: "poi-7",
        name: {
            vi: "Bến thuyền Sông Hàn",
            en: "Han River Dock",
            zh: "汉江码头",
            ja: "ハン川船着き場",
        },
        description: {
            vi: "Bến thuyền du lịch trên sông Hàn, điểm xuất phát cho các tour du thuyền ngắm hoàng hôn.",
            en: "Tourist boat dock on the Han River, departure point for sunset cruise tours.",
            zh: "汉江旅游船码头，是观赏日落游船之旅的出发点。",
            ja: "ハン川の観光船乗り場。サンセットクルーズツアーの出発点です。",
        },
        category: "minor",
        subCategory: "dock",
        latitude: 16.0605,
        longitude: 108.225,
        images: [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        ],
        address: "Bach Dang Street, Hai Chau",
        rating: 4.3,
        reviewCount: 520,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                duration: 120,
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
                duration: 115,
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
                duration: 110,
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
                duration: 125,
            },
        },
    },
    {
        id: "poi-8",
        name: {
            vi: "Chùa Linh Ứng",
            en: "Linh Ung Pagoda",
            zh: "灵应寺",
            ja: "リンウン寺",
        },
        description: {
            vi: "Chùa Linh Ứng nằm trên bán đảo Sơn Trà, nổi tiếng với tượng Phật Bà cao 67m - tượng Phật lớn nhất Việt Nam. Từ đây có thể ngắm toàn cảnh thành phố Đà Nẵng.",
            en: "Linh Ung Pagoda sits on Son Tra Peninsula, famous for its 67m Lady Buddha statue - the tallest in Vietnam. It offers panoramic views of Da Nang city.",
            zh: "灵应寺位于山茶半岛，以67米高的观音像闻名——这是越南最高的佛像。从这里可以俯瞰整个岘港市。",
            ja: "リンウン寺はソンチャ半島にあり、高さ67mのレディブッダ像で有名です。ベトナム最大の仏像であり、ダナン市のパノラマビューを楽しめます。",
        },
        category: "major",
        latitude: 16.1004,
        longitude: 108.2772,
        images: [
            "https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&h=600&fit=crop",
        ],
        address: "Hoang Sa, Son Tra, Da Nang",
        rating: 4.9,
        reviewCount: 3200,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                duration: 200,
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                duration: 195,
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                duration: 190,
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                duration: 205,
            },
        },
    },
    {
        id: "poi-9",
        name: {
            vi: "Bảo tàng Chăm",
            en: "Cham Museum",
            zh: "占婆博物馆",
            ja: "チャム彫刻博物館",
        },
        description: {
            vi: "Bảo tàng điêu khắc Chăm là nơi lưu giữ bộ sưu tập nghệ thuật Chăm lớn nhất thế giới, với hơn 2000 hiện vật từ thế kỷ 7 đến 15.",
            en: "The Cham Sculpture Museum houses the world's largest collection of Cham art, with over 2000 artifacts from the 7th to 15th centuries.",
            zh: "占婆雕塑博物馆收藏了世界上最大的占婆艺术品收藏，拥有2000多件7至15世纪的文物。",
            ja: "チャム彫刻博物館は、7世紀から15世紀にかけての2000点以上の遺物を所蔵する、世界最大のチャム美術コレクションを誇ります。",
        },
        category: "major",
        latitude: 16.0600,
        longitude: 108.2238,
        images: [
            "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop",
        ],
        address: "2 Thang 9, Hai Chau, Da Nang",
        rating: 4.5,
        reviewCount: 1560,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                duration: 220,
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                duration: 215,
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                duration: 210,
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                duration: 225,
            },
        },
    },
    {
        id: "poi-10",
        name: {
            vi: "Cầu Tình Yêu",
            en: "Love Lock Bridge",
            zh: "爱情桥",
            ja: "ラブロックブリッジ",
        },
        description: {
            vi: "Cầu Tình Yêu là cây cầu đi bộ bắc qua sông Hàn, nơi các cặp đôi treo khóa tình yêu. Buổi tối cầu lung linh với đèn LED đổi màu.",
            en: "Love Lock Bridge is a pedestrian bridge over the Han River where couples hang love locks. At night, it sparkles with color-changing LED lights.",
            zh: "爱情桥是跨越汉江的人行桥，情侣们在这里挂上爱情锁。夜晚，桥上闪烁着变色LED灯。",
            ja: "ラブロックブリッジはハン川に架かる歩行者専用橋で、カップルが愛の南京錠を掛けます。夜は色が変わるLEDライトで輝きます。",
        },
        category: "major",
        latitude: 16.0618,
        longitude: 108.2248,
        images: [
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop",
        ],
        address: "Bach Dang, Hai Chau, Da Nang",
        rating: 4.4,
        reviewCount: 2100,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                duration: 130,
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
                duration: 125,
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
                duration: 120,
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
                duration: 135,
            },
        },
    },
    {
        id: "poi-11",
        name: {
            vi: "Công viên Châu Á",
            en: "Asia Park",
            zh: "亚洲公园",
            ja: "アジアパーク",
        },
        description: {
            vi: "Công viên Châu Á với vòng quay Sun Wheel cao 115m - một trong những vòng quay cao nhất thế giới. Công viên có nhiều trò chơi và khu vực theo chủ đề các nước châu Á.",
            en: "Asia Park features the Sun Wheel at 115m tall - one of the world's tallest Ferris wheels. The park has rides and themed zones representing Asian countries.",
            zh: "亚洲公园拥有115米高的太阳轮——世界上最高的摩天轮之一。公园设有游乐设施和代表亚洲各国的主题区域。",
            ja: "アジアパークには、世界で最も高い観覧車の1つである高さ115mのサンホイールがあります。アジア各国をテーマにしたエリアと乗り物があります。",
        },
        category: "major",
        latitude: 16.0380,
        longitude: 108.2268,
        images: [
            "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&h=600&fit=crop",
        ],
        address: "1 Phan Dang Luu, Hai Chau, Da Nang",
        rating: 4.6,
        reviewCount: 2800,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
                duration: 180,
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
                duration: 175,
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
                duration: 170,
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
                duration: 185,
            },
        },
    },
    {
        id: "poi-12",
        name: {
            vi: "Bãi biển Non Nước",
            en: "Non Nuoc Beach",
            zh: "农诺海滩",
            ja: "ノンヌオックビーチ",
        },
        description: {
            vi: "Bãi biển Non Nước nằm dưới chân Ngũ Hành Sơn, là bãi biển yên tĩnh hơn với cát trắng mịn và làng nghề điêu khắc đá nổi tiếng gần đó.",
            en: "Non Nuoc Beach lies at the foot of Marble Mountains, a quieter beach with fine white sand and a famous stone carving village nearby.",
            zh: "农诺海滩位于五行山脚下，是一个安静的海滩，沙滩细腻洁白，附近有著名的石雕村。",
            ja: "ノンヌオックビーチは五行山のふもとにあり、きめ細やかな白い砂と、近くに有名な石彫り村がある静かなビーチです。",
        },
        category: "major",
        latitude: 15.9934,
        longitude: 108.2665,
        images: [
            "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&h=600&fit=crop",
        ],
        address: "Hoa Hai, Ngu Hanh Son, Da Nang",
        rating: 4.5,
        reviewCount: 1890,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                duration: 150,
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                duration: 145,
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                duration: 140,
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                duration: 155,
            },
        },
    },
]

export const CLIENT_MOCK_TOURS: ClientTour[] = [
    {
        id: "tour-1",
        name: {
            vi: "Khám phá Đà Nẵng",
            en: "Discover Da Nang",
            zh: "探索岘港",
            ja: "ダナン探検",
        },
        description: {
            vi: "Tour trọn ngày khám phá các điểm nổi bật nhất của Đà Nẵng, từ Cầu Rồng đến Ngũ Hành Sơn và kết thúc tại bãi biển Mỹ Khê.",
            en: "A full-day tour exploring Da Nang's highlights, from Dragon Bridge to Marble Mountains and ending at My Khe Beach.",
            zh: "全天游览岘港的亮点，从龙桥到五行山，最后在美溪海滩结束。",
            ja: "ドラゴンブリッジから五行山、そしてミーケービーチで締めくくる、ダナンのハイライトを巡る終日ツアー。",
        },
        pois: [
            { poiId: "poi-1", order: 1 },
            { poiId: "poi-2", order: 2 },
            { poiId: "poi-3", order: 3 },
        ],
        estimatedDuration: 360,
        distance: 15.5,
        coverImage: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop",
    },
    {
        id: "tour-2",
        name: {
            vi: "Dạo bước sông Hàn",
            en: "Han River Walk",
            zh: "漫步汉江",
            ja: "ハン川散歩",
        },
        description: {
            vi: "Tour buổi tối ngắm cảnh sông Hàn, thưởng thức cảnh hoàng hôn và xem cầu Rồng phun lửa.",
            en: "Evening tour along Han River, enjoying sunset views and watching Dragon Bridge breathe fire.",
            zh: "沿汉江的傍晚之旅，欣赏日落美景，观看龙桥喷火表演。",
            ja: "ハン川沿いの夕方のツアー。夕日を楽しみ、ドラゴンブリッジの火噴きを見ます。",
        },
        pois: [
            { poiId: "poi-7", order: 1 },
            { poiId: "poi-1", order: 2 },
        ],
        estimatedDuration: 120,
        distance: 3.2,
        coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    },
]

export function getClientPOIById(id: string): ClientPOI | undefined {
    return CLIENT_MOCK_POIS.find((poi) => poi.id === id)
}

export function getClientTourById(id: string): ClientTour | undefined {
    return CLIENT_MOCK_TOURS.find((tour) => tour.id === id)
}
