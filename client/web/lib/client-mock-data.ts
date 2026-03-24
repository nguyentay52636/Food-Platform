import type { ClientPOI, ClientTour } from "./client-types"

// Tọa độ trung tâm Phố ẩm thực Vĩnh Khánh, Quận 4, TP.HCM
// Latitude: 10.7579, Longitude: 106.7005

export const CLIENT_MOCK_POIS: ClientPOI[] = [
    {
        id: "poi-1",
        name: {
            vi: "Ốc Đào",
            en: "Oc Dao (Snail Restaurant)",
            zh: "岛螺餐厅",
            ja: "オックダオ（カタツムリ料理店）",
        },
        description: {
            vi: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            en: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            zh: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            ja: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
        },
        category: "major",
        latitude: 10.7582,
        longitude: 106.7008,
        images: [
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
        ],
        address: "212 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.8,
        reviewCount: 3450,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                duration: 180,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                duration: 175,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                duration: 170,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                duration: 185,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-2",
        name: {
            vi: "Hải Sản Bé Mặn",
            en: "Be Man Seafood",
            zh: "小咸海鲜",
            ja: "ベーマン シーフード",
        },
        description: {
            vi: "Quán hải sản tươi sống với các món đặc sản: cua rang me, tôm hùm nướng phô mai, ghẹ hấp bia. Hải sản được lựa chọn kỹ, đảm bảo tươi ngon. Giá cả phải chăng so với chất lượng.",
            en: "Fresh seafood restaurant featuring signature dishes: tamarind crab, cheese grilled lobster, beer-steamed crab. Carefully selected fresh seafood at reasonable prices.",
            zh: "新鲜海鲜餐厅，特色菜有：罗望子蟹、芝士烤龙虾、啤酒蒸蟹。精选新鲜海鲜，价格合理。",
            ja: "新鮮なシーフードレストラン。タマリンドクラブ、チーズグリルロブスター、ビール蒸しカニなどの名物料理。厳選された新鮮な海産物をリーズナブルな価格で。",
        },
        category: "major",
        latitude: 10.7575,
        longitude: 106.7002,
        images: [
            "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=600&fit=crop",
        ],
        address: "156 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.6,
        reviewCount: 2180,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                duration: 160,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                duration: 155,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
                duration: 150,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
                duration: 165,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-3",
        name: {
            vi: "Lẩu Cua Đồng Út Kiều",
            en: "Ut Kieu Field Crab Hotpot",
            zh: "月娇田蟹火锅",
            ja: "ウットキェウ 田蟹鍋",
        },
        description: {
            vi: "Quán lẩu cua đồng truyền thống với nước lẩu đậm đà từ gạch cua. Món đặc trưng là lẩu cua đồng ăn kèm bún, rau muống, hoa chuối. Không gian bình dân, đông khách vào buổi tối.",
            en: "Traditional field crab hotpot with rich broth made from crab roe. Signature dish is field crab hotpot served with vermicelli, morning glory, and banana blossom. Casual atmosphere, busy at night.",
            zh: "传统田蟹火锅，汤底由蟹膏熬制而成。招牌菜是田蟹火锅配米粉、空心菜和香蕉花。平民氛围，晚间客满。",
            ja: "蟹味噌から作った濃厚なスープの伝統的な田蟹鍋。ビーフン、空心菜、バナナの花と一緒にいただく田蟹鍋が名物。カジュアルな雰囲気で、夜は混雑します。",
        },
        category: "major",
        latitude: 10.7588,
        longitude: 106.7015,
        images: [
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop",
        ],
        address: "268 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.5,
        reviewCount: 1650,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                duration: 145,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                duration: 140,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
                duration: 135,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
                duration: 150,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-4",
        name: {
            vi: "Nghêu Hấp Thái Lan",
            en: "Thai Style Steamed Clams",
            zh: "泰式蒸蛤蜊",
            ja: "タイ風蒸しハマグリ",
        },
        description: {
            vi: "Quán chuyên nghêu hấp kiểu Thái với sả, ớt, lá chanh thơm nức. Món ăn nhanh, giá rẻ, phù hợp nhậu vỉa hè. Ngoài nghêu còn có sò huyết, sò điệp nướng.",
            en: "Specializing in Thai-style steamed clams with lemongrass, chili, and fragrant lime leaves. Quick, cheap, perfect for street-side drinking. Also serves blood cockles and grilled scallops.",
            zh: "专营泰式蒸蛤蜊，配香茅、辣椒和香气扑鼻的青柠叶。快速便宜，适合路边小酌。还供应血蚶和烤扇贝。",
            ja: "レモングラス、唐辛子、香り高いライムの葉を使ったタイ風蒸しハマグリを専門としています。早くて安く、路上での飲みにぴったり。血貝や焼きホタテもあります。",
        },
        category: "major",
        latitude: 10.7570,
        longitude: 106.6995,
        images: [
            "https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?w=800&h=600&fit=crop",
        ],
        address: "98 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.4,
        reviewCount: 980,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                duration: 130,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
                duration: 125,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
                duration: 120,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
                duration: 135,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-5",
        name: {
            vi: "Cháo Hào Cô Ba",
            en: "Co Ba Oyster Porridge",
            zh: "三姑生蚝粥",
            ja: "コーバー 牡蠣粥",
        },
        description: {
            vi: "Quán cháo hào nổi tiếng với hào tươi béo ngậy, nước cháo ngọt thanh. Cháo nấu từ gạo dẻo, hào được thả vào khi sôi để giữ độ tươi. Kèm theo rau mùi, hành phi, tiêu.",
            en: "Famous oyster porridge with fresh, creamy oysters and sweet, light broth. Porridge cooked with sticky rice, oysters added when boiling to keep fresh. Served with cilantro, fried shallots, pepper.",
            zh: "著名的生蚝粥，生蚝鲜嫩肥美，汤底甘甜清淡。粥用糯米熬制，生蚝在沸腾时放入以保持新鲜。配香菜、油葱和胡椒。",
            ja: "新鮮でクリーミーな牡蠣と甘く軽いスープが自慢の有名な牡蠣粥。もち米で炊いたお粥に、新鮮さを保つため沸騰時に牡蠣を入れます。パクチー、揚げエシャロット、コショウ添え。",
        },
        category: "major",
        latitude: 10.7595,
        longitude: 106.7020,
        images: [
            "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&h=600&fit=crop",
        ],
        address: "324 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.7,
        reviewCount: 1420,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                duration: 140,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                duration: 135,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                duration: 130,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                duration: 145,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-6",
        name: {
            vi: "Bánh Khọt Cô Tư",
            en: "Co Tu Banh Khot",
            zh: "四姑越南小饼",
            ja: "コートゥー バインコット",
        },
        description: {
            vi: "Bánh khọt giòn rụm với nhân tôm tươi, ăn kèm rau sống và nước mắm chua ngọt. Quán nhỏ xinh, đông khách từ sáng đến tối. Có thể gọi thêm gỏi cuốn, chả giò.",
            en: "Crispy banh khot (mini savory pancakes) with fresh shrimp filling, served with fresh vegetables and sweet-sour fish sauce. Small cozy shop, busy from morning to night. Also offers spring rolls.",
            zh: "酥脆的越南小饼配新鲜虾仁馅，搭配生蔬菜和酸甜鱼露。小店温馨，从早到晚都很忙。还有春卷。",
            ja: "新鮮なエビのフィリングが入ったカリカリのバインコット（ミニ塩味パンケーキ）。生野菜と甘酸っぱいヌクマムと一緒に。小さな居心地の良いお店で、朝から夜まで忙しい。春巻きもあります。",
        },
        category: "major",
        latitude: 10.7565,
        longitude: 106.6988,
        images: [
            "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=800&h=600&fit=crop",
        ],
        address: "45 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.5,
        reviewCount: 890,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                duration: 120,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                duration: 115,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                duration: 110,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                duration: 125,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-7",
        name: {
            vi: "Tôm Càng Nướng Anh Hai",
            en: "Anh Hai Grilled Prawns",
            zh: "二哥烤大虾",
            ja: "アンハイ 焼きエビ",
        },
        description: {
            vi: "Quán tôm càng xanh nướng trên than hoa, thịt tôm ngọt tự nhiên, vỏ giòn thơm. Tôm được nuôi ở Long An, đảm bảo sạch và tươi. Ăn kèm muối ớt chanh.",
            en: "Grilled freshwater prawns over charcoal, naturally sweet meat with crispy fragrant shell. Prawns farmed in Long An, guaranteed clean and fresh. Served with chili lime salt.",
            zh: "炭火烤青虾，虾肉自然鲜甜，虾壳酥脆香浓。虾来自隆安养殖，保证干净新鲜。配辣椒青柠盐。",
            ja: "炭火で焼いた淡水エビ、自然な甘みの肉とカリカリで香ばしい殻。ロンアン産の養殖エビで、新鮮さを保証。チリライムソルト添え。",
        },
        category: "major",
        latitude: 10.7600,
        longitude: 106.7025,
        images: [
            "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&h=600&fit=crop",
        ],
        address: "386 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.6,
        reviewCount: 1280,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                duration: 150,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
                duration: 145,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
                duration: 140,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
                duration: 155,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-8",
        name: {
            vi: "Bò Nướng Lá Lốt Chị Năm",
            en: "Chi Nam Grilled Beef in Betel Leaf",
            zh: "五姐蒌叶烤牛肉",
            ja: "チーナム コショウの葉包み焼き牛肉",
        },
        description: {
            vi: "Bò cuốn lá lốt nướng than, thịt bò băm nhuyễn ướp gia vị đậm đà. Ăn kèm bún, rau thơm, đậu phộng rang và nước mắm pha. Món ăn truyền thống Nam Bộ.",
            en: "Charcoal-grilled beef wrapped in betel leaves, minced beef marinated with rich spices. Served with vermicelli, herbs, roasted peanuts and fish sauce. Traditional Southern Vietnamese dish.",
            zh: "炭火烤蒌叶包牛肉，牛肉末腌制入味。配米粉、香草、烤花生和鱼露。越南南部传统美食。",
            ja: "炭火で焼いたコショウの葉包み牛肉。スパイスでしっかり味付けした牛ひき肉。ビーフン、ハーブ、ローストピーナッツ、ヌクマム添え。ベトナム南部の伝統料理。",
        },
        category: "major",
        latitude: 10.7572,
        longitude: 106.6998,
        images: [
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
        ],
        address: "128 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.4,
        reviewCount: 760,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
                duration: 135,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
                duration: 130,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
                duration: 125,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
                duration: 140,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-9",
        name: {
            vi: "Ốc Móng Tay Chảo",
            en: "Stir-fried Razor Clams",
            zh: "爆炒竹蛏",
            ja: "マテ貝炒め",
        },
        description: {
            vi: "Chuyên ốc móng tay xào tỏi, xào sa tế, nướng mỡ hành. Ốc móng tay tươi từ biển Vũng Tàu, thịt ngọt giòn. Quán mở từ 16h đến 23h hàng ngày.",
            en: "Specializing in razor clams stir-fried with garlic, satay, or grilled with scallion oil. Fresh razor clams from Vung Tau beach, sweet crispy meat. Open 4 PM to 11 PM daily.",
            zh: "专营蒜炒竹蛏、沙茶炒竹蛏或葱油烤竹蛏。竹蛏来自头顿海滩，肉质甘甜爽脆。每天下午4点至晚上11点营业。",
            ja: "ニンニク炒め、サテ炒め、ネギ油焼きのマテ貝を専門としています。ブンタウビーチの新鮮なマテ貝、甘くてシャキシャキ。毎日午後4時から午後11時まで営業。",
        },
        category: "major",
        latitude: 10.7585,
        longitude: 106.7012,
        images: [
            "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop",
        ],
        address: "234 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.5,
        reviewCount: 1120,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                duration: 125,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                duration: 120,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                duration: 115,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                duration: 130,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-10",
        name: {
            vi: "Chè Khúc Bạch Cô Sáu",
            en: "Co Sau Che Khuc Bach",
            zh: "六姑杏仁豆腐甜汤",
            ja: "コーサウ チェークックバック",
        },
        description: {
            vi: "Chè khúc bạch mát lạnh với kem sữa dê thơm béo, nhãn nhục, hạt sen. Thức uống giải nhiệt hoàn hảo sau bữa ăn hải sản. Có thêm chè thái, chè đậu.",
            en: "Cool che khuc bach (almond jelly dessert) with creamy goat milk, longan, lotus seeds. Perfect cooling drink after seafood meal. Also serves Thai-style dessert and bean dessert.",
            zh: "清凉的杏仁豆腐甜汤，配羊奶奶油、龙眼、莲子。海鲜餐后完美的解暑饮品。还有泰式甜品和豆类甜品。",
            ja: "クリーミーなヤギミルク、龍眼、蓮の実入りの冷たいチェークックバック（アーモンドゼリーデザート）。シーフード後の完璧なクールダウンドリンク。タイ風デザートや豆のデザートもあります。",
        },
        category: "major",
        latitude: 10.7568,
        longitude: 106.6992,
        images: [
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
        ],
        address: "78 Vĩnh Khánh, Phường 1, Quận 4",
        rating: 4.3,
        reviewCount: 650,
        audio: {
            vi: {
                languageCode: "vi",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                duration: 100,
                transcript: "Ốc Đào là quán ốc nổi tiếng nhất Vĩnh Khánh, hoạt động từ năm 1998. Quán chuyên các món ốc chế biến đa dạng: ốc hương nướng mỡ hành, ốc len xào dừa, ốc giác xào me. Không gian rộng rãi, phục vụ nhanh.",
            },
            en: {
                languageCode: "en",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                duration: 95,
                transcript: "Oc Dao is the most famous snail restaurant on Vinh Khanh, operating since 1998. Specializing in various snail dishes: grilled sweet snails with scallion oil, stir-fried mud snails with coconut, tamarind snails. Spacious venue with quick service.",
            },
            zh: {
                languageCode: "zh",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                duration: 90,
                transcript: "岛螺是永康最著名的螺蛳餐厅，自1998年营业。专营各种螺蛳菜肴：葱油烤香螺、椰子炒泥螺、罗望子螺。空间宽敞，服务快速。",
            },
            ja: {
                languageCode: "ja",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                duration: 105,
                transcript: "オックダオは1998年から営業しているヴィンカン通りで最も有名なカタツムリ料理店です。ネギ油焼きカタツムリ、ココナッツ炒め泥貝、タマリンド貝など多様なカタツムリ料理を専門としています。",
            },
        },
    },
    {
        id: "poi-11",
        name: {
            vi: "WC Công Cộng - Đầu Phố",
            en: "Public Restroom - Street Entrance",
            zh: "公共厕所 - 街口",
            ja: "公衆トイレ - 入口",
        },
        description: {
            vi: "Nhà vệ sinh công cộng miễn phí tại đầu phố ẩm thực Vĩnh Khánh.",
            en: "Free public restroom at the entrance of Vinh Khanh food street.",
            zh: "永康美食街入口处的免费公共厕所。",
            ja: "ヴィンカン・フードストリート入口の無料公衆トイレ。",
        },
        category: "minor",
        subCategory: "wc",
        latitude: 10.7560,
        longitude: 106.6985,
        images: [],
        address: "Đầu đường Vĩnh Khánh, Quận 4",
        audio: {}
    },
    {
        id: "poi-12",
        name: {
            vi: "Bãi Giữ Xe Quận 4",
            en: "District 4 Parking Lot",
            zh: "第四郡停车场",
            ja: "4区駐車場",
        },
        description: {
            vi: "Bãi giữ xe máy và ô tô có bảo vệ 24/7, gần phố ẩm thực Vĩnh Khánh.",
            en: "24/7 guarded motorcycle and car parking near Vinh Khanh food street.",
            zh: "24/7保安看守的摩托车和汽车停车场，靠近永康美食街。",
            ja: "ヴィンカン・フードストリート近くの24時間警備付きバイク・車駐車場。",
        },
        category: "minor",
        subCategory: "parking",
        latitude: 10.7555,
        longitude: 106.6980,
        images: [],
        address: "Hoàng Diệu, Quận 4",
        audio: {}
    },
]

