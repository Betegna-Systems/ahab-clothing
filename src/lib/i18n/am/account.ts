// Customer account (sign in / sign up, email verification, two-step sign-in, saved
// addresses, order history) and the made-to-measure request form.
// Follows the GLOSSARY in ./common.ts. Shared words (Account, Bust, Waist, Hips, New) live there.
export const account: Record<string, string> = {
  // ── Account: page title & header ────────────────────────────────────────────
  "Sign in to view your AHAB orders, wishlist and saved addresses.":
    "የAHAB ትዕዛዞችዎን፣ የምኞት ዝርዝርዎንና የተቀመጡ አድራሻዎችዎን ለማየት ይግቡ።",
  "Your account": "መለያዎ",
  "Welcome back.": "እንኳን ደህና መጡ።", // REVIEW: "welcome back" — no exact Amharic idiom; ተመልሰው እንኳን ደህና መጡ is an alternative
  "A little more personal.": "ትንሽ ለየት ያለ፣ ለእርስዎ ብቻ።", // REVIEW: brand tagline, free rendering
  "Accounts are temporarily unavailable.": "መለያዎች ለጊዜው አይገኙም።",
  "The storefront deployment is missing its public Supabase Auth configuration. The shop and guest checkout remain available; please try again later.":
    "የመለያ መግቢያ አገልግሎቱ ለጊዜው አልተዘጋጀም። ሱቁና ያለ መለያ ግዢ መፈጸሚያው ግን ይሰራሉ፤ እባክዎ ቆይተው እንደገና ይሞክሩ።", // REVIEW: technical detail (Supabase config) simplified for customers
  "Continue shopping": "ግዢዎን ይቀጥሉ",

  // ── Account: new password (from the reset email) ────────────────────────────
  "Choose a new password": "አዲስ የይለፍ ቃል ይምረጡ",
  "Use at least 12 characters for your new password.": "ለአዲሱ የይለፍ ቃልዎ ቢያንስ 12 ቁምፊዎችን ይጠቀሙ።",
  "New password": "አዲስ የይለፍ ቃል",
  "Updating…": "በማዘመን ላይ…",
  "Update password": "የይለፍ ቃል ያዘምኑ",
  "Checking your account…": "መለያዎን በመፈተሽ ላይ…",

  // ── Account: two-step sign-in (authenticator app) ───────────────────────────
  "Verify your sign-in": "መግባትዎን ያረጋግጡ",
  "Enter the six-digit code from your authenticator app to continue.":
    "ለመቀጠል ከማረጋገጫ መተግበሪያዎ (authenticator app) ያገኙትን ባለ ስድስት አሃዝ ኮድ ያስገቡ።",
  "Verifying…": "በማረጋገጥ ላይ…",
  "Verify and continue": "አረጋግጠው ይቀጥሉ",
  "Sign out": "ይውጡ",
  "Checking account security": "የመለያ ደህንነትን በመፈተሽ ላይ",
  "We couldn't complete the security check. Sign out and try again, or contact AHAB support if you no longer have your authenticator.":
    "የደህንነት ፍተሻውን ማጠናቀቅ አልቻልንም። ወጥተው እንደገና ይሞክሩ፤ የማረጋገጫ መተግበሪያዎ ከሌለዎት የAHAB ድጋፍን ያግኙ።",

  // ── Account: sign in / create account / reset password ──────────────────────
  "Check your inbox": "የኢሜይል ሳጥንዎን ይመልከቱ",
  "If an account exists for {email}, you’ll receive a link to reset the password. Check spam if it doesn’t arrive.":
    "ለ{email} መለያ ካለ፣ የይለፍ ቃሉን የሚቀይሩበት ሊንክ ይደርስዎታል። ካልደረሰዎት የአይፈለጌ (spam) ማህደሩን ይመልከቱ።",
  "Sign in": "ይግቡ",
  "Create your account": "መለያዎን ይፍጠሩ",
  "Reset your password": "የይለፍ ቃልዎን ይቀይሩ",
  "Full name": "ሙሉ ስም",
  "Email address": "የኢሜይል አድራሻ",
  "Password (at least 12 characters)": "የይለፍ ቃል (ቢያንስ 12 ቁምፊዎች)",
  Password: "የይለፍ ቃል",
  "Please wait…": "እባክዎ ይጠብቁ…",
  "Create account": "መለያ ይፍጠሩ",
  "Sending…": "በመላክ ላይ…",
  "Send reset link": "የመቀየሪያ ሊንክ ይላኩ",
  "Forgot password?": "የይለፍ ቃልዎን ረሱት?",
  "Resend verification email": "የማረጋገጫ ኢሜይሉን እንደገና ይላኩ",
  "This account still needs email verification. Check spam, or resend the verification email above.":
    "ይህ መለያ አሁንም የኢሜይል ማረጋገጫ ይፈልጋል። የአይፈለጌ (spam) ማህደሩን ይመልከቱ፣ ወይም ከላይ የማረጋገጫ ኢሜይሉን እንደገና ይላኩ።",
  "New to AHAB?": "ለAHAB አዲስ ነዎት?",
  "Already have an account?": "መለያ አለዎት?",
  "Create an account": "መለያ ይፍጠሩ",
  "Made for you": "ለእርስዎ የተዘጋጀ",
  "See orders placed while signed in, or saved from their tracking links.":
    "ገብተው ያዘዟቸውን ወይም ከመከታተያ ሊንካቸው ያስቀመጧቸውን ትዕዛዞች ይመልከቱ።",
  "Keep your wishlist in sync across devices.": "የምኞት ዝርዝርዎን በሁሉም መሣሪያዎችዎ ላይ አንድ አድርገው ይያዙ።",
  "Save delivery addresses for a quicker checkout.": "ለፈጣን ክፍያ አፈጻጸም የማድረሻ አድራሻዎችን ያስቀምጡ።",
  "Continue as a guest": "ያለ መለያ ይቀጥሉ",

  // ── Account: signed-in overview ─────────────────────────────────────────────
  "Email verified": "ኢሜይል ተረጋግጧል",
  "Email verification pending": "የኢሜይል ማረጋገጫ በመጠባበቅ ላይ",
  "Manage custom requests": "በልክ የሚሰፉ ጥያቄዎችን ያስተዳድሩ",

  // ── Account: account security (two-step sign-in setup) ──────────────────────
  "Account security": "የመለያ ደህንነት",
  "Scan this QR code with an authenticator app, then enter its six-digit code.":
    "ይህንን QR ኮድ በማረጋገጫ መተግበሪያ (authenticator app) ይቃኙ፤ ከዚያም መተግበሪያው የሚያሳየውን ባለ ስድስት አሃዝ ኮድ ያስገቡ።",
  "Authenticator setup QR code": "የማረጋገጫ መተግበሪያ ማዋቀሪያ QR ኮድ",
  "Setup key: {secret}": "የማዋቀሪያ ቁልፍ፦ {secret}",
  "Enable authenticator": "የማረጋገጫ መተግበሪያውን ያብሩ",
  "Cancel setup": "ማዋቀሩን ይሰርዙ",
  "Authenticator verification is required when you sign in.": "ሲገቡ በማረጋገጫ መተግበሪያ ማረጋገጥ ያስፈልጋል።",
  "Disable authenticator sign-in": "በማረጋገጫ መተግበሪያ መግባትን ያጥፉ",
  "Add an authenticator app for an extra sign-in step. It is optional and can be disabled later.":
    "ለተጨማሪ የመግቢያ ደረጃ የማረጋገጫ መተግበሪያ ያክሉ። ግዴታ አይደለም፤ በኋላም ማጥፋት ይችላሉ።",
  "Activate authenticator sign-in": "በማረጋገጫ መተግበሪያ መግባትን ያግብሩ",
  "Set up an authenticator": "የማረጋገጫ መተግበሪያ ያዋቅሩ",

  // ── Account: order history ──────────────────────────────────────────────────
  "Your orders": "ትዕዛዞችዎ",
  "Loading your orders…": "ትዕዛዞችዎን በመጫን ላይ…",
  "Orders placed while signed in appear here. For earlier orders, open the tracking link and choose “Save to my account”.":
    "ገብተው ያዘዟቸው ትዕዛዞች እዚህ ይታያሉ። ለቀደሙ ትዕዛዞች የመከታተያ ሊንኩን ከፍተው “በመለያዬ አስቀምጥ”ን ይምረጡ።", // quoted label matches the tracking page's "Save to my account" (orders.ts)
  "Discover the collection": "ስብስቡን ይመልከቱ",
  // Order statuses and "Payment confirmed" are in orders.ts.
  // Payment status (from paymentStatusLabel)
  "Receipt received, being verified": "ደረሰኙ ደርሶናል፣ በመረጋገጥ ላይ ነው",
  "Pay on delivery": "ሲደርስ ይክፈሉ",
  "Awaiting payment": "ክፍያ በመጠባበቅ ላይ",

  // ── Account: saved addresses ────────────────────────────────────────────────
  "Saved addresses": "የተቀመጡ አድራሻዎች",
  Remove: "አስወግድ",
  "Save an address to make your next checkout quicker.": "የሚቀጥለው ክፍያዎ ፈጣን እንዲሆን አድራሻ ያስቀምጡ።",
  "Add an address": "አድራሻ ያክሉ",
  "Label (e.g. Home)": "መጠሪያ (ለምሳሌ፦ ቤት)",
  "Recipient name": "የተቀባዩ ስም",
  Phone: "ስልክ",
  "Sub-city": "ክፍለ ከተማ",
  City: "ከተማ",
  "Street, building or landmark": "መንገድ፣ ሕንፃ ወይም የታወቀ ቦታ",
  "Save address": "አድራሻ ያስቀምጡ",

  // ── Account: status messages ────────────────────────────────────────────────
  "Complete authenticator verification to view your orders.":
    "ትዕዛዞችዎን ለማየት በማረጋገጫ መተግበሪያ ማረጋገጥን ያጠናቅቁ።",
  "Verify your email address to view your order history.": "የትዕዛዝ ታሪክዎን ለማየት የኢሜይል አድራሻዎን ያረጋግጡ።",
  "Some account information couldn't be loaded. Please try again.":
    "አንዳንድ የመለያ መረጃዎች ሊጫኑ አልቻሉም። እባክዎ እንደገና ይሞክሩ።",
  "We couldn't verify your account security. Please sign out and try again.":
    "የመለያዎን ደህንነት ማረጋገጥ አልቻልንም። እባክዎ ወጥተው እንደገና ይሞክሩ።",
  "Account sign-in is not configured for this deployment.": "የመለያ መግቢያ በዚህ ድረ-ገጽ ላይ ገና አልተዘጋጀም።",
  "We couldn't check your sign-in. Please refresh and try again.":
    "መግባትዎን ማረጋገጥ አልቻልንም። እባክዎ ገጹን አድሰው እንደገና ይሞክሩ።",
  "We couldn't load account sign-in. Please try again later.":
    "የመለያ መግቢያውን መጫን አልቻልንም። እባክዎ ቆይተው እንደገና ይሞክሩ።",
  "Verify your email address before signing in. Check your inbox for the confirmation link.":
    "ከመግባትዎ በፊት የኢሜይል አድራሻዎን ያረጋግጡ። የማረጋገጫ ሊንኩን በኢሜይል ሳጥንዎ ውስጥ ይፈልጉ።",
  "Verify your email address before signing in. You can resend the confirmation email below.":
    "ከመግባትዎ በፊት የኢሜይል አድራሻዎን ያረጋግጡ። የማረጋገጫ ኢሜይሉን ከታች እንደገና መላክ ይችላሉ።",
  "Your account is ready.": "መለያዎ ዝግጁ ነው።",
  "Check your inbox to verify your email and finish creating your account.":
    "ኢሜይልዎን አረጋግጠው መለያዎን መፍጠር ለማጠናቀቅ የኢሜይል ሳጥንዎን ይመልከቱ።",
  "We couldn't sign you in with those details. Check your email and password, then try again.":
    "በእነዚህ መረጃዎች ማስገባት አልቻልንም። ኢሜይልዎንና የይለፍ ቃልዎን አረጋግጠው እንደገና ይሞክሩ።",
  "We couldn't create your account. Check your details and try again.":
    "መለያዎን መፍጠር አልቻልንም። መረጃዎን አረጋግጠው እንደገና ይሞክሩ።",
  "That verification code couldn't be accepted. Check the code and try again.":
    "ያ የማረጋገጫ ኮድ ተቀባይነት አላገኘም። ኮዱን አረጋግጠው እንደገና ይሞክሩ።",
  "We couldn't start authenticator setup. Please try again.":
    "የማረጋገጫ መተግበሪያ ማዋቀርን መጀመር አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Authenticator sign-in is enabled for your account.": "ለመለያዎ በማረጋገጫ መተግበሪያ መግባት በርቷል።",
  "We couldn't enable the authenticator. Check the code and try again.":
    "የማረጋገጫ መተግበሪያውን ማብራት አልቻልንም። ኮዱን አረጋግጠው እንደገና ይሞክሩ።",
  "We couldn't cancel authenticator setup. Please try again.":
    "የማረጋገጫ መተግበሪያ ማዋቀሩን መሰረዝ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Authenticator sign-in has been disabled.": "በማረጋገጫ መተግበሪያ መግባት ጠፍቷል።",
  "We couldn't disable authenticator sign-in. Try again after verifying your current code.":
    "በማረጋገጫ መተግበሪያ መግባትን ማጥፋት አልቻልንም። የአሁኑን ኮድዎን አረጋግጠው እንደገና ይሞክሩ።",
  "Enter your email address above first.": "መጀመሪያ የኢሜይል አድራሻዎን ከላይ ያስገቡ።",
  "If this address has a pending account, a new verification email is on its way.":
    "ይህ አድራሻ ያልተረጋገጠ መለያ ካለው፣ አዲስ የማረጋገጫ ኢሜይል እየተላከ ነው።",
  "We couldn't resend the verification email. Please wait a moment and try again.":
    "የማረጋገጫ ኢሜይሉን እንደገና መላክ አልቻልንም። እባክዎ ጥቂት ቆይተው እንደገና ይሞክሩ።",
  "If an account exists for that email, a password reset link is on its way.":
    "ለዚያ ኢሜይል መለያ ካለ፣ የይለፍ ቃል መቀየሪያ ሊንክ እየተላከ ነው።",
  "We couldn't send a password reset link. Please wait a moment and try again.":
    "የይለፍ ቃል መቀየሪያ ሊንክ መላክ አልቻልንም። እባክዎ ጥቂት ቆይተው እንደገና ይሞክሩ።",
  "Your password has been updated.": "የይለፍ ቃልዎ ተቀይሯል።",
  "We couldn't update your password. Check the password requirements and try again.":
    "የይለፍ ቃልዎን መቀየር አልቻልንም። የይለፍ ቃል መስፈርቶቹን አረጋግጠው እንደገና ይሞክሩ።",
  "Delivery address saved.": "የማድረሻ አድራሻው ተቀምጧል።",
  "We couldn't save that address. Please try again.": "ያንን አድራሻ ማስቀመጥ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Delivery address removed.": "የማድረሻ አድራሻው ተወግዷል።",
  "We couldn't remove that address. Please try again.": "ያንን አድራሻ ማስወገድ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "You have been signed out.": "ወጥተዋል።",
  "We couldn't sign you out. Please try again.": "ማስወጣት አልቻልንም። እባክዎ እንደገና ይሞክሩ።",

  // ── Custom (made-to-measure) page: title & intro ────────────────────────────
  "Custom Commissions": "በልክ የሚሰፉ ትዕዛዞች",
  "Commission a made-to-measure AHAB suit or bodycon top, designed with you and sewn in our Addis Ababa atelier.":
    "ከእርስዎ ጋር ተነድፎ በአዲስ አበባ የስፌት ቤታችን የሚሰፋ፣ በልክ የሚሰፋ የAHAB ሱፍ ልብስ ወይም ሰውነትን የሚይዝ ቶፕ ያዙ።",
  "Seamstress fitting a garment on a dress form in the AHAB atelier":
    "በAHAB የስፌት ቤት ውስጥ ልብስን በልብስ መለኪያ አሻንጉሊት ላይ የምታስተካክል ሰፊ",
  "The Atelier": "የስፌት ቤታችን",
  // "Made for {lines}": {lines} is the gold italic phrase "your lines."
  "Made for {lines}": "{lines} የተሰራ።", // REVIEW: headline wordplay; reads "made for your shape"
  "your lines.": "ለእርስዎ ቅርጽ",
  "Commission a made-to-measure suit or bodycon top — designed around your style, colour and fit, then sewn in our Addis Ababa atelier.":
    "በልክ የሚሰፋ ሱፍ ልብስ ወይም ሰውነትን የሚይዝ ቶፕ ያዙ — በእርስዎ ስታይል፣ ቀለምና ልክ ተነድፎ በአዲስ አበባ የስፌት ቤታችን ይሰፋል።", // REVIEW: "bodycon" rendered as ሰውነትን የሚይዝ
  "Share your vision below": "ሐሳብዎን ከታች ያጋሩን",
  "Consultation with a designer": "ከዲዛይነር ጋር ምክክር",
  "Fabric, colour & fit selection": "የጨርቅ፣ የቀለምና የልክ ምርጫ",
  "Fitting, alterations & delivery": "ልኬት፣ ማስተካከያና ማድረስ", // REVIEW: "fitting" = trying the garment on (ማስሞከር) — ልኬት may read as "measuring"

  // ── Custom page: request form ───────────────────────────────────────────────
  "Begin your commission": "ትዕዛዝዎን ይጀምሩ",
  Email: "ኢሜይል",
  "What would you like made?": "ምን እንዲሰፋልዎ ይፈልጋሉ?",
  "Custom top": "በልክ የሚሰፋ ቶፕ",
  "Custom suit": "በልክ የሚሰፋ ሱፍ ልብስ",
  Occasion: "ዝግጅት",
  Everyday: "ለዕለት ተዕለት",
  Wedding: "ሠርግ",
  Engagement: "ቀለበት ማሰር (እጮኝነት)",
  "Holiday / Meskel / Timket": "በዓል / መስቀል / ጥምቀት",
  Graduation: "ምረቃ",
  "Work / formal": "ሥራ / መደበኛ",
  Other: "ሌላ",
  "Suit style": "የሱፍ ልብስ ዓይነት",
  "Top style": "የቶፕ ዓይነት",
  "Two-piece suit": "ባለ ሁለት ክፍል ሱፍ ልብስ",
  "Single-breasted suit": "ባለ አንድ ረድፍ ቁልፍ ሱፍ ልብስ",
  "Double-breasted suit": "ባለ ሁለት ረድፍ ቁልፍ ሱፍ ልብስ",
  "Tuxedo suit": "ቱክሲዶ ሱፍ ልብስ",
  "Wide-leg suit": "ሰፊ እግር ሱሪ ያለው ሱፍ ልብስ",
  "Other / full custom design": "ሌላ / ሙሉ በሙሉ የራሴ ዲዛይን",
  "One-shoulder top": "ባለ አንድ ትከሻ ቶፕ",
  "Square neck top": "ባለ አራት ማዕዘን አንገት ቶፕ",
  "Cowl neck top": "ባለ ተንጠልጣይ አንገት ቶፕ", // REVIEW: "cowl neck" — no settled Amharic term
  "Corset-style top": "የኮርሴት ዓይነት ቶፕ",
  "Cutout top": "ክፍት ዲዛይን ያለው ቶፕ",
  "Full custom design": "ሙሉ በሙሉ የራሴ ዲዛይን",
  "Preferred colour": "የሚመርጡት ቀለም",
  "Burgundy, navy, or a reference": "ቡርጋንዲ፣ ባሕር ሰማያዊ ወይም ምሳሌ",
  "Deep burgundy": "ጥቁር ቡርጋንዲ",
  "Preferred fabric": "የሚመርጡት ጨርቅ",
  "Optional — we can recommend fabrics": "አማራጭ — ጨርቅ ልንመክርዎ እንችላለን",
  Budget: "በጀት",
  "Suit measurements (cm) — optional, we can take them at your fitting":
    "የሱፍ ልብስ ልኬቶች (ሴ.ሜ) — አማራጭ፤ በሚለኩበት ቀን ልንወስድልዎ እንችላለን",
  "Measurements (cm) — optional, we can take them at your fitting":
    "ልኬቶች (ሴ.ሜ) — አማራጭ፤ በሚለኩበት ቀን ልንወስድልዎ እንችላለን",
  "{measurement} measurement in centimeters": "የ{measurement} ልኬት በሴንቲሜትር",
  // Measurement names (Bust, Waist, Hips are in common.ts)
  Height: "ቁመት",
  "Shoulder width": "የትከሻ ስፋት",
  "Sleeve length": "የእጅጌ ርዝመት",
  "Jacket length": "የኮት ርዝመት",
  "Trouser waist": "የሱሪ ወገብ",
  "Trouser inseam": "የሱሪ ውስጠኛ እግር ርዝመት", // REVIEW: inseam = crotch-to-hem length
  "Fit or alteration preferences": "የልክ ወይም የማስተካከያ ምርጫዎች",
  "No preference yet — advise me": "ገና አልወሰንኩም — ይምከሩኝ",
  "Close / tailored fit": "ሰውነትን የሚይዝ / በልክ የተሰፋ",
  "Relaxed fit": "ሰፋ ያለ",
  "Room for later alterations": "በኋላ ለማስተካከል የሚሆን ትርፍ ቦታ",
  "Discuss at fitting": "በልኬት ቀን እንወያይ",
  "Upload inspiration images": "የመነሻ ሐሳብ ምስሎችን ይጫኑ",
  "JPG, PNG or WebP, up to 3 images. Uploaded privately.":
    "JPG፣ PNG ወይም WebP፣ እስከ 3 ምስሎች። በግል ይጫናሉ።",
  "Additional notes": "ተጨማሪ ማስታወሻ",
  // {link} is the "privacy policy" link
  "I agree that AHAB may store my contact details, measurements, and private inspiration images to respond to this commission, as described in the {link}.":
    "AHAB ለዚህ ትዕዛዝ ምላሽ ለመስጠት የመገኛ መረጃዬን፣ ልኬቶቼንና በግል የጫንኳቸውን የመነሻ ሐሳብ ምስሎች እንዲያስቀምጥ፣ በ{link} በተገለጸው መሠረት እስማማለሁ።",
  "privacy policy": "የግላዊነት ፖሊሲ",
  "Sending request…": "ጥያቄውን በመላክ ላይ…",
  "Send my suit request": "የሱፍ ልብስ ጥያቄዬን ላክ",
  "Send my top request": "የቶፕ ጥያቄዬን ላክ",

  // ── Custom page: messages ───────────────────────────────────────────────────
  "Too many requests were sent from this email. Please try again later.":
    "ከዚህ ኢሜይል በጣም ብዙ ጥያቄዎች ተልከዋል። እባክዎ ቆይተው እንደገና ይሞክሩ።",
  "Check that measurements contain numbers in centimeters.": "ልኬቶቹ በሴንቲሜትር ቁጥሮች መሆናቸውን ያረጋግጡ።",
  "An inspiration image could not be verified. Please choose another image.":
    "አንዱ የመነሻ ሐሳብ ምስል ሊረጋገጥ አልቻለም። እባክዎ ሌላ ምስል ይምረጡ።",
  "We couldn't upload the inspiration images. Please try again.":
    "የመነሻ ሐሳብ ምስሎቹን መጫን አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "We couldn't save your request. Please try again.": "ጥያቄዎን ማስቀመጥ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Request saved. Your reference is {reference}.": "ጥያቄዎ ተቀምጧል። የመለያ ቁጥርዎ {reference} ነው።",
  "Your custom request has been sent to AHAB.": "በልክ የሚሰፋ ጥያቄዎ ወደ AHAB ተልኳል።",
  "We couldn't submit your request. Please check your connection and try again.":
    "ጥያቄዎን መላክ አልቻልንም። እባክዎ የኢንተርኔት ግንኙነትዎን አረጋግጠው እንደገና ይሞክሩ።",
  "Please choose no more than 3 inspiration images.": "እባክዎ ከ3 ያልበለጡ የመነሻ ሐሳብ ምስሎችን ይምረጡ።",
  "Each inspiration image must be smaller than 20 MB.": "እያንዳንዱ የመነሻ ሐሳብ ምስል ከ20 MB ያነሰ መሆን አለበት።",
  "Choose JPG, PNG, or WebP inspiration images.": "JPG፣ PNG ወይም WebP የመነሻ ሐሳብ ምስሎችን ይምረጡ።",
  "An inspiration photo is too large. Choose a file under 20 MB.":
    "የመነሻ ሐሳብ ፎቶው በጣም ትልቅ ነው። ከ20 MB በታች የሆነ ፋይል ይምረጡ።",
  "Choose a smaller-resolution inspiration photo.": "ጥራቱ (resolution) ያነሰ የመነሻ ሐሳብ ፎቶ ይምረጡ።",
  "Your browser couldn't prepare the inspiration photo.": "አሳሽዎ የመነሻ ሐሳብ ፎቶውን ማዘጋጀት አልቻለም።",
  "An inspiration photo is too large to upload. Choose a smaller image.":
    "የመነሻ ሐሳብ ፎቶው ለመጫን በጣም ትልቅ ነው። ያነሰ ምስል ይምረጡ።",
};
