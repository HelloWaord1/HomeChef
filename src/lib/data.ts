export interface Cook {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  coverImage: string;
  bio: string;
  city: string;
  country: string;
  cuisine: string[];
  experienceLevel: "Home Cook" | "Professional" | "Chef";
  rating: number;
  reviewCount: number;
  completedEvents: number;
  responseRate: string;
  responseTime: string;
  joinedDate: string;
  verified: boolean;
  available: boolean;
  priceRange: string;
  dishes: Dish[];
  reviews: Review[];
}

export interface Dish {
  id: string;
  cookId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  cuisine: string;
  dietary: string[];
  preparationTime?: string;
  servingSize?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  eventType: string;
}

export interface CookingEvent {
  id: string;
  slug: string;
  title: string;
  postedBy: string;
  postedByAvatar: string;
  city: string;
  country: string;
  address: string;
  date: string;
  time: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Party" | "Special Occasion";
  guestCount: number;
  budgetPerPerson: number;
  cuisine: string;
  ingredientProvider: "host" | "cook";
  description: string;
  status: "open" | "in-progress" | "completed";
  postedAt: string;
  responses: EventResponse[];
}

export interface EventResponse {
  id: string;
  cookId: string;
  cookName: string;
  cookAvatar: string;
  cookRating: number;
  cookReviewCount: number;
  proposedFee: number;
  message: string;
  submittedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

// ── Filter options ──

export const cuisineTypes = [
  "All",
  "Georgian",
  "Italian",
  "Japanese",
  "Mexican",
  "Indian",
  "Russian",
  "Thai",
  "Mediterranean",
  "French",
  "Korean",
  "Chinese",
  "American",
  "Brazilian",
];

export const experienceLevels = ["All", "Home Cook", "Professional", "Chef"];

export const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Halal",
  "Spicy",
];

export const mealTypes = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Party",
  "Special Occasion",
];

export const cities = [
  "All",
  "New York",
  "Los Angeles",
  "London",
  "Paris",
  "Tokyo",
  "Dubai",
  "Berlin",
  "Barcelona",
];

// ── Subscription Plans ──

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "",
    description: "Get started and explore what FreeChef has to offer.",
    features: [
      "Browse all cook profiles",
      "Post up to 2 events per month",
      "Receive cook bids on your events",
      "View cook ratings & reviews",
      "Basic search & filters",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    id: "premium",
    name: "Premium",
    price: 14.99,
    period: "/month",
    description: "Unlock direct messaging and priority access.",
    features: [
      "Everything in Free",
      "Unlimited event posts",
      "Direct message any cook",
      "Priority placement in search",
      "Verified badge on your profile",
      "Advanced filters & preferences",
      "Early access to new cooks",
      "Cancel anytime",
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    id: "one-time",
    name: "Contact Pass",
    price: 4.99,
    period: "/contact",
    description: "Buy individual cook contacts without subscribing.",
    features: [
      "One-time purchase per cook",
      "Get cook's direct contact info",
      "Send unlimited messages to that cook",
      "No subscription required",
      "Instant access",
    ],
    highlighted: false,
    cta: "Buy a Contact",
  },
];

// ── Seed: Cooks ──