export const CLIENT_MOCK_TOURS: ClientTour[] = [
    {
        id: "tour-1",
        name: {
            vi: "Tour Ốc & Hải Sản",
            en: "Snails & Seafood Tour",
            zh: "螺蛳海鲜之旅",
            ja: "カタツムリ&シーフードツアー",
        },
        description: {
            vi: "Khám phá các quán ốc và hải sản nổi tiếng nhất phố Vĩnh Khánh. Thưởng thức ốc hương, nghêu hấp, cua rang me và nhiều món hải sản tươi ngon.",
            en: "Explore the most famous snail and seafood restaurants on Vinh Khanh street. Enjoy sweet snails, steamed clams, tamarind crab and many fresh seafood dishes.",
            zh: "探索永康街最著名的螺蛳和海鲜餐厅。品尝香螺、蒸蛤蜊、罗望子蟹和众多新鲜海鲜。",
            ja: "ヴィンカン通りで最も有名なカタツムリとシーフードレストランを探索。甘いカタツムリ、蒸しハマグリ、タマリンドクラブなど新鮮なシーフードをお楽しみください。",
        },
        pois: [
            { poiId: "poi-1", order: 1 },
            { poiId: "poi-2", order: 2 },
            { poiId: "poi-4", order: 3 },
            { poiId: "poi-9", order: 4 },
        ],
        estimatedDuration: 180,
        distance: 0.8,
        coverImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    },
    {
        id: "tour-2",
        name: {
            vi: "Tour Đặc Sản Nam Bộ",
            en: "Southern Specialties Tour",
            zh: "南部特色之旅",
            ja: "南部名物ツアー",
        },
        description: {
            vi: "Trải nghiệm các món ăn truyền thống Nam Bộ: lẩu cua đồng, bò lá lốt, bánh khọt. Kết thúc với chè khúc bạch mát lạnh.",
            en: "Experience traditional Southern Vietnamese dishes: field crab hotpot, beef in betel leaf, banh khot. End with cool che khuc bach dessert.",
            zh: "体验越南南部传统美食：田蟹火锅、蒌叶牛肉、越南小饼。以清凉的杏仁豆腐甜汤结束。",
            ja: "ベトナム南部の伝統料理を体験：田蟹鍋、コショウの葉包み牛肉、バインコット。冷たいチェークックバックで締めくくり。",
        },
        pois: [
            { poiId: "poi-3", order: 1 },
            { poiId: "poi-8", order: 2 },
            { poiId: "poi-6", order: 3 },
            { poiId: "poi-10", order: 4 },
        ],
        estimatedDuration: 150,
        distance: 0.6,
        coverImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop",
    },
]

export function getClientPOIById(id: string): ClientPOI | undefined {
    return CLIENT_MOCK_POIS.find((poi) => poi.id === id)
}

export function getClientTourById(id: string): ClientTour | undefined {
    return CLIENT_MOCK_TOURS.find((tour) => tour.id === id)
}
