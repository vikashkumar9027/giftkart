const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {}
const mongoose = require('mongoose');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Banner = require('./models/Banner');
const Gallery = require('./models/Gallery');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/giftnest');
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Banner.deleteMany();
    await Gallery.deleteMany();

    console.log('👤 Seeding users (Admin, Customer, and Indian Sellers)...');
    const adminUser = await User.create({
      name: 'GiftNest Admin',
      email: 'admin@giftnest.com',
      password: 'Admin@12345',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'Aarav Sharma',
      email: 'customer@giftnest.com',
      password: 'Customer@12345',
      role: 'customer',
    });

    const sellerTech = await User.create({
      name: 'Rohan Verma',
      email: 'seller.tech@giftnest.com',
      password: 'Seller@12345',
      role: 'seller',
      sellerProfile: {
        storeName: 'TechNest India Retail',
        gstin: '29AABCT1332M1ZV',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        phone: '+91 98450 12345',
        rating: 4.8,
        isVerified: true,
      },
    });

    const sellerFashion = await User.create({
      name: 'Pooja Singhania',
      email: 'seller.fashion@giftnest.com',
      password: 'Seller@12345',
      role: 'seller',
      sellerProfile: {
        storeName: 'Royal Heritage Weaves',
        gstin: '08AAACR8821N1ZM',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        phone: '+91 94140 67890',
        rating: 4.9,
        isVerified: true,
      },
    });

    const sellerSweets = await User.create({
      name: 'Kishore Mithaiwala',
      email: 'seller.sweets@giftnest.com',
      password: 'Seller@12345',
      role: 'seller',
      sellerProfile: {
        storeName: 'Shree Anandam Gourmet Treats',
        gstin: '27AABCS9910K1ZT',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 98200 45678',
        rating: 4.7,
        isVerified: true,
      },
    });

    const sellerCrafts = await User.create({
      name: 'Vikramaditya Rao',
      email: 'seller.crafts@giftnest.com',
      password: 'Seller@12345',
      role: 'seller',
      sellerProfile: {
        storeName: 'Artisan Woodcrafts Delhi',
        gstin: '07AAACD4412L1ZQ',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '+91 98110 98765',
        rating: 4.9,
        isVerified: true,
      },
    });

    console.log(`✅ Users created: Admin, Buyer (Aarav), and 4 Indian Verified Sellers.`);

    console.log('🏷️ Seeding Flipkart-style Marketplace Categories...');
    const categoriesData = [
      {
        name: 'Mobiles & Electronics',
        slug: 'electronics',
        description: 'Smart wearables, Bluetooth audio, wireless earbuds, and cutting-edge tech gadgets.',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Fashion & Ethnic Wear',
        slug: 'fashion',
        description: 'Handloom sarees, festive designer kurtas, chronographs, and artisanal accessories.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Home Decor & Kitchen',
        slug: 'home-kitchen',
        description: 'Brass Diya sets, handcrafted ceramics, wall clocks, and modern living accessories.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Luxury Hampers & Sweets',
        slug: 'gifts-hampers',
        description: 'Festive mithai crates, Kashmiri dry fruit selections, and Belgian artisanal chocolates.',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Beauty & Personal Care',
        slug: 'beauty-grooming',
        description: 'Pure Ayurvedic wellness, artisanal soaps, luxury oud perfumes, and grooming kits.',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Personalised Keepsakes',
        slug: 'personalised-gifts',
        description: 'Custom name engraved wooden plaques, monogrammed leather wallets, and photo plaques.',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log(`✅ ${createdCategories.length} Categories created.`);

    console.log('🎁 Seeding realistic Indian products with Rupee (₹) pricing and MRP discounts...');
    const productsData = [
      // 1. Electronics
      {
        name: 'EchoBeat Pro Wireless ANC Earbuds (Titanium Black)',
        category: categoryMap['electronics'],
        seller: sellerTech._id,
        brand: 'EchoBeat Audio',
        price: 1899,
        mrp: 4999,
        rating: 4.5,
        ratingsCount: 2420,
        isAssured: true,
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Next-gen wireless earbuds featuring 32dB Active Noise Cancellation, Quad-mic ENC for crystal-clear calling, 40 hours total playtime with fast USB-C charge, and IPX5 splash resistance.',
        highlights: [
          '32 dB Hybrid Active Noise Cancellation',
          '40 Hours Mega Battery Life with Type-C Quick Charge',
          '13mm Titanium Drivers for Deep Bass',
          'NestAssured Quality Tested with 1 Year Warranty',
        ],
        specifications: {
          'Bluetooth Version': '5.3 Ultra-Low Latency',
          'Battery Life': '40 Hours Total',
          'Water Resistance': 'IPX5',
          'Warranty': '1 Year Brand Replacement',
        },
        occasion: 'General',
        isFeatured: true,
      },
      {
        name: 'AuraPulse 1.96" AMOLED Calling Smartwatch (Starlight Gold)',
        category: categoryMap['electronics'],
        seller: sellerTech._id,
        brand: 'AuraPulse',
        price: 2499,
        mrp: 6999,
        rating: 4.4,
        ratingsCount: 1830,
        isAssured: true,
        stock: 28,
        images: [
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Premium curved glass AMOLED display with Always-On screen, single-chip Bluetooth calling with high-clarity speaker, SpO2 & 24x7 Heart Rate monitoring, and 120+ sports tracking modes.',
        highlights: [
          '1.96 Inch Super Retina AMOLED Display (800 Nits)',
          'Crisp Bluetooth Calling with Dialpad & Phonebook Sync',
          'Comprehensive Health Suite: SpO2, Heart Rate, Sleep',
          'Metallic Alloy Casing with Comfortable Silicone Strap',
        ],
        specifications: {
          'Display': '1.96" AMOLED 410x502 Pixels',
          'Battery Backup': 'Up to 7 Days',
          'Sensors': 'Optical Heart Rate, SpO2, Accelerometer',
          'Water Proof': 'IP68 Swim-Proof',
        },
        occasion: 'Birthday',
        isFeatured: true,
      },
      {
        name: 'SonicBoom 24W Portable Bluetooth Speaker with RGB Bass Radiator',
        category: categoryMap['electronics'],
        seller: sellerTech._id,
        brand: 'SonicBoom',
        price: 1599,
        mrp: 3499,
        rating: 4.3,
        ratingsCount: 950,
        isAssured: true,
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Immersive 360-degree punchy stereo sound with dual passive bass radiators, dynamic rhythmic RGB ambient lighting, TWS stereo pairing, and 14 hours non-stop playtime.',
        highlights: [
          '24W RMS High-Decibel Output with Deep Bass',
          'Multi-Color Dynamic Ambient LED Light Modes',
          'TWS Feature to Pair Two Speakers Simultaneously',
          'Rugged Shockproof Design with Fabric Grille',
        ],
        occasion: 'General',
        isFeatured: false,
      },

      // 2. Fashion & Ethnic Wear
      {
        name: 'Banarasi Zari Woven Silk Saree with Unstitched Blouse (Royal Crimson)',
        category: categoryMap['fashion'],
        seller: sellerFashion._id,
        brand: 'Royal Heritage',
        price: 2899,
        mrp: 7999,
        rating: 4.7,
        ratingsCount: 1420,
        isAssured: true,
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Authentic Banarasi soft silk saree featuring opulent golden zari brocade floral motifs, heavy regal pallu border, and matching unstitched blouse fabric. Perfect for weddings, Diwali, and festive milestones.',
        highlights: [
          'Finely Woven Pure Soft Art Silk Fabric',
          'Intricate Floral Kalka Zari Weaving on Pallu',
          'Includes 0.8m Matching Heavy Blouse Piece',
          'Dry Clean Recommended for Lasting Radiance',
        ],
        specifications: {
          'Fabric': 'Art Silk with Gold Zari',
          'Saree Length': '5.5 Meters',
          'Blouse Length': '0.8 Meter',
          'Occasion': 'Wedding, Festive, Celebration',
        },
        occasion: 'Wedding',
        isFeatured: true,
      },
      {
        name: 'Men Handloom Embroidered Silk Kurta Churidar Set (Emerald Green)',
        category: categoryMap['fashion'],
        seller: sellerFashion._id,
        brand: 'Royal Heritage',
        price: 1999,
        mrp: 4499,
        rating: 4.6,
        ratingsCount: 810,
        isAssured: true,
        stock: 24,
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Tailored straight-fit ethnic silk blend kurta with delicate mandarin collar resham threadwork embroidery, paired with a matching comfortable cream churidar pyjama.',
        highlights: [
          'Rich Silk Blend Fabric with Luxurious Sheen',
          'Mandarin Collar with Thread Embroidery',
          'Complete 2-Piece Ethnic Ensemble',
        ],
        occasion: 'Festival',
        isFeatured: false,
      },
      {
        name: 'Regal Chronograph Stainless Steel Men Watch (Sapphire Blue)',
        category: categoryMap['fashion'],
        seller: sellerFashion._id,
        brand: 'Titanium Timepieces',
        price: 2199,
        mrp: 5999,
        rating: 4.6,
        ratingsCount: 1650,
        isAssured: true,
        stock: 19,
        images: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Precision Japanese quartz movement housed in surgical stainless steel casing, mineral crystal glass, date calendar window, and polished link strap.',
        highlights: [
          'Scratch-Resistant Mineral Crystal Glass',
          'Functional Multi-Dial Chronograph with Date',
          '3 ATM Water Resistant',
        ],
        occasion: 'Anniversary',
        isFeatured: true,
      },

      // 3. Home Decor & Kitchen
      {
        name: 'Handcrafted Brass Royal Peacock Diya Urli Set (Antique Gold)',
        category: categoryMap['home-kitchen'],
        seller: sellerCrafts._id,
        brand: 'Vedic Heritage',
        price: 1499,
        mrp: 3299,
        rating: 4.8,
        ratingsCount: 1280,
        isAssured: true,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Traditional solid brass floating flower and tealight Urli featuring hand-engraved peacock finials and an antique golden lacquer finish. Ideal for entrance pooja decor, Diwali, and housewarming gifts.',
        highlights: [
          '100% Solid Heavy-Gauge Brass Casting',
          'Peacock Motif Centerpiece with 5 Tealight Holders',
          'Tarnish-Resistant Protective Protective Clear Coat',
        ],
        occasion: 'Festival',
        isFeatured: true,
      },
      {
        name: 'Minimalist Scandinavian Silent Sweep Wooden Wall Clock (12-Inch)',
        category: categoryMap['home-kitchen'],
        seller: sellerCrafts._id,
        brand: 'Nordic Studio',
        price: 1199,
        mrp: 2499,
        rating: 4.5,
        ratingsCount: 640,
        isAssured: true,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Constructed from natural kiln-dried pine wood with laser-engraved 3D numerals and high-torque silent quartz mechanism with zero ticking noise.',
        highlights: [
          'Ultra-Silent Continuous Quartz Movement',
          'Natural Grain Pinewood Construction',
          'Modern Aesthetic for Living Rooms & Offices',
        ],
        occasion: 'Corporate',
        isFeatured: false,
      },
      {
        name: 'Ceramic Hand-Glazed Artisanal Coffee Mug Gift Set (Pack of 4)',
        category: categoryMap['home-kitchen'],
        seller: sellerCrafts._id,
        brand: 'Clay & Kiln',
        price: 899,
        mrp: 1799,
        rating: 4.4,
        ratingsCount: 520,
        isAssured: true,
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Stoneware matte glazed artisan ceramic mugs with ergonomic ear handles. Microwave and dishwasher safe, packaged in an eco-friendly gift box.',
        highlights: [
          'Lead-Free, Food-Grade Stoneware Ceramic',
          'Microwave, Oven & Dishwasher Safe',
          'Generous 350ml Beverage Capacity',
        ],
        occasion: 'Birthday',
        isFeatured: false,
      },

      // 4. Luxury Hampers & Sweets
      {
        name: 'Royal Kashmiri Dry Fruit & Saffron Festive Crate (1.2 kg)',
        category: categoryMap['gifts-hampers'],
        seller: sellerSweets._id,
        brand: 'Shree Anandam',
        price: 2499,
        mrp: 4999,
        rating: 4.9,
        ratingsCount: 3120,
        isAssured: true,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Exquisite wooden hamper box packed with jumbo California almonds, roasted W240 cashews, Afghan golden raisins, Turkish apricots, and 1g certified Kashmiri Mongra Saffron.',
        highlights: [
          'Handpicked Grade-A Dry Fruits in Reusable Glass Jars',
          '1g Certified 100% Pure Kashmiri Mongra Kesar included',
          'Presented in a Luxury Wooden Laser-Carved Keepsake Crate',
          'FSSAI Certified 100% Freshness Guarantee',
        ],
        occasion: 'Festival',
        isFeatured: true,
      },
      {
        name: 'Artisan Belgian Cocoa Truffles & Pralines Celebration Box (24 Pcs)',
        category: categoryMap['gifts-hampers'],
        seller: sellerSweets._id,
        brand: 'ChocoArtisan',
        price: 1299,
        mrp: 2299,
        rating: 4.7,
        ratingsCount: 1980,
        isAssured: true,
        stock: 38,
        images: [
          'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Assortment of handcrafted Belgian dark chocolate truffles, hazelnut pralines, sea-salt caramel domes, and almond crunches crafted with 70% single-origin cocoa.',
        highlights: [
          '70% Single-Origin Cocoa Butter Formulation',
          'No Artificial Preservatives or Vegetable Fat',
          'Temperature-Controlled Thermal Packaging with Gel Ice',
        ],
        occasion: 'Birthday',
        isFeatured: true,
      },
      {
        name: 'Heritage Golden Brass Tea Hamper with Darjeeling First Flush',
        category: categoryMap['gifts-hampers'],
        seller: sellerSweets._id,
        brand: 'TeaVana Heritage',
        price: 1899,
        mrp: 3999,
        rating: 4.6,
        ratingsCount: 760,
        isAssured: true,
        stock: 26,
        images: [
          'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Organic Darjeeling First Flush whole leaf tea paired with Kashmiri Kahwa spiced green tea, brass tea infuser strainer, and pure raw mountain forest honey jar.',
        highlights: [
          'Single Estate Darjeeling & Kashmiri Kahwa Blends',
          'Includes Hand-Engraved Pure Brass Tea Strainer',
          'Raw Untreated Organic Forest Honey Jar',
        ],
        occasion: 'Corporate',
        isFeatured: false,
      },

      // 5. Beauty & Personal Care
      {
        name: 'Kumkumadi & Sandalwood Luxury Ayurvedic Glow Ritual Kit',
        category: categoryMap['beauty-grooming'],
        seller: sellerSweets._id,
        brand: 'VedaPure Botanicals',
        price: 1699,
        mrp: 3599,
        rating: 4.7,
        ratingsCount: 2240,
        isAssured: true,
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Authentic Ayurvedic skincare regimen containing pure Kumkumadi Miraculous Beauty Fluid (15ml), Pure Mysore Sandalwood Ubtan, Rose Damascena Mist, and a Kansa Wand face massager.',
        highlights: [
          'Formulated with 24K Gold Dust & 16 Ayurvedic Herbs',
          '100% Chemical-Free, Sulphate & Paraben-Free',
          'Includes Ayurvedic Kansa Facial Sculpting Tool',
        ],
        occasion: 'Anniversary',
        isFeatured: true,
      },
      {
        name: 'Gentleman Regal Beard & Grooming Travel Trunk',
        category: categoryMap['beauty-grooming'],
        seller: sellerTech._id,
        brand: 'The Royal Gent',
        price: 1399,
        mrp: 2999,
        rating: 4.5,
        ratingsCount: 940,
        isAssured: true,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Everything the modern man needs: Cedarwood beard growth oil, sandalwood shaving cream, dual-sided teakwood comb, stainless steel trimming shears, and solid cologne.',
        highlights: [
          'Cedarwood & Jojoba Organic Conditioning Oils',
          'Anti-Static Hand-Cut Solid Sheesham Comb',
          'Vintage Leatherette Travel Vanity Trunk',
        ],
        occasion: 'General',
        isFeatured: false,
      },

      // 6. Personalised Keepsakes
      {
        name: 'Custom Engraved Solid Teakwood Photo Plaque (8x6 Inch)',
        category: categoryMap['personalised-gifts'],
        seller: sellerCrafts._id,
        brand: 'CraftNest Studio',
        price: 999,
        mrp: 2499,
        rating: 4.9,
        ratingsCount: 3420,
        isAssured: true,
        stock: 60,
        images: [
          'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Laser-etched high-definition photo on seasoned natural teakwood with custom heartfelt inscription. Features protective clear lacquer, table kickstand, and wall mount hook.',
        highlights: [
          'Precision HD Laser Photo Etching That Never Fades',
          'Solid Seasoned Kerala Teakwood Plaque',
          'Custom Name & Message Engraving Included',
        ],
        occasion: 'Personalised Gifts',
        isFeatured: true,
      },
      {
        name: 'Personalized Monogrammed Full-Grain Leather Wallet & Keychain Combo',
        category: categoryMap['personalised-gifts'],
        seller: sellerCrafts._id,
        brand: 'CraftNest Studio',
        price: 1199,
        mrp: 2799,
        rating: 4.8,
        ratingsCount: 1840,
        isAssured: true,
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Handcrafted full-grain oil-pull leather wallet with RFID anti-theft blocking shield, custom metallic foil name monogramming, and matching braided leather keychain.',
        highlights: [
          'Genuine Full-Grain Leather with Rich Patina Aging',
          'RFID Blocking Protection for Contactless Cards',
          'Personalised Golden Foil Embossed Name/Initials',
        ],
        occasion: 'Personalised Gifts',
        isFeatured: true,
      },
      {
        name: 'Custom Spotify Song Acrylic Music Plaque with Scannable Code & Wooden Stand',
        category: categoryMap['personalised-gifts'],
        seller: sellerCrafts._id,
        brand: 'CraftNest Studio',
        price: 799,
        mrp: 1899,
        rating: 4.6,
        ratingsCount: 2650,
        isAssured: true,
        stock: 55,
        images: [
          'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Crystal-clear acrylic glass plaque customized with your favorite couple photo, favorite song title, and high-contrast scannable Spotify code that plays instantly on mobile phones.',
        highlights: [
          'Shatter-Proof High Clarity 3mm Cast Acrylic Sheet',
          'UV Printed Vivid Photo & Instant Spotify Scan Code',
          'Includes Warm LED Illuminated Pinewood Stand',
        ],
        occasion: 'Anniversary',
        isFeatured: true,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`✅ ${createdProducts.length} Marketplace Products seeded in INR (₹)!`);

    console.log('🖼️ Seeding promotional banners...');
    const bannersData = [
      {
        title: 'The Great Indian Festive Gifting Fest',
        subtitle: 'Up to 70% Off on Curated Royal Hampers, Electronics & Personalised Keepsakes | Free Express Dispatch',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Shop Grand Deals',
        buttonLink: '/shop',
        isActive: true,
      },
      {
        title: 'Smart Tech & Wireless Audio Fest',
        subtitle: 'Noise-Cancelling Earbuds & AMOLED Smartwatches starting at just ₹1,599 with 1 Year Brand Warranty.',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Explore Gadgets',
        buttonLink: '/shop?category=electronics',
        isActive: true,
      },
      {
        title: 'Royal Heritage Silk Sarees & Ethnic Ensembles',
        subtitle: 'Handwoven Banarasi weaves and designer festive kurtas directly from master artisans in Jaipur & Varanasi.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Explore Fashion',
        buttonLink: '/shop?category=fashion',
        isActive: true,
      },
    ];

    const createdBanners = await Banner.insertMany(bannersData);
    console.log(`✅ ${createdBanners.length} Banners created.`);

    console.log('📸 Seeding gallery...');
    const galleryData = [
      {
        title: 'Handcrafted Packaging Perfection',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
        category: 'Packaging',
        isActive: true,
      },
      {
        title: 'Golden Festive Diya Celebrations',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        category: 'Festive',
        isActive: true,
      },
      {
        title: 'Luxury Velvet Jewelry Crate',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
        category: 'Keepsakes',
        isActive: true,
      },
      {
        title: 'Royal Silk Brocade Moments',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        category: 'Fashion',
        isActive: true,
      },
      {
        title: 'Gourmet Saffron & Dry Fruit Atelier',
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
        category: 'Gourmet',
        isActive: true,
      },
      {
        title: 'Ayurvedic Kumkumadi Botanical Spa',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        category: 'Wellness',
        isActive: true,
      },
    ];

    const createdGallery = await Gallery.insertMany(galleryData);
    console.log(`✅ ${createdGallery.length} Gallery items created.`);

    console.log('📦 Seeding Indian customer orders with Ekart, BlueDart & Delhivery tracking...');
    const sampleOrders = [
      {
        user: customerUser._id,
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            price: createdProducts[0].price,
            quantity: 1,
            image: createdProducts[0].images[0],
            customization: {
              recipientName: 'Aarav Sharma',
              customText: 'Aarav • Music For Life',
              occasionBadge: 'Birthday',
            },
          },
          {
            product: createdProducts[9]._id, // Dry fruits
            name: createdProducts[9].name,
            price: createdProducts[9].price,
            quantity: 1,
            image: createdProducts[9].images[0],
          },
        ],
        deliveryAddress: {
          fullName: 'Aarav Sharma',
          phone: '+91 98201 23456',
          address: 'Flat 402, Sea Breeze Heights, Worli Sea Face',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400018',
        },
        giftPackaging: {
          boxType: 'velvet_box',
          name: 'Royal Velvet Keepsake Box',
          price: 249,
          ribbonColor: 'Burgundy Silk',
        },
        greetingCard: {
          theme: 'Golden Celebration',
          message: 'Happy Birthday Bhai! May your year be filled with success, good health, and joyful tunes.',
          senderName: 'Neha & Kabir',
          fontStyle: 'cursive',
        },
        deliveryDetails: {
          carrierName: 'Ekart Logistics',
          trackingNumber: 'EKT-400018-9018',
          trackingUrl: 'https://ekartlogistics.com/shipmenttrack/EKT-400018-9018',
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          deliveryAgent: {
            name: 'Santosh Jadhav',
            phone: '+91 98209 88123',
            vehicleType: 'EV Two-Wheeler',
          },
          timeline: [
            {
              status: 'Confirmed',
              title: 'Order Placed & Confirmed',
              description: 'Payment verified via PhonePe UPI. Order sent to merchant for dispatch.',
              timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
              location: 'Mumbai Central Hub',
            },
            {
              status: 'Packed',
              title: 'Artisan Packaging Completed',
              description: 'Sealed in Royal Velvet Keepsake Box with Burgundy Silk ribbon.',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
              location: 'TechNest Fulfillment Station, Mumbai',
            },
            {
              status: 'Shipped',
              title: 'Dispatched via Ekart Express Priority',
              description: 'Package inducted into Ekart automated parcel sorting network.',
              timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
              location: 'Bhiwandi Superhub, Maharashtra',
            },
            {
              status: 'Shipped',
              title: 'In Transit — Arrived at Delivery Hub',
              description: 'Package arrived at Worli Delivery Center. Out for dispatch soon.',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
              location: 'Worli Delivery Facility, Mumbai',
            },
          ],
        },
        paymentInfo: {
          method: 'UPI',
          status: 'Paid',
          transactionId: 'TXN-UPI-982012',
          paidAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
          amountPaid: createdProducts[0].price + createdProducts[9].price + 249,
          details: { vpa: 'aarav@okaxis' },
        },
        giftMessage: 'Happy Birthday Bhai! May your year be filled with success, good health, and joyful tunes.',
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        totalAmount: createdProducts[0].price + createdProducts[9].price + 249,
        status: 'Shipped',
      },
      {
        user: customerUser._id,
        items: [
          {
            product: createdProducts[3]._id, // Silk Saree
            name: createdProducts[3].name,
            price: createdProducts[3].price,
            quantity: 1,
            image: createdProducts[3].images[0],
          },
        ],
        deliveryAddress: {
          fullName: 'Ananya Deshmukh',
          phone: '+91 97654 32109',
          address: 'B-12, Green Glen Layout, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103',
        },
        giftPackaging: {
          boxType: 'floral_wrap',
          name: 'Botanical Floral Wrap',
          price: 149,
          ribbonColor: 'Royal Gold',
        },
        greetingCard: {
          theme: 'Romantic Blossom',
          message: 'Happy Anniversary to my dearest wife. Thank you for making every day extraordinary.',
          senderName: 'Kunal Deshmukh',
          fontStyle: 'cursive',
        },
        deliveryDetails: {
          carrierName: 'BlueDart Express',
          trackingNumber: 'BLU-560103-2819',
          trackingUrl: 'https://www.bluedart.com/tracking?awb=BLU-560103-2819',
          estimatedDelivery: new Date(Date.now() - 4 * 60 * 60 * 1000),
          deliveryAgent: {
            name: 'Karthik Gowda',
            phone: '+91 99001 54321',
            vehicleType: 'Delivery Van',
          },
          timeline: [
            {
              status: 'Confirmed',
              title: 'Order Verified',
              description: 'Payment completed via Net Banking.',
              timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
              location: 'Bengaluru Gateway',
            },
            {
              status: 'Packed',
              title: 'Artisan Floral Wrap Applied',
              description: 'Wrapped with Royal Gold satin ribbon.',
              timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
              location: 'Royal Heritage Atelier, Jaipur',
            },
            {
              status: 'Shipped',
              title: 'Dispatched via BlueDart Air Express',
              description: 'Air cargo arrival at Kempegowda Airport Hub.',
              timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
              location: 'Bengaluru Cargo Hub',
            },
            {
              status: 'Delivered',
              title: 'Successfully Delivered & Signed',
              description: 'Delivered to Ananya Deshmukh with OTP verification.',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
              location: 'Bellandur, Bengaluru',
            },
          ],
        },
        paymentInfo: {
          method: 'Net Banking',
          status: 'Paid',
          transactionId: 'TXN-NET-773412',
          paidAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
          amountPaid: createdProducts[3].price + 149,
          details: { bank: 'HDFC Bank' },
        },
        deliveryDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
        totalAmount: createdProducts[3].price + 149,
        status: 'Delivered',
      },
      {
        user: customerUser._id,
        items: [
          {
            product: createdProducts[6]._id, // Brass Diya
            name: createdProducts[6].name,
            price: createdProducts[6].price,
            quantity: 1,
            image: createdProducts[6].images[0],
          },
          {
            product: createdProducts[14]._id, // Teakwood Plaque
            name: createdProducts[14].name,
            price: createdProducts[14].price,
            quantity: 1,
            image: createdProducts[14].images[0],
            customization: {
              recipientName: 'Mehra Family',
              customText: 'Shubh Labh • The Mehra Home 2026',
            },
          },
        ],
        deliveryAddress: {
          fullName: 'Priya Mehra',
          phone: '+91 98112 34567',
          address: '45 Golf Links, Near Lodhi Gardens',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110003',
        },
        giftPackaging: {
          boxType: 'wooden_crate',
          name: 'Rustic Wooden Keepsake Crate',
          price: 299,
          ribbonColor: 'Emerald Satin',
        },
        greetingCard: {
          theme: 'Festive Cheer',
          message: 'Warmest congratulations on your new home! May prosperity and light fill every corner.',
          senderName: 'Rohit & Shweta',
          fontStyle: 'handwriting',
        },
        deliveryDetails: {
          carrierName: 'Delhivery',
          trackingNumber: 'DEL-110003-4412',
          trackingUrl: 'https://www.delhivery.com/track/DEL-110003-4412',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          deliveryAgent: {
            name: 'Sunil Kumar',
            phone: '+91 98101 22334',
          },
          timeline: [
            {
              status: 'Confirmed',
              title: 'Order Confirmed',
              description: 'Customer order verified. Custom plaque laser engraving in queue.',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
              location: 'Delhi Studio',
            },
            {
              status: 'Packed',
              title: 'Custom Inscription Engraved & Crate Sealed',
              description: 'Brass Diya and engraved plaque packaged in Wooden Crate.',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              location: 'Artisan Workshop, Okhla Industrial Area',
            },
          ],
        },
        paymentInfo: {
          method: 'Credit Card',
          status: 'Paid',
          transactionId: 'TXN-CARD-881902',
          paidAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          amountPaid: createdProducts[6].price + createdProducts[14].price + 299,
          details: { cardLast4: '4012', brand: 'RuPay Platinum' },
        },
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        totalAmount: createdProducts[6].price + createdProducts[14].price + 299,
        status: 'Packed',
      },
      {
        user: customerUser._id,
        items: [
          {
            product: createdProducts[1]._id, // Smartwatch
            name: createdProducts[1].name,
            price: createdProducts[1].price,
            quantity: 1,
            image: createdProducts[1].images[0],
          },
        ],
        deliveryAddress: {
          fullName: 'Divya Nair',
          phone: '+91 94470 12345',
          address: '14 Panampilly Nagar, Near Central Park',
          city: 'Kochi',
          state: 'Kerala',
          pincode: '682036',
        },
        giftPackaging: {
          boxType: 'standard',
          name: 'Standard Eco Presentation Box',
          price: 0,
          ribbonColor: 'Midnight Silver',
        },
        deliveryDetails: {
          carrierName: 'India Post (Speed Post)',
          trackingNumber: 'INP-682036-1102',
          estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          timeline: [
            {
              status: 'Confirmed',
              title: 'Order Confirmed',
              description: 'Waiting for merchant dispatch allocation.',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
              location: 'Kochi Hub',
            },
          ],
        },
        paymentInfo: {
          method: 'Cash on Delivery',
          status: 'Pending',
        },
        deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        totalAmount: createdProducts[1].price,
        status: 'Confirmed',
      },
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ ${createdOrders.length} Indian Orders seeded with Ekart, BlueDart, Delhivery & India Post!`);

    console.log('\n🎉 GiftNest Marketplace successfully seeded with full Flipkart-style Indian Catalog & Sellers!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
