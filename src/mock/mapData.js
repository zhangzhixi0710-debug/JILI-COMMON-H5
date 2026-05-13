// mapData: 映射符号ID => 名称
const mapData = {
    0: "9",
    1: "10",
    2: "J",
    3: "Q",
    4: "K",
    5: "A",
    6: "鹿",
    7: "狼",
    8: "熊",
    9: "鹰",
    10: "普通野牛",
    11: "紫色野牛",
    12: "金色野牛",
    13: "WILD",
    14: "SCATTER",
    15: "紫色箭头",
    16: "金额箭头",
    17: "WILD *2",
    18: "WILD *3",
    19: "WILD *5",
};
// 头部事件符号映射符号ID => 名称
const mapEventData = {
    1: "8FREE GAME x3 x5",
    2: "CHARGE紫牛",
    3: "SUPER CHARGE金牛",
    4: "门",
};

const eventIdToSymbolIdMap = {
    2: 11, // CHARGE紫牛 => 紫色野牛
    3: 12, // SUPER CHARGE金牛 => 金色野牛
};
