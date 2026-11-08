// Checkout, payment, order tracking and the order confirmation email.
// Follows the GLOSSARY in ./common.ts. Shared words (Subtotal, Delivery, Free, Total, Try again,
// Your bag is empty., Promo discount {code}, New) come from common.ts.
// "link" is written ሊንክ (the everyday word on Ethiopian sites) rather than ማስፈንጠሪያ.
export const orders: Record<string, string> = {
  // Payment methods (labels and notes from payment-methods.ts; shown at checkout, payment page
  // and in the email). The English label is what the order stores.
  "Cash on delivery": "ሲደርስ በጥሬ ገንዘብ መክፈል",
  Telebirr: "Telebirr",
  "CBE bank transfer": "CBE ባንክ ዝውውር", // REVIEW: also read inside "በ{method}" ("በCBE ባንክ ዝውውር ይክፈሉ")
  "Pay when your top arrives in Addis Ababa.": "ትዕዛዝዎ አዲስ አበባ ውስጥ ሲደርስልዎ ይክፈሉ።", // REVIEW: English says "top"; "order" used because it also applies to suits
  "Transfer the total to our Telebirr number.": "ጠቅላላ ገንዘቡን ወደ Telebirr ቁጥራችን ያስተላልፉ።",
  "Transfer the total to our CBE account.": "ጠቅላላ ገንዘቡን ወደ CBE ሂሳባችን ያስተላልፉ።",

  // Checkout page
  Checkout: "ክፍያ መፈጸሚያ",
  "Complete your AHAB order — delivery details and order summary.":
    "የAHAB ትዕዛዝዎን ያጠናቅቁ — የማድረሻ መረጃና የትዕዛዝ ማጠቃለያ።",
  Copied: "ተቀድቷል",
  "Copy is unavailable in this browser.": "በዚህ ብራውዘር መቅዳት አይቻልም።",
  Copy: "ቅዳ",
  "Saved delivery addresses couldn't be loaded.": "የተቀመጡ የማድረሻ አድራሻዎችን መጫን አልተቻለም።",
  "Some items are unavailable. Update your bag before placing the order.":
    "አንዳንድ ዕቃዎች የሉም። ትዕዛዙን ከማስገባትዎ በፊት ቦርሳዎን ያስተካክሉ።",
  "We couldn't send your order. Please try again.": "ትዕዛዝዎን መላክ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "One or more selected size and color combinations are not available.":
    "ከተመረጡት የመጠንና የቀለም ጥምረቶች አንዱ ወይም ከዚያ በላይ የሉም።",
  "There isn't enough stock for the requested quantity. Update your bag and try again.":
    "ለጠየቁት ብዛት በቂ ክምችት የለም። ቦርሳዎን አስተካክለው እንደገና ይሞክሩ።",
  "Prices or delivery charges have changed. Review your bag and try again.":
    "ዋጋዎች ወይም የማድረሻ ክፍያዎች ተቀይረዋል። ቦርሳዎን ተመልክተው እንደገና ይሞክሩ።",
  "Several orders were just placed with this phone number. Please contact AHAB on chat to place another.":
    "በዚህ ስልክ ቁጥር በቅርቡ በርካታ ትዕዛዞች ተሰጥተዋል። ሌላ ትዕዛዝ ለማስገባት እባክዎ AHABን በቻት ያግኙ።",
  "Thank you": "እናመሰግናለን",
  "Your order is placed.": "ትዕዛዝዎ ተመዝግቧል።",
  "Order {number}": "ትዕዛዝ {number}",
  "We'll call you shortly to confirm delivery and payment. For a faster reply, send us your order on chat:":
    "ማድረሱንና ክፍያውን ለማረጋገጥ በቅርቡ እንደውልልዎታለን። ፈጣን ምላሽ ለማግኘት ትዕዛዝዎን በቻት ይላኩልን፦",
  "Track this order": "ይህንን ትዕዛዝ ይከታተሉ",
  "Continue shopping": "ግዢዎን ይቀጥሉ",
  "Discover the collection": "ስብስቡን ይመልከቱ",
  "Delivery details": "የማድረሻ መረጃ",
  "Use a saved address": "የተቀመጠ አድራሻ ይጠቀሙ",
  "Enter a new delivery address": "አዲስ የማድረሻ አድራሻ ያስገቡ",
  "First name": "ስም",
  "Last name": "የአባት ስም",
  "Phone (e.g. 0911 223344)": "ስልክ (ለምሳሌ 0911 223344)",
  "Email (optional)": "ኢሜይል (አማራጭ)",
  "Sub-city (e.g. Bole)": "ክፍለ ከተማ (ለምሳሌ ቦሌ)",
  City: "ከተማ",
  "Street, building or landmark": "መንገድ፣ ሕንፃ ወይም የታወቀ ቦታ",
  "Notes for delivery (optional)": "ለማድረስ የሚረዱ ማስታወሻዎች (አማራጭ)",
  Payment: "ክፍያ",
  "Stock availability couldn't be verified.": "የክምችት መኖርን ማረጋገጥ አልተቻለም።",
  "Checking stock for your order…": "ለትዕዛዝዎ ክምችት በመፈተሽ ላይ…",
  "One or more items are unavailable in the selected size or color. Remove them from your bag before continuing.":
    "አንድ ወይም ከዚያ በላይ ዕቃዎች በተመረጠው መጠን ወይም ቀለም የሉም። ከመቀጠልዎ በፊት ከቦርሳዎ ያስወግዷቸው።",
  "Sending…": "በመላክ ላይ…",
  "Place order": "ትዕዛዙን ያስገቡ",
  "Order summary": "የትዕዛዝ ማጠቃለያ",

  // Payment page (/payment/…)
  "Complete Your Payment | AHAB": "ክፍያዎን ያጠናቅቁ | AHAB",
  "Unable to read this image.": "ይህንን ምስል ማንበብ አልተቻለም።",
  "Choose a photo smaller than 20 MB.": "ከ20 MB ያነሰ ፎቶ ይምረጡ።",
  "This photo format can't be read. Choose a JPG, PNG, or WebP image.":
    "የዚህ ፎቶ ቅርጸት ሊነበብ አይችልም። JPG፣ PNG ወይም WebP ምስል ይምረጡ።",
  "This photo can't be prepared on your device.": "ይህንን ፎቶ በመሣሪያዎ ላይ ማዘጋጀት አልተቻለም።",
  "This photo is too large to prepare. Choose a smaller image.":
    "ይህ ፎቶ ለማዘጋጀት በጣም ትልቅ ነው። አነስ ያለ ምስል ይምረጡ።",
  "This payment link is no longer available.": "ይህ የክፍያ ሊንክ ከአሁን በኋላ አይሰራም።",
  "Payment confirmed.": "ክፍያዎ ተረጋግጧል።",
  "Payment is still awaiting verification.": "ክፍያዎ አሁንም ማረጋገጫ በመጠባበቅ ላይ ነው።",
  "We couldn't check your payment status. Please try again.":
    "የክፍያዎን ሁኔታ ማረጋገጥ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Payment link unavailable.": "የክፍያ ሊንኩ አይገኝም።",
  "Check the link from your order confirmation or contact AHAB for help.":
    "በትዕዛዝ ማረጋገጫዎ ላይ ያለውን ሊንክ ያረጋግጡ ወይም ለእርዳታ AHABን ያግኙ።",
  "Return to the shop": "ወደ ሱቁ ይመለሱ",
  "Payment details unavailable.": "የክፍያ ዝርዝሩ አይገኝም።",
  "Please contact AHAB with order {number}.": "እባክዎ የትዕዛዝ ቁጥር {number}ን ይዘው AHABን ያግኙ።",
  "We couldn't prepare this photo.": "ይህንን ፎቶ ማዘጋጀት አልቻልንም።",
  "Choose your payment screenshot first.": "መጀመሪያ የክፍያ ደረሰኝዎን ፎቶ ይምረጡ።",
  "A screenshot has already been submitted for this order.": "ለዚህ ትዕዛዝ የደረሰኝ ፎቶ ቀድሞ ተልኳል።",
  "We couldn't submit your screenshot. Please try again or send it by chat.":
    "የደረሰኝ ፎቶዎን መላክ አልቻልንም። እባክዎ እንደገና ይሞክሩ ወይም በቻት ይላኩት።",
  "Payment screenshot received.": "የክፍያ ደረሰኝ ፎቶዎ ደርሶናል።",
  "Complete your payment.": "ክፍያዎን ያጠናቅቁ።",
  "Transfer the exact total, then upload a screenshot of your receipt.":
    "ትክክለኛውን ጠቅላላ መጠን ያስተላልፉ፤ ከዚያም የደረሰኝዎን ፎቶ (ስክሪንሾት) ይጫኑ።", // REVIEW: "screenshot" rendered as "የደረሰኝ ፎቶ" throughout, with the loanword ስክሪንሾት here
  "Payment instructions": "የክፍያ መመሪያ",
  "Pay with {method}": "በ{method} ይክፈሉ",
  "Payment details copied.": "የክፍያ ዝርዝሩ ተቀድቷል።",
  "Copy details": "ዝርዝሩን ቅዳ",
  "Amount to transfer": "የሚያስተላልፉት መጠን",
  "Send the amount above to the {method} account.": "ከላይ ያለውን መጠን በ{method} ወደ ተጠቀሰው ሂሳብ ያስተላልፉ።",
  "Keep your payment receipt screenshot. Make sure the amount and transaction reference are visible.":
    "የክፍያ ደረሰኝዎን ፎቶ (ስክሪንሾት) ያስቀምጡ። የገንዘቡ መጠንና የግብይት መለያ ቁጥሩ በግልጽ መታየታቸውን ያረጋግጡ።", // REVIEW: "transaction reference" → የግብይት መለያ ቁጥር; banks/Telebirr may say "የግብይት ቁጥር"
  "Upload the screenshot below. AHAB will review it and confirm your order.":
    "ፎቶውን ከታች ይጫኑ። AHAB ገምግሞ ትዕዛዝዎን ያረጋግጣል።",
  "Payment confirmed": "ክፍያ ተረጋግጧል",
  "Screenshot received": "የደረሰኝ ፎቶ ደርሶናል",
  "Your payment has been verified. AHAB will contact you to confirm delivery.":
    "ክፍያዎ ተረጋግጧል። ማድረሱን ለማረጋገጥ AHAB ያነጋግርዎታል።",
  "We’ll verify your payment and contact you to confirm delivery.":
    "ክፍያዎን አረጋግጠን ማድረሱን ለማረጋገጥ እናነጋግርዎታለን።",
  "Checking…": "በማረጋገጥ ላይ…",
  "Check payment status": "የክፍያ ሁኔታን ያረጋግጡ",
  "Payment screenshot": "የክፍያ ደረሰኝ ፎቶ",
  "Choose a photo from your phone or take one now. We’ll convert it to JPG and resize it for upload. Your receipt is stored privately with this order.":
    "ከስልክዎ ፎቶ ይምረጡ ወይም አሁን ያንሱ። ለመጫን እንዲመች ወደ JPG ቀይረን መጠኑን እናስተካክለዋለን። ደረሰኝዎ ከዚህ ትዕዛዝ ጋር በግል ይቀመጣል።",
  "Selected: {name}": "የተመረጠው፦ {name}",
  "Preparing photo…": "ፎቶውን በማዘጋጀት ላይ…",
  "Sending screenshot…": "ፎቶውን በመላክ ላይ…",
  "Send payment screenshot": "የክፍያ ደረሰኝ ፎቶ ይላኩ",
  "Need help? You can also send the screenshot to AHAB in chat.":
    "እርዳታ ይፈልጋሉ? የደረሰኝ ፎቶውን ለAHAB በቻትም መላክ ይችላሉ።",

  // Tracking page (/tracking/…)
  "Track Your Order | AHAB": "ትዕዛዝዎን ይከታተሉ | AHAB",
  "Order tracking": "የትዕዛዝ ክትትል",
  "Placed {date}": "የታዘዘበት ቀን፦ {date}",
  "Current status": "የአሁኑ ሁኔታ",
  "Current status: {status}": "የአሁኑ ሁኔታ፦ {status}",
  "Your order has been received.": "ትዕዛዝዎ ደርሶናል።",
  "Your order is being prepared.": "ትዕዛዝዎ በዝግጅት ላይ ነው።",
  "Your order is on its way.": "ትዕዛዝዎ በመንገድ ላይ ነው።",
  "Your order has been delivered.": "ትዕዛዝዎ ደርሷል።",
  "This order has been cancelled. Contact AHAB if you need assistance.":
    "ይህ ትዕዛዝ ተሰርዟል። እርዳታ ከፈለጉ AHABን ያግኙ።",
  "Payment receipt received and awaiting verification.": "የክፍያ ደረሰኝዎ ደርሶናል፤ ማረጋገጫ በመጠባበቅ ላይ ነው።",
  "Refreshing…": "በማደስ ላይ…",
  "Refresh status": "ሁኔታውን አድስ",
  "This tracking link is no longer available.": "ይህ የመከታተያ ሊንክ ከአሁን በኋላ አይሰራም።",
  "Order status updated.": "የትዕዛዝ ሁኔታ ታድሷል።",
  "We couldn't refresh your order status. Please try again.":
    "የትዕዛዝዎን ሁኔታ ማደስ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Tracking link unavailable.": "የመከታተያ ሊንኩ አይገኝም።",
  "Check the order link or contact AHAB for help.": "የትዕዛዝ ሊንኩን ያረጋግጡ ወይም ለእርዳታ AHABን ያግኙ።",
  "Need help? Share order {number} with AHAB.": "እርዳታ ይፈልጋሉ? የትዕዛዝ ቁጥር {number}ን ለAHAB ያጋሩ።",
  "Contact customer care": "የደንበኞች አገልግሎትን ያግኙ",

  // Order statuses (stored in English by the admin app; "New" is in common.ts)
  Confirmed: "ተረጋግጧል",
  Processing: "በሂደት ላይ",
  "Being prepared": "በዝግጅት ላይ",
  Packed: "ታሽጓል",
  Shipped: "ተልኳል",
  "Out for delivery": "ለማድረስ ወጥቷል",
  "In transit": "በመጓጓዝ ላይ",
  Delivered: "ደርሷል",
  Cancelled: "ተሰርዟል",

  // Tracking page — save to account
  "Order saved to your account.": "ትዕዛዙ በመለያዎ ተቀምጧል።",
  "Complete two-step verification in your account first.": "መጀመሪያ በመለያዎ ባለሁለት ደረጃ ማረጋገጫን ያጠናቅቁ።",
  "Verify your account email first.": "መጀመሪያ የመለያዎን ኢሜይል ያረጋግጡ።",
  "This order is already linked to another account.": "ይህ ትዕዛዝ ቀድሞውኑ ከሌላ መለያ ጋር ተገናኝቷል።",
  "We couldn't save this order to your account.": "ይህንን ትዕዛዝ በመለያዎ ማስቀመጥ አልቻልንም።",
  "View in account": "በመለያ ውስጥ ይመልከቱ",
  "Saving…": "በማስቀመጥ ላይ…",
  "Save to my account": "በመለያዬ አስቀምጥ",

  // Tracking page — verified reviews after delivery
  "Share your experience": "ተሞክሮዎን ያካፍሉ",
  "Reviews are linked to delivered orders and published only after AHAB approval. Customer photos stay private until approved.":
    "አስተያየቶች ከደረሱ ትዕዛዞች ጋር የተያያዙ ሲሆኑ የሚታተሙት AHAB ካጸደቃቸው በኋላ ብቻ ነው። የደንበኞች ፎቶዎች እስኪጸድቁ ድረስ በግል ይቆያሉ።",
  "Name to show with your review": "ከአስተያየትዎ ጋር የሚታይ ስም",
  "Rating for {name}": "ለ{name} የሚሰጡት ደረጃ",
  "1 star": "1 ኮከብ",
  "{count} stars": "{count} ኮከቦች",
  "How did the fit feel? (optional)": "ልኩ እንዴት ነበር? (አማራጭ)",
  "Optional customer photo for {name}": "ለ{name} የደንበኛ ፎቶ (አማራጭ)",
  "Submitting…": "በመላክ ላይ…",
  "Submit verified review": "የተረጋገጠ አስተያየት ይላኩ",
  "Choose a JPG, PNG, or WebP photo smaller than 3 MB.": "ከ3 MB ያነሰ JPG፣ PNG ወይም WebP ፎቶ ይምረጡ።",
  "We couldn't verify this order.": "ይህንን ትዕዛዝ ማረጋገጥ አልቻልንም።",
  "Reviews can be submitted after delivery.": "አስተያየት መስጠት የሚቻለው ትዕዛዙ ከደረሰ በኋላ ነው።",
  "This product isn't part of this order.": "ይህ ምርት የዚህ ትዕዛዝ አካል አይደለም።",
  "Choose a valid JPG, PNG, or WebP photo smaller than 3 MB.":
    "ከ3 MB ያነሰ ትክክለኛ JPG፣ PNG ወይም WebP ፎቶ ይምረጡ።",
  "We couldn't upload your photo. Please try again.": "ፎቶዎን መጫን አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "A review has already been submitted for this product.": "ለዚህ ምርት አስተያየት ቀድሞ ተሰጥቷል።",
  "We couldn't save your review. Please try again.": "አስተያየትዎን ማስቀመጥ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Review submitted for verification.": "አስተያየትዎ ለማረጋገጫ ተልኳል።",
  "We couldn't submit your review. Please try again.": "አስተያየትዎን መላክ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Review received. It will appear after AHAB verifies and approves it.":
    "አስተያየትዎ ደርሶናል። AHAB አረጋግጦ ካጸደቀው በኋላ ይታያል።",

  // Order confirmation email (subject, plain text and HTML)
  "Your AHAB order {number}": "የAHAB ትዕዛዝዎ {number}",
  "Hi {name},": "ሰላም {name}፣",
  there: "ውድ ደንበኛችን", // greeting name when the customer gave none: "Hi there," → "ሰላም ውድ ደንበኛችን፣"
  "Thank you for your order. Your order number is {number}.":
    "ስለ ትዕዛዝዎ እናመሰግናለን። የትዕዛዝ ቁጥርዎ {number} ነው።",
  "Thank you, {name}.": "{name}፣ እናመሰግናለን።",
  "Thank you for your order.": "ስለ ትዕዛዝዎ እናመሰግናለን።",
  "Your order {number} is placed.": "ትዕዛዝዎ {number} ተመዝግቧል።",
  "{name} ({color}, size {size}) ×{qty}: {price}": "{name} ({color}፣ መጠን {size}) ×{qty}፦ {price}",
  "size {size}": "መጠን {size}",
  Discount: "ቅናሽ",
  "Please transfer {amount} via {method} to {account}, then upload your receipt so we can confirm your order.":
    "እባክዎ {amount} በ{method} ወደ {account} ያስተላልፉ፤ ከዚያም ትዕዛዝዎን እንድናረጋግጥ ደረሰኝዎን ይጫኑ።",
  "We'll call you shortly to confirm delivery. You pay when your order arrives.":
    "ማድረሱን ለማረጋገጥ በቅርቡ እንደውልልዎታለን። ክፍያውን የሚፈጽሙት ትዕዛዝዎ ሲደርስ ነው።",
  "Upload your receipt": "ደረሰኝዎን ይጫኑ",
  "Upload receipt": "ደረሰኝ ይጫኑ",
  "Track your order": "ትዕዛዝዎን ይከታተሉ",
  "These links are private to your order — keep this email and don't share them.":
    "እነዚህ ሊንኮች ለትዕዛዝዎ ብቻ የተዘጋጁ ናቸው — ይህንን ኢሜይል ያስቀምጡ፤ ሊንኮቹንም ለሌላ ሰው አያጋሩ።",
  "AHAB Clothing · Made in Addis Ababa": "AHAB Clothing · በአዲስ አበባ የተሰራ",
};
