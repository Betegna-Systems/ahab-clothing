// Amharic translations, keyed by the English text shown on the site.
//
// For reviewers: each file in ./am/ covers one part of the site. Change only the Amharic
// (right-hand) side. Keep {placeholders} exactly as they are — they are filled in with names,
// numbers and order details. Lines with a "REVIEW:" comment are terms to double-check.
// Anything missing here is shown in English; `npm test` lists missing entries.
import { common } from "./am/common.ts";
import { shop } from "./am/shop.ts";
import { orders } from "./am/orders.ts";
import { account } from "./am/account.ts";
import { policies } from "./am/policies.ts";

export const amSections: Record<string, Record<string, string>> = {
  common,
  shop,
  orders,
  account,
  policies,
};

export const am: Record<string, string> = Object.assign({}, ...Object.values(amSections));
