// ============================================================
//  ANNACHI TIFFIN CENTRE — Brand Data & Menu
// ============================================================

export const BRAND = {
  name: "Annachi Tiffin Centre",
  nameShort: "Annachi",
  tagline: "The Real Taste of the Tamilian",
  location: "Shanti Nagar, Hubli",
  landmark: "Near Shanti Nagar",
  hours: {
    weekdays: "8:00 AM – 9:00 PM",
    sunday: "Closed (Holiday)",
    label: "Mon – Sat: 8:00 AM – 9:00 PM · Sunday: Closed",
  },
  phone: "7204523312",
  whatsapp: "917204523312",
  paytmUpiId: "nehalnadaf@ptyes",
  maps: null,
  payment: ["UPI", "Cash"],
};

export const MENU_CATEGORIES = [
  {
    id: "breakfast",
    name: "Breakfast",
    image: "/product-images/dosa.webp",
    count: 5,
  },
  {
    id: "drinks",
    name: "Drinks",
    image: "/product-images/chai.webp",
    count: 2,
  },
];

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  availability: "daily" | "limited";
  availableDays?: string;
  isVeg: boolean;
  isStar?: boolean;
  contents: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "dosa",
    categoryId: "breakfast",
    name: "Dosa",
    price: 40,
    image: "/product-images/dosa.webp",
    description:
      "Crispy, golden dosa freshly made — the star of the menu. Served with classic accompaniments.",
    availability: "daily",
    isVeg: true,
    isStar: true,
    contents: "Plain Dosa + Aloo Sabzi + White Chutney + Red Liquid Chutney",
  },
  {
    id: "idli",
    categoryId: "breakfast",
    name: "Idli",
    price: 30,
    image: "/product-images/idli.webp",
    description: "Soft, fluffy steamed idlis served with a trio of chutneys and sambar.",
    availability: "daily",
    isVeg: true,
    contents: "2 Idlis + White Chutney + Orange Chutney + Sambar",
  },
  {
    id: "vada",
    categoryId: "breakfast",
    name: "Vada",
    price: 30,
    image: "/product-images/vada.webp",
    description: "Crispy lentil vadas with a soft, fluffy interior. A classic South Indian delight.",
    availability: "daily",
    isVeg: true,
    contents: "2 Vadas + White Chutney + Red Chutney",
  },
  {
    id: "idli-vada",
    categoryId: "breakfast",
    name: "Idli Vada",
    price: 35,
    image: "/product-images/idli_vada_combo.webp",
    description: "The ultimate combo — a soft idli and a crispy vada, perfect together.",
    availability: "daily",
    isVeg: true,
    contents: "1 Idli + 1 Vada + White Chutney + Orange Chutney + Sambar",
  },
  {
    id: "pongal",
    categoryId: "breakfast",
    name: "Pongal",
    price: 40,
    image: "/product-images/pongal.webp",
    description:
      "Rich, comforting Pongal with ghee and black pepper. Available only on select days.",
    availability: "limited",
    availableDays: "Wednesday & Saturday only",
    isVeg: true,
    contents: "Pongal + White Chutney + Orange Chutney",
  },
  {
    id: "chai",
    categoryId: "drinks",
    name: "Chai",
    price: 10,
    image: "/product-images/chai.webp",
    description: "One cup of hot, aromatic tea to start your morning.",
    availability: "daily",
    isVeg: true,
    contents: "1 Cup Chai",
  },
  {
    id: "water-bottle",
    categoryId: "drinks",
    name: "Water Bottle",
    price: 10,
    image: "/product-images/water_bottle.webp",
    description: "Clean, packaged drinking water.",
    availability: "daily",
    isVeg: true,
    contents: "1 Bottle (500ml)",
  },
];

export const FAQS = [
  {
    q: "Does the restaurant have a breakfast menu?",
    a: "Yes, the restaurant has a breakfast menu with a wide selection of options to choose from — Dosa, Idli, Vada, Idli Vada Combo, and Pongal.",
  },
  {
    q: "What are the various modes of payment accepted?",
    a: "Payments can be made via UPI or Cash. Cards are not accepted.",
  },
  {
    q: "Which is the nearest landmark?",
    a: "The restaurant is located in close proximity to Shanti Nagar, Hubli, making it very easy to find.",
  },
  {
    q: "What are the hours of operation?",
    a: "Monday to Saturday: 8:00 AM – 9:00 PM. Sunday is a holiday — the restaurant remains closed.",
  },
  {
    q: "Which is the star item on the menu?",
    a: "Dosa is the special highlight of the menu — freshly made, crispy, and exceptionally tasty.",
  },
  {
    q: "Is Pongal available every day?",
    a: "Pongal is available only on Wednesdays and Saturdays.",
  },
];

export const REVIEWS = [
  {
    name: "Ramesh K.",
    rating: 5,
    text: "The dosa here is absolutely out of this world. Crispy on the outside, perfectly soft inside. The aloo sabzi is just like home!",
    date: "April 2026",
  },
  {
    name: "Priya Naidu",
    rating: 5,
    text: "Best idli I've had in Hubli. The sambar is so flavourful and the orange chutney is unique — never had anything like it!",
    date: "March 2026",
  },
  {
    name: "Suresh T.",
    rating: 5,
    text: "Authentic Tamil breakfast in the heart of Hubli. The Pongal on Wednesdays is a must-try. Price is very reasonable.",
    date: "March 2026",
  },
  {
    name: "Meena V.",
    rating: 4,
    text: "Love the vada here. Crispy perfection every single time. The red chutney is spicy and full of flavour.",
    date: "February 2026",
  },
  {
    name: "Anand Pillai",
    rating: 5,
    text: "This place has become my morning ritual. Nothing beats starting the day with an Annachi Dosa and filter coffee nearby.",
    date: "February 2026",
  },
  {
    name: "Kavitha S.",
    rating: 5,
    text: "Genuine South Indian street tiffin. The Idli Vada combo is the best value for money — very filling and delicious!",
    date: "January 2026",
  },
];
