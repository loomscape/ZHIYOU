export type StitchType =
  | 'chain'
  | 'single'
  | 'halfDouble'
  | 'double'
  | 'treble'
  | 'slip'
  | 'popcorn'
  | 'picot'
  | 'vStitch'
  | 'crossed'
  | 'cluster3'
  | 'shell'
  | 'knit'
  | 'purl'
  | 'rib'
  | 'seed'
  | 'cable'
  | 'lace';

export type ToolType = 'pencil' | 'eraser' | 'fill' | 'eyedropper';

export type DitherMode = 'none' | 'floyd-steinberg' | 'bayer';

export type ColorCount = 2 | 4 | 8 | 16 | 32;

export type ColorMode = 'multi' | 'single';

export type Resolution = 40 | 80 | 120 | 160 | 200;

export type UnitSystem = 'cm' | 'inch';

export type YarnCategory =
  | 'lace'
  | 'superFine'
  | 'fine'
  | 'light'
  | 'medium'
  | 'bulky'
  | 'superBulky'
  | 'jumbo';

export type YarnFiber =
  | 'cotton'
  | 'wool'
  | 'acrylic'
  | 'linen'
  | 'silk'
  | 'mohair'
  | 'cashmere'
  | 'modal'
  | 'nylon'
  | 'bamboo'
  | 'blend'
  | 'tshirt'
  | 'chenille';

export interface FinishedSize {
  width: number;
  height: number;
  unit: UnitSystem;
}

export interface Gauge {
  stitchesPerUnit: number;
  rowsPerUnit:
  number;
  unit: UnitSystem;
}

export interface PatternGrid {
  width: number;
  height: number;
  cells: number[][];
  resolution: Resolution;
  palette: string[];
}

export interface StitchMapping {
  colorIndex: number;
  stitchType: StitchType;
}

export interface StitchInfo {
  id: StitchType;
  name: { 'zh-CN': string; 'zh-TW': string; en: string; ja: string; ko: string };
  abbreviation: string;
  symbol: string;
  category: 'basic' | 'increase' | 'decrease' | 'texture' | 'lace' | 'knitting';
  description: { 'zh-CN': string; 'zh-TW': string; en: string; ja: string; ko: string };
  heightMultiplier: number;
}

export interface Material {
  id: string;
  name: { 'zh-CN': string; 'zh-TW': string; en: string; ja: string; ko: string };
  fiber: YarnFiber;
  category: YarnCategory;
  thickness: number;
  roughness: number;
  elasticity: number;
  fuzziness: number;
  color: string;
  recommendedHook?: string;
  recommendedNeedle?: string;
  description?: { 'zh-CN': string; 'zh-TW': string; en: string; ja: string; ko: string };
}

export interface Instruction {
  rowNumber: number;
  stitches: string;
  colorChange?: number;
}

