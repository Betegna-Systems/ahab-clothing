// Storefront pages: home, shop, product, wishlist, lookbook, about, contact, size guide.
// Follows the GLOSSARY in ./common.ts. Shared words (Shop, Size, In stock, Delivery…) live there.
// "bodycon" is rendered as ሰውነትን ተከትሎ የሚቀመጥ ("follows the body") throughout.
export const shop: Record<string, string> = {
  // ── Home page ───────────────────────────────────────────────────────────────
  "AHAB Suits & Tops — Made in Addis Ababa": "AHAB ሱፍ ልብሶች እና ቶፖች — በአዲስ አበባ የተሰራ",
  "Discover tailored women's suits and sculpted tops, designed and sewn by hand in Addis Ababa.":
    "በአዲስ አበባ በእጅ ተነድፈውና ተሰፍተው የተዘጋጁ የሴቶች ሱፍ ልብሶችንና ቅርጽን የሚያጎሉ ቶፖችን ያግኙ።",
  "Model wearing the chocolate Taitu double-breasted AHAB suit":
    "የቸኮሌት ቀለም ያለውን ባለሁለት ረድፍ ቁልፍ የጣይቱ AHAB ሱፍ ልብስ የለበሰች ሞዴል", // REVIEW: "double-breasted" = ባለሁለት ረድፍ ቁልፍ
  "AHAB Suits": "AHAB ሱፍ ልብሶች",
  // Hero headline is shown as "<Tailored for> <em>Her.</em>" — read together: "የተሰፋው ለእሷ ነው።"
  "Tailored for": "የተሰፋው", // REVIEW: split headline, word order chosen so both halves read naturally
  "Her.": "ለእሷ ነው።", // REVIEW: second half of the split headline above
  "AHAB Suits and bodycon tops, designed and tailored in Addis Ababa.":
    "በአዲስ አበባ የተነደፉና የተሰፉ AHAB ሱፍ ልብሶችና ሰውነትን ተከትለው የሚቀመጡ ቶፖች።", // REVIEW: "bodycon"
  "Shop AHAB Suits": "AHAB ሱፍ ልብሶችን ይግዙ",
  "Shop the Tops": "ቶፖቹን ይግዙ",
  "The Collections": "ስብስቦቹ",
  "Two lines. One signature.": "ሁለት መስመሮች። አንድ መለያ።", // REVIEW: tagline; "signature" as መለያ (hallmark)
  Discover: "ይመልከቱ",
  "Just Arrived": "አዲስ የገቡ",
  "New this season.": "የዚህ ወቅት አዲሶች።",
  "View all": "ሁሉንም ይመልከቱ",
  "Most Loved": "በብዛት የተወደዱ",
  "The tops they return for.": "ደንበኞች ደጋግመው የሚመለሱላቸው ቶፖች።",
  "Seamstress pinning a top pattern in the AHAB atelier":
    "በAHAB የስፌት ስቱዲዮ ውስጥ የቶፕ ንድፍ በመርፌ የምታያይዝ ልብስ ሰፊ", // REVIEW: "atelier" = የስፌት ስቱዲዮ
  "The Craft Behind AHAB": "ከAHAB ጀርባ ያለው ጥበብ",
  // Shown as "<Every stitch.> <em>One body</em> <at a time.>"
  "Every stitch.": "እያንዳንዱ ስፌት።",
  "One body": "ለአንድ ሰውነት", // REVIEW: split headline "Every stitch. One body at a time."
  "at a time.": "በአንድ ጊዜ።",
  "Every top is cut, seamed and finished by hand in our Addis Ababa atelier — fitted on real bodies, not just the mannequin, so the stretch holds you exactly where it should.":
    "እያንዳንዱ ቶፕ በአዲስ አበባ የስፌት ስቱዲዮአችን በእጅ ይቆረጣል፣ ይሰፋል፣ ይጠናቀቃል — በማኒኩዊን ላይ ብቻ ሳይሆን በእውነተኛ ሰውነት ላይ ይለካል፤ ስለዚህ የሚለጠጠው ጨርቅ በሚገባው ቦታ ልክ ይይዝዎታል።",
  "Made in Addis Ababa": "በአዲስ አበባ የተሰራ",
  "Cut and finished by hand in our own atelier.": "በራሳችን የስፌት ስቱዲዮ በእጅ ተቆርጦ የተጠናቀቀ።",
  "A fit that holds": "ጸንቶ የሚቆይ ልክ",
  "Each style is fitted on the body before it ships.": "እያንዳንዱ ዲዛይን ከመላኩ በፊት በሰውነት ላይ ይለካል።",
  "Quality fabrics": "ጥራት ያላቸው ጨርቆች",
  "Stretch knits and crepes chosen for recovery and feel.":
    "ቅርጻቸውን መልሰው በመያዛቸውና በልስላሴያቸው የተመረጡ የሚለጠጡ የሹራብ ጨርቆችና ክሬፖች።", // REVIEW: "knits", "crepes", "recovery"
  "Fair work": "ፍትሐዊ ሥራ",
  "Fair pay for every tailor who stitches a piece.": "ልብስ ለሚሰፋ ለእያንዳንዱ ልብስ ሰፊ ፍትሐዊ ክፍያ።",
  "Read our story": "ታሪካችንን ያንብቡ",
  "Customer feedback": "የደንበኞች አስተያየት",
  "Reviews after delivery.": "ከደረሰ በኋላ የሚሰጡ አስተያየቶች።",
  "We’re preparing verified customer reviews. Feedback will be published after an order has been delivered and reviewed.":
    "የተረጋገጡ የደንበኞች አስተያየቶችን እያዘጋጀን ነው። አስተያየቶች የሚታተሙት ትዕዛዝ ደርሶ ከተገመገመ በኋላ ነው።",
  "Follow Our Journey": "ጉዟችንን ይከተሉ",
  "Addis Ababa": "አዲስ አበባ",
  // Shown as "<Worn Close.> <em>Worn Often.</em>"
  "Worn Close.": "ተጠግቶ የሚለበስ።", // REVIEW: tagline, literal rendering
  "Worn Often.": "ደጋግሞ የሚለበስ።", // REVIEW: tagline, literal rendering
  "Start Shopping": "መግዛት ይጀምሩ",

  // Collection tiles (home page; data in src/lib/products.ts)
  "Tailored two-piece suits for women, cut in Addis Ababa.":
    "በአዲስ አበባ የተቆረጡ ባለሁለት ክፍል የሴቶች ሱፍ ልብሶች።",
  Sleeveless: "እጅጌ የሌለው",
  "Square necks, halters and corsets for warm evenings.": "ለሞቃት ምሽቶች ካሬ አንገት፣ ሆልተርና ኮርሴት ቶፖች።", // REVIEW: "halter", "corset" kept as loanwords
  "One Shoulder": "አንድ ትከሻ",
  "Diagonal necklines that do the talking.": "ራሳቸውን የሚገልጹ ሰያፍ አንገቶች።",
  "Long Sleeve": "ረጅም እጅጌ",
  "Cowl, mock neck and rib, cut close to the body.":
    "ከሰውነት ጋር ተጠግተው የተቆረጡ የተሸበሸበ አንገት፣ ከፍ ያለ አንገትና ሪብ ቶፖች።", // REVIEW: "cowl", "mock neck", "rib"
  Cutouts: "ክፍት ዲዛይኖች",
  "A single opening, placed to catch the eye.": "ዓይንን እንዲስብ ተደርጎ የተቀመጠ አንድ ክፍት ቦታ።",
  "Everyday Basics": "የዕለት ተዕለት መሠረታዊ ልብሶች",
  "The pieces you will buy in a second colour.": "በሌላ ቀለምም ደግመው የሚገዟቸው ልብሶች።",

  // ── Shop page ───────────────────────────────────────────────────────────────
  "Shop AHAB Suits and bodycon tops — tailored women's suits and sculpted tops, made in Addis Ababa.":
    "AHAB ሱፍ ልብሶችንና ሰውነትን ተከትለው የሚቀመጡ ቶፖችን ይግዙ — በአዲስ አበባ የተሰሩ የሴቶች ሱፍ ልብሶችና ቅርጽን የሚያጎሉ ቶፖች።",
  "Off Shoulder": "ትከሻ የሚያሳይ",
  Basics: "መሠረታዊ",
  Colour: "ቀለም",
  "Up to ETB {amount}": "እስከ ETB {amount}",
  "Clear all": "ሁሉንም አጽዳ",
  "The Collection": "ስብስቡ",
  "All pieces": "ሁሉም ልብሶች",
  All: "ሁሉም",
  Filter: "ማጣሪያ",
  "{count} pieces": "{count} ልብሶች",
  "Sort by": "ቅደም ተከተል ይምረጡ",
  Newest: "አዲሶቹ መጀመሪያ",
  Popular: "ተወዳጅ",
  "Price: low to high": "ዋጋ፦ ከዝቅተኛ ወደ ከፍተኛ",
  "Price: high to low": "ዋጋ፦ ከከፍተኛ ወደ ዝቅተኛ",
  "Best rated": "ከፍተኛ ደረጃ የተሰጣቸው",
  "No pieces match — try clearing a filter.": "የሚዛመድ ልብስ የለም — ማጣሪያ አጽድተው ይሞክሩ።",
  "Close filters": "ማጣሪያዎችን ዝጋ",
  "Show {count} pieces": "{count} ልብሶችን አሳይ",

  // ── Product page ────────────────────────────────────────────────────────────
  "This piece is no longer available.": "ይህ ልብስ ከአሁን በኋላ አይገኝም።",
  "Back to the shop": "ወደ ሱቁ ይመለሱ",
  "Please choose a size": "እባክዎ መጠን ይምረጡ",
  "Stock availability couldn't be checked. Please try again later.":
    "የክምችት መኖርን ማረጋገጥ አልተቻለም። እባክዎ ቆይተው እንደገና ይሞክሩ።",
  "That size and color are currently unavailable.": "ያ መጠንና ቀለም በአሁኑ ጊዜ የለም።",
  Stop: "አቁም",
  "360° view": "360° እይታ",
  "New Arrival": "አዲስ የገባ",
  "On Sale": "በቅናሽ ላይ",
  "{rating} out of 5 stars": "ከ5 ኮከቦች {rating}",
  "{count} verified review": "{count} የተረጋገጠ አስተያየት",
  "{count} verified reviews": "{count} የተረጋገጡ አስተያየቶች",
  "No verified reviews yet": "እስካሁን የተረጋገጠ አስተያየት የለም",
  "Checking size and color availability…": "የመጠንና የቀለም መኖርን በመፈተሽ ላይ…",
  "Availability couldn't be checked. Please try again later.":
    "መኖሩን ማረጋገጥ አልተቻለም። እባክዎ ቆይተው እንደገና ይሞክሩ።",
  "This size and color are currently unavailable.": "ይህ መጠንና ቀለም በአሁኑ ጊዜ የለም።",
  "Select an available size and color.": "ያለ መጠንና ቀለም ይምረጡ።",
  "Add to Cart": "ወደ ቦርሳ ጨምር",
  "Buy Now": "አሁን ግዛ",
  "Or order by chat": "ወይም በቻት ይዘዙ",
  Fabric: "ጨርቅ",
  Care: "እንክብካቤ",
  "Suit size & fit": "የሱፍ ልብስ መጠንና ልክ",
  "For a suit-specific fit note, contact AHAB.": "ለዚህ ሱፍ ልብስ የተለየ የልክ ማብራሪያ ለማግኘት AHABን ያግኙ።",
  "The size chart shows body measurements, not finished garment measurements.":
    "የመጠን ሰንጠረዡ የሚያሳየው የሰውነት ልኬቶችን እንጂ የተጠናቀቀውን ልብስ ልኬቶች አይደለም።",
  "For jacket or trouser measurements and possible alterations, contact AHAB before ordering so the team can confirm options for this suit.":
    "የኮት ወይም የሱሪ ልኬቶችንና ሊደረጉ የሚችሉ ማስተካከያዎችን ለማወቅ፣ ቡድናችን ለዚህ ሱፍ ልብስ ያሉትን አማራጮች እንዲያረጋግጥልዎ ከማዘዝዎ በፊት AHABን ያግኙ።",
  "Addis Ababa:": "አዲስ አበባ፦",
  "1–2 days, free over ETB 5,000.": "ከ1–2 ቀናት፤ ከETB 5,000 በላይ ነፃ።",
  "Across Ethiopia:": "በመላው ኢትዮጵያ፦",
  "3–6 days via trusted courier.": "በታመነ የመላኪያ አገልግሎት ከ3–6 ቀናት።",
  "International:": "ከኢትዮጵያ ውጭ፦",
  "coming soon — message us to arrange.": "በቅርቡ ይጀምራል — ለማመቻቸት መልእክት ይላኩልን።",
  "Verified customer reviews": "የተረጋገጡ የደንበኞች አስተያየቶች",
  "Fit: {fit}": "ልክ፦ {fit}",
  "Customer photo for {name}": "የ{name} የደንበኛ ፎቶ",
  "{name} · Verified purchase": "{name} · የተረጋገጠ ግዢ",
  "No customer reviews have been published for this piece yet.":
    "ለዚህ ልብስ እስካሁን የታተመ የደንበኛ አስተያየት የለም።",
  "You may also love": "ሊወዷቸው የሚችሉ ሌሎች",
  "Recently viewed": "በቅርቡ የተመለከቷቸው",

  // Suit fit notes (product page, per suit)
  "Sharp shoulders and a nipped waist pair with high-rise wide-leg trousers.":
    "ቀጥ ያሉ ትከሻዎችና የጠበበ ወገብ ከፍ ያለ ወገብ ካለው ሰፊ እግር ሱሪ ጋር ይጣመራሉ።",
  "A clean one-button blazer with straight-leg trousers.": "ቀለል ያለ ባለአንድ ቁልፍ ብሌዘር ከቀጥተኛ እግር ሱሪ ጋር።",
  "A relaxed oversized blazer with fluid wide-leg trousers.":
    "ዘና ያለ ሰፋ ያለ ብሌዘር ከሚወርድ ሰፊ እግር ሱሪ ጋር።",
  "A cropped blazer pairs with high-waisted pleated trousers.":
    "አጠር ያለ ብሌዘር ከፍ ያለ ወገብ ካለው ባለ ፕሊት ሱሪ ጋር ይጣመራል።", // REVIEW: "pleated" = ባለ ፕሊት
  "A nipped-waist blazer pairs with slim high-waisted trousers.":
    "ወገብ ላይ የጠበበ ብሌዘር ከፍ ያለ ወገብ ካለው ጠባብ ሱሪ ጋር ይጣመራል።",
  "A wrap-front blazer adjusts with its belt and pairs with wide-leg trousers.":
    "ፊቱ የሚጠቀለል ብሌዘር በቀበቶው ይስተካከላል፤ ከሰፊ እግር ሱሪ ጋር ይጣመራል።",
  "A fitted blazer with satin shawl lapels pairs with straight-leg trousers.":
    "የሳቲን ሻውል ኮሌታ ያለው ልክ የሆነ ብሌዘር ከቀጥተኛ እግር ሱሪ ጋር ይጣመራል።", // REVIEW: "shawl lapels"
  "An unstructured linen-blend blazer pairs with cropped trousers.":
    "ጠንካራ ቅርጽ ያልተሰጠው የሊነን ድብልቅ ብሌዘር ከአጠር ያለ ሱሪ ጋር ይጣመራል።",
  "A waist-tailored blazer with a velvet collar.": "የቬልቬት ኮሌታ ያለው ወገብ ላይ ልክ የተሰፋ ብሌዘር።",
  "A fitted blazer pairs with floor-sweeping wide-leg trousers.":
    "ልክ የሆነ ብሌዘር መሬት ከሚነካ ሰፊ እግር ሱሪ ጋር ይጣመራል።",

  // ── Wishlist ────────────────────────────────────────────────────────────────
  "Your saved AHAB pieces.": "ያስቀመጧቸው የAHAB ልብሶች።",
  "Your wishlist": "የምኞት ዝርዝርዎ",
  "Tap the heart on any piece to save it here.": "ማንኛውንም ልብስ እዚህ ለማስቀመጥ በላዩ ያለውን የልብ ምልክት ይንኩ።",
  "Discover the collection": "ስብስቡን ይመልከቱ",

  // ── Lookbook ────────────────────────────────────────────────────────────────
  "Lookbook — Autumn 2026": "የፋሽን ማሳያ — መጸው 2026", // REVIEW: "Autumn" = መጸው
  "AHAB suits and sculpted tops of Autumn 2026, photographed in our Addis Ababa studio.":
    "በአዲስ አበባ ስቱዲዮአችን የተነሱ የመጸው 2026 AHAB ሱፍ ልብሶችና ቅርጽን የሚያጎሉ ቶፖች።",
  "Volume I · Autumn 2026": "ቅጽ 1 · መጸው 2026",
  // Shown as "<Second> <em>skin.</em>"
  Second: "ሁለተኛ",
  "skin.": "ቆዳ።",
  "The tops of AHAB, photographed in our Addis Ababa studio.": "በአዲስ አበባ ስቱዲዮአችን የተነሱ የAHAB ቶፖች።",
  "Ivory one-shoulder bodycon top in warm studio light":
    "በሞቃት የስቱዲዮ ብርሃን ውስጥ የዝሆን ጥርስ ቀለም ያለው ባለአንድ ትከሻ ቶፕ",
  "The Line": "መስመሩ",
  "“A fitted top should hold you, never hold you back.”": "“ልክ የሆነ ቶፕ ሊይዝዎ እንጂ ሊገድብዎ አይገባም።”",
  "Burgundy wrap-front top in warm studio light": "በሞቃት የስቱዲዮ ብርሃን ውስጥ ቡርጋንዲ ቀለም ያለው ፊቱ የሚጠቀለል ቶፕ",
  "The Studio": "ስቱዲዮው",
  "Every seam is pinned on a body, not a hanger.": "እያንዳንዱ ስፌት የሚያያዘው በመስቀያ ላይ ሳይሆን በሰውነት ላይ ነው።",
  "Shop the looks": "እነዚህን አለባበሶች ይግዙ",

  // ── About ───────────────────────────────────────────────────────────────────
  "The story of AHAB — an independent house in Addis Ababa designing and sewing women's suits and tops by hand.":
    "የAHAB ታሪክ — በአዲስ አበባ የሴቶች ሱፍ ልብሶችንና ቶፖችን በእጅ የሚነድፍና የሚሰፋ ራሱን የቻለ ቤት።",
  "AHAB founder in her Addis Ababa atelier": "የAHAB መሥራች በአዲስ አበባ የስፌት ስቱዲዮዋ ውስጥ",
  "The Founder": "መሥራቿ",
  // Shown as "<A house built on> <em>fit.</em>" — read together: "ቤታችን የተገነባው በልክ ላይ ነው።"
  "A house built on": "ቤታችን የተገነባው", // REVIEW: split headline, reordered for Amharic
  "fit.": "በልክ ላይ ነው።", // REVIEW: second half of the split headline above
  "AHAB began at a single sewing table in Addis Ababa with one belief: that a fitted top, cut properly, can carry a whole outfit. Today we sew that top — one style, one body, one stitch at a time.":
    "AHAB በአዲስ አበባ በአንድ የስፌት ጠረጴዛ ላይ በአንድ እምነት ተጀመረ፦ በትክክል የተቆረጠ ልክ የሆነ ቶፕ ሙሉ አለባበስን ሊያደምቅ ይችላል። ዛሬ ያንን ቶፕ እንሰፋለን — አንድ ዲዛይን፣ አንድ ሰውነት፣ አንድ ስፌት በአንድ ጊዜ።",
  "Why AHAB exists": "AHAB ለምን ተመሠረተ",
  "Because a well-cut top can change how a woman carries herself. AHAB makes that top in Addis Ababa, one body at a time.":
    "ምክንያቱም በሚገባ የተቆረጠ ቶፕ አንዲት ሴት ራሷን የምትይዝበትን መንገድ ሊለውጥ ይችላል። AHAB ያንን ቶፕ በአዲስ አበባ፣ ለአንድ ሰውነት በአንድ ጊዜ ይሰራል።",
  "The fit philosophy": "የልክ ፍልስፍናችን",
  "Bodycon should never mean uncomfortable. Every style is drafted to stretch, hold and breathe — fitted on real bodies before it ever ships.":
    "ሰውነትን ተከትሎ የሚቀመጥ ልብስ ፈጽሞ የማይመች መሆን የለበትም። እያንዳንዱ ዲዛይን እንዲለጠጥ፣ እንዲይዝና አየር እንዲያስገባ ተደርጎ ይነደፋል — ከመላኩ በፊት በእውነተኛ ሰውነት ላይ ይለካል።", // REVIEW: "bodycon"
  "How we make them": "እንዴት እንደምንሰራቸው",
  "Knits are cut, seamed and finished by hand in our atelier, with fair pay for every tailor who stitches a piece.":
    "የሹራብ ጨርቆች በስፌት ስቱዲዮአችን በእጅ ይቆረጣሉ፣ ይሰፋሉ፣ ይጠናቀቃሉ፤ ለሚሰፋ ለእያንዳንዱ ልብስ ሰፊም ፍትሐዊ ክፍያ ይከፈላል።",
  "Our vision": "ራዕያችን",
  "To put an Addis Ababa-made top in wardrobes around the world, quietly and confidently.":
    "በአዲስ አበባ የተሰራ ቶፕ በጸጥታና በልበ ሙሉነት በዓለም ዙሪያ ባሉ የልብስ ቁም ሣጥኖች ውስጥ እንዲገኝ ማድረግ።",
  "Made With Love.": "በፍቅር የተሰራ።",
  "Shop the tops": "ቶፖቹን ይግዙ",

  // ── Contact ─────────────────────────────────────────────────────────────────
  "Reach AHAB Clothing in Addis Ababa by phone, email, WhatsApp or social media.":
    "AHAB Clothingን በአዲስ አበባ በስልክ፣ በኢሜይል፣ በWhatsApp ወይም በማኅበራዊ ሚዲያ ያግኙ።",
  "Your email draft is ready. Send it from your mail app to complete your message.":
    "የኢሜይል ረቂቅዎ ዝግጁ ነው። መልእክትዎን ለማጠናቀቅ ከኢሜይል መተግበሪያዎ ይላኩት።",
  "We'd love to hear from you.": "ከእርስዎ መስማት እንወዳለን።",
  Name: "ስም",
  Email: "ኢሜይል",
  Phone: "ስልክ",
  "Your message": "መልእክትዎ",
  "Send message": "መልእክት ይላኩ",
  "Chat with us": "ያነጋግሩን",
  "Addis Ababa, Ethiopia": "አዲስ አበባ፣ ኢትዮጵያ",
  "AHAB location": "የAHAB መገኛ",

  // ── Size guide ──────────────────────────────────────────────────────────────
  "Size Guide": "የመጠን መመሪያ",
  "Find your AHAB size — bust, waist and hip measurements for our women's suits and tops.":
    "የAHAB መጠንዎን ያግኙ — ለሴቶች ሱፍ ልብሶቻችንና ቶፖቻችን የደረት፣ የወገብና የዳሌ ልኬቶች።",
  "Body measurements for AHAB suits and tops. Between sizes? Choose the larger, or contact us for a tailored fit.":
    "ለAHAB ሱፍ ልብሶችና ቶፖች የሰውነት ልኬቶች። በሁለት መጠኖች መካከል ነዎት? ትልቁን ይምረጡ፣ ወይም ለተስተካከለ ልክ ያግኙን።",
  "Suit fit": "የሱፍ ልብስ ልክ",
  // Shown as "<Blazers … alterations, or> <link>request a made-to-measure suit</link><.>"
  "Blazers and trousers are sized together. If your bust and hip fall in different sizes, choose the larger and we can advise on alterations, or":
    "ብሌዘሮችና ሱሪዎች በአንድ ላይ በመጠን ይዘጋጃሉ። ደረትዎና ዳሌዎ በተለያዩ መጠኖች ውስጥ ከሆኑ ትልቁን ይምረጡ፤ ስለ ማስተካከያዎች ልንመክርዎ እንችላለን፣ ወይም",
  "request a made-to-measure suit": "በልክ የሚሰፋ ሱፍ ልብስ ይጠይቁ",
  ".": "።",
};
