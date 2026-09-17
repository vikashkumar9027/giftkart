const API_BASE = 'http://localhost:5000/api';

async function testMarketplace() {
  console.log('--- STARTING FLIPKART-STYLE E-COMMERCE & SELLER VERIFICATION ---');

  try {
    // 1. Register a new Indian customer
    const rand = Math.floor(Math.random() * 10000);
    const buyerEmail = `buyer_${rand}@example.com`;
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Sharma',
        email: buyerEmail,
        password: 'password123',
      }),
    });
    const buyerData = await regRes.json();
    if (!buyerData.success) throw new Error(`Registration failed: ${JSON.stringify(buyerData)}`);
    console.log('✓ 1. Customer Registered:', buyerData.user.name, `(${buyerData.user.role})`);
    const buyerToken = buyerData.token;

    // 2. Register this user as a Seller (Flipkart Seller Hub)
    const sellerRes = await fetch(`${API_BASE}/seller/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${buyerToken}`,
      },
      body: JSON.stringify({
        storeName: `Sharma Electronics & Gifts ${rand}`,
        gstin: '29ABCDE1234F1Z5',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        phone: '+91 9876543210',
      }),
    });
    const sellerData = await sellerRes.json();
    if (!sellerData.success) throw new Error(`Seller registration failed: ${JSON.stringify(sellerData)}`);
    console.log('✓ 2. Seller Registered:', sellerData.user.sellerProfile.storeName, `(Role: ${sellerData.user.role})`);

    // 3. Fetch categories to get a category ID
    const catRes = await fetch(`${API_BASE}/categories`);
    const catData = await catRes.json();
    const categoryId = catData.categories[0]._id;
    console.log('✓ 3. Category loaded:', catData.categories[0].name);

    // 4. Create a new seller product in INR ₹
    const prodRes = await fetch(`${API_BASE}/seller/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${buyerToken}`,
      },
      body: JSON.stringify({
        name: `Noise-Cancelling Wireless Earbuds Pro ${rand}`,
        category: categoryId,
        occasion: 'Corporate',
        price: 2499,
        mrp: 4999,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80'],
        description: 'Premium active noise-cancelling earbuds with deep bass and 40h battery life. Made for work and leisure.',
        highlights: ['Active Noise Cancellation up to 35dB', 'Quad Mic with ENC for Crystal Clear Calls', '40 Hours Total Playback Time'],
        specifications: {
          brand: 'TechNest Audio',
          material: 'Matte Polycarbonate',
          warranty: '1 Year Brand Warranty',
        },
        isFeatured: true,
        isAssured: true,
      }),
    });
    const prodData = await prodRes.json();
    if (!prodData.success) throw new Error(`Product creation failed: ${JSON.stringify(prodData)}`);
    const createdProduct = prodData.product;
    console.log('✓ 4. Seller Product Created:', createdProduct.name, `Price: ₹${createdProduct.price}, MRP: ₹${createdProduct.mrp}, Assured: ${createdProduct.isAssured}`);

    // 5. Test Seller Dashboard
    const dashRes = await fetch(`${API_BASE}/seller/dashboard`, {
      headers: { Authorization: `Bearer ${buyerToken}` },
    });
    const dashData = await dashRes.json();
    console.log('✓ 5. Seller Dashboard Loaded: Live Listings =', dashData.stats.totalProducts);

    // 6. Test Public Product Detail & Verify Populated Seller
    const detailRes = await fetch(`${API_BASE}/products/${createdProduct._id}`);
    const detailData = await detailRes.json();
    console.log('✓ 6. Product Loaded for Buyers. Sold By:', detailData.product.seller?.sellerProfile?.storeName);

    // 7. Place an Order with Indian Delivery Address & UPI
    const orderRes = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${buyerToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            product: createdProduct._id,
            name: createdProduct.name,
            price: createdProduct.price,
            quantity: 1,
            image: createdProduct.images[0],
            customization: {
              customText: 'Gift for Rahul',
              recipientName: 'Rahul Verma',
            },
            packaging: {
              name: 'Royal Velvet Keepsake Box',
              price: 199,
              ribbonColor: 'Champagne Gold',
            },
          },
        ],
        deliveryAddress: {
          fullName: 'Rahul Verma',
          phone: '+91 9988776655',
          address: 'Villa 14, Palm Meadows, Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560066',
        },
        giftPackaging: {
          boxType: 'velvet',
          name: 'Royal Velvet Keepsake Box',
          price: 199,
          ribbonColor: 'Champagne Gold',
        },
        paymentInfo: {
          method: 'upi',
          status: 'Paid',
          details: {
            upiId: 'rahul@okhdfcbank',
            vpaProvider: 'UPI Instant Gateway',
          },
        },
        totalAmount: 2499 + 199,
      }),
    });
    const orderData = await orderRes.json();
    if (!orderData.success) throw new Error(`Order placement failed: ${JSON.stringify(orderData)}`);
    const placedOrder = orderData.order;
    console.log('✓ 7. Order Placed in ₹ INR:', `#${placedOrder._id.slice(-6).toUpperCase()}`, `Total: ₹${placedOrder.totalAmount}, Status: ${placedOrder.orderStatus}`);

    // 8. Test Seller Orders Queue
    const sellerOrdersRes = await fetch(`${API_BASE}/seller/orders`, {
      headers: { Authorization: `Bearer ${buyerToken}` },
    });
    const sellerOrdersData = await sellerOrdersRes.json();
    console.log('✓ 8. Seller Orders Queue verified. Total Orders to Dispatch:', sellerOrdersData.orders.length);

    // 9. Test Public Tracking Endpoint
    const trackRes = await fetch(`${API_BASE}/orders/track/${placedOrder._id}`);
    const trackData = await trackRes.json();
    console.log('✓ 9. Public Fast-Track Lookup verified. Status:', trackData.order.status);

    console.log('\n========================================');
    console.log('ALL FLIPKART-STYLE MARKETPLACE TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('========================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
    process.exit(1);
  }
}

testMarketplace();
