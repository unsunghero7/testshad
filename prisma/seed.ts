import { PrismaClient, UserRole, OrderStatus, OrderType, PaymentMethod, PaymentStatus, TransactionType, DiscountType } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItemAddon.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.address.deleteMany();
  await prisma.branchManager.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.location.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.restaurantAdmin.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.systemSettings.deleteMany();
  await prisma.contentPage.deleteMany();

  // Create users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@example.com',
      password: await hash('password123', 10),
      role: UserRole.SUPER_ADMIN,
    },
  });

  const restaurantAdmin1 = await prisma.user.create({
    data: {
      email: 'restaurantadmin1@example.com',
      password: await hash('password123', 10),
      role: UserRole.RESTAURANT_ADMIN,
    },
  });

  const restaurantAdmin2 = await prisma.user.create({
    data: {
      email: 'restaurantadmin2@example.com',
      password: await hash('password123', 10),
      role: UserRole.RESTAURANT_ADMIN,
    },
  });

  const branchManager1 = await prisma.user.create({
    data: {
      email: 'branchmanager1@example.com',
      password: await hash('password123', 10),
      role: UserRole.BRANCH_MANAGER,
    },
  });

  const branchManager2 = await prisma.user.create({
    data: {
      email: 'branchmanager2@example.com',
      password: await hash('password123', 10),
      role: UserRole.BRANCH_MANAGER,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: await hash('password123', 10),
      role: UserRole.CUSTOMER,
    },
  });

  // Create locations
  const location1 = await prisma.location.create({
    data: {
      city: 'New York City',
      state: 'NY',
      country: 'USA',
    },
  });

  const location2 = await prisma.location.create({
    data: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    },
  });

  // Create restaurants
  const restaurant1 = await prisma.restaurant.create({
    data: {
      slug: 'tasty-bites',
      name: 'Tasty Bites',
      description: 'Delicious food for every taste',
      logo: 'https://example.com/tastybites-logo.png',
      contactEmail: 'contact@tastybites.com',
      contactPhone: '123-456-7890',
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      slug: 'gourmet-haven',
      name: 'Gourmet Haven',
      description: 'Exquisite dining experience',
      logo: 'https://example.com/gourmethaven-logo.png',
      contactEmail: 'info@gourmethaven.com',
      contactPhone: '098-765-4321',
    },
  });

  // Create restaurant admins
  await prisma.restaurantAdmin.create({
    data: {
      userId: restaurantAdmin1.id,
      restaurantId: restaurant1.id,
    },
  });

  await prisma.restaurantAdmin.create({
    data: {
      userId: restaurantAdmin2.id,
      restaurantId: restaurant2.id,
    },
  });

  // Create branches
  const branch1 = await prisma.branch.create({
    data: {
      restaurantId: restaurant1.id,
      locationId: location1.id,
      name: 'Tasty Bites Downtown',
      address: '123 Main St',
      postalCode: '10001',
      contactPhone: '555-123-4567',
      operatingHours: {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '21:00' },
      },
    },
  });

  const branch2 = await prisma.branch.create({
    data: {
      restaurantId: restaurant2.id,
      locationId: location2.id,
      name: 'Gourmet Haven Beverly Hills',
      address: '456 Rodeo Drive',
      postalCode: '90210',
      contactPhone: '555-987-6543',
      operatingHours: {
        monday: { open: '11:00', close: '23:00' },
        tuesday: { open: '11:00', close: '23:00' },
        wednesday: { open: '11:00', close: '23:00' },
        thursday: { open: '11:00', close: '23:00' },
        friday: { open: '11:00', close: '00:00' },
        saturday: { open: '11:00', close: '00:00' },
        sunday: { open: '12:00', close: '22:00' },
      },
    },
  });

  // Create branch managers
  await prisma.branchManager.create({
    data: {
      userId: branchManager1.id,
      branchId: branch1.id,
    },
  });

  await prisma.branchManager.create({
    data: {
      userId: branchManager2.id,
      branchId: branch2.id,
    },
  });

  // Create menu items for Tasty Bites
  const burger = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant1.id,
      name: 'Classic Burger',
      description: 'Juicy beef patty with fresh veggies',
      price: 9.99,
      category: 'Main Course',
      image: 'https://example.com/burger.jpg',
    },
  });

  const fries = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant1.id,
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 3.99,
      category: 'Sides',
      image: 'https://example.com/fries.jpg',
    },
  });

  // Create menu items for Gourmet Haven
  const steak = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant2.id,
      name: 'Filet Mignon',
      description: 'Prime cut steak with truffle sauce',
      price: 29.99,
      category: 'Main Course',
      image: 'https://example.com/steak.jpg',
    },
  });

  const salad = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant2.id,
      name: 'Gourmet Salad',
      description: 'Fresh greens with balsamic dressing',
      price: 8.99,
      category: 'Starters',
      image: 'https://example.com/salad.jpg',
    },
  });

  // Create addons
  const cheese = await prisma.addon.create({
    data: {
      restaurantId: restaurant1.id,
      name: 'Extra Cheese',
      price: 1.50,
    },
  });

  const bacon = await prisma.addon.create({
    data: {
      restaurantId: restaurant1.id,
      name: 'Bacon',
      price: 2.00,
    },
  });

  const lobsterTail = await prisma.addon.create({
    data: {
      restaurantId: restaurant2.id,
      name: 'Lobster Tail',
      price: 15.00,
    },
  });

  // Associate addons with menu items
  await prisma.menuItemAddon.createMany({
    data: [
      { menuItemId: burger.id, addonId: cheese.id },
      { menuItemId: burger.id, addonId: bacon.id },
      { menuItemId: steak.id, addonId: lobsterTail.id },
    ],
  });

  // Create customer
  const customerProfile = await prisma.customer.create({
    data: {
      userId: customer.id,
      name: 'John Doe',
      phoneNumber: '555-123-4567',
    },
  });

  // Create customer address
  await prisma.address.create({
    data: {
      customerId: customerProfile.id,
      street: '789 Elm St',
      city: 'New York City',
      state: 'NY',
      postalCode: '10001',
      isDefault: true,
    },
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      customerId: customerProfile.id,
      branchId: branch1.id,
      totalAmount: 13.98,
      status: OrderStatus.DELIVERED,
      type: OrderType.DELIVERY,
    },
  });

  // Create order items
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        menuItemId: burger.id,
        quantity: 1,
        price: 9.99,
        addons: JSON.stringify([{ id: cheese.id, name: 'Extra Cheese', price: 1.50 }]),
      },
      {
        orderId: order.id,
        menuItemId: fries.id,
        quantity: 1,
        price: 3.99,
      },
    ],
  });

  // Create payment
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: 13.98,
      method: PaymentMethod.CARD,
      status: PaymentStatus.COMPLETED,
      transactionId: 'txn_123456',
    },
  });

  // Create wallet
  const wallet = await prisma.wallet.create({
    data: {
      customerId: customerProfile.id,
      balance: 50.00,
    },
  });

  // Create wallet transaction
  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      amount: 50.00,
      type: TransactionType.CREDIT,
      description: 'Initial deposit',
    },
  });

  // Create reviews
  await prisma.review.createMany({
    data: [
      {
        customerId: customerProfile.id,
        restaurantId: restaurant1.id,
        rating: 5,
        comment: 'Great food and service!',
      },
      {
        customerId: customerProfile.id,
        restaurantId: restaurant2.id,
        rating: 4,
        comment: 'Excellent ambiance, slightly pricey.',
      },
    ],
  });

  // Create favorites
  await prisma.favorite.createMany({
    data: [
      {
        customerId: customerProfile.id,
        restaurantId: restaurant1.id,
      },
      {
        customerId: customerProfile.id,
        restaurantId: restaurant2.id,
      },
    ],
  });

  // Create promotions
  await prisma.promotion.createMany({
    data: [
      {
        restaurantId: restaurant1.id,
        title: 'Happy Hour Special',
        description: 'Get 20% off on all appetizers from 4 PM to 6 PM',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        isActive: true,
      },
      {
        restaurantId: restaurant2.id,
        title: 'Date Night Deal',
        description: 'Complimentary dessert with every two main courses',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        isActive: true,
      },
    ],
  });

  // Create coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minOrderAmount: 20,
        maxDiscountAmount: 5,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        isActive: true,
        usageLimit: 100,
        restaurantId: restaurant1.id,
      },
      {
        code: 'SUMMER2023',
        discountType: DiscountType.FIXED,
        discountValue: 5,
        minOrderAmount: 30,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        isActive: true,
        usageLimit: 200,
        restaurantId: restaurant2.id,
      },
    ],
  });

  // Create system settings
  await prisma.systemSettings.createMany({
    data: [
      {
        key: 'COMMISSION_RATE',
        value: JSON.stringify({ rate: 0.1 }),
      },
      {
        key: 'DEFAULT_CURRENCY',
        value: JSON.stringify({ currency: 'USD' }),
      },
      {
        key: 'MINIMUM_ORDER_AMOUNT',
        value: JSON.stringify({ amount: 10 }),
      },
    ],
  });
  
 // Create content pages
 await prisma.contentPage.createMany({
  data: [
    {
      title: 'About Us',
      slug: 'about-us',
      content: 'Welcome to our restaurant SaaS platform. We connect food lovers with their favorite local restaurants, providing an easy-to-use platform for online ordering and delivery.',
      isPublished: true,
    },
    {
      title: 'Terms of Service',
      slug: 'terms-of-service',
      content: 'Please read these terms of service carefully before using our platform. By accessing or using our service, you agree to be bound by these terms.',
      isPublished: true,
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: 'Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.',
      isPublished: true,
    },
    {
      title: 'FAQ',
      slug: 'faq',
      content: 'Find answers to frequently asked questions about our service, ordering process, and more.',
      isPublished: true,
    },
  ],
});

console.log('Seed data created successfully');
}

main()
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});