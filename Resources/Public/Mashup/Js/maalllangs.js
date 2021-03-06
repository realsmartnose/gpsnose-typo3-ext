var allLangs = [
    { code: "aa", native: "Qafar", english: "Afar" },
    { code: "af", native: "Afrikaans", english: "Afrikaans" },
    { code: "agq", native: "Aghem", english: "Aghem" },
    { code: "ak", native: "Akan", english: "Akan" },
    { code: "am", native: "አማርኛ", english: "Amharic" },
    { code: "ar", native: "العربية", english: "Arabic" },
    { code: "arn", native: "Mapudungun", english: "Mapudungun" },
    { code: "as", native: "অসমীয়া", english: "Assamese" },
    { code: "asa", native: "Kipare", english: "Asu" },
    { code: "ast", native: "asturianu", english: "Asturian" },
    { code: "az", native: "azərbaycan dili", english: "Azerbaijani" },
    { code: "ba", native: "Башҡорт", english: "Bashkir" },
    { code: "bas", native: "Ɓàsàa", english: "Basaa" },
    { code: "be", native: "Беларуская", english: "Belarusian" },
    { code: "bem", native: "Ichibemba", english: "Bemba" },
    { code: "bez", native: "Hibena", english: "Bena" },
    { code: "bg", native: "български", english: "Bulgarian" },
    { code: "bin", native: "Ẹ̀dó", english: "Edo" },
    { code: "bm", native: "bamanakan", english: "Bamanankan" },
    { code: "bn", native: "বাংলা", english: "Bangla" },
    { code: "bo", native: "བོད་ཡིག", english: "Tibetan" },
    { code: "br", native: "brezhoneg", english: "Breton" },
    { code: "brx", native: "बड़ो", english: "Bodo" },
    { code: "bs", native: "bosanski", english: "Bosnian" },
    { code: "byn", native: "ብሊን", english: "Blin" },
    { code: "ca", native: "català", english: "Catalan" },
    { code: "ce", native: "нохчийн", english: "Chechen" },
    { code: "cgg", native: "Rukiga", english: "Chiga" },
    { code: "chr", native: "ᏣᎳᎩ", english: "Cherokee" },
    { code: "co", native: "Corsu", english: "Corsican" },
    { code: "cs", native: "čeština", english: "Czech" },
    { code: "cu", native: "церковнослове́нскїй", english: "Church Slavic" },
    { code: "cy", native: "Cymraeg", english: "Welsh" },
    { code: "da", native: "dansk", english: "Danish" },
    { code: "dav", native: "Kitaita", english: "Taita" },
    { code: "de", native: "Deutsch", english: "German" },
    { code: "dje", native: "Zarmaciine", english: "Zarma" },
    { code: "dsb", native: "dolnoserbšćina", english: "Lower Sorbian" },
    { code: "dua", native: "duálá", english: "Duala" },
    { code: "dv", native: "ދިވެހިބަސް", english: "Divehi" },
    { code: "dyo", native: "joola", english: "Jola-Fonyi" },
    { code: "dz", native: "རྫོང་ཁ", english: "Dzongkha" },
    { code: "ebu", native: "Kĩembu", english: "Embu" },
    { code: "ee", native: "Eʋegbe", english: "Ewe" },
    { code: "el", native: "Ελληνικά", english: "Greek" },
    { code: "en", native: "English", english: "English" },
    { code: "eo", native: "esperanto", english: "Esperanto" },
    { code: "es", native: "español", english: "Spanish" },
    { code: "et", native: "eesti", english: "Estonian" },
    { code: "eu", native: "euskara", english: "Basque" },
    { code: "ewo", native: "ewondo", english: "Ewondo" },
    { code: "fa", native: "فارسى", english: "Persian" },
    { code: "ff", native: "Fulah", english: "Fulah" },
    { code: "fi", native: "suomi", english: "Finnish" },
    { code: "fil", native: "Filipino", english: "Filipino" },
    { code: "fo", native: "føroyskt", english: "Faroese" },
    { code: "fr", native: "français", english: "French" },
    { code: "fur", native: "furlan", english: "Friulian" },
    { code: "fy", native: "Frysk", english: "Western Frisian" },
    { code: "ga", native: "Gaeilge", english: "Irish" },
    { code: "gd", native: "Gàidhlig", english: "Scottish Gaelic" },
    { code: "gl", native: "galego", english: "Galician" },
    { code: "gn", native: "Avañe’ẽ", english: "Guarani" },
    { code: "gsw", native: "Elsässisch", english: "Alsatian" },
    { code: "gu", native: "ગુજરાતી", english: "Gujarati" },
    { code: "guz", native: "Ekegusii", english: "Gusii" },
    { code: "gv", native: "Gaelg", english: "Manx" },
    { code: "ha", native: "Hausa", english: "Hausa" },
    { code: "haw", native: "ʻŌlelo Hawaiʻi", english: "Hawaiian" },
    { code: "he", native: "עברית", english: "Hebrew" },
    { code: "hi", native: "हिंदी", english: "Hindi" },
    { code: "hr", native: "hrvatski", english: "Croatian" },
    { code: "hsb", native: "hornjoserbšćina", english: "Upper Sorbian" },
    { code: "hu", native: "magyar", english: "Hungarian" },
    { code: "hy", native: "Հայերեն", english: "Armenian" },
    { code: "ia", native: "interlingua", english: "Interlingua" },
    { code: "ibb", native: "Ibibio-Efik", english: "Ibibio" },
    { code: "id", native: "Indonesia", english: "Indonesian" },
    { code: "ig", native: "Igbo", english: "Igbo" },
    { code: "ii", native: "ꆈꌠꁱꂷ", english: "Yi" },
    { code: "is", native: "íslenska", english: "Icelandic" },
    { code: "it", native: "italiano", english: "Italian" },
    { code: "iu", native: "Inuktitut", english: "Inuktitut" },
    { code: "ja", native: "日本語", english: "Japanese" },
    { code: "jgo", native: "Ndaꞌa", english: "Ngomba" },
    { code: "jmc", native: "Kimachame", english: "Machame" },
    { code: "jv", native: "Basa Jawa", english: "Javanese" },
    { code: "ka", native: "ქართული", english: "Georgian" },
    { code: "kab", native: "Taqbaylit", english: "Kabyle" },
    { code: "kam", native: "Kikamba", english: "Kamba" },
    { code: "kde", native: "Chimakonde", english: "Makonde" },
    { code: "kea", native: "kabuverdianu", english: "Kabuverdianu" },
    { code: "khq", native: "Koyra ciini", english: "Koyra Chiini" },
    { code: "ki", native: "Gikuyu", english: "Kikuyu" },
    { code: "kk", native: "қазақ тілі", english: "Kazakh" },
    { code: "kkj", native: "kakɔ", english: "Kako" },
    { code: "kl", native: "kalaallisut", english: "Greenlandic" },
    { code: "kln", native: "Kalenjin", english: "Kalenjin" },
    { code: "km", native: "ភាសាខ្មែរ", english: "Khmer" },
    { code: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
    { code: "ko", native: "한국어", english: "Korean" },
    { code: "kok", native: "कोंकणी", english: "Konkani" },
    { code: "kr", native: "Kanuri", english: "Kanuri" },
    { code: "ks", native: "کٲشُر", english: "Kashmiri" },
    { code: "ksb", native: "Kishambaa", english: "Shambala" },
    { code: "ksf", native: "rikpa", english: "Bafia" },
    { code: "ksh", native: "Kölsch", english: "Ripuarian" },
    { code: "ku", native: "کوردیی ناوەڕاست", english: "Central Kurdish" },
    { code: "kw", native: "kernewek", english: "Cornish" },
    { code: "ky", native: "Кыргыз", english: "Kyrgyz" },
    { code: "la", native: "lingua latīna", english: "Latin" },
    { code: "lag", native: "Kɨlaangi", english: "Langi" },
    { code: "lb", native: "Lëtzebuergesch", english: "Luxembourgish" },
    { code: "lg", native: "Luganda", english: "Ganda" },
    { code: "lkt", native: "Lakȟólʼiyapi", english: "Lakota" },
    { code: "ln", native: "lingála", english: "Lingala" },
    { code: "lo", native: "ລາວ", english: "Lao" },
    { code: "lrc", native: "لۊری شومالی", english: "Northern Luri" },
    { code: "lt", native: "lietuvių", english: "Lithuanian" },
    { code: "lu", native: "Tshiluba", english: "Luba-Katanga" },
    { code: "luo", native: "Dholuo", english: "Luo" },
    { code: "luy", native: "Luluhia", english: "Luyia" },
    { code: "lv", native: "latviešu", english: "Latvian" },
    { code: "mas", native: "Maa", english: "Masai" },
    { code: "mer", native: "Kĩmĩrũ", english: "Meru" },
    { code: "mfe", native: "kreol morisien", english: "Morisyen" },
    { code: "mg", native: "Malagasy", english: "Malagasy" },
    { code: "mgh", native: "Makua", english: "Makhuwa-Meetto" },
    { code: "mgo", native: "metaʼ", english: "Metaʼ" },
    { code: "mi", native: "Reo Māori", english: "Maori" },
    { code: "mk", native: "македонски", english: "Macedonian" },
    { code: "ml", native: "മലയാളം", english: "Malayalam" },
    { code: "mn", native: "Монгол хэл", english: "Mongolian" },
    { code: "mni", native: "মৈতৈলোন্", english: "Manipuri" },
    { code: "moh", native: "Kanien’kéha", english: "Mohawk" },
    { code: "mr", native: "मराठी", english: "Marathi" },
    { code: "ms", native: "Bahasa Melayu", english: "Malay" },
    { code: "mt", native: "Malti", english: "Maltese" },
    { code: "mua", native: "MUNDAŊ", english: "Mundang" },
    { code: "my", native: "ဗမာ", english: "Burmese" },
    { code: "mzn", native: "مازرونی", english: "Mazanderani" },
    { code: "naq", native: "Khoekhoegowab", english: "Nama" },
    { code: "nb", native: "norsk bokmål", english: "Norwegian Bokmål" },
    { code: "nd", native: "isiNdebele", english: "North Ndebele" },
    { code: "ne", native: "नेपाली", english: "Nepali" },
    { code: "nl", native: "Nederlands", english: "Dutch" },
    { code: "nmg", native: "Kwasio", english: "Kwasio" },
    { code: "nn", native: "nynorsk", english: "Norwegian Nynorsk" },
    { code: "nnh", native: "Shwóŋò ngiembɔɔn", english: "Ngiemboon" },
    { code: "nqo", native: "ߒߞߏ", english: "N'ko" },
    { code: "nr", native: "isiNdebele", english: "South Ndebele" },
    { code: "nso", native: "Sesotho sa Leboa", english: "Sesotho sa Leboa" },
    { code: "nus", native: "Thok Nath", english: "Nuer" },
    { code: "nyn", native: "Runyankore", english: "Nyankole" },
    { code: "oc", native: "Occitan", english: "Occitan" },
    { code: "om", native: "Oromoo", english: "Oromo" },
    { code: "or", native: "ଓଡ଼ିଆ", english: "Odia" },
    { code: "os", native: "Ирон æвзаг", english: "Ossetian" },
    { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi" },
    { code: "pap", native: "Papiamentu", english: "Papiamento" },
    { code: "pl", native: "polski", english: "Polish" },
    { code: "prg", native: "prūsiskan", english: "Prussian" },
    { code: "prs", native: "درى", english: "Dari" },
    { code: "ps", native: "پښتو", english: "Pashto" },
    { code: "pt", native: "português", english: "Portuguese" },
    { code: "quc", native: "K'iche'", english: "K'iche'" },
    { code: "quz", native: "runasimi", english: "Quechua" },
    { code: "rm", native: "rumantsch", english: "Romansh" },
    { code: "rn", native: "Ikirundi", english: "Rundi" },
    { code: "ro", native: "română", english: "Romanian" },
    { code: "rof", native: "Kihorombo", english: "Rombo" },
    { code: "ru", native: "русский", english: "Russian" },
    { code: "rw", native: "Kinyarwanda", english: "Kinyarwanda" },
    { code: "rwk", native: "Kiruwa", english: "Rwa" },
    { code: "sa", native: "संस्कृत", english: "Sanskrit" },
    { code: "sah", native: "Саха", english: "Sakha" },
    { code: "saq", native: "Kisampur", english: "Samburu" },
    { code: "sbp", native: "Ishisangu", english: "Sangu" },
    { code: "sd", native: "سنڌي", english: "Sindhi" },
    { code: "se", native: "davvisámegiella", english: "Northern Sami" },
    { code: "seh", native: "sena", english: "Sena" },
    { code: "ses", native: "Koyraboro senni", english: "Koyraboro Senni" },
    { code: "sg", native: "Sängö", english: "Sango" },
    { code: "shi", native: "ⵜⴰⵛⵍⵃⵉⵜ", english: "Tachelhit" },
    { code: "si", native: "සිංහල", english: "Sinhala" },
    { code: "sk", native: "slovenčina", english: "Slovak" },
    { code: "sl", native: "slovenščina", english: "Slovenian" },
    { code: "sma", native: "åarjelsaemiengïele", english: "Sami (Southern)" },
    { code: "smj", native: "julevusámegiella", english: "Sami (Lule)" },
    { code: "smn", native: "anarâškielâ", english: "Sami (Inari)" },
    { code: "sms", native: "sää´mǩiõll", english: "Sami (Skolt)" },
    { code: "sn", native: "chiShona", english: "Shona" },
    { code: "so", native: "Soomaali", english: "Somali" },
    { code: "sq", native: "shqip", english: "Albanian" },
    { code: "sr", native: "srpski", english: "Serbian" },
    { code: "ss", native: "Siswati", english: "siSwati" },
    { code: "ssy", native: "Saho", english: "Saho" },
    { code: "st", native: "Sesotho", english: "Sesotho" },
    { code: "sv", native: "svenska", english: "Swedish" },
    { code: "sw", native: "Kiswahili", english: "Kiswahili" },
    { code: "syr", native: "ܣܘܪܝܝܐ", english: "Syriac" },
    { code: "ta", native: "தமிழ்", english: "Tamil" },
    { code: "te", native: "తెలుగు", english: "Telugu" },
    { code: "teo", native: "Kiteso", english: "Teso" },
    { code: "tg", native: "Тоҷикӣ", english: "Tajik" },
    { code: "th", native: "ไทย", english: "Thai" },
    { code: "ti", native: "ትግርኛ", english: "Tigrinya" },
    { code: "tig", native: "ትግረ", english: "Tigre" },
    { code: "tk", native: "Türkmen dili", english: "Turkmen" },
    { code: "tn", native: "Setswana", english: "Setswana" },
    { code: "to", native: "lea fakatonga", english: "Tongan" },
    { code: "tr", native: "Türkçe", english: "Turkish" },
    { code: "ts", native: "Xitsonga", english: "Tsonga" },
    { code: "tt", native: "Татар", english: "Tatar" },
    { code: "twq", native: "Tasawaq senni", english: "Tasawaq" },
    { code: "tzm", native: "Tamaziɣt n laṭlaṣ", english: "Central Atlas Tamazight" },
    { code: "ug", native: "ئۇيغۇرچە", english: "Uyghur" },
    { code: "uk", native: "українська", english: "Ukrainian" },
    { code: "ur", native: "اُردو", english: "Urdu" },
    { code: "uz", native: "o‘zbek", english: "Uzbek" },
    { code: "vai", native: "ꕙꔤ", english: "Vai" },
    { code: "ve", native: "Tshivenḓa", english: "Venda" },
    { code: "vi", native: "Tiếng Việt", english: "Vietnamese" },
    { code: "vo", native: "Volapük", english: "Volapük" },
    { code: "vun", native: "Kyivunjo", english: "Vunjo" },
    { code: "wae", native: "Walser", english: "Walser" },
    { code: "wal", native: "ወላይታቱ", english: "Wolaytta" },
    { code: "wo", native: "Wolof", english: "Wolof" },
    { code: "xh", native: "isiXhosa", english: "isiXhosa" },
    { code: "xog", native: "Olusoga", english: "Soga" },
    { code: "yav", native: "nuasue", english: "Yangben" },
    { code: "yi", native: "ייִדיש", english: "Yiddish" },
    { code: "yo", native: "Èdè Yorùbá", english: "Yoruba" },
    { code: "zgh", native: "ⵜⴰⵎⴰⵣⵉⵖⵜ", english: "Standard Moroccan Tamazight" },
    { code: "zh", native: "中文", english: "Chinese" },
    { code: "zu", native: "isiZulu", english: "isiZulu" },
];
