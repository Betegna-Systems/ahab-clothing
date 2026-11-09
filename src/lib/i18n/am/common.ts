// Shared site text: header, footer, product cards, bag, search, size chart, 404/error.
//
// GLOSSARY — use these Amharic terms consistently in every file:
//   suit → ሱፍ ልብስ        top → ቶፕ (የሴቶች ላይኛው ልብስ)   bag/cart → ቦርሳ
//   order → ትዕዛዝ          checkout → ክፍያ መፈጸሚያ          delivery → ማድረስ / መላኪያ
//   size → መጠን            colour/color → ቀለም              in stock → በክምችት ያለ
//   sold out → ተሽጧል       wishlist → የምኞት ዝርዝር           account → መለያ
//   payment → ክፍያ          receipt → ደረሰኝ                  promo code → የቅናሽ ኮድ
//   custom (made-to-measure) → በልክ የሚሰፋ                    review → አስተያየት / ግምገማ
//   free → ነፃ              total → ጠቅላላ                    subtotal → ንዑስ ድምር
//   Addis Ababa → አዲስ አበባ   ETB stays "ETB" in prices (REVIEW: or "ብር").
// Brand names (AHAB, Telebirr, CBE, Telegram, WhatsApp, Instagram, TikTok) stay in Latin script.
export const common: Record<string, string> = {
  // Language switcher
  English: "English",
  Amharic: "አማርኛ",
  "View this page in English": "ይህንን ገጽ በእንግሊዝኛ ይመልከቱ",
  "View this page in Amharic": "ይህንን ገጽ በአማርኛ ይመልከቱ",

  // Announcement bar & header
  "Free Addis delivery over ETB 5,000": "ከETB 5,000 በላይ በአዲስ አበባ ነፃ ማድረስ",
  "Free delivery in Addis Ababa on orders over ETB 5,000":
    "ከETB 5,000 በላይ ለሆኑ ትዕዛዞች በአዲስ አበባ ነፃ ማድረስ",
  Suits: "ሱፍ ልብሶች",
  Tops: "ቶፖች",
  Shop: "ሱቅ",
  Lookbook: "የፋሽን ማሳያ",
  Custom: "በልክ ማሰፊያ",
  About: "ስለ እኛ",
  Contact: "ያግኙን",
  Home: "መነሻ",
  "Open menu": "ምናሌ ክፈት",
  "Close menu": "ምናሌ ዝጋ",
  Search: "ፈልግ",
  Wishlist: "የምኞት ዝርዝር",
  Account: "መለያ",
  "Open cart": "ቦርሳ ክፈት",
  "AHAB Clothing": "AHAB Clothing",
  "Made With Love": "በፍቅር የተሰራ",

  // Footer
  "All tops": "ሁሉም ቶፖች",
  "Custom commissions": "በልክ የሚሰፉ ትዕዛዞች",
  "Customer care": "የደንበኞች አገልግሎት",
  "Contact us": "ያግኙን",
  "Size guide": "የመጠን መመሪያ",
  "Shipping & delivery": "መላኪያ እና ማድረስ",
  Returns: "ተመላሽ",
  "The house": "ስለ ቤታችን",
  "About AHAB": "ስለ AHAB",
  "Privacy policy": "የግላዊነት ፖሊሲ",
  "Terms of service": "የአገልግሎት ውሎች",
  "An independent house designing and sewing women's suits and tops in Addis Ababa. Cut, seamed and finished by hand.":
    "በአዲስ አበባ የሴቶች ሱፍ ልብሶችንና ቶፖችን የሚነድፍና የሚሰፋ ራሱን የቻለ ቤት። በእጅ ተቆርጦ፣ ተሰፍቶና ተጠናቅቆ የሚዘጋጅ።",
  "Please enter a valid email address": "እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ",
  "Your email draft is ready. Send it to request newsletter updates.":
    "የኢሜይል ረቂቅዎ ዝግጁ ነው። የዜና መጽሔት ዝማኔዎችን ለመቀበል ይላኩት።",
  "New collections, first": "አዳዲስ ስብስቦች፣ ቀድመው",
  "Your email": "ኢሜይልዎ",
  Join: "ይቀላቀሉ",
  "AHAB Clothing · Addis Ababa, Ethiopia": "AHAB Clothing · አዲስ አበባ፣ ኢትዮጵያ",
  "AHAB on Instagram": "AHAB በInstagram",
  "AHAB on TikTok": "AHAB በTikTok",

  // Product card
  New: "አዲስ",
  Sale: "ቅናሽ",
  "Best Seller": "በብዛት የተሸጠ",
  "Removed from wishlist": "ከምኞት ዝርዝር ተወግዷል",
  "Saved to wishlist": "በምኞት ዝርዝር ተቀምጧል",
  "Remove from wishlist": "ከምኞት ዝርዝር አስወግድ",
  "Save to wishlist": "በምኞት ዝርዝር አስቀምጥ",
  "Previous colour": "የቀድሞው ቀለም",
  "Next colour": "የሚቀጥለው ቀለም",
  "Quick add": "በፍጥነት ጨምር",
  "Checking stock": "ክምችት በመፈተሽ ላይ",
  "Stock unavailable": "ክምችት ማረጋገጥ አልተቻለም",
  "In stock": "በክምችት አለ",
  "Sold out": "ተሽጧል",
  "Available colours": "ያሉ ቀለሞች",
  "{name} in {color}": "{name} በ{color}",
  "Show {name} in {color}": "{name}ን በ{color} አሳይ",
  "Choose a size": "መጠን ይምረጡ",
  "Checking stock availability…": "የክምችት መኖርን በመፈተሽ ላይ…",
  "Stock couldn't be checked. Try again later.": "ክምችቱን ማረጋገጥ አልተቻለም። ቆይተው እንደገና ይሞክሩ።",
  "Currently unavailable in this color.": "በዚህ ቀለም በአሁኑ ጊዜ የለም።",
  "Add to bag": "ወደ ቦርሳ ጨምር",
  "Buy now": "አሁን ግዛ",

  // Bag
  "Promo applied": "የቅናሽ ኮድ ተተግብሯል",
  "{percent}% off your order.": "ከትዕዛዝዎ {percent}% ቅናሽ።",
  "Invalid promo code": "ልክ ያልሆነ የቅናሽ ኮድ",
  "Your bag": "ቦርሳዎ",
  "Close cart": "ቦርሳ ዝጋ",
  "Your bag is empty.": "ቦርሳዎ ባዶ ነው።",
  "Begin with the pieces our customers return for.": "ደንበኞቻችን ደጋግመው በሚመርጧቸው ልብሶች ይጀምሩ።",
  "Shop the collection": "ስብስቡን ይግዙ",
  "Add {amount} for free Addis Ababa delivery.": "ለነፃ የአዲስ አበባ ማድረስ {amount} ይጨምሩ።",
  "Remove item": "ዕቃውን አስወግድ",
  "This size and color are unavailable. Remove it to continue.": "ይህ መጠንና ቀለም የለም። ለመቀጠል ያስወግዱት።",
  "Decrease quantity": "ብዛት ቀንስ",
  "Increase quantity": "ብዛት ጨምር",
  "Promo code": "የቅናሽ ኮድ",
  "This promo code has expired.": "ይህ የቅናሽ ኮድ ጊዜው አልፎበታል።",
  "This promo code has been fully used.": "ይህ የቅናሽ ኮድ ሙሉ በሙሉ ጥቅም ላይ ውሏል።",
  "This promo code isn't active yet.": "ይህ የቅናሽ ኮድ ገና አልጀመረም።",
  "We couldn't check this code. Please try again.": "ኮዱን ማረጋገጥ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Code {code} · {percent}% off": "ኮድ {code} · {percent}% ቅናሽ",
  "Add {amount} more to use this code.": "ይህንን ኮድ ለመጠቀም {amount} ተጨማሪ ይግዙ።",
  Apply: "ተግብር",
  Subtotal: "ንዑስ ድምር",
  "Promo discount {code}": "የቅናሽ ኮድ {code}",
  Delivery: "ማድረስ",
  Free: "ነፃ",
  Total: "ጠቅላላ",
  "Check stock for every item before continuing to checkout.":
    "ወደ ክፍያ ከመቀጠልዎ በፊት የእያንዳንዱን ዕቃ ክምችት ያረጋግጡ።",
  "Proceed to Checkout": "ወደ ክፍያ ይቀጥሉ",
  "Some selected size and color combinations are unavailable.": "አንዳንድ የተመረጡ የመጠንና የቀለም ጥምረቶች የሉም።",
  "Or order on chat": "ወይም በቻት ይዘዙ",

  // Search
  "Search suits, tops, colours, fabrics…": "ሱፍ ልብሶችን፣ ቶፖችን፣ ቀለሞችንና ጨርቆችን ይፈልጉ…",
  "Close search": "ፍለጋ ዝጋ",
  "No pieces found matching “{q}”.": "“{q}”ን የሚያሟላ ልብስ አልተገኘም።",

  // Categories (shop filters, search)
  suits: "ሱፍ ልብሶች",
  tops: "ቶፖች",
  sleeveless: "እጅጌ የሌለው",
  "long-sleeve": "ረጅም እጅጌ",
  "one-shoulder": "አንድ ትከሻ",
  "off-shoulder": "ትከሻ የሚያሳይ",
  cutout: "ክፍት ዲዛይን",
  basics: "መሠረታዊ",

  // Size chart
  Size: "መጠን",
  Bust: "ደረት",
  Waist: "ወገብ",
  Hips: "ዳሌ",
  "Measure around the fullest part of your chest, keeping the tape level under your arms.":
    "ሜትሩን ከብብትዎ ስር ቀጥ አድርገው በደረትዎ ሰፊው ክፍል ዙሪያ ይለኩ።",
  "Measure around your natural waistline — the narrowest part of your torso.":
    "በተፈጥሯዊ ወገብዎ — በሰውነትዎ በጣም ጠባብ ክፍል — ዙሪያ ይለኩ።",
  "Stand with feet together and measure around the fullest part of your hips.":
    "እግሮችዎን አጣምረው ቆመው በዳሌዎ ሰፊው ክፍል ዙሪያ ይለኩ።",

  // 404 / error
  "This page has wandered off.": "ይህ ገጽ ጠፍቷል።",
  "Return home": "ወደ መነሻ ይመለሱ",
  "This page didn't load": "ይህ ገጽ አልተከፈተም",
  "Try again": "እንደገና ይሞክሩ",
};
