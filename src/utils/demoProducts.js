export const demoProducts = [
  {
    _id: "demo1",
    name: "Aurora Wireless Headphones",
    description: "Premium active noise-cancelling headphones with 40h battery, spatial audio and buttery-soft memory foam.",
    price: 199, originalPrice: 249,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
    category: "Electronics", brand: "Aurora", stock: 42, rating: 4.8, numReviews: 124, featured: true,
    reviews: [{ _id:'r1', name:'Alex M.', rating:5, comment:'Best headphones I have owned!', createdAt: new Date().toISOString()}]
  },
  {
    _id: "demo2",
    name: "Lumen 4K Smart Monitor 32\"",
    description: "32-inch 4K UHD IPS display with 144Hz, HDR600 and USB-C 90W power delivery.",
    price: 449, originalPrice: 599,
    images: ["https://images.unsplash.com/photo-1527443224157-c4a3942d3acf?w=800"],
    category: "Electronics", brand: "Lumen", stock: 18, rating: 4.6, numReviews: 89, featured: true, reviews:[]
  },
  {
    _id: "demo3",
    name: "NovaBook Air 14 - M2",
    description: "Ultra-light 14-inch laptop with M2-class chip, 16GB RAM, 512GB SSD.",
    price: 1199, originalPrice: 1399,
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"],
    category: "Electronics", brand: "Nova", stock: 10, rating: 4.9, numReviews: 210, featured: true, reviews:[]
  },
  {
    _id: "demo4",
    name: "Essential Oversized Hoodie",
    description: "Heavyweight 500GSM brushed French terry hoodie. Garment-dyed.",
    price: 89, originalPrice: 120,
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"],
    category: "Fashion", brand: "Essential", stock: 120, rating: 4.7, numReviews: 342, featured: true, reviews:[]
  },
  {
    _id: "demo5",
    name: "Trail Runner GTX - Moss",
    description: "Waterproof GORE-TEX trail runners with Vibram outsole.",
    price: 149, originalPrice: 189,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
    category: "Fashion", brand: "Trail", stock: 65, rating: 4.5, numReviews: 98, featured: false, reviews:[]
  },
  {
    _id: "demo6",
    name: "Aurelia Silk Shirt - Ivory",
    description: "100% mulberry silk shirt with mother-of-pearl buttons.",
    price: 129,
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"],
    category: "Fashion", brand: "Aurelia", stock: 30, rating: 4.6, numReviews: 54, featured: false, reviews:[]
  },
  {
    _id: "demo7",
    name: "Nook Ceramic Vase Set",
    description: "Set of 3 handmade ceramic vases in warm neutral glaze.",
    price: 79, originalPrice: 99,
    images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"],
    category: "Home & Living", brand: "Nook", stock: 50, rating: 4.8, numReviews: 67, featured: true, reviews:[]
  },
  {
    _id: "demo8",
    name: "Hearth Linen Duvet Cover",
    description: "Washed European flax linen duvet cover. Oeko-Tex certified.",
    price: 189,
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
    category: "Home & Living", brand: "Hearth", stock: 35, rating: 4.7, numReviews: 112, featured: false, reviews:[]
  },
  {
    _id: "demo9",
    name: "Moku Pour-Over Kettle",
    description: "Matte black gooseneck kettle with precision spout.",
    price: 59, originalPrice: 79,
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800"],
    category: "Home & Living", brand: "Moku", stock: 80, rating: 4.9, numReviews: 203, featured: true, reviews:[]
  },
  {
    _id: "demo10",
    name: "Bloom Vitamin C Serum",
    description: "15% vitamin C + hyaluronic acid serum. Brightens in 14 days.",
    price: 42, originalPrice: 58,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800"],
    category: "Beauty & Personal Care", brand: "Bloom", stock: 200, rating: 4.6, numReviews: 540, featured: true, reviews:[]
  },
  {
    _id: "demo11",
    name: "Oasis Scented Candle - Fig & Cedar",
    description: "Soy wax candle with fig, cedar and amber. 60-hour burn.",
    price: 34,
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800"],
    category: "Beauty & Personal Care", brand: "Oasis", stock: 150, rating: 4.8, numReviews: 88, featured: false, reviews:[]
  },
  {
    _id: "demo12",
    name: "Pure Gua Sha Stone - Rose Quartz",
    description: "Authentic rose quartz gua sha tool for lymphatic massage.",
    price: 28, originalPrice: 38,
    images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800"],
    category: "Beauty & Personal Care", brand: "Pure", stock: 300, rating: 4.5, numReviews: 76, featured: false, reviews:[]
  },
  {
    _id: "demo13",
    name: "Summit All-Weather Duffel 40L",
    description: "40L weatherproof duffel with padded straps.",
    price: 99, originalPrice: 129,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"],
    category: "Sports & Outdoors", brand: "Summit", stock: 70, rating: 4.7, numReviews: 45, featured: true, reviews:[]
  },
  {
    _id: "demo14",
    name: "Flex Yoga Mat - Sage",
    description: "6mm natural rubber yoga mat with alignment guides.",
    price: 69,
    images: ["https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800"],
    category: "Sports & Outdoors", brand: "Flex", stock: 90, rating: 4.8, numReviews: 130, featured: false, reviews:[]
  },
  {
    _id: "demo15",
    name: "Pulse Fitness Smartwatch",
    description: "AMOLED smartwatch with GPS, heart-rate, SpO2 and 12-day battery.",
    price: 179, originalPrice: 229,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
    category: "Sports & Outdoors", brand: "Pulse", stock: 55, rating: 4.4, numReviews: 210, featured: false, reviews:[]
  },
  {
    _id: "demo16",
    name: "Aether Minimal Desk Lamp",
    description: "Tunable LED lamp with wireless charging base.",
    price: 119,
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"],
    category: "Home & Living", brand: "Aether", stock: 40, rating: 4.9, numReviews: 31, featured: true, reviews:[]
  },
];
