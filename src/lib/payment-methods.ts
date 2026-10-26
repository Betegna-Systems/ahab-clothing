export const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on delivery",
    note: "Pay when your top arrives in Addis Ababa.",
    account: "",
  },
  {
    id: "telebirr",
    label: "Telebirr",
    note: "Transfer the total to our Telebirr number.",
    account: "+251941219026",
  },
  {
    id: "cbe",
    label: "CBE bank transfer",
    note: "Transfer the total to our CBE account.",
    account: "1000259462774",
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export function getPaymentMethod(id: string) {
  return PAYMENT_METHODS.find((method) => method.id === id);
}