export const cooks: Cook[] = [
  {
    id: "1",
    name: "Nino Kapanadze",
    slug: "nino-kapanadze",
    avatar:
      "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop",
    bio: "Born and raised in Tbilisi, I bring the warmth of Georgian hospitality to every dish. My grandmother taught me the art of khinkali folding when I was seven. Every meal carries her spirit — generous, soulful, and always with wine nearby.",
    city: "New York",
    country: "USA",
    cuisine: ["Georgian", "Mediterranean"],
    experienceLevel: "Professional",
    rating: 4.9,
    reviewCount: 127,
    completedEvents: 84,
    responseRate: "98%",
    responseTime: "< 1 hour",
    joinedDate: "March 2024",
    verified: true,
    available: true,
    priceRange: "$25–45/person",
    dishes: [
      {
        id: "d1",
        cookId: "1",
        name: "Khinkali (10 pcs)",
        description:
          "Hand-folded Georgian dumplings filled with spiced beef and pork. Each one twisted with exactly 28 pleats.",
        price: 16,
        image:
          "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&h=400&fit=crop",
        cuisine: "Georgian",
        dietary: [],
      },
      {
        id: "d2",
        cookId: "1",
        name: "Khachapuri Adjaruli",
        description:
          "Boat-shaped bread filled with melted Georgian cheese, topped with a runny egg and butter.",
        price: 14,
        image:
          "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=600&h=400&fit=crop",
        cuisine: "Georgian",
        dietary: ["Vegetarian"],
      },
      {
        id: "d3",
        cookId: "1",
        name: "Pkhali Platter",
        description:
          "Trio of walnut-herb pastes — spinach, beet, and green bean — garnished with pomegranate seeds.",
        price: 12,
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
        cuisine: "Georgian",
        dietary: ["Vegan", "Gluten-Free"],
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Sarah M.",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Nino cooked for our dinner party of 8 and it was absolutely magical. The khinkali were restaurant-quality.",
        date: "2 weeks ago",
        eventType: "Dinner Party",
      },
      {
        id: "r2",
        author: "Mike R.",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Hired Nino for my wife's birthday. She prepared a full Georgian feast — unbelievable flavors and so professional.",
        date: "1 month ago",
        eventType: "Birthday",
      },
    ],
  },
  {
    id: "2",
    name: "Marco Rossi",
    slug: "marco-rossi",
    avatar:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1200&h=400&fit=crop",
    bio: "Third-generation pasta maker from Naples. Former sous chef in Manhattan. I make fresh pasta daily using bronze dies and a 50-year-old technique. No shortcuts, no compromises, just pure Italian tradition.",
    city: "New York",
    country: "USA",
    cuisine: ["Italian"],
    experienceLevel: "Chef",
    rating: 4.8,
    reviewCount: 203,
    completedEvents: 156,
    responseRate: "95%",
    responseTime: "< 2 hours",
    joinedDate: "January 2024",
    verified: true,
    available: true,
    priceRange: "$30–55/person",
    dishes: [
      {
        id: "d4",
        cookId: "2",
        name: "Cacio e Pepe",
        description:
          "Fresh tonnarelli in silky Pecorino Romano and cracked black pepper sauce.",
        price: 18,
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop",
        cuisine: "Italian",
        dietary: ["Vegetarian"],
      },
      {
        id: "d5",
        cookId: "2",
        name: "Fresh Ravioli with Ricotta & Sage",
        description:
          "Handmade ravioli filled with ricotta and lemon zest, in brown butter with crispy sage.",
        price: 22,
        image:
          "https://images.unsplash.com/photo-1587740908075-9e245070dfaa?w=600&h=400&fit=crop",
        cuisine: "Italian",
        dietary: ["Vegetarian"],
      },
      {
        id: "d6",
        cookId: "2",
        name: "Tiramisu",
        description:
          "Classic tiramisu with mascarpone, espresso-soaked ladyfingers, and cocoa. Made fresh daily.",
        price: 10,
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
        cuisine: "Italian",
        dietary: ["Vegetarian"],
      },
    ],
    reviews: [
      {
        id: "r3",
        author: "David K.",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Marco catered our family reunion — 20 people, five courses. Best Italian food I've ever had outside of Italy.",
        date: "1 week ago",
        eventType: "Family Gathering",
      },
    ],
  },
  {
    id: "3",
    name: "Yuki Tanaka",
    slug: "yuki-tanaka",
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=1200&h=400&fit=crop",
    bio: "Trained at Tsukiji Market in Tokyo for eight years. I source the freshest fish daily and prepare every piece with the precision that washoku tradition demands. Omakase experiences a specialty.",
    city: "New York",
    country: "USA",
    cuisine: ["Japanese"],
    experienceLevel: "Chef",
    rating: 4.9,
    reviewCount: 89,
    completedEvents: 62,
    responseRate: "100%",
    responseTime: "< 30 min",
    joinedDate: "June 2024",
    verified: true,
    available: true,
    priceRange: "$40–80/person",
    dishes: [
      {
        id: "d7",
        cookId: "3",
        name: "Omakase Box (12 pcs)",
        description:
          "Chef's choice nigiri selection with seasonal fish, pickled ginger, wasabi, and house soy sauce.",
        price: 45,
        image:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
        cuisine: "Japanese",
        dietary: ["Gluten-Free", "Dairy-Free"],
      },
      {
        id: "d8",
        cookId: "3",
        name: "Tonkotsu Ramen",
        description:
          "Rich pork bone broth simmered 18 hours, fresh noodles, chashu pork, ajitama egg, nori.",
        price: 18,
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
        cuisine: "Japanese",
        dietary: [],
      },
    ],
    reviews: [
      {
        id: "r4",
        author: "Alex P.",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Yuki did an omakase dinner for 6 at our apartment. It was an unforgettable experience — Michelin quality.",
        date: "1 week ago",
        eventType: "Omakase Dinner",
      },
    ],
  },
  {
    id: "4",
    name: "Elena Vargas",
    slug: "elena-vargas",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&h=400&fit=crop",
    bio: "From Oaxaca with love. I grew up grinding corn for tortillas and making mole with my abuela. My food is a celebration of Mexican tradition — bold, colorful, and made from locally sourced ingredients.",
    city: "Los Angeles",
    country: "USA",
    cuisine: ["Mexican"],
    experienceLevel: "Professional",
    rating: 4.7,
    reviewCount: 156,
    completedEvents: 112,
    responseRate: "92%",
    responseTime: "< 2 hours",
    joinedDate: "February 2024",
    verified: true,
    available: true,
    priceRange: "$20–35/person",
    dishes: [
      {
        id: "d9",
        cookId: "4",
        name: "Mole Negro con Pollo",
        description:
          "Chicken in Oaxacan black mole — 30+ ingredients including chocolate, chilies, and spices.",
        price: 20,
        image:
          "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&h=400&fit=crop",
        cuisine: "Mexican",
        dietary: ["Gluten-Free"],
      },
      {
        id: "d10",
        cookId: "4",
        name: "Tamales (6 pcs)",
        description:
          "Corn masa filled with slow-cooked pork in red chile sauce, steamed in corn husks.",
        price: 15,
        image:
          "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=600&h=400&fit=crop",
        cuisine: "Mexican",
        dietary: ["Gluten-Free"],
      },
      {
        id: "d11",
        cookId: "4",
        name: "Churros con Chocolate",
        description:
          "Crispy fried dough rolled in cinnamon sugar with thick Mexican hot chocolate.",
        price: 8,
        image:
          "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop",
        cuisine: "Mexican",
        dietary: ["Vegetarian"],
      },
    ],
    reviews: [
      {
        id: "r5",
        author: "Carlos G.",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Elena did a taco station for our housewarming party — 15 people. Her mole alone was worth it.",
        date: "2 days ago",
        eventType: "Housewarming",
      },
    ],
  },
  {
    id: "5",
    name: "Priya Sharma",
    slug: "priya-sharma",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&h=400&fit=crop",
    bio: "Learned to cook in my mother's kitchen in Jaipur. Vibrant Rajasthani and North Indian cuisine with spices ground fresh every morning. I specialize in large gatherings and celebrations.",
    city: "London",
    country: "UK",
    cuisine: ["Indian"],
    experienceLevel: "Professional",
    rating: 4.8,
    reviewCount: 178,
    completedEvents: 134,
    responseRate: "96%",
    responseTime: "< 1 hour",
    joinedDate: "April 2024",
    verified: true,
    available: true,
    priceRange: "£20–40/person",
    dishes: [
      {
        id: "d12",
        cookId: "5",
        name: "Butter Chicken",
        description:
          "Tender chicken in luscious tomato-cream sauce with kasuri methi and freshly ground garam masala.",
        price: 16,
        image:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop",
        cuisine: "Indian",
        dietary: ["Gluten-Free"],
      },
      {
        id: "d13",
        cookId: "5",
        name: "Dal Makhani",
        description:
          "Slow-cooked black lentils in creamy, buttery sauce. Simmered overnight for deepest flavor.",
        price: 12,
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
        cuisine: "Indian",
        dietary: ["Vegetarian", "Gluten-Free"],
      },
    ],
    reviews: [
      {
        id: "r6",
        author: "Tom H.",
        avatar:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Priya did a Diwali dinner for 30 guests. Every dish was perfect. Our guests are still talking about it.",
        date: "3 days ago",
        eventType: "Diwali Celebration",
      },
    ],
  },
  {
    id: "6",
    name: "Olga Petrova",
    slug: "olga-petrova",
    avatar:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=1200&h=400&fit=crop",
    bio: "From Moscow with soul. My babushka filled our kitchen with borscht and pirozhki aromas. Now I recreate those flavors — hearty, nourishing, and made with the same patience she taught me.",
    city: "Berlin",
    country: "Germany",
    cuisine: ["Russian"],
    experienceLevel: "Home Cook",
    rating: 4.6,
    reviewCount: 94,
    completedEvents: 58,
    responseRate: "88%",
    responseTime: "< 3 hours",
    joinedDate: "May 2024",
    verified: true,
    available: true,
    priceRange: "€18–30/person",
    dishes: [
      {
        id: "d14",
        cookId: "6",
        name: "Borscht",
        description:
          "Classic beet soup with slow-cooked beef, cabbage, root vegetables, smetana and fresh dill.",
        price: 12,
        image:
          "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&h=400&fit=crop",
        cuisine: "Russian",
        dietary: [],
      },
      {
        id: "d15",
        cookId: "6",
        name: "Pirozhki (5 pcs)",
        description:
          "Golden fluffy baked buns filled with seasoned ground beef and onions. 60-year-old recipe.",
        price: 10,
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
        cuisine: "Russian",
        dietary: [],
      },
    ],
    reviews: [
      {
        id: "r7",
        author: "Nina B.",
        avatar:
          "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Olga cooked a traditional Russian dinner for my daughter's nameday. Felt like being back at grandma's.",
        date: "5 days ago",
        eventType: "Family Dinner",
      },
    ],
  },
  {
    id: "7",
    name: "Somchai Prasert",
    slug: "somchai-prasert",
    avatar:
      "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=1200&h=400&fit=crop",
    bio: "Grew up in a floating market in Bangkok. My food is bold, balanced, and unapologetically Thai. Every curry paste pounded by hand in my granite mortar. I specialize in authentic street food experiences.",
    city: "London",
    country: "UK",
    cuisine: ["Thai"],
    experienceLevel: "Professional",
    rating: 4.8,
    reviewCount: 112,
    completedEvents: 78,
    responseRate: "94%",
    responseTime: "< 1 hour",
    joinedDate: "March 2024",
    verified: true,
    available: false,
    priceRange: "£22–40/person",
    dishes: [
      {
        id: "d16",
        cookId: "7",
        name: "Green Curry with Chicken",
        description:
          "Fragrant coconut curry with Thai basil, bamboo shoots, and tender chicken. Served with jasmine rice.",
        price: 16,
        image:
          "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop",
        cuisine: "Thai",
        dietary: ["Gluten-Free", "Dairy-Free"],
      },
      {
        id: "d17",
        cookId: "7",
        name: "Pad Thai",
        description:
          "Rice noodles stir-fried with shrimp, tofu, egg, bean sprouts, peanuts in tamarind sauce.",
        price: 14,
        image:
          "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop",
        cuisine: "Thai",
        dietary: ["Gluten-Free"],
      },
    ],
    reviews: [
      {
        id: "r8",
        author: "Jordan F.",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Somchai set up a Thai street food station for our office party. 25 people, all blown away. The green curry was life-changing.",
        date: "1 week ago",
        eventType: "Office Party",
      },
    ],
  },
  {
    id: "8",
    name: "Layla Khoury",
    slug: "layla-khoury",
    avatar:
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&h=400&fit=crop",
    bio: "From my grandmother's kitchen in Beirut to yours. Mediterranean food the way it was meant to be — freshest ingredients, generous olive oil, recipes passed through four generations of Lebanese women.",
    city: "Dubai",
    country: "UAE",
    cuisine: ["Mediterranean", "Lebanese"],
    experienceLevel: "Professional",
    rating: 4.9,
    reviewCount: 145,
    completedEvents: 98,
    responseRate: "97%",
    responseTime: "< 45 min",
    joinedDate: "January 2024",
    verified: true,
    available: true,
    priceRange: "AED 80–150/person",
    dishes: [
      {
        id: "d18",
        cookId: "8",
        name: "Mezze Platter",
        description:
          "Generous spread of hummus, baba ganoush, tabbouleh, labneh, and warm pita. Perfect for sharing.",
        price: 22,
        image:
          "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop",
        cuisine: "Mediterranean",
        dietary: ["Vegetarian"],
      },
      {
        id: "d19",
        cookId: "8",
        name: "Lamb Shawarma Plate",
        description:
          "Slow-roasted spiced lamb carved thin with garlic sauce, pickled turnips, saffron rice.",
        price: 19,
        image:
          "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop",
        cuisine: "Mediterranean",
        dietary: ["Gluten-Free", "Dairy-Free"],
      },
      {
        id: "d20",
        cookId: "8",
        name: "Baklava (6 pcs)",
        description:
          "Phyllo layers with pistachios and walnuts soaked in orange blossom syrup. Made fresh daily.",
        price: 10,
        image:
          "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&h=400&fit=crop",
        cuisine: "Mediterranean",
        dietary: ["Vegetarian"],
      },
    ],
    reviews: [
      {
        id: "r9",
        author: "Sam W.",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Layla cooked a Lebanese feast for our engagement party — 40 guests. She handled everything flawlessly.",
        date: "4 days ago",
        eventType: "Engagement Party",
      },
    ],
  },
  {
    id: "9",
    name: "Pierre Dubois",
    slug: "pierre-dubois",
    avatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop",
    bio: "Former sous chef at a Michelin-starred restaurant in Lyon. I left the professional kitchen to cook what I truly love — the rustic, honest food of the French countryside. Cassoulet, coq au vin, tarte tatin.",
    city: "Paris",
    country: "France",
    cuisine: ["French"],
    experienceLevel: "Chef",
    rating: 4.7,
    reviewCount: 67,
    completedEvents: 45,
    responseRate: "90%",
    responseTime: "< 2 hours",
    joinedDate: "July 2024",
    verified: false,
    available: true,
    priceRange: "€35–60/person",
    dishes: [
      {
        id: "d21",
        cookId: "9",
        name: "Coq au Vin",
        description:
          "Chicken braised in Burgundy wine with pearl onions, mushrooms, and lardons.",
        price: 24,
        image:
          "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop",
        cuisine: "French",
        dietary: ["Gluten-Free"],
      },
      {
        id: "d22",
        cookId: "9",
        name: "Crème Brûlée",
        description:
          "Silky vanilla custard with perfectly caramelized sugar crust.",
        price: 10,
        image:
          "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&h=400&fit=crop",
        cuisine: "French",
        dietary: ["Vegetarian", "Gluten-Free"],
      },
    ],
    reviews: [
      {
        id: "r10",
        author: "Claire M.",
        avatar:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Pierre did a 5-course French dinner for our anniversary. Absolutely extraordinary. Michelin-star quality in our dining room.",
        date: "1 week ago",
        eventType: "Anniversary",
      },
    ],
  },
  {
    id: "10",
    name: "Min-jun Park",
    slug: "min-jun-park",
    avatar:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200&h=200&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&h=400&fit=crop",
    bio: "Seoul native and fermentation obsessive. All my kimchi, gochujang, doenjang — made from scratch. Korean food is about depth, balance, and the magic of time. I specialize in Korean BBQ experiences.",
    city: "Tokyo",
    country: "Japan",
    cuisine: ["Korean"],
    experienceLevel: "Home Cook",
    rating: 4.8,
    reviewCount: 98,
    completedEvents: 72,
    responseRate: "91%",
    responseTime: "< 2 hours",
    joinedDate: "August 2024",
    verified: true,
    available: true,
    priceRange: "¥3000–6000/person",
    dishes: [
      {
        id: "d23",
        cookId: "10",
        name: "Korean BBQ Set",
        description:
          "Bulgogi, galbi, and samgyeopsal with all the banchan sides. Full Korean BBQ experience.",
        price: 35,
        image:
          "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&h=400&fit=crop",
        cuisine: "Korean",
        dietary: [],
      },
      {
        id: "d24",
        cookId: "10",
        name: "Kimchi Jjigae",
        description:
          "Fermented kimchi stew with pork belly, tofu, and scallions. Deeply savory and warming.",
        price: 14,
        image:
          "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=600&h=400&fit=crop",
        cuisine: "Korean",
        dietary: ["Dairy-Free"],
      },
    ],
    reviews: [
      {
        id: "r11",
        author: "Kevin L.",
        avatar:
          "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        comment:
          "Min-jun did a Korean BBQ night for 12 friends. He brought everything — the grill, the meats, the banchan. A+ experience.",
        date: "3 days ago",
        eventType: "BBQ Night",
      },
    ],
  },
];

