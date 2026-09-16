// Comprehensive automated test suite for GiftNest REST API
const testSuite = async () => {
  const baseURL = 'http://localhost:5000/api';
  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  };

  try {
    console.log('\n--- 1. Health & Server Check ---');
    const healthRes = await fetch(`${baseURL}/health`).then((r) => r.json());
    assert(healthRes.status === 'healthy', 'GET /api/health returns healthy status');

    console.log('\n--- 2. Public Catalog APIs ---');
    const catRes = await fetch(`${baseURL}/categories`).then((r) => r.json());
    assert(catRes.success && catRes.categories.length >= 6, 'GET /api/categories returns default categories');

    const prodRes = await fetch(`${baseURL}/products?limit=10`).then((r) => r.json());
    assert(prodRes.success && prodRes.products.length > 0, 'GET /api/products returns products');

    const searchRes = await fetch(`${baseURL}/products?search=chocolate`).then((r) => r.json());
    assert(searchRes.success, 'GET /api/products?search=chocolate executes successfully');

    const bannerRes = await fetch(`${baseURL}/banners`).then((r) => r.json());
    assert(bannerRes.success && bannerRes.banners.length > 0, 'GET /api/banners returns active banners');

    const galleryRes = await fetch(`${baseURL}/gallery`).then((r) => r.json());
    assert(galleryRes.success && galleryRes.gallery.length > 0, 'GET /api/gallery returns active gallery');

    console.log('\n--- 3. Customer Authentication & Profile ---');
    const testEmail = `testuser_${Date.now()}@giftnest.com`;
    const regRes = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Tester',
        email: testEmail,
        password: 'Password@123',
      }),
    }).then((r) => r.json());
    assert(regRes.success && !!regRes.token, 'POST /api/auth/register creates new customer & returns JWT');

    const customerToken = regRes.token;

    const meRes = await fetch(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    }).then((r) => r.json());
    assert(meRes.success && meRes.user.email === testEmail, 'GET /api/auth/me returns current user data');

    console.log('\n--- 4. Admin Authentication ---');
    const adminLoginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@giftnest.com',
        password: 'Admin@12345',
      }),
    }).then((r) => r.json());
    assert(adminLoginRes.success && adminLoginRes.user.role === 'admin', 'POST /api/auth/login logs in admin');

    const adminToken = adminLoginRes.token;

    console.log('\n--- 5. Security & RBAC Guard Tests ---');
    const unauthorizedAdminCall = await fetch(`${baseURL}/orders/dashboard/stats`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(unauthorizedAdminCall.status === 403, 'Customer calling admin route returns 403 Forbidden');

    const unauthenticatedCall = await fetch(`${baseURL}/orders/dashboard/stats`);
    assert(unauthenticatedCall.status === 401, 'Unauthenticated call returns 401 Unauthorized');

    console.log('\n--- 6. Customer Checkout & Order Creation ---');
    const testProduct = prodRes.products[0];
    const orderPayload = {
      items: [
        {
          product: testProduct._id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 1,
          image: testProduct.images[0],
        },
      ],
      deliveryAddress: {
        fullName: 'Jane Doe',
        phone: '+1 (555) 987-6543',
        address: '100 Sunset Blvd',
        city: 'Beverly Hills',
        state: 'CA',
        pincode: '90210',
      },
      giftMessage: 'Happy Graduation! So proud of you.',
      deliveryDate: new Date(Date.now() + 86400000).toISOString(),
    };

    const orderRes = await fetch(`${baseURL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(orderPayload),
    }).then((r) => r.json());
    assert(orderRes.success && !!orderRes.order._id, 'POST /api/orders creates order in MongoDB');

    const createdOrderId = orderRes.order._id;

    const myOrdersRes = await fetch(`${baseURL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    }).then((r) => r.json());
    assert(
      myOrdersRes.success && myOrdersRes.orders.some((o) => o._id === createdOrderId),
      'GET /api/orders/my-orders returns customer order'
    );

    console.log('\n--- 7. Admin Order Status Update & Dashboard Stats ---');
    const statusUpdateRes = await fetch(`${baseURL}/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'Shipped' }),
    }).then((r) => r.json());
    assert(
      statusUpdateRes.success && statusUpdateRes.order.status === 'Shipped',
      'PATCH /api/orders/:id/status updates status to "Shipped"'
    );

    const statsRes = await fetch(`${baseURL}/orders/dashboard/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(
      statsRes.success && statsRes.stats.totalOrders >= 2,
      'GET /api/orders/dashboard/stats returns real counts & metrics'
    );

    console.log('\n--- 8. Admin Product Creation & Management ---');
    const newProductRes = await fetch(`${baseURL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Artisan Test Keepsake Box',
        category: catRes.categories[0]._id,
        price: 29.99,
        stock: 15,
        description: 'Test gift description',
        images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'],
        occasion: 'Birthday',
        isFeatured: true,
      }),
    }).then((r) => r.json());
    assert(newProductRes.success && !!newProductRes.product._id, 'Admin POST /api/products creates product');

    // Clean up created test product
    if (newProductRes.product?._id) {
      await fetch(`${baseURL}/products/${newProductRes.product._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    }

    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal test execution error:', error);
    process.exit(1);
  }
};

testSuite();