export interface ProjectState {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const STITCH_LIBRARY: StitchInfo[] = [
  {
    id: 'chain',
    name: { 'zh-CN': '辫子针/锁针', 'zh-TW': '辮子針/鎖針', en: 'Chain Stitch', ja: '鎖針（くさり編み）', ko: '사슬뜨기' },
    abbreviation: 'ch',
    symbol: '○',
    category: 'basic',
    description: { 'zh-CN': '基础起针，形成辫子状链条', 'zh-TW': '基礎起針，形成辮子狀鏈條', en: 'Foundation stitch, creates a chain', ja: '基礎の編み目で、鎖のような輪を作ります', ko: '기초 뜨기로, 사슬 모양의 고리를 만듭니다' },
    heightMultiplier: 0.3,
  },
  {
    id: 'single',
    name: { 'zh-CN': '短针', 'zh-TW': '短針', en: 'Single Crochet', ja: '細編み（こまあみ）', ko: '단뜨기' },
    abbreviation: 'sc',
    symbol: '+',
    category: 'basic',
    description: { 'zh-CN': '最基础的短针，织片紧密厚实', 'zh-TW': '最基礎的短針，織片緊密厚實', en: 'Shortest basic stitch, dense fabric', ja: '一番短い基本の編み目で、編地が密になります', ko: '가장 짧은 기본 뜨기로, 뜨개질이 촘촘하고 튼튼합니다' },
    heightMultiplier: 1,
  },
  {
    id: 'halfDouble',
    name: { 'zh-CN': '中长针', 'zh-TW': '中長針', en: 'Half Double Crochet', ja: '中長編み（ちゅうながあみ）', ko: '중장뜨기' },
    abbreviation: 'hdc',
    symbol: 'T',
    category: 'basic',
    description: { 'zh-CN': '高度介于短针和长针之间', 'zh-TW': '高度介於短針和長針之間', en: 'Medium height stitch', ja: '細編みと長編みの中間の高さの編み目', ko: '단뜨기와 장뜨기 사이 높이의 뜨기' },
    heightMultiplier: 1.5,
  },
  {
    id: 'double',
    name: { 'zh-CN': '长针', 'zh-TW': '長針', en: 'Double Crochet', ja: '長編み（ながあみ）', ko: '장뜨기' },
    abbreviation: 'dc',
    symbol: '⊥',
    category: 'basic',
    description: { 'zh-CN': '最常用的针法，高度适中', 'zh-TW': '最常用的針法，高度適中', en: 'Most common stitch, good height', ja: '最も一般的な編み目で、ちょうど良い高さです', ko: '가장 일반적인 뜨기로, 높이가 적당합니다' },
    heightMultiplier: 2,
  },
  {
    id: 'treble',
    name: { 'zh-CN': '长长针', 'zh-TW': '長長針', en: 'Treble Crochet', ja: '長々編み（ながながあみ）', ko: '장장뜨기' },
    abbreviation: 'tr',
    symbol: '⊤',
    category: 'basic',
    description: { 'zh-CN': '两次绕线的高针', 'zh-TW': '兩次繞線的高針', en: 'Tall stitch, two yarn overs', ja: '針に糸を2回かけて編む、背の高い編み目', ko: '바늘에 실을 두 번 감고 뜨는, 높이가 있는 뜨기' },
    heightMultiplier: 2.5,
  },
  {
    id: 'slip',
    name: { 'zh-CN': '引拔针', 'zh-TW': '引拔針', en: 'Slip Stitch', ja: '引き抜き編み（ひきぬきあみ）', ko: '슬립스티치' },
    abbreviation: 'sl st',
    symbol: '•',
    category: 'basic',
    description: { 'zh-CN': '连接用针，非常短', 'zh-TW': '連接用針，非常短', en: 'Joining stitch, very short', ja: '編み地をつなげるための、とても短い編み目', ko: '뜨개질을 잇는 아주 짧은 뜨기' },
    heightMultiplier: 0.5,
  },
  {
    id: 'popcorn',
    name: { 'zh-CN': '爆米花针', 'zh-TW': '爆米花針', en: 'Popcorn Stitch', ja: 'ポップコーン編み（ぽっぷこーんあみ）', ko: '팝콘뜨기' },
    abbreviation: 'pc',
    symbol: '❀',
    category: 'texture',
    description: { 'zh-CN': '一针内钩5针长针，立体泡泡效果', 'zh-TW': '一針內鉤5針長針，立體泡泡效果', en: '5 dc in same stitch, 3D bobble texture', ja: '同じ目に長編みを5目編んで作る、立体的なぽこぽこした模様', ko: '같은 뜨기에 장뜨기를 5번 떠서 만드는 입체적인 방울 모양' },
    heightMultiplier: 2,
  },
  {
    id: 'cluster3',
    name: { 'zh-CN': '3针枣形针', 'zh-TW': '3針棗形針', en: '3-dc Cluster', ja: '玉編み3目（たまあみ3め）', ko: '3단 뜨기 클러스터' },
    abbreviation: '3-dc cl',
    symbol: '◆',
    category: 'texture',
    description: { 'zh-CN': '3个长针并为一针', 'zh-TW': '3個長針併為一針', en: '3 double crochets worked together', ja: '長編み3目を1目にまとめて編む', ko: '장뜨기 3개를 한 뜨기로 모아서 뜨기' },
    heightMultiplier: 2,
  },
  {
    id: 'picot',
    name: { 'zh-CN': '狗牙针', 'zh-TW': '狗牙針', en: 'Picot Stitch', ja: 'ピコット', ko: '피코트' },
    abbreviation: 'picot',
    symbol: '∨',
    category: 'lace',
    description: { 'zh-CN': '装饰性花边针', 'zh-TW': '裝飾性花邊針', en: 'Decorative loop edge stitch', ja: '縁飾りに使う、輪っかのある装飾的な編み目', ko: '가장자리 장식에 쓰이는 고리 모양의 장식적인 뜨기' },
    heightMultiplier: 1,
  },
  {
    id: 'vStitch',
    name: { 'zh-CN': 'V字针', 'zh-TW': 'V字針', en: 'V-Stitch', ja: 'Vステッチ', ko: 'V스티치' },
    abbreviation: 'V-st',
    symbol: 'V',
    category: 'lace',
    description: { 'zh-CN': '一针内钩长针+锁针+长针', 'zh-TW': '一針內鉤長針+鎖針+長針', en: 'dc, ch, dc in same stitch', ja: '同じ目に長編み+鎖編み+長編みを編む', ko: '같은 뜨기에 장뜨기+사슬뜨기+장뜨기를 뜨기' },
    heightMultiplier: 2,
  },
  {
    id: 'crossed',
    name: { 'zh-CN': '交叉针', 'zh-TW': '交叉針', en: 'Crossed Stitch', ja: '交差編み（こうさあみ）', ko: '교차뜨기' },
    abbreviation: 'cross',
    symbol: 'X',
    category: 'texture',
    description: { 'zh-CN': '两针交叉形成花纹', 'zh-TW': '兩針交叉形成花紋', en: 'Two crossed stitches pattern', ja: '2つの編み目を交差させて模様を作る', ko: '두 개의 뜨기를 교차시켜 무늬를 만듭니다' },
    heightMultiplier: 2,
  },
  {
    id: 'shell',
    name: { 'zh-CN': '贝壳针', 'zh-TW': '貝殼針', en: 'Shell Stitch', ja: 'シェル編み（しぇるあみ）', ko: '쉘뜨기' },
    abbreviation: 'shell',
    symbol: '⌒',
    category: 'lace',
    description: { 'zh-CN': '一针内钩5针形成扇形', 'zh-TW': '一針內鉤5針形成扇形', en: '5 dc in same stitch, fan shape', ja: '同じ目に5目編んで貝殻（扇）の形にする', ko: '같은 뜨기에 5번 떠서 조개(부채) 모양으로 만듭니다' },
    heightMultiplier: 2,
  },
  {
    id: 'knit',
    name: { 'zh-CN': '平针', 'zh-TW': '平針', en: 'Knit Stitch', ja: 'メリヤス編み（表目）', ko: '겉뜨기' },
    abbreviation: 'K',
    symbol: '',
    category: 'knitting',
    description: { 'zh-CN': '棒针基础针法，正面V字形', 'zh-TW': '棒針基礎針法，正面V字形', en: 'Basic knit stitch (v-stitch look)', ja: '棒針編みの基本、表目（V字に見える）', ko: '대바늘 뜨기의 기본, 겉뜨기 (V자 모양으로 보임)' },
    heightMultiplier: 1,
  },
  {
    id: 'purl',
    name: { 'zh-CN': '反针', 'zh-TW': '反針', en: 'Purl Stitch', ja: '裏目（うらめ）', ko: '안뜨기' },
    abbreviation: 'P',
    symbol: 'o',
    category: 'knitting',
    description: { 'zh-CN': '平针的反面，颗粒状', 'zh-TW': '平針的反面，顆粒狀', en: 'Reverse side of knit stitch', ja: 'メリヤス編みの裏側、ぶつぶつした見た目', ko: '메리야스 뜨기의 안쪽, 오돌토돌한 모양' },
    heightMultiplier: 1,
  },
  {
    id: 'rib',
    name: { 'zh-CN': '罗纹针', 'zh-TW': '羅紋針', en: 'Rib Stitch', ja: 'ゴム編み（ごむあみ）', ko: '리브뜨기' },
    abbreviation: 'R',
    symbol: '|',
    category: 'knitting',
    description: { 'zh-CN': '上下针交替，有弹性', 'zh-TW': '上下針交替，有彈性', en: 'Alternating knit and purl columns', ja: '表目と裏目を交互に編んだ、伸縮性のある編み地', ko: '겉뜨기와 안뜨기를 교대로 떠서 만드는 신축성 있는 뜨개질' },
    heightMultiplier: 1,
  },
  {
    id: 'seed',
    name: { 'zh-CN': '桂花针', 'zh-TW': '桂花針', en: 'Seed Stitch', ja: 'シードステッチ', ko: '시드스티치' },
    abbreviation: 'S',
    symbol: '·',
    category: 'knitting',
    description: { 'zh-CN': '上下针交错，颗粒质感', 'zh-TW': '上下針交錯，顆粒質感', en: 'Alternating knit and purl in checkerboard', ja: '表目と裏目を市松模様に交互に編む、でこぼこした質感', ko: '겉뜨기와 안뜨기를 바둑판 모양으로 교대로 뜨는, 울퉁불퉁한 질감' },
    heightMultiplier: 1,
  },
  {
    id: 'cable',
    name: { 'zh-CN': '路轨针/绞花', 'zh-TW': '路軌針/絞花', en: 'Cable Stitch', ja: 'ケーブル編み（けーぶるあみ）', ko: '케이블뜨기' },
    abbreviation: 'C',
    symbol: '#',
    category: 'knitting',
    description: { 'zh-CN': '交叉针形成麻花/辫子效果', 'zh-TW': '交叉針形成麻花/辮子效果', en: 'Crossed stitches forming braids', ja: '編み目を交差させて三つ編みのような模様を作る', ko: '뜨기를 교차시켜 땋은 머리 모양의 무늬를 만듭니다' },
    heightMultiplier: 1,
  },
  {
    id: 'lace',
    name: { 'zh-CN': '镂空针', 'zh-TW': '鏤空針', en: 'Lace / YO', ja: 'レース編み（かけ目）', ko: '레이스뜨기 (겉뜨기 감음)' },
    abbreviation: 'YO',
    symbol: '◇',
    category: 'lace',
    description: { 'zh-CN': '绕针形成洞眼，镂空效果', 'zh-TW': '繞針形成洞眼，鏤空效果', en: 'Yarn over creates eyelet hole', ja: '糸をかけて穴を作り、透かし模様にする', ko: '실을 감아 구멍을 만들어 레이스(투각) 무늬로 만듭니다' },
    heightMultiplier: 1,
  },
];

export const YARN_LIBRARY: Material[] = [
  {
    id: 'cotton-lace',
    name: { 'zh-CN': '蕾丝棉线', 'zh-TW': '蕾絲棉線', en: 'Cotton Lace', ja: 'コットンレース', ko: '면 레이스 실' },
    fiber: 'cotton',
    category: 'lace',
    thickness: 0.3,
    roughness: 0.5,
    elasticity: 0.1,
    fuzziness: 0.0,
    color: '#FFF8E7',
    recommendedHook: '1.5 - 2.5 mm',
    description: { 'zh-CN': '精细棉线，适合杯垫和蕾丝', 'zh-TW': '精細棉線，適合杯墊和蕾絲', en: 'Fine cotton for doilies and lace', ja: 'ドイリーやレースに適した細いコットン糸', ko: '도일리와 레이스에 적합한 가는 면사' },
  },
  {
    id: 'cotton-fine',
    name: { 'zh-CN': '细棉线', 'zh-TW': '細棉線', en: 'Cotton Fine', ja: '細コットン', ko: '가는 면사' },
    fiber: 'cotton',
    category: 'fine',
    thickness: 0.5,
    roughness: 0.4,
    elasticity: 0.15,
    fuzziness: 0.05,
    color: '#FFFEF2',
    recommendedHook: '2.5 - 3.5 mm',
    description: { 'zh-CN': '柔软棉线，适合夏季衣物', 'zh-TW': '柔軟棉線，適合夏季衣物', en: 'Soft cotton for summer garments', ja: '夏物の衣類に適した柔らかいコットン糸', ko: '여름 의류에 적합한 부드러운 면사' },
  },
  {
    id: 'cotton-medium',
    name: { 'zh-CN': '中粗棉线', 'zh-TW': '中粗棉線', en: 'Cotton Medium', ja: '並太コットン', ko: '중간 굵기 면사' },
    fiber: 'cotton',
    category: 'medium',
    thickness: 0.7,
    roughness: 0.5,
    elasticity: 0.2,
    fuzziness: 0.1,
    color: '#F5F5DC',
    recommendedHook: '4 - 5 mm',
    description: { 'zh-CN': '通用棉线，适合各种项目', 'zh-TW': '通用棉線，適合各種項目', en: 'All-purpose cotton yarn', ja: '様々な作品に使える万能コットン糸', ko: '다양한 작품에 사용할 수 있는 만능 면사' },
  },
  {
    id: 'cotton-bulky',
    name: { 'zh-CN': '粗棉线', 'zh-TW': '粗棉線', en: 'Cotton Bulky', ja: '太コットン', ko: '굵은 면사' },
    fiber: 'cotton',
    category: 'bulky',
    thickness: 0.85,
    roughness: 0.6,
    elasticity: 0.2,
    fuzziness: 0.1,
    color: '#E8E4C9',
    recommendedHook: '6 - 8 mm',
    description: { 'zh-CN': '粗棉线，适合包包和家居装饰', 'zh-TW': '粗棉線，適合包包和家居裝飾', en: 'Thick cotton for bags and home decor', ja: 'バッグやインテリアに適した太いコットン糸', ko: '가방과 인테리어에 적합한 굵은 면사' },
  },
  {
    id: 'wool-sock',
    name: { 'zh-CN': '羊毛袜线', 'zh-TW': '羊毛襪線', en: 'Wool Sock', ja: 'ウールソックヤーン', ko: '양말용 양모 실' },
    fiber: 'wool',
    category: 'fine',
    thickness: 0.5,
    roughness: 0.6,
    elasticity: 0.6,
    fuzziness: 0.3,
    color: '#E0D0B8',
    recommendedNeedle: '2.5 - 3.5 mm',
    description: { 'zh-CN': '耐用羊毛，适合编织袜子', 'zh-TW': '耐用羊毛，適合編織襪子', en: 'Durable wool for socks', ja: '靴下編みに適した丈夫なウール糸', ko: '양말 뜨개질에 적합한 튼튼한 양모 실' },
  },
  {
    id: 'wool-dk',
    name: { 'zh-CN': '双股羊毛', 'zh-TW': '雙股羊毛', en: 'Wool DK', ja: 'DKウール', ko: 'DK 양모 실' },
    fiber: 'wool',
    category: 'light',
    thickness: 0.65,
    roughness: 0.7,
    elasticity: 0.7,
    fuzziness: 0.4,
    color: '#D2B48C',
    recommendedHook: '4 - 5 mm',
    description: { 'zh-CN': '经典双股粗细羊毛', 'zh-TW': '經典雙股粗細羊毛', en: 'Classic DK weight wool', ja: '定番のDK太さのウール糸', ko: '클래식한 DK 굵기의 양모 실' },
  },
  {
    id: 'wool-worsted',
    name: { 'zh-CN': '中粗羊毛', 'zh-TW': '中粗羊毛', en: 'Wool Worsted', ja: '並太ウール', ko: '중간 굵기 양모 실' },
    fiber: 'wool',
    category: 'medium',
    thickness: 0.75,
    roughness: 0.75,
    elasticity: 0.7,
    fuzziness: 0.5,
    color: '#C4A87C',
    recommendedHook: '5 - 6.5 mm',
    description: { 'zh-CN': '最受欢迎的中等粗细羊毛', 'zh-TW': '最受歡迎的中等粗細羊毛', en: 'Most popular wool weight', ja: '最も人気のある並太ウール糸', ko: '가장 인기 있는 중간 굵기 양모 실' },
  },
  {
    id: 'wool-chunky',
    name: { 'zh-CN': '粗羊毛', 'zh-TW': '粗羊毛', en: 'Wool Chunky', ja: '極太ウール', ko: '굵은 양모 실' },
    fiber: 'wool',
    category: 'bulky',
    thickness: 0.9,
    roughness: 0.8,
    elasticity: 0.75,
    fuzziness: 0.6,
    color: '#B8956E',
    recommendedHook: '8 - 10 mm',
    description: { 'zh-CN': '粗羊毛，适合毛毯和围巾', 'zh-TW': '粗羊毛，適合毛毯和圍巾', en: 'Thick wool for cozy blankets', ja: 'ブランケットやマフラーに適した太いウール糸', ko: '담요와 머플러에 적합한 굵은 양모 실' },
  },
  {
    id: 'acrylic-baby',
    name: { 'zh-CN': '宝宝腈纶线', 'zh-TW': '寶寶腈綸線', en: 'Acrylic Baby', ja: 'ベビーアクリル', ko: '베이비 아크릴 실' },
    fiber: 'acrylic',
    category: 'fine',
    thickness: 0.5,
    roughness: 0.3,
    elasticity: 0.4,
    fuzziness: 0.2,
    color: '#FFE4E1',
    recommendedHook: '3 - 4 mm',
    description: { 'zh-CN': '超柔软腈纶，适合宝宝用品', 'zh-TW': '超柔軟腈綸，適合寶寶用品', en: 'Super soft acrylic for baby items', ja: 'ベビー用品に適した超柔らかいアクリル糸', ko: '아기 용품에 적합한 초부드러운 아크릴 실' },
  },
  {
    id: 'acrylic-medium',
    name: { 'zh-CN': '腈纶线', 'zh-TW': '腈綸線', en: 'Acrylic Medium', ja: 'アクリル並太', ko: '아크릴 중간 굵기' },
    fiber: 'acrylic',
    category: 'medium',
    thickness: 0.7,
    roughness: 0.4,
    elasticity: 0.5,
    fuzziness: 0.3,
    color: '#FF6B6B',
    recommendedHook: '4.5 - 6 mm',
    description: { 'zh-CN': '经济实惠，可机洗', 'zh-TW': '經濟實惠，可機洗', en: 'Affordable and washable', ja: '手頃で洗濯機で洗えるアクリル糸', ko: '가격이 저렴하고 세탁기로 빨 수 있는 아크릴 실' },
  },
  {
    id: 'acrylic-chunky',
    name: { 'zh-CN': '粗腈纶线', 'zh-TW': '粗腈綸線', en: 'Acrylic Chunky', ja: '極太アクリル', ko: '굵은 아크릴 실' },
    fiber: 'acrylic',
    category: 'bulky',
    thickness: 0.88,
    roughness: 0.45,
    elasticity: 0.55,
    fuzziness: 0.35,
    color: '#FF8C8C',
    recommendedHook: '8 - 12 mm',
    description: { 'zh-CN': '粗腈纶，快速编织项目', 'zh-TW': '粗腈綸，快速編織項目', en: 'Thick acrylic for quick projects', ja: '早く編める太いアクリル糸', ko: '빨리 뜰 수 있는 굵은 아크릴 실' },
  },
  {
    id: 'linen-yarn',
    name: { 'zh-CN': '亚麻线', 'zh-TW': '亞麻線', en: 'Linen Yarn', ja: 'リネン糸', ko: '린넨 실' },
    fiber: 'linen',
    category: 'fine',
    thickness: 0.55,
    roughness: 0.85,
    elasticity: 0.05,
    fuzziness: 0.0,
    color: '#F0E6D2',
    recommendedHook: '3 - 4 mm',
    description: { 'zh-CN': '清凉挺括，适合夏季', 'zh-TW': '清涼挺括，適合夏季', en: 'Cool and crisp, perfect for summer', ja: '清涼感があり夏にぴったりのリネン糸', ko: '시원하고 깔끔해서 여름에 제격인 린넨 실' },
  },
  {
    id: 'silk-yarn',
    name: { 'zh-CN': '真丝线', 'zh-TW': '真絲線', en: 'Silk Yarn', ja: 'シルク糸', ko: '실크 실' },
    fiber: 'silk',
    category: 'fine',
    thickness: 0.4,
    roughness: 0.15,
    elasticity: 0.1,
    fuzziness: 0.0,
    color: '#FFFACD',
    recommendedHook: '2.5 - 3.5 mm',
    description: { 'zh-CN': '奢华光泽的真丝', 'zh-TW': '奢華光澤的真絲', en: 'Luxurious shiny silk', ja: '高級感のある光沢のシルク糸', ko: '고급스러운 광택의 실크 실' },
  },
  {
    id: 'mohair-yarn',
    name: { 'zh-CN': '马海毛', 'zh-TW': '馬海毛', en: 'Mohair', ja: 'モヘア', ko: '모헤어' },
    fiber: 'mohair',
    category: 'superFine',
    thickness: 0.45,
    roughness: 0.65,
    elasticity: 0.3,
    fuzziness: 0.9,
    color: '#F5F5DC',
    recommendedHook: '4 - 6 mm',
    description: { 'zh-CN': '蓬松温暖，有绒毛光晕', 'zh-TW': '蓬鬆溫暖，有絨毛暈光', en: 'Fluffy and warm with halo', ja: 'ふわふわで暖かく、毛並みの輝きがあるモヘア', ko: '폭신폭신하고 따뜻하며 털빛이 아름다운 모헤어' },
  },
  {
    id: 'cashmere-yarn',
    name: { 'zh-CN': '羊绒线', 'zh-TW': '羊絨線', en: 'Cashmere', ja: 'カシミヤ', ko: '캐시미어' },
    fiber: 'cashmere',
    category: 'fine',
    thickness: 0.5,
    roughness: 0.2,
    elasticity: 0.5,
    fuzziness: 0.4,
    color: '#E8DCC8',
    recommendedHook: '3 - 4 mm',
    description: { 'zh-CN': '极致柔软的奢华纤维', 'zh-TW': '極致柔軟的奢華纖維', en: 'Ultra soft luxury fiber', ja: '極上の肌触りの高級繊維カシミヤ', ko: '극상의 부드러움을 자랑하는 고급 섬유 캐시미어' },
  },
  {
    id: 'modal-yarn',
    name: { 'zh-CN': '莫代尔线', 'zh-TW': '莫代爾線', en: 'Modal', ja: 'モーダル', ko: '모달' },
    fiber: 'modal',
    category: 'fine',
    thickness: 0.45,
    roughness: 0.25,
    elasticity: 0.15,
    fuzziness: 0.05,
    color: '#F0F8FF',
    recommendedHook: '3 - 4 mm',
    description: { 'zh-CN': '丝滑柔软的植物纤维', 'zh-TW': '絲滑柔軟的植物纖維', en: 'Silky soft plant fiber', ja: 'シルクのように柔らかい植物繊維', ko: '실크처럼 부드러운 식물성 섬유' },
  },
  {
    id: 'bamboo-yarn',
    name: { 'zh-CN': '竹纤维线', 'zh-TW': '竹纖維線', en: 'Bamboo Yarn', ja: 'バンブー糸', ko: '대나무 섬유 실' },
    fiber: 'bamboo',
    category: 'fine',
    thickness: 0.48,
    roughness: 0.3,
    elasticity: 0.12,
    fuzziness: 0.05,
    color: '#E8F5E9',
    recommendedHook: '3 - 4 mm',
    description: { 'zh-CN': '清凉环保的竹纤维', 'zh-TW': '清涼環保的竹纖維', en: 'Cool and eco-friendly bamboo fiber', ja: '清涼感があり環境に優しい竹繊維', ko: '시원하고 친환경적인 대나무 섬유' },
  },
  {
    id: 'nylon-yarn',
    name: { 'zh-CN': '尼龙混纺', 'zh-TW': '尼龍混紡', en: 'Nylon Blend', ja: 'ナイロンブレンド', ko: '나일론 혼방' },
    fiber: 'nylon',
    category: 'fine',
    thickness: 0.4,
    roughness: 0.35,
    elasticity: 0.8,
    fuzziness: 0.1,
    color: '#E6E6FA',
    recommendedHook: '2.5 - 3.5 mm',
    description: { 'zh-CN': '强韧有弹性，增加耐用性', 'zh-TW': '強韌有彈性，增加耐用性', en: 'Strong and stretchy', ja: '丈夫で伸縮性があり、耐久性がアップ', ko: '튼튼하고 신축성이 있어 내구성이 향상됨' },
  },
  {
    id: 'wool-silk-blend',
    name: { 'zh-CN': '丝羊毛混纺', 'zh-TW': '絲羊毛混紡', en: 'Wool Silk Blend', ja: 'ウールシルクブレンド', ko: '양모 실크 혼방' },
    fiber: 'blend',
    category: 'fine',
    thickness: 0.52,
    roughness: 0.45,
    elasticity: 0.5,
    fuzziness: 0.25,
    color: '#FDF5E6',
    recommendedHook: '3.5 - 4.5 mm',
    description: { 'zh-CN': '羊毛的温暖+真丝的光泽', 'zh-TW': '羊毛的溫暖+真絲的光澤', en: 'Warm wool with silk sheen', ja: 'ウールの暖かさとシルクの光沢を併せ持つ', ko: '양모의 따뜻함과 실크의 광택을 함께 가짐' },
  },
  {
    id: 'tshirt-yarn',
    name: { 'zh-CN': 'T恤线', 'zh-TW': 'T恤線', en: 'T-shirt Yarn', ja: 'Tシャツヤーン', ko: '티셔츠 얀' },
    fiber: 'tshirt',
    category: 'superBulky',
    thickness: 0.95,
    roughness: 0.7,
    elasticity: 0.3,
    fuzziness: 0.0,
    color: '#FFB6C1',
    recommendedHook: '8 - 15 mm',
    description: { 'zh-CN': '宽扁纱线，适合包包地毯', 'zh-TW': '寬扁紗線，適合包包地毯', en: 'Wide flat yarn, great for bags', ja: '幅広で平らな糸、バッグやラグに最適', ko: '납작하고 넓은 실, 가방과 러그에 최적' },
  },
  {
    id: 'chenille-yarn',
    name: { 'zh-CN': '雪尼尔线', 'zh-TW': '雪尼爾線', en: 'Chenille Yarn', ja: 'シェニール糸', ko: '셔닐 실' },
    fiber: 'chenille',
    category: 'medium',
    thickness: 0.75,
    roughness: 0.3,
    elasticity: 0.25,
    fuzziness: 0.7,
    color: '#DDA0DD',
    recommendedHook: '5 - 7 mm',
    description: { 'zh-CN': '天鹅绒般柔软，毛绒质感', 'zh-TW': '天鵝絨般柔軟，毛絨質感', en: 'Velvety soft with plush texture', ja: 'ベルベットのように柔らかく、ふわふわした質感', ko: '벨벳처럼 부드럽고 폭신폭신한 질감' },
  },
  {
    id: 'baby-wool',
    name: { 'zh-CN': '宝宝羊毛', 'zh-TW': '寶寶羊毛', en: 'Baby Wool', ja: 'ベビーウール', ko: '베이비 양모 실' },
    fiber: 'blend',
    category: 'superFine',
    thickness: 0.35,
    roughness: 0.2,
    elasticity: 0.45,
    fuzziness: 0.2,
    color: '#FFFAF0',
    recommendedHook: '2.5 - 3.5 mm',
    description: { 'zh-CN': '超细柔软，适合宝宝', 'zh-TW': '超細柔軟，適合寶寶', en: 'Extra fine and gentle for babies', ja: '極細で柔らかく、赤ちゃんにも安心', ko: '아주 가늘고 부드러워 아기에게도 안심' },
  },
];

export const STITCH_NAMES: Record<StitchType, { 'zh-CN': string; 'zh-TW': string; en: string; ja: string; ko: string }> = STITCH_LIBRARY.reduce(
  (acc, stitch) => {
    acc[stitch.id] = stitch.name;
    return acc;
  },
  {} as Record<StitchType, { 'zh-CN': string; 'zh-TW': string; en: string; ja: string; ko: string }>
);

export const DEFAULT_MATERIALS = YARN_LIBRARY;