// ── Seed: Events/Tasks ──

export const events: CookingEvent[] = [
  {
    id: "e1",
    slug: "italian-dinner-party-manhattan",
    title: "Italian Dinner Party for 8",
    postedBy: "Jessica T.",
    postedByAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    city: "New York",
    country: "USA",
    address: "Upper West Side, Manhattan",
    date: "Feb 15, 2026",
    time: "7:00 PM",
    mealType: "Dinner",
    guestCount: 8,
    budgetPerPerson: 45,
    cuisine: "Italian",
    ingredientProvider: "cook",
    description:
      "Looking for an experienced Italian cook for a dinner party at my apartment. We'd love a 3-course meal — antipasti, fresh pasta, and dessert. Two guests are vegetarian. Wine pairing suggestions welcome!",
    status: "open",
    postedAt: "2 hours ago",
    responses: [
      {
        id: "resp1",
        cookId: "2",
        cookName: "Marco Rossi",
        cookAvatar:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop&crop=face",
        cookRating: 4.8,
        cookReviewCount: 203,
        proposedFee: 340,
        message:
          "I'd love to cook for your party! I can prepare a full 3-course Italian dinner: bruschetta and caprese for antipasti, my signature cacio e pepe and a vegetarian ravioli option, and tiramisu for dessert. I'll bring all ingredients and can suggest wine pairings.",
        submittedAt: "1 hour ago",
      },
    ],
  },
  {
    id: "e2",
    slug: "japanese-omakase-brooklyn",
    title: "Private Omakase Experience",
    postedBy: "Daniel R.",
    postedByAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    city: "New York",
    country: "USA",
    address: "DUMBO, Brooklyn",
    date: "Feb 20, 2026",
    time: "8:00 PM",
    mealType: "Dinner",
    guestCount: 4,
    budgetPerPerson: 80,
    cuisine: "Japanese",
    ingredientProvider: "cook",
    description:
      "Anniversary dinner for my wife and two friends. Looking for a sushi chef who can do a proper omakase experience at our place. 12-15 courses preferred. We have a kitchen island that works as a counter.",
    status: "open",
    postedAt: "5 hours ago",
    responses: [
      {
        id: "resp2",
        cookId: "3",
        cookName: "Yuki Tanaka",
        cookAvatar:
          "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face",
        cookRating: 4.9,
        cookReviewCount: 89,
        proposedFee: 300,
        message:
          "Happy anniversary! I would be honored to prepare a 15-course omakase for you. I'll source the fish that morning from the market. The experience typically runs 90 minutes. I bring my own knife set and prep equipment.",
        submittedAt: "3 hours ago",
      },
    ],
  },
  {
    id: "e3",
    slug: "indian-diwali-celebration-london",
    title: "Diwali Celebration Dinner",
    postedBy: "Aisha K.",
    postedByAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    city: "London",
    country: "UK",
    address: "Kensington, London",
    date: "Mar 1, 2026",
    time: "6:30 PM",
    mealType: "Special Occasion",
    guestCount: 20,
    budgetPerPerson: 35,
    cuisine: "Indian",
    ingredientProvider: "cook",
    description:
      "Hosting a belated Diwali celebration for family and friends. Need a cook experienced in North Indian cuisine for a full spread — starters, mains, bread, and desserts. Five vegetarian guests. Would love rangoli-style plating!",
    status: "open",
    postedAt: "1 day ago",
    responses: [
      {
        id: "resp3",
        cookId: "5",
        cookName: "Priya Sharma",
        cookAvatar:
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
        cookRating: 4.8,
        cookReviewCount: 178,
        proposedFee: 650,
        message:
          "Diwali celebrations are my specialty! I can prepare a full feast: samosas and chaat for starters, butter chicken, paneer tikka, dal makhani, biryani, naan, and gulab jamun for dessert. I'll bring traditional serving ware and can absolutely do festive plating.",
        submittedAt: "20 hours ago",
      },
    ],
  },
  {
    id: "e4",
    slug: "thai-cooking-class-berlin",
    title: "Thai Cooking Class + Dinner",
    postedBy: "Martin S.",
    postedByAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    city: "Berlin",
    country: "Germany",
    address: "Kreuzberg, Berlin",
    date: "Feb 22, 2026",
    time: "5:00 PM",
    mealType: "Dinner",
    guestCount: 6,
    budgetPerPerson: 40,
    cuisine: "Thai",
    ingredientProvider: "cook",
    description:
      "We want a hands-on Thai cooking class followed by eating what we cook! Pad Thai, green curry, and a dessert. Fun group of friends, all beginners. A patient teacher would be ideal.",
    status: "open",
    postedAt: "3 hours ago",
    responses: [],
  },
  {
    id: "e5",
    slug: "mexican-birthday-brunch-la",
    title: "Birthday Brunch — Mexican Style",
    postedBy: "Rachel W.",
    postedByAvatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    city: "Los Angeles",
    country: "USA",
    address: "Silver Lake, Los Angeles",
    date: "Feb 18, 2026",
    time: "11:00 AM",
    mealType: "Breakfast",
    guestCount: 12,
    budgetPerPerson: 30,
    cuisine: "Mexican",
    ingredientProvider: "cook",
    description:
      "Birthday brunch for my best friend! Looking for someone who can do chilaquiles, huevos rancheros, fresh guac, and churros. We'll provide the drinks (micheladas!). Outdoor backyard setup. Fun, festive vibes!",
    status: "open",
    postedAt: "6 hours ago",
    responses: [
      {
        id: "resp4",
        cookId: "4",
        cookName: "Elena Vargas",
        cookAvatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
        cookRating: 4.7,
        cookReviewCount: 156,
        proposedFee: 320,
        message:
          "This sounds like such a fun party! I'd love to be part of it. I can do all the dishes you mentioned plus add a fruit platter with tajín and a build-your-own-taco station. Happy birthday to your friend! 🎉",
        submittedAt: "4 hours ago",
      },
    ],
  },
  {
    id: "e6",
    slug: "french-anniversary-paris",
    title: "Romantic French Dinner for Two",
    postedBy: "Sophie L.",
    postedByAvatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
    city: "Paris",
    country: "France",
    address: "Le Marais, Paris",
    date: "Feb 14, 2026",
    time: "8:00 PM",
    mealType: "Dinner",
    guestCount: 2,
    budgetPerPerson: 60,
    cuisine: "French",
    ingredientProvider: "cook",
    description:
      "Valentine's Day dinner for two in our apartment. Want a classic French experience — amuse-bouche, soup, main, cheese course, dessert. Candlelit. Make it special! We have a well-equipped kitchen.",
    status: "in-progress",
    postedAt: "2 days ago",
    responses: [
      {
        id: "resp5",
        cookId: "9",
        cookName: "Pierre Dubois",
        cookAvatar:
          "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&crop=face",
        cookRating: 4.7,
        cookReviewCount: 67,
        proposedFee: 110,
        message:
          "Bonsoir! A Valentine's dinner is something I take very seriously. I propose: amuse-bouche of foie gras mousse, French onion soup, duck confit with dauphinoise potatoes, a cheese selection, and my signature crème brûlée. I'll arrive 2 hours early to prepare. Bon appétit!",
        submittedAt: "1 day ago",
      },
    ],
  },
];

// ── Helpers ──

export function getCookBySlug(slug: string): Cook | undefined {
  return cooks.find((c) => c.slug === slug);
}

export function getEventBySlug(slug: string): CookingEvent | undefined {
  return events.find((e) => e.slug === slug);
}

export function getEventById(id: string): CookingEvent | undefined {
  return events.find((e) => e.id === id);
}

export function getAllDishes() {
  return cooks.flatMap((cook) =>
    cook.dishes.map((dish) => ({
      ...dish,
      cookName: cook.name,
      cookSlug: cook.slug,
    }))
  );
}
