// Policy pages: privacy, terms of service, returns & exchanges, shipping & delivery.
// Follows the GLOSSARY in ./common.ts. Already translated in common.ts and reused here:
// "Privacy policy", "Terms of service", "Customer care", "Custom commissions", "Contact",
// "Shipping & delivery".
export const policies: Record<string, string> = {
  // Shared eyebrow
  Legal: "ሕጋዊ",

  // Privacy policy (/privacy)
  "Privacy Policy": "የግላዊነት ፖሊሲ",
  "How AHAB Clothing collects, uses and protects your personal information.":
    "AHAB Clothing የግል መረጃዎን እንዴት እንደሚሰበስብ፣ እንደሚጠቀምበትና እንደሚጠብቀው።",
  "We collect only what we need to make, send and care for your order.":
    "የምንሰበስበው ትዕዛዝዎን ለመስራት፣ ለመላክና ለመንከባከብ የሚያስፈልገንን መረጃ ብቻ ነው።",
  "What we collect": "የምንሰበስበው መረጃ",
  "Your name, contact details, delivery address, measurements for custom work, and order history. When you submit a custom commission, we also store the request details and any inspiration images you choose to upload so our team can respond.":
    "ስምዎን፣ የመገኛ መረጃዎን፣ የማድረሻ አድራሻዎን፣ በልክ ለሚሰፋ ሥራ የሚያስፈልጉ ልኬቶችዎን እና የትዕዛዝ ታሪክዎን። በልክ የሚሰፋ ትዕዛዝ ሲያቀርቡ፣ ቡድናችን ምላሽ መስጠት እንዲችል የጥያቄውን ዝርዝር መረጃ እና ለመጫን የመረጧቸውን የሀሳብ መነሻ ምስሎች እናስቀምጣለን።",
  "How we use it": "መረጃውን እንዴት እንደምንጠቀምበት",
  "To fulfil orders, answer your questions, and respond to custom requests. Custom request details and images are available only to authorized AHAB administrators. We keep them while needed to handle your request; you may ask us to delete them by contacting us. We send occasional news about new collections only if you opt in.":
    "ትዕዛዞችን ለማሟላት፣ ጥያቄዎችዎን ለመመለስ እና ለበልክ ማሰፊያ ጥያቄዎች ምላሽ ለመስጠት። የበልክ ማሰፊያ ጥያቄ ዝርዝሮችና ምስሎች የሚደርሱት ፈቃድ ለተሰጣቸው የAHAB አስተዳዳሪዎች ብቻ ነው። ጥያቄዎን ለማስተናገድ እስካስፈለጉ ድረስ እናስቀምጣቸዋለን፤ እኛን በማግኘት እንድንሰርዛቸው መጠየቅ ይችላሉ። ስለ አዳዲስ ስብስቦች አልፎ አልፎ ዜና የምንልከው እርስዎ ለመቀበል ከፈቀዱ ብቻ ነው።", // REVIEW: "opt in" rendered as "ለመቀበል ከፈቀዱ" (if you consent to receive)
  "Your bag and wishlist": "ቦርሳዎና የምኞት ዝርዝርዎ",
  "These are stored on your own device and are not sent to us until you check out.":
    "እነዚህ በራስዎ መሣሪያ ላይ ይቀመጣሉ፤ ክፍያ እስኪፈጽሙ ድረስ ወደ እኛ አይላኩም።",
  "Your rights": "መብቶችዎ",
  "You may ask to see, correct or delete your information at any time by contacting us.":
    "በማንኛውም ጊዜ እኛን በማግኘት መረጃዎን ለማየት፣ ለማስተካከል ወይም ለመሰረዝ መጠየቅ ይችላሉ።",

  // Terms of service (/terms)
  "Terms of Service": "የአገልግሎት ውሎች",
  "The terms that apply when you shop with AHAB Clothing.": "ከAHAB Clothing ሲገዙ ተፈጻሚ የሚሆኑ ውሎች።",
  "By placing an order with AHAB Clothing you agree to these terms.":
    "ለAHAB Clothing ትዕዛዝ በማስገባትዎ በእነዚህ ውሎች ተስማምተዋል።", // REVIEW: legal wording of "you agree to these terms"
  Pricing: "ዋጋ",
  "All prices are shown in Ethiopian Birr (ETB). We reserve the right to correct pricing errors before an order ships.":
    "ሁሉም ዋጋዎች በኢትዮጵያ ብር (ETB) ይታያሉ። ትዕዛዝ ከመላኩ በፊት የዋጋ ስህተቶችን የማስተካከል መብታችን የተጠበቀ ነው።", // REVIEW: "reserve the right" rendered as "መብታችን የተጠበቀ ነው"
  "Handmade variation": "የእጅ ሥራ ልዩነት",
  "Our pieces are woven and finished by hand, so small variations in colour and pattern are part of their character, not a fault.":
    "ልብሶቻችን በእጅ የተሸመኑና የተጠናቀቁ በመሆናቸው በቀለምና በንድፍ ላይ የሚታዩ ጥቃቅን ልዩነቶች የባህሪያቸው አካል እንጂ ጉድለት አይደሉም።",
  "Commissions require a deposit and are non-refundable once cutting begins.":
    "በልክ የሚሰፉ ትዕዛዞች ቅድመ ክፍያ ይጠይቃሉ፤ ጨርቁ መቆረጥ ከጀመረ በኋላ ክፍያው ተመላሽ አይደረግም።", // REVIEW: "deposit" = ቅድመ ክፍያ; "non-refundable" = ክፍያው ተመላሽ አይደረግም
  "Questions about these terms? Reach us through the contact page.":
    "ስለ እነዚህ ውሎች ጥያቄ አለዎት? በ«ያግኙን» ገጽ በኩል ያግኙን።",

  // Returns & exchanges (/returns)
  "Returns & Exchanges": "ተመላሽ እና ልውውጥ",
  "How to return or exchange an AHAB piece within 14 days.":
    "የAHAB ልብስን በ14 ቀናት ውስጥ እንዴት መመለስ ወይም መለወጥ እንደሚቻል።",
  "Returns & exchanges": "ተመላሽ እና ልውውጥ",
  "If something isn't quite right, we'll make it right.": "አንድ ነገር ልክ ካልሆነ፣ እኛ እናስተካክለዋለን።",
  "14-day returns": "የ14 ቀን ተመላሽ",
  "Ready-to-wear pieces can be returned within 14 days of delivery, unworn, with tags attached and in the original dust bag.":
    "ዝግጁ ልብሶች ከደረሱበት ቀን ጀምሮ በ14 ቀናት ውስጥ፣ ሳይለበሱ፣ ታጎቻቸው ሳይነሱ እና በመጀመሪያው የአቧራ መከላከያ ከረጢታቸው ውስጥ ሆነው መመለስ ይችላሉ።", // REVIEW: "tags" = ታግ (avoids መለያ, which is "account" in the glossary); "dust bag" = የአቧራ መከላከያ ከረጢት (ቦርሳ is reserved for the shopping bag)
  Exchanges: "ልውውጥ",
  "We're happy to exchange for a different size or colour, subject to availability. Exchanges within Addis Ababa are collected free of charge.":
    "እንደ አቅርቦቱ ሁኔታ በሌላ መጠን ወይም ቀለም በደስታ እንለውጣለን። በአዲስ አበባ ውስጥ የሚለወጡ ልብሶችን ያለክፍያ መጥተን እንወስዳለን።",
  "Final sale": "የመጨረሻ ሽያጭ (የማይመለስ)", // REVIEW: "final sale" has no settled Amharic retail term; clarified as non-returnable
  "Custom commissions, altered pieces and sale items cannot be returned.":
    "በልክ የተሰፉ ትዕዛዞች፣ ማስተካከያ የተደረገባቸው ልብሶች እና በቅናሽ የተሸጡ ዕቃዎች ተመላሽ ሊደረጉ አይችሉም።",
  "How to start": "እንዴት እንደሚጀምሩ",
  "Contact us with your order number and we'll arrange collection or drop-off at the atelier.":
    "የትዕዛዝ ቁጥርዎን ይዘው ያግኙን፤ ልብሱን መጥተን እንድንወስድ ወይም ወደ ስቱዲዮአችን እንዲያመጡት እናመቻቻለን።", // REVIEW: "atelier" = ስቱዲዮ (sewing workshop)

  // Shipping & delivery (/shipping)
  "Shipping & Delivery": "መላኪያ እና ማድረስ",
  "AHAB delivery times and costs across Addis Ababa, Ethiopia and worldwide.":
    "በአዲስ አበባ፣ በኢትዮጵያ እና በመላው ዓለም የAHAB የማድረሻ ጊዜዎችና ወጪዎች።",
  "Every AHAB piece is packed by hand in our Addis Ababa atelier and wrapped in a cotton dust bag.":
    "እያንዳንዱ የAHAB ልብስ በአዲስ አበባ በሚገኘው ስቱዲዮአችን በእጅ ታሽጎ በጥጥ የአቧራ መከላከያ ከረጢት ይጠቀለላል።",
  "Addis Ababa": "አዲስ አበባ",
  "Delivery in 1–2 working days. Free on orders over ETB 5,000; otherwise ETB 250.":
    "ማድረስ በ1–2 የሥራ ቀናት ውስጥ። ከETB 5,000 በላይ ለሆኑ ትዕዛዞች ነፃ፤ ካልሆነ ግን ETB 250።",
  "Elsewhere in Ethiopia": "በሌሎች የኢትዮጵያ ክፍሎች",
  "Delivery in 3–5 working days via trusted courier. ETB 600 flat rate.":
    "በታማኝ የመልእክት አድራሽ ድርጅት አማካኝነት በ3–5 የሥራ ቀናት ውስጥ ማድረስ። ቋሚ ክፍያ ETB 600።", // REVIEW: "courier" = የመልእክት አድራሽ ድርጅት; "flat rate" = ቋሚ ክፍያ
  International: "ዓለም አቀፍ",
  "Delivery in 7–14 working days. Rates are calculated at checkout. Duties and taxes are paid by the recipient.":
    "ማድረስ በ7–14 የሥራ ቀናት ውስጥ። ዋጋው በክፍያ መፈጸሚያ ላይ ይሰላል። የጉምሩክ ቀረጥና ታክስ የሚከፈለው በተቀባዩ ነው።", // REVIEW: "duties" = የጉምሩክ ቀረጥ
  "Made-to-measure pieces ship once your final fitting is approved. We'll confirm the timeline with you directly.":
    "በልክ የሚሰፉ ልብሶች የመጨረሻ ልኬት ሙከራዎ ከጸደቀ በኋላ ይላካሉ። የጊዜ ሰሌዳውን በቀጥታ ከእርስዎ ጋር እናረጋግጣለን።", // REVIEW: "final fitting" = የመጨረሻ ልኬት ሙከራ
};
