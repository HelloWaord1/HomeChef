import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create cooks
  const nino = await prisma.user.create({
    data: {
      email: "nino@homechef.com",
      name: "Nino Kapanadze",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&h=200&fit=crop&crop=face",
      bio: "Born and raised in Tbilisi, I bring the warmth of Georgian hospitality to every dish. My grandmother taught me the art of khinkali folding when I was seven. Every meal carries her spirit — generous, soulful, and always with wine nearby.",
      location: "New York, USA",
      cuisines: ["Georgian", "Mediterranean"],
      pricePerHour: 35,
      rating: 4.9,
      reviewCount: 127,
      verified: true,
    },
  });

  const marco = await prisma.user.create({
    data: {
      email: "marco@homechef.com",
      name: "Marco Rossi",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop&crop=face",
      bio: "Third-generation pasta maker from Naples. Former sous chef in Manhattan. I make fresh pasta daily using bronze dies and a 50-year-old technique. No shortcuts, no compromises, just pure Italian tradition.",
      location: "New York, USA",
      cuisines: ["Italian"],
      pricePerHour: 45,
      rating: 4.8,
      reviewCount: 203,
      verified: true,
    },
  });

  const yuki = await prisma.user.create({
    data: {
      email: "yuki@homechef.com",
      name: "Yuki Tanaka",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&crop=face",
      bio: "Trained at Tsukiji Market in Tokyo for eight years. I source the freshest fish daily and prepare every piece with the precision that washoku tradition demands. Omakase experiences a specialty.",
      location: "New York, USA",
      cuisines: ["Japanese"],
      pricePerHour: 60,
      rating: 4.9,
      reviewCount: 89,
      verified: true,
    },
  });

  const elena = await prisma.user.create({
    data: {
      email: "elena@homechef.com",
      name: "Elena Vargas",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
      bio: "From Oaxaca with love. I grew up grinding corn for tortillas and making mole with my abuela. My food is a celebration of Mexican tradition — bold, colorful, and made from locally sourced ingredients.",
      location: "Los Angeles, USA",
      cuisines: ["Mexican"],
      pricePerHour: 28,
      rating: 4.7,
      reviewCount: 156,
      verified: true,
    },
  });

  const priya = await prisma.user.create({
    data: {
      email: "priya@homechef.com",
      name: "Priya Sharma",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
      bio: "Learned to cook in my mother's kitchen in Jaipur. Vibrant Rajasthani and North Indian cuisine with spices ground fresh every morning. I specialize in large gatherings and celebrations.",
      location: "London, UK",
      cuisines: ["Indian"],
      pricePerHour: 30,
      rating: 4.8,
      reviewCount: 178,
      verified: true,
    },
  });

  const olga = await prisma.user.create({
    data: {
      email: "olga@homechef.com",
      name: "Olga Petrova",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&h=200&fit=crop&crop=face",
      bio: "From Moscow with soul. My babushka filled our kitchen with borscht and pirozhki aromas. Now I recreate those flavors — hearty, nourishing, and made with the same patience she taught me.",
      location: "Berlin, Germany",
      cuisines: ["Russian"],
      pricePerHour: 24,
      rating: 4.6,
      reviewCount: 94,
      verified: true,
    },
  });

  const somchai = await prisma.user.create({
    data: {
      email: "somchai@homechef.com",
      name: "Somchai Prasert",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&h=200&fit=crop&crop=face",
      bio: "Grew up in a floating market in Bangkok. My food is bold, balanced, and unapologetically Thai. Every curry paste pounded by hand in my granite mortar. I specialize in authentic street food experiences.",
      location: "London, UK",
      cuisines: ["Thai"],
      pricePerHour: 32,
      rating: 4.8,
      reviewCount: 112,
      verified: true,
    },
  });

  const layla = await prisma.user.create({
    data: {
      email: "layla@homechef.com",
      name: "Layla Khoury",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=200&h=200&fit=crop&crop=face",
      bio: "From my grandmother's kitchen in Beirut to yours. Mediterranean food the way it was meant to be — freshest ingredients, generous olive oil, recipes passed through four generations of Lebanese women.",
      location: "Dubai, UAE",
      cuisines: ["Mediterranean", "Lebanese"],
      pricePerHour: 40,
      rating: 4.9,
      reviewCount: 145,
      verified: true,
    },
  });

  const pierre = await prisma.user.create({
    data: {
      email: "pierre@homechef.com",
      name: "Pierre Dubois",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=face",
      bio: "Former sous chef at a Michelin-starred restaurant in Lyon. I left the professional kitchen to cook what I truly love — the rustic, honest food of the French countryside. Cassoulet, coq au vin, tarte tatin.",
      location: "Paris, France",
      cuisines: ["French"],
      pricePerHour: 50,
      rating: 4.7,
      reviewCount: 67,
      verified: false,
    },
  });

  const minjun = await prisma.user.create({
    data: {
      email: "minjun@homechef.com",
      name: "Min-jun Park",
      password: hashedPassword,
      role: "COOK",
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200&h=200&fit=crop&crop=face",
      bio: "Seoul native and fermentation obsessive. All my kimchi, gochujang, doenjang — made from scratch. Korean food is about depth, balance, and the magic of time. I specialize in Korean BBQ experiences.",
      location: "Tokyo, Japan",
      cuisines: ["Korean"],
      pricePerHour: 35,
      rating: 4.8,
      reviewCount: 98,
      verified: true,
    },
  });

  // Create some customer users
  const customer1 = await prisma.user.create({
    data: {
      email: "sarah@example.com",
      name: "Sarah Mitchell",
      password: hashedPassword,
      role: "CUSTOMER",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      location: "New York, USA",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "david@example.com",
      name: "David Kim",
      password: hashedPassword,
      role: "CUSTOMER",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      location: "New York, USA",
    },
  });

  // Create dishes
  // Nino's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Khinkali (10 pcs)",
        description: "Hand-folded Georgian dumplings filled with spiced beef and pork. Each one twisted with exactly 28 pleats.",
        price: 16,
        cuisine: "Georgian",
        category: "Main",
        image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&h=400&fit=crop",
        preparationTime: 45,
        servingSize: 2,
        ingredients: ["Beef", "Pork", "Flour", "Onion", "Cilantro", "Black pepper"],
        allergens: ["Gluten"],
        cookId: nino.id,
      },
      {
        name: "Khachapuri Adjaruli",
        description: "Boat-shaped bread filled with melted Georgian cheese, topped with a runny egg and butter.",
        price: 14,
        cuisine: "Georgian",
        category: "Main",
        image: "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=600&h=400&fit=crop",
        preparationTime: 35,
        servingSize: 2,
        ingredients: ["Flour", "Georgian cheese", "Egg", "Butter"],
        allergens: ["Gluten", "Dairy", "Eggs"],
        cookId: nino.id,
      },
      {
        name: "Pkhali Platter",
        description: "Trio of walnut-herb pastes — spinach, beet, and green bean — garnished with pomegranate seeds.",
        price: 12,
        cuisine: "Georgian",
        category: "Appetizer",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
        preparationTime: 30,
        servingSize: 4,
        ingredients: ["Spinach", "Beet", "Green beans", "Walnuts", "Pomegranate"],
        allergens: ["Tree Nuts"],
        cookId: nino.id,
      },
    ],
  });

  // Marco's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Cacio e Pepe",
        description: "Fresh tonnarelli in silky Pecorino Romano and cracked black pepper sauce.",
        price: 18,
        cuisine: "Italian",
        category: "Main",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop",
        preparationTime: 25,
        servingSize: 2,
        ingredients: ["Tonnarelli pasta", "Pecorino Romano", "Black pepper"],
        allergens: ["Gluten", "Dairy"],
        cookId: marco.id,
      },
      {
        name: "Fresh Ravioli with Ricotta & Sage",
        description: "Handmade ravioli filled with ricotta and lemon zest, in brown butter with crispy sage.",
        price: 22,
        cuisine: "Italian",
        category: "Main",
        image: "https://images.unsplash.com/photo-1587740908075-9e245070dfaa?w=600&h=400&fit=crop",
        preparationTime: 60,
        servingSize: 2,
        ingredients: ["Flour", "Ricotta", "Lemon", "Butter", "Sage"],
        allergens: ["Gluten", "Dairy"],
        cookId: marco.id,
      },
      {
        name: "Tiramisu",
        description: "Classic tiramisu with mascarpone, espresso-soaked ladyfingers, and cocoa. Made fresh daily.",
        price: 10,
        cuisine: "Italian",
        category: "Dessert",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
        preparationTime: 20,
        servingSize: 2,
        ingredients: ["Mascarpone", "Espresso", "Ladyfingers", "Cocoa"],
        allergens: ["Gluten", "Dairy", "Eggs"],
        cookId: marco.id,
      },
    ],
  });

  // Yuki's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Omakase Box (12 pcs)",
        description: "Chef's choice nigiri selection with seasonal fish, pickled ginger, wasabi, and house soy sauce.",
        price: 45,
        cuisine: "Japanese",
        category: "Main",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
        preparationTime: 40,
        servingSize: 1,
        ingredients: ["Seasonal fish", "Sushi rice", "Nori", "Wasabi", "Ginger"],
        allergens: ["Fish", "Soy"],
        cookId: yuki.id,
      },
      {
        name: "Tonkotsu Ramen",
        description: "Rich pork bone broth simmered 18 hours, fresh noodles, chashu pork, ajitama egg, nori.",
        price: 18,
        cuisine: "Japanese",
        category: "Main",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
        preparationTime: 30,
        servingSize: 1,
        ingredients: ["Pork broth", "Noodles", "Chashu pork", "Egg", "Nori"],
        allergens: ["Gluten", "Eggs", "Soy"],
        cookId: yuki.id,
      },
    ],
  });

  // Elena's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Mole Negro con Pollo",
        description: "Chicken in Oaxacan black mole — 30+ ingredients including chocolate, chilies, and spices.",
        price: 20,
        cuisine: "Mexican",
        category: "Main",
        image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&h=400&fit=crop",
        preparationTime: 90,
        servingSize: 2,
        ingredients: ["Chicken", "Dried chilies", "Chocolate", "Spices"],
        allergens: [],
        cookId: elena.id,
      },
      {
        name: "Tamales (6 pcs)",
        description: "Corn masa filled with slow-cooked pork in red chile sauce, steamed in corn husks.",
        price: 15,
        cuisine: "Mexican",
        category: "Main",
        image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=600&h=400&fit=crop",
        preparationTime: 120,
        servingSize: 3,
        ingredients: ["Corn masa", "Pork", "Red chile sauce", "Corn husks"],
        allergens: [],
        cookId: elena.id,
      },
      {
        name: "Churros con Chocolate",
        description: "Crispy fried dough rolled in cinnamon sugar with thick Mexican hot chocolate.",
        price: 8,
        cuisine: "Mexican",
        category: "Dessert",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop",
        preparationTime: 25,
        servingSize: 2,
        ingredients: ["Flour", "Butter", "Cinnamon", "Sugar", "Chocolate"],
        allergens: ["Gluten", "Dairy"],
        cookId: elena.id,
      },
    ],
  });

  // Priya's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Butter Chicken",
        description: "Tender chicken in luscious tomato-cream sauce with kasuri methi and freshly ground garam masala.",
        price: 16,
        cuisine: "Indian",
        category: "Main",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop",
        preparationTime: 50,
        servingSize: 2,
        ingredients: ["Chicken", "Tomato", "Cream", "Garam masala", "Kasuri methi"],
        allergens: ["Dairy"],
        cookId: priya.id,
      },
      {
        name: "Dal Makhani",
        description: "Slow-cooked black lentils in creamy, buttery sauce. Simmered overnight for deepest flavor.",
        price: 12,
        cuisine: "Indian",
        category: "Main",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
        preparationTime: 40,
        servingSize: 2,
        ingredients: ["Black lentils", "Butter", "Cream", "Tomato", "Spices"],
        allergens: ["Dairy"],
        cookId: priya.id,
      },
    ],
  });

  // Olga's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Borscht",
        description: "Classic beet soup with slow-cooked beef, cabbage, root vegetables, smetana and fresh dill.",
        price: 12,
        cuisine: "Russian",
        category: "Soup",
        image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&h=400&fit=crop",
        preparationTime: 60,
        servingSize: 4,
        ingredients: ["Beef", "Beets", "Cabbage", "Potatoes", "Sour cream", "Dill"],
        allergens: ["Dairy"],
        cookId: olga.id,
      },
      {
        name: "Pirozhki (5 pcs)",
        description: "Golden fluffy baked buns filled with seasoned ground beef and onions. 60-year-old recipe.",
        price: 10,
        cuisine: "Russian",
        category: "Appetizer",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
        preparationTime: 45,
        servingSize: 3,
        ingredients: ["Flour", "Yeast", "Beef", "Onion", "Butter"],
        allergens: ["Gluten", "Dairy"],
        cookId: olga.id,
      },
    ],
  });

  // Somchai's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Green Curry with Chicken",
        description: "Fragrant coconut curry with Thai basil, bamboo shoots, and tender chicken. Served with jasmine rice.",
        price: 16,
        cuisine: "Thai",
        category: "Main",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop",
        preparationTime: 35,
        servingSize: 2,
        ingredients: ["Chicken", "Coconut milk", "Green curry paste", "Thai basil", "Bamboo shoots"],
        allergens: [],
        cookId: somchai.id,
      },
      {
        name: "Pad Thai",
        description: "Rice noodles stir-fried with shrimp, tofu, egg, bean sprouts, peanuts in tamarind sauce.",
        price: 14,
        cuisine: "Thai",
        category: "Main",
        image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop",
        preparationTime: 20,
        servingSize: 1,
        ingredients: ["Rice noodles", "Shrimp", "Tofu", "Egg", "Peanuts", "Tamarind"],
        allergens: ["Shellfish", "Peanuts", "Soy", "Eggs"],
        cookId: somchai.id,
      },
    ],
  });

  // Layla's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Mezze Platter",
        description: "Generous spread of hummus, baba ganoush, tabbouleh, labneh, and warm pita. Perfect for sharing.",
        price: 22,
        cuisine: "Mediterranean",
        category: "Appetizer",
        image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop",
        preparationTime: 30,
        servingSize: 4,
        ingredients: ["Chickpeas", "Eggplant", "Parsley", "Labneh", "Pita bread"],
        allergens: ["Gluten", "Dairy", "Sesame"],
        cookId: layla.id,
      },
      {
        name: "Lamb Shawarma Plate",
        description: "Slow-roasted spiced lamb carved thin with garlic sauce, pickled turnips, saffron rice.",
        price: 19,
        cuisine: "Mediterranean",
        category: "Main",
        image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop",
        preparationTime: 120,
        servingSize: 2,
        ingredients: ["Lamb", "Garlic", "Saffron", "Pickled turnips", "Rice"],
        allergens: [],
        cookId: layla.id,
      },
      {
        name: "Baklava (6 pcs)",
        description: "Phyllo layers with pistachios and walnuts soaked in orange blossom syrup. Made fresh daily.",
        price: 10,
        cuisine: "Mediterranean",
        category: "Dessert",
        image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&h=400&fit=crop",
        preparationTime: 60,
        servingSize: 3,
        ingredients: ["Phyllo dough", "Pistachios", "Walnuts", "Orange blossom water", "Butter"],
        allergens: ["Gluten", "Tree Nuts", "Dairy"],
        cookId: layla.id,
      },
    ],
  });

  // Pierre's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Coq au Vin",
        description: "Chicken braised in Burgundy wine with pearl onions, mushrooms, and lardons.",
        price: 24,
        cuisine: "French",
        category: "Main",
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop",
        preparationTime: 90,
        servingSize: 2,
        ingredients: ["Chicken", "Burgundy wine", "Pearl onions", "Mushrooms", "Lardons"],
        allergens: [],
        cookId: pierre.id,
      },
      {
        name: "Crème Brûlée",
        description: "Silky vanilla custard with perfectly caramelized sugar crust.",
        price: 10,
        cuisine: "French",
        category: "Dessert",
        image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&h=400&fit=crop",
        preparationTime: 45,
        servingSize: 1,
        ingredients: ["Cream", "Vanilla", "Egg yolks", "Sugar"],
        allergens: ["Dairy", "Eggs"],
        cookId: pierre.id,
      },
    ],
  });

  // Min-jun's dishes
  await prisma.dish.createMany({
    data: [
      {
        name: "Korean BBQ Set",
        description: "Bulgogi, galbi, and samgyeopsal with all the banchan sides. Full Korean BBQ experience.",
        price: 35,
        cuisine: "Korean",
        category: "Main",
        image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&h=400&fit=crop",
        preparationTime: 60,
        servingSize: 2,
        ingredients: ["Beef", "Pork belly", "Short ribs", "Soy sauce", "Sesame oil"],
        allergens: ["Soy", "Sesame"],
        cookId: minjun.id,
      },
      {
        name: "Kimchi Jjigae",
        description: "Fermented kimchi stew with pork belly, tofu, and scallions. Deeply savory and warming.",
        price: 14,
        cuisine: "Korean",
        category: "Soup",
        image: "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=600&h=400&fit=crop",
        preparationTime: 30,
        servingSize: 2,
        ingredients: ["Kimchi", "Pork belly", "Tofu", "Scallions", "Gochugaru"],
        allergens: ["Soy"],
        cookId: minjun.id,
      },
    ],
  });

  // Create events
  await prisma.event.create({
    data: {
      title: "Italian Dinner Party for 8",
      description: "Looking for an experienced Italian cook for a dinner party at my apartment. We'd love a 3-course meal — antipasti, fresh pasta, and dessert. Two guests are vegetarian. Wine pairing suggestions welcome!",
      date: new Date("2026-02-15T19:00:00"),
      location: "Upper West Side, Manhattan, New York",
      maxGuests: 8,
      pricePerGuest: 45,
      cuisine: "Italian",
      status: "UPCOMING",
      hostId: customer1.id,
    },
  });

  await prisma.event.create({
    data: {
      title: "Private Omakase Experience",
      description: "Anniversary dinner for my wife and two friends. Looking for a sushi chef who can do a proper omakase experience at our place. 12-15 courses preferred.",
      date: new Date("2026-02-20T20:00:00"),
      location: "DUMBO, Brooklyn, New York",
      maxGuests: 4,
      pricePerGuest: 80,
      cuisine: "Japanese",
      status: "UPCOMING",
      hostId: customer2.id,
    },
  });

  await prisma.event.create({
    data: {
      title: "Diwali Celebration Dinner",
      description: "Hosting a belated Diwali celebration for family and friends. Need a cook experienced in North Indian cuisine for a full spread — starters, mains, bread, and desserts.",
      date: new Date("2026-03-01T18:30:00"),
      location: "Kensington, London, UK",
      maxGuests: 20,
      pricePerGuest: 35,
      cuisine: "Indian",
      status: "UPCOMING",
      hostId: customer1.id,
    },
  });

  await prisma.event.create({
    data: {
      title: "Thai Cooking Class + Dinner",
      description: "We want a hands-on Thai cooking class followed by eating what we cook! Pad Thai, green curry, and a dessert.",
      date: new Date("2026-02-22T17:00:00"),
      location: "Kreuzberg, Berlin, Germany",
      maxGuests: 6,
      pricePerGuest: 40,
      cuisine: "Thai",
      status: "UPCOMING",
      hostId: customer2.id,
    },
  });

  await prisma.event.create({
    data: {
      title: "Birthday Brunch — Mexican Style",
      description: "Birthday brunch for my best friend! Looking for someone who can do chilaquiles, huevos rancheros, fresh guac, and churros.",
      date: new Date("2026-02-18T11:00:00"),
      location: "Silver Lake, Los Angeles, USA",
      maxGuests: 12,
      pricePerGuest: 30,
      cuisine: "Mexican",
      status: "UPCOMING",
      hostId: customer1.id,
    },
  });

  await prisma.event.create({
    data: {
      title: "Romantic French Dinner for Two",
      description: "Valentine's Day dinner for two. Want a classic French experience — amuse-bouche, soup, main, cheese course, dessert.",
      date: new Date("2026-02-14T20:00:00"),
      location: "Le Marais, Paris, France",
      maxGuests: 2,
      pricePerGuest: 60,
      cuisine: "French",
      status: "UPCOMING",
      hostId: customer2.id,
    },
  });

  // Create some reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Nino cooked for our dinner party of 8 and it was absolutely magical. The khinkali were restaurant-quality.",
      authorId: customer1.id,
      targetId: nino.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Marco catered our family reunion — 20 people, five courses. Best Italian food I've ever had outside of Italy.",
      authorId: customer2.id,
      targetId: marco.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Yuki did an omakase dinner for 6 at our apartment. It was an unforgettable experience — Michelin quality.",
      authorId: customer1.id,
      targetId: yuki.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Elena did a taco station for our housewarming party — 15 people. Her mole alone was worth it.",
      authorId: customer2.id,
      targetId: elena.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Priya did a Diwali dinner for 30 guests. Every dish was perfect. Our guests are still talking about it.",
      authorId: customer1.id,
      targetId: priya.id,
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
