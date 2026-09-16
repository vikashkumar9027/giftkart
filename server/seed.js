require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

    console.log('👤 Seeding users...');
    // We create admin and customer using User.create so bcrypt pre-save hook handles hashing
    const adminUser = await User.create({
      name: 'GiftNest Admin',
      email: 'admin@giftnest.com',
      password: 'Admin@12345',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'customer@giftnest.com',
      password: 'Customer@12345',
      role: 'customer',
    });

    console.log(`✅ Users created: Admin (${adminUser.email}), Customer (${customerUser.email})`);

    console.log('🏷️ Seeding categories...');
    const categoriesData = [
      {
        name: 'Birthday',
        slug: 'birthday',
        description: 'Vibrant celebration boxes, sweet surprises, and cheerful keepsakes for all ages.',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Anniversary',
        slug: 'anniversary',
        description: 'Romantic hampers, engraved keepsakes, and timeless tokens of devotion.',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Wedding',
        slug: 'wedding',
        description: 'Luxurious gift hampers, crystal champagne flutes, and elegant blessings for the newlyweds.',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Corporate',
        slug: 'corporate',
        description: 'Refined executive desk organizers, gourmet tea hampers, and client appreciation sets.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Festival',
        slug: 'festival',
        description: 'Traditional sweets, artisanal candles, golden diya trays, and festive joy.',
        image: 'https://images.unsplash.com/photo-1576014131341-fe148657423b?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Personalised Gifts',
        slug: 'personalised-gifts',
        description: 'Customized wooden photo plaques, embossed leather journals, and monogrammed treasures.',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log(`✅ ${createdCategories.length} Categories created.`);

    console.log('🎁 Seeding products...');
    const productsData = [
      {
        name: 'Artisan Birthday Celebration Hamper',
        category: categoryMap['birthday'],
        price: 49.99,
        description: 'A delight-filled birthday crate featuring gourmet dark chocolate truffles, a hand-poured vanilla bean celebratory candle, festive organic party confetti, and an artisan greeting card.',
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Birthday',
        isFeatured: true,
      },
      {
        name: 'Pastel Confetti Joy Box',
        category: categoryMap['birthday'],
        price: 34.50,
        description: 'Brighten their special milestone with this pastel treat hamper complete with sparkling raspberry soda, artisan butter cookies, and an iridescent birthday mug.',
        stock: 18,
        images: [
          'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Birthday',
        isFeatured: false,
      },
      {
        name: 'Everlasting Rose & Crystal Keepsake',
        category: categoryMap['anniversary'],
        price: 89.00,
        description: 'A genuine preserved Ecuadorian red rose encased in an architectural glass cloche that retains its pristine beauty for up to three years without water.',
        stock: 14,
        images: [
          'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Anniversary',
        isFeatured: true,
      },
      {
        name: 'Gilded Champagne & Caviar Treat Box',
        category: categoryMap['anniversary'],
        price: 119.50,
        description: 'Celebrate years of love with handblown 24k gold-rimmed champagne coupes paired with Belgian caramel truffles and a custom love note envelope.',
        stock: 9,
        images: [
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Anniversary',
        isFeatured: true,
      },
      {
        name: 'Royal Heritage Wedding Gift Chest',
        category: categoryMap['wedding'],
        price: 145.00,
        description: 'An heirloom keepsake wooden trunk holding scented silk pomanders, matching ceramic couple mugs, brass picture frame, and premium lavender blossom incense.',
        stock: 12,
        images: [
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Wedding',
        isFeatured: true,
      },
      {
        name: 'Handcrafted Mr. & Mrs. Marble Coaster Set',
        category: categoryMap['wedding'],
        price: 38.00,
        description: 'Set of 4 heavy white marble and brass inlay hexagonal drink coasters, hand-engraved with floral filigree to honor the newlywed couple.',
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Wedding',
        isFeatured: false,
      },
      {
        name: 'Executive Leather & Copper Desk Set',
        category: categoryMap['corporate'],
        price: 79.99,
        description: 'Sleek Italian full-grain leather desk pad, copper finish rollerball pen, wireless wooden charging valet, and a monogrammed notebook for discerning professionals.',
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Corporate',
        isFeatured: true,
      },
      {
        name: 'Artisan Single-Origin Coffee & Tumbler Crate',
        category: categoryMap['corporate'],
        price: 52.00,
        description: 'Gift productivity with freshly roasted Ethiopian Yirgacheffe beans, double-walled matte charcoal vacuum travel tumbler, and dark chocolate espresso beans.',
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Corporate',
        isFeatured: false,
      },
      {
        name: 'Golden Glow Diwali Diya & Dry Fruit Platter',
        category: categoryMap['festival'],
        price: 64.00,
        description: 'Ornate brass peacock diya lamps, hand-carved mango wood box filled with California almonds, roasted cashews, Turkish figs, and saffron cardamom sweets.',
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1576014131341-fe148657423b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1605197150428-2d8869c9b1b2?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Festival',
        isFeatured: true,
      },
      {
        name: 'Winter Spice Gourmet Holiday Collection',
        category: categoryMap['festival'],
        price: 58.50,
        description: 'Cozy holiday cheer with cinnamon clove spiced tea, gingerbread honey, hand-knitted woolen mug sweater, and roasted hazelnut brittle.',
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Festival',
        isFeatured: false,
      },
      {
        name: 'Custom Engraved Walnut Wood Photo Plaque',
        category: categoryMap['personalised-gifts'],
        price: 42.00,
        description: 'Natural solid walnut tabletop photo display engraved with your custom date and heartfelt message, finished with organic beeswax polish.',
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Personalised Gifts',
        isFeatured: true,
      },
      {
        name: 'Monogrammed Botanical Soy Candle Set',
        category: categoryMap['personalised-gifts'],
        price: 36.00,
        description: 'A duo of 100% soy wax candles featuring dried botanical petals and custom initial embossed metallic lids in Amber Woods and Bergamot Verbena.',
        stock: 28,
        images: [
          'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Personalised Gifts',
        isFeatured: false,
      },
      {
        name: 'Handmade Scented Bath & Spa Sanctuary Basket',
        category: categoryMap['birthday'],
        price: 68.00,
        description: 'Indulgent self-care with lavender dead sea bath salts, artisan cold-process honey soaps, plush organic waffle cotton washcloth, and soothing bath tea bags.',
        stock: 16,
        images: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Birthday',
        isFeatured: true,
      },
      {
        name: 'Midnight Luxe Sweet & Savory Gourmet Box',
        category: categoryMap['corporate'],
        price: 92.00,
        description: 'Smoked Spanish paprika almonds, aged gouda crisps, single-estate olive tapenade, and artisanal sea salt caramel disks packed in an embossed matte black gift box.',
        stock: 11,
        images: [
          'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
        ],
        occasion: 'Corporate',
        isFeatured: false,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`✅ ${createdProducts.length} Products created.`);

    console.log('🖼️ Seeding banners...');
    const bannersData = [
      {
        title: 'Unwrap Moments That Last Forever',
        subtitle: 'Handcrafted gift crates, bespoke keepsakes, and personalized surprises for every celebration.',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Shop All Gifts',
        buttonLink: '/shop',
        isActive: true,
      },
      {
        title: 'Curated Anniversary Tokens & Luxury Hampers',
        subtitle: 'Honor shared milestones with timeless elegance, preserved blooms, and golden memories.',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Explore Romance',
        buttonLink: '/shop?category=anniversary',
        isActive: true,
      },
      {
        title: 'Corporate Impressions Redefined',
        subtitle: 'Sophisticated executive gifts and festive recognition boxes customized for your team and clients.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Corporate Gifting',
        buttonLink: '/shop?category=corporate',
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
        title: 'Golden Ribbon Celebrations',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        category: 'Birthday',
        isActive: true,
      },
      {
        title: 'Preserved Bloom Artistry',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
        category: 'Anniversary',
        isActive: true,
      },
      {
        title: 'Bespoke Newlywed Sets',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        category: 'Wedding',
        isActive: true,
      },
      {
        title: 'Festival of Lights Special',
        image: 'https://images.unsplash.com/photo-1576014131341-fe148657423b?auto=format&fit=crop&w=800&q=80',
        category: 'Festival',
        isActive: true,
      },
      {
        title: 'Artisan Spa & Botanicals',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        category: 'Wellness',
        isActive: true,
      },
    ];

    const createdGallery = await Gallery.insertMany(galleryData);
    console.log(`✅ ${createdGallery.length} Gallery items created.`);

    console.log('📦 Seeding sample initial order...');
    const sampleOrder = await Order.create({
      user: customerUser._id,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          price: createdProducts[0].price,
          quantity: 1,
          image: createdProducts[0].images[0],
        },
        {
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          price: createdProducts[2].price,
          quantity: 1,
          image: createdProducts[2].images[0],
        },
      ],
      deliveryAddress: {
        fullName: 'Sarah Jenkins',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace, Suite 104',
        city: 'Springfield',
        state: 'Oregon',
        pincode: '97477',
      },
      giftMessage: 'Happy Birthday to my dearest sister! Wishing you a magnificent year filled with love and wonder.',
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      totalAmount: createdProducts[0].price + createdProducts[2].price,
      status: 'Confirmed',
    });

    console.log(`✅ 1 Sample Order created: ID ${sampleOrder._id}`);
    console.log('\n🎉 GiftNest Database successfully seeded with rich demo data!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
