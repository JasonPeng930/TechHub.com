/* =========================================================
   TechHub 商店設定檔
   ========================================================= */

const STORE_CONFIG = {
  brand: {
    nameEn: 'TechHub',
    nameZh: '電腦硬件專門店',
    slogan: '砌出你的專屬電腦',
    subtitle: '頂級硬件 · 專業組裝 · 一年保養',
    foundedYear: 2018,
    description: '由一群熱愛 DIY 砌機的工程師創立，堅持只售原廠正貨。',
  },
  contact: {
    email: 'support@techhub.hk',
    phone: '+852 2345 6789',
    address: '香港九龍電腦廣場 8 樓 801 室',
    hours: '星期一至日 10:00 – 21:00',
  },
  rules: {
    freeShippingThreshold: 500,
    shippingFee: 50,
    freeAssemblyThreshold: 3000,
    maxQuantityPerItem: 99,
  },
  stats: {
    customers: '20,000+',
    brands: '50+',
    yearlyBuilds: '3,500+',
    satisfaction: '98%',
  },
  footer: {
    copyrightYear: 2025,
  },
};

const PRODUCTS = [
  { id: 'gpu-4070',    name: 'RTX 4070 顯示卡',      price: 4880, spec: '12GB GDDR6X · 三風扇散熱',   category: 'gpu',        categoryName: '顯示卡',     img: 'gpu.jpg',         brand: 'NVIDIA',   stock: 12, tags: ['熱門', '電競'] },
  { id: 'cpu-i7',      name: 'Intel Core i7 處理器', price: 3290, spec: '14 核心 · 5.4GHz 超頻',     category: 'cpu',        categoryName: '處理器',     img: 'cpu.jpg',         brand: 'Intel',    stock: 8,  tags: ['熱門', '高效能'] },
  { id: 'ram-ddr5-32', name: 'DDR5 32GB 記憶體',     price: 980,  spec: '6000MHz · RGB 燈效',         category: 'ram',        categoryName: '記憶體',     img: 'ram.jpg',         brand: 'Kingston', stock: 25, tags: ['RGB'] },
  { id: 'ssd-1tb',     name: '1TB NVMe SSD',         price: 620,  spec: 'PCIe 4.0 · 讀取 7000MB/s',  category: 'ssd',        categoryName: '固態硬碟',   img: 'ssd.jpg',         brand: 'Samsung',  stock: 30, tags: ['高速'] },
  { id: 'mb-atx',      name: 'ATX 主機板',           price: 1780, spec: 'DDR5 · PCIe 5.0 · Wi-Fi 6E', category: 'mb',         categoryName: '主機板',     img: 'motherboard.jpg', brand: 'ASUS',     stock: 15, tags: ['Wi-Fi 6E'] },
  { id: 'psu-850',     name: '850W 金牌電源',        price: 890,  spec: '80Plus 金牌 · 全模組',       category: 'psu',        categoryName: '電源供應器', img: 'psu.jpg',         brand: 'Corsair',  stock: 20, tags: ['金牌'] },
  { id: 'case-mid',    name: '中塔機箱',             price: 560,  spec: '玻璃側板 · 支援 360 水冷',   category: 'case',       categoryName: '機箱',       img: 'case.jpg',        brand: 'Lian Li',  stock: 18, tags: ['玻璃側板'] },
  { id: 'kb-mech',     name: '機械鍵盤',             price: 480,  spec: '熱插拔 · RGB 背光',          category: 'peripheral', categoryName: '週邊配件',   img: 'keyboard.jpg',    brand: 'Logitech', stock: 40, tags: ['RGB', '熱插拔'] },
];

