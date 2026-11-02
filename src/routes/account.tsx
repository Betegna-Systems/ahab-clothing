import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { AhabButton, AhabLink } from "@/components/site/ui";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getAccountOrders } from "@/lib/orders.functions";
import { formatPrice } from "@/lib/products";
import { seo } from "@/lib/seo";

type SavedAddress = Database["public"]["Tables"]["account_saved_addresses"]["Row"];
type AccountOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  total: number;
  items: { slug: string; name: string }[];
};

const field =
  "h-12 w-full border border-border bg-transparent px-4 text-sm outline-none focus:border-primary";

export const Route = createFileRoute("/account")({
  head: () =>
    seo("Account", "Sign in to view your AHAB orders, wishlist and saved addresses.", {
      path: "/account",
      index: false,
    }),
  component: AccountPage,
});

function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const loadAccountData = useCallback(async (activeSession: Session) => {
    setLoadingData(true);
    try {
      const [orderResult, addressResult] = await Promise.all([
        getAccountOrders({ data: { accessToken: activeSession.access_token } }),
        supabase
          .from("account_saved_addresses")
          .select("*")
          .eq("user_id", activeSession.user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (!orderResult.ok) {
        setOrders([]);
        setNotice("Verify your email address to view orders placed with that email.");
      } else {
        setOrders(orderResult.orders);
      }

      if (addressResult.error) throw addressResult.error;
      setAddresses(addressResult.data ?? []);
    } catch (error) {
      console.error("Account data lookup failed:", error);
      setNotice("Some account information couldn't be loaded. Please try again.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setPasswordRecovery(event === "PASSWORD_RECOVERY");
      setNotice("");
      if (nextSession) {
        window.setTimeout(() => void loadAccountData(nextSession), 0);
      } else {
        setOrders([]);
        setAddresses([]);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [loadAccountData]);

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") ?? "");

    try {
      if (mode === "sign_up") {
        const name = String(form.get("name") ?? "").trim();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });
        if (error) throw error;
        if (data.session) {
          setNotice("Your account is ready.");
        } else {
          setVerificationPending(true);
          setNotice("Check your inbox to verify your email and finish creating your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            setVerificationPending(true);
          }
          throw error;
        }
      }
    } catch (error) {
      console.error("Account authentication failed:", error);
      setNotice(
        error instanceof Error ? error.message : "We couldn't complete sign-in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const resendVerificationEmail = async () => {
    const email = emailInput.trim().toLowerCase();
    if (!email) {
      setNotice("Enter your email address above first.");
      return;
    }

    setBusy(true);
    setNotice("");
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/account` },
      });
      if (error) throw error;
      setVerificationPending(true);
      setNotice("If this address has a pending account, a new verification email is on its way.");
    } catch (error) {
      console.error("Verification email resend failed:", error);
      setNotice(
        error instanceof Error ? error.message : "We couldn't resend the verification email.",
      );
    } finally {
      setBusy(false);
    }
  };

  const sendPasswordReset = async () => {
    const email = emailInput.trim().toLowerCase();
    if (!email) {
      setNotice("Enter your email address above first.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account`,
      });
      if (error) throw error;
      setNotice("If an account exists for that email, a password reset link is on its way.");
    } catch (error) {
      console.error("Password reset request failed:", error);
      setNotice(error instanceof Error ? error.message : "We couldn't send a reset email.");
    } finally {
      setBusy(false);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPasswordRecovery(false);
      setNotice("Your password has been updated.");
    } catch (error) {
      console.error("Account password update failed:", error);
      setNotice(error instanceof Error ? error.message : "We couldn't update your password.");
    } finally {
      setBusy(false);
    }
  };

  const addAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    setNotice("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const address = {
      user_id: session.user.id,
      label: String(form.get("label") ?? "").trim(),
      recipient_name: String(form.get("recipient_name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      sub_city: String(form.get("sub_city") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
    };

    try {
      const { data, error } = await supabase
        .from("account_saved_addresses")
        .insert(address)
        .select("*")
        .single();
      if (error) throw error;
      setAddresses((current) => [data, ...current]);
      formElement.reset();
      setNotice("Delivery address saved.");
    } catch (error) {
      console.error("Saved address creation failed:", error);
      setNotice("We couldn't save that address. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const removeAddress = async (id: string) => {
    if (!session) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("account_saved_addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);
      if (error) throw error;
      setAddresses((current) => current.filter((address) => address.id !== id));
      setNotice("Delivery address removed.");
    } catch (error) {
      console.error("Saved address removal failed:", error);
      setNotice("We couldn't remove that address. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Account sign-out failed:", error);
      setNotice("We couldn't sign you out. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-20 md:px-10">
      <p className="label-xs text-gold">Your account</p>
      <h1 className="mt-4 font-serif text-5xl md:text-6xl">
        {session ? "Welcome back." : "A little more personal."}
      </h1>
      {notice ? (
        <p role="status" className="mt-6 border border-border p-4 text-sm text-muted-foreground">
          {notice}
        </p>
      ) : null}

      {!session ? (
        <section className="mt-12 grid gap-12 md:grid-cols-[1fr_0.8fr]">
          <form onSubmit={submitAuth} className="space-y-4">
            <h2 className="font-serif text-3xl">
              {mode === "sign_in" ? "Sign in" : "Create your account"}
            </h2>
            {mode === "sign_up" ? (
              <input
                required
                name="name"
                autoComplete="name"
                placeholder="Full name"
                className={field}
              />
            ) : null}
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={emailInput}
              onChange={(event) => setEmailInput(event.currentTarget.value)}
              className={field}
            />
            <input
              required
              name="password"
              type="password"
              minLength={8}
              autoComplete={mode === "sign_in" ? "current-password" : "new-password"}
              placeholder="Password (at least 8 characters)"
              className={field}
            />
            <AhabButton type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "sign_in" ? "Sign in" : "Create account"}
            </AhabButton>
            {mode === "sign_in" ? (
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void sendPasswordReset()}
                  className="label-xs text-muted-foreground underline underline-offset-4"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void resendVerificationEmail()}
                  className="label-xs text-muted-foreground underline underline-offset-4"
                >
                  Resend verification email
                </button>
              </div>
            ) : null}
            {verificationPending ? (
              <p className="text-sm text-muted-foreground">
                This account still needs email verification. Check spam, or resend the verification
                email above.
              </p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {mode === "sign_in" ? "New to AHAB?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "sign_in" ? "sign_up" : "sign_in");
                  setNotice("");
                }}
                className="text-foreground underline underline-offset-4"
              >
                {mode === "sign_in" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </form>
          <div className="border-t border-border pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <h2 className="font-serif text-3xl">Made for you</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>See orders placed with your verified email.</li>
              <li>Keep your wishlist in sync across devices.</li>
              <li>Save delivery addresses for a quicker checkout.</li>
            </ul>
            <AhabLink to="/wishlist" className="mt-8">
              Continue as a guest
            </AhabLink>
          </div>
        </section>
      ) : passwordRecovery ? (
        <form onSubmit={updatePassword} className="mt-10 max-w-md space-y-4">
          <h2 className="font-serif text-3xl">Choose a new password</h2>
          <input
            required
            name="password"
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="New password (at least 8 characters)"
            className={field}
          />
          <AhabButton type="submit" size="lg" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </AhabButton>
        </form>
      ) : (
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {session.user.email_confirmed_at ? "Email verified" : "Email verification pending"}
              </p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void signOut()}
              className="label-xs underline underline-offset-4"
            >
              Sign out
            </button>
          </div>

          <div className="grid gap-14 py-10 lg:grid-cols-[1.2fr_0.8fr]">
            <section>
              <h2 className="font-serif text-3xl">Your orders</h2>
              {loadingData ? (
                <p className="mt-5 text-sm text-muted-foreground">Loading your orders…</p>
              ) : orders.length === 0 ? (
                <div className="mt-5 border border-border p-6">
                  <p className="text-sm text-muted-foreground">
                    Orders placed with your verified account email will appear here.
                  </p>
                  <AhabLink to="/shop" className="mt-5">
                    Discover the collection
                  </AhabLink>
                </div>
              ) : (
                <ul className="mt-5 divide-y divide-border border-y border-border">
                  {orders.map((order) => (
                    <li key={order.orderNumber} className="py-5">
                      <div className="flex flex-wrap justify-between gap-3">
                        <div>
                          <p className="label-xs">{order.orderNumber}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-right text-sm">
                          {formatPrice(order.total)}
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {order.status} · Payment {order.paymentStatus}
                          </span>
                        </p>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {order.items.map((item) => item.name).join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="font-serif text-3xl">Saved addresses</h2>
              {addresses.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {addresses.map((address) => (
                    <li key={address.id} className="border border-border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-sm">
                          <p className="font-medium">{address.label}</p>
                          <p className="mt-1">{address.recipient_name}</p>
                          <p className="text-muted-foreground">{address.phone}</p>
                          <p className="mt-2 text-muted-foreground">
                            {address.address}, {address.sub_city}, {address.city}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void removeAddress(address.id)}
                          className="label-xs text-muted-foreground underline underline-offset-4"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Save an address to make your next checkout quicker.
                </p>
              )}

              <form onSubmit={addAddress} className="mt-6 space-y-3">
                <h3 className="label-xs text-gold">Add an address</h3>
                <input
                  required
                  maxLength={60}
                  name="label"
                  placeholder="Label (e.g. Home)"
                  className={field}
                />
                <input
                  required
                  maxLength={200}
                  name="recipient_name"
                  placeholder="Recipient name"
                  autoComplete="name"
                  className={field}
                />
                <input
                  required
                  maxLength={40}
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  autoComplete="tel"
                  className={field}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    maxLength={100}
                    name="sub_city"
                    placeholder="Sub-city"
                    className={field}
                  />
                  <input
                    required
                    maxLength={100}
                    name="city"
                    placeholder="City"
                    defaultValue="Addis Ababa"
                    className={field}
                  />
                </div>
                <input
                  required
                  maxLength={500}
                  name="address"
                  placeholder="Street, building or landmark"
                  autoComplete="street-address"
                  className={field}
                />
                <AhabButton type="submit" variant="outline" disabled={busy}>
                  Save address
                </AhabButton>
              </form>
            </section>
          </div>
        </section>
      )}
    </div>
  );
}
