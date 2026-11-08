import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { AhabButton, AhabLink } from "@/components/site/ui";
import { initializeSupabaseBrowser } from "@/integrations/supabase/client";
import { featureClient as supabase } from "@/lib/feature-client";
import type { FeatureDatabase as Database } from "@/lib/feature-database";
import { getAccountOrders } from "@/lib/orders.functions";
import { paymentStatusLabel } from "@/lib/order-access";
import { formatPrice } from "@/lib/products";
import { seo } from "@/lib/seo";
import { formatDate, headT, localizePath, useLocale, useT } from "@/lib/i18n";

type SavedAddress = Database["public"]["Tables"]["account_saved_addresses"]["Row"];
type AccountOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  total: number;
  items: { slug: string; name: string }[];
};

const field =
  "h-12 w-full border border-border bg-transparent px-4 text-sm outline-none focus:border-primary";

export const Route = createFileRoute("/account")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(t("Account"), t("Sign in to view your AHAB orders, wishlist and saved addresses."), {
      path: "/account",
      index: false,
      locale,
    });
  },
  component: AccountPage,
});

function AccountPage() {
  // Notices are kept as English text and translated when shown.
  const t = useT();
  const locale = useLocale();
  // Auth emails link back to the account page in the visitor's language.
  const accountUrl = () => `${window.location.origin}${localizePath("/account", locale)}`;
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [mode, setMode] = useState<"sign_in" | "sign_up" | "forgot_password">("sign_in");
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [browserAuthConfigured, setBrowserAuthConfigured] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaReady, setMfaReady] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChallenge, setMfaChallenge] = useState<{
    factorId: string;
    challengeId: string;
    purpose: "sign_in" | "activate";
  } | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaEnrollment, setMfaEnrollment] = useState<{
    factorId: string;
    qrCode: string;
    secret: string;
  } | null>(null);
  const authCheckId = useRef(0);
  const accountDataRequestId = useRef(0);

  const loadAccountData = useCallback(async (activeSession: Session) => {
    const requestId = ++accountDataRequestId.current;
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

      if (requestId !== accountDataRequestId.current) return;
      if (!orderResult.ok) {
        setOrders([]);
        setNotice(
          orderResult.reason === "mfa_required"
            ? "Complete authenticator verification to view your orders."
            : "Verify your email address to view your order history.",
        );
      } else {
        setOrders(orderResult.orders);
      }

      if (addressResult.error) throw addressResult.error;
      setAddresses(addressResult.data ?? []);
    } catch (error) {
      if (requestId !== accountDataRequestId.current) return;
      console.error("Account data lookup failed:", error);
      setNotice("Some account information couldn't be loaded. Please try again.");
    } finally {
      if (requestId === accountDataRequestId.current) setLoadingData(false);
    }
  }, []);

  const prepareAuthenticatedSession = useCallback(
    async (activeSession: Session | null) => {
      const requestId = ++authCheckId.current;
      if (!activeSession) {
        accountDataRequestId.current += 1;
        setMfaRequired(false);
        setMfaReady(false);
        setMfaFactorId(null);
        setMfaChallenge(null);
        setMfaEnrollment(null);
        setOrders([]);
        setAddresses([]);
        setLoadingData(false);
        return;
      }

      setMfaReady(false);
      try {
        const [
          { data: mfaRequiredData, error: mfaRequiredError },
          { data: factors, error: factorsError },
        ] = await Promise.all([
          supabase.rpc("account_mfa_is_required"),
          supabase.auth.mfa.listFactors(),
        ]);
        if (requestId !== authCheckId.current) return;
        if (mfaRequiredError) throw mfaRequiredError;
        if (factorsError) throw factorsError;

        const verifiedFactor = factors.totp.find((factor) => factor.status === "verified");
        setMfaFactorId(verifiedFactor?.id ?? null);
        setMfaRequired(mfaRequiredData);

        if (mfaRequiredData) {
          const { data: assurance, error: assuranceError } =
            await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
          if (assuranceError) throw assuranceError;
          if (assurance.nextLevel === "aal2" && assurance.currentLevel !== "aal2") {
            if (!verifiedFactor) throw new Error("No verified MFA factor is enrolled.");
            const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
              factorId: verifiedFactor.id,
            });
            if (challengeError) throw challengeError;
            if (requestId !== authCheckId.current) return;
            setMfaChallenge({
              factorId: verifiedFactor.id,
              challengeId: challenge.id,
              purpose: "sign_in",
            });
            return;
          }
        }

        if (requestId !== authCheckId.current) return;
        setMfaChallenge(null);
        setMfaReady(true);
        void loadAccountData(activeSession);
      } catch (error) {
        if (requestId !== authCheckId.current) return;
        console.error("Account security check failed:", error);
        setNotice("We couldn't verify your account security. Please sign out and try again.");
      }
    },
    [loadAccountData],
  );

  useEffect(() => {
    let active = true;
    let authEventVersion = 0;
    let unsubscribe: (() => void) | undefined;

    void initializeSupabaseBrowser()
      .then((configured) => {
        if (!active) return;
        setBrowserAuthConfigured(configured);
        if (!configured) {
          setNotice("Account sign-in is not configured for this deployment.");
          setAuthInitialized(true);
          return;
        }

        const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
          authEventVersion += 1;
          if (!active) return;
          setSession(nextSession);
          setAuthInitialized(true);
          setPasswordRecovery(event === "PASSWORD_RECOVERY");
          setNotice("");
          if (nextSession) {
            setMfaReady(false);
            window.setTimeout(() => void prepareAuthenticatedSession(nextSession), 0);
          } else {
            void prepareAuthenticatedSession(null);
          }
        });
        unsubscribe = () => data.subscription.unsubscribe();

        const initialEventVersion = authEventVersion;
        void supabase.auth
          .getSession()
          .then(({ data: sessionData, error }) => {
            if (!active || authEventVersion !== initialEventVersion) return;
            if (error) {
              console.error("Account session lookup failed:", error.message);
              setNotice("We couldn't check your sign-in. Please refresh and try again.");
            }
            setSession(sessionData.session);
            setAuthInitialized(true);
            void prepareAuthenticatedSession(sessionData.session);
          })
          .catch((error: unknown) => {
            if (!active || authEventVersion !== initialEventVersion) return;
            console.error("Account session lookup failed:", error);
            setNotice("We couldn't check your sign-in. Please refresh and try again.");
            setAuthInitialized(true);
          });
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error("Supabase browser configuration lookup failed:", error);
        setNotice("We couldn't load account sign-in. Please try again later.");
        setAuthInitialized(true);
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [prepareAuthenticatedSession]);

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
            emailRedirectTo: accountUrl(),
          },
        });
        if (error) throw error;
        if (data.session && !data.user?.email_confirmed_at) {
          const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
          if (signOutError) throw signOutError;
          setVerificationPending(true);
          setNotice(
            "Verify your email address before signing in. Check your inbox for the confirmation link.",
          );
        } else if (data.session) {
          setNotice("Your account is ready.");
        } else {
          setVerificationPending(true);
          setNotice("Check your inbox to verify your email and finish creating your account.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            setVerificationPending(true);
          }
          throw error;
        }
        if (!data.user?.email_confirmed_at) {
          const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
          if (signOutError) throw signOutError;
          setVerificationPending(true);
          setNotice(
            "Verify your email address before signing in. Check your inbox for the confirmation link.",
          );
        }
      }
    } catch (error) {
      const emailUnconfirmed =
        error instanceof Error && error.message.toLowerCase().includes("email not confirmed");
      if (emailUnconfirmed) setVerificationPending(true);
      console.error("Account authentication request failed.");
      setNotice(
        emailUnconfirmed
          ? "Verify your email address before signing in. You can resend the confirmation email below."
          : mode === "sign_in"
            ? "We couldn't sign you in with those details. Check your email and password, then try again."
            : "We couldn't create your account. Check your details and try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const verifyMfaChallenge = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mfaChallenge) return;
    setBusy(true);
    setNotice("");
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: mfaChallenge.factorId,
        challengeId: mfaChallenge.challengeId,
        code: mfaCode.trim(),
      });
      if (error) throw error;

      if (mfaChallenge.purpose === "activate") {
        const { error: requiredError } = await supabase.rpc("set_account_mfa_required", {
          p_required: true,
        });
        if (requiredError) throw requiredError;
        setMfaRequired(true);
      }

      setMfaCode("");
      setMfaChallenge(null);
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      await prepareAuthenticatedSession(data.session);
    } catch (error) {
      console.error("MFA verification failed:", error);
      setNotice("That verification code couldn't be accepted. Check the code and try again.");
    } finally {
      setBusy(false);
    }
  };

  const startMfa = async () => {
    setBusy(true);
    setNotice("");
    try {
      if (mfaFactorId) {
        const { data, error } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
        if (error) throw error;
        setMfaChallenge({
          factorId: mfaFactorId,
          challengeId: data.id,
          purpose: "activate",
        });
        setMfaReady(false);
        return;
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "AHAB account",
      });
      if (error) throw error;
      setMfaEnrollment({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
    } catch (error) {
      console.error("MFA enrollment could not start:", error);
      setNotice("We couldn't start authenticator setup. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const verifyMfaEnrollment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mfaEnrollment) return;
    setBusy(true);
    setNotice("");
    setMfaReady(false);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: mfaEnrollment.factorId,
      });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaEnrollment.factorId,
        challengeId: challenge.id,
        code: mfaCode.trim(),
      });
      if (verifyError) throw verifyError;
      const { error: requiredError } = await supabase.rpc("set_account_mfa_required", {
        p_required: true,
      });
      if (requiredError) throw requiredError;

      setMfaRequired(true);
      setMfaFactorId(mfaEnrollment.factorId);
      setMfaEnrollment(null);
      setMfaCode("");
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      await prepareAuthenticatedSession(data.session);
      setNotice("Authenticator sign-in is enabled for your account.");
    } catch (error) {
      console.error("MFA enrollment verification failed:", error);
      setMfaReady(true);
      setNotice("We couldn't enable the authenticator. Check the code and try again.");
    } finally {
      setBusy(false);
    }
  };

  const cancelMfaEnrollment = async () => {
    if (!mfaEnrollment) return;
    setBusy(true);
    setNotice("");
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: mfaEnrollment.factorId });
      if (error) throw error;
      setMfaEnrollment(null);
      setMfaCode("");
    } catch (error) {
      console.error("Unverified MFA factor could not be removed:", error);
      setNotice("We couldn't cancel authenticator setup. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const disableMfa = async () => {
    if (!mfaFactorId) return;
    setBusy(true);
    setNotice("");
    try {
      const { error: settingError } = await supabase.rpc("set_account_mfa_required", {
        p_required: false,
      });
      if (settingError) throw settingError;
      const { error: factorError } = await supabase.auth.mfa.unenroll({ factorId: mfaFactorId });
      if (factorError) {
        const { error: restoreError } = await supabase.rpc("set_account_mfa_required", {
          p_required: true,
        });
        if (restoreError) {
          console.error("MFA requirement restore failed after unenrollment error:", restoreError);
        }
        throw factorError;
      }

      setMfaRequired(false);
      setMfaFactorId(null);
      setNotice("Authenticator sign-in has been disabled.");
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      await prepareAuthenticatedSession(data.session);
    } catch (error) {
      console.error("MFA could not be disabled:", error);
      setNotice(
        "We couldn't disable authenticator sign-in. Try again after verifying your current code.",
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
        options: { emailRedirectTo: accountUrl() },
      });
      if (error) throw error;
      setVerificationPending(true);
      setNotice("If this address has a pending account, a new verification email is on its way.");
    } catch {
      console.error("Verification email resend failed.");
      setNotice("We couldn't resend the verification email. Please wait a moment and try again.");
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
    setNotice("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: accountUrl(),
      });
      if (error) throw error;
      setResetEmailSent(true);
      setNotice("If an account exists for that email, a password reset link is on its way.");
    } catch {
      console.error("Password reset request failed.");
      setNotice("We couldn't send a password reset link. Please wait a moment and try again.");
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
      setMode("sign_in");
      setNotice("Your password has been updated.");
    } catch {
      console.error("Account password update failed.");
      setNotice("We couldn't update your password. Check the password requirements and try again.");
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
    setNotice("");
    try {
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) throw error;
      setNotice("You have been signed out.");
    } catch (error) {
      console.error("Account sign-out failed:", error);
      setNotice("We couldn't sign you out. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-20 md:px-10">
      <p className="label-xs text-gold">{t("Your account")}</p>
      <h1 className="mt-4 font-serif text-5xl md:text-6xl">
        {session ? t("Welcome back.") : t("A little more personal.")}
      </h1>
      {notice ? (
        <p role="status" className="mt-6 border border-border p-4 text-sm text-muted-foreground">
          {t(notice)}
        </p>
      ) : null}

      {!browserAuthConfigured ? (
        <section className="mt-10 max-w-xl border border-border p-6">
          <h2 className="font-serif text-2xl">{t("Accounts are temporarily unavailable.")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t(
              "The storefront deployment is missing its public Supabase Auth configuration. The shop and guest checkout remain available; please try again later.",
            )}
          </p>
          <AhabLink to="/shop" className="mt-6">
            {t("Continue shopping")}
          </AhabLink>
        </section>
      ) : passwordRecovery ? (
        <form onSubmit={updatePassword} className="mt-10 max-w-md space-y-4">
          <h2 className="font-serif text-3xl">{t("Choose a new password")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("Use at least 12 characters for your new password.")}
          </p>
          <input
            required
            name="password"
            type="password"
            minLength={12}
            autoComplete="new-password"
            placeholder={t("New password")}
            className={field}
          />
          <AhabButton type="submit" size="lg" disabled={busy}>
            {busy ? t("Updating…") : t("Update password")}
          </AhabButton>
        </form>
      ) : !authInitialized ? (
        <p role="status" className="mt-8 text-sm text-muted-foreground">
          {t("Checking your account…")}
        </p>
      ) : session && mfaChallenge ? (
        <form onSubmit={verifyMfaChallenge} className="mt-10 max-w-md space-y-4">
          <h2 className="font-serif text-3xl">{t("Verify your sign-in")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("Enter the six-digit code from your authenticator app to continue.")}
          </p>
          <input
            required
            name="mfa-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            value={mfaCode}
            onChange={(event) => setMfaCode(event.currentTarget.value.replace(/\D/g, ""))}
            placeholder="6-digit code"
            className={field}
          />
          <AhabButton type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? t("Verifying…") : t("Verify and continue")}
          </AhabButton>
          <button
            type="button"
            disabled={busy}
            onClick={() => void signOut()}
            className="label-xs underline underline-offset-4"
          >
            {t("Sign out")}
          </button>
        </form>
      ) : session && !mfaReady ? (
        <section className="mt-10 max-w-md border border-border p-6">
          <h2 className="font-serif text-2xl">{t("Checking account security")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t(
              "We couldn't complete the security check. Sign out and try again, or contact AHAB support if you no longer have your authenticator.",
            )}
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void signOut()}
            className="label-xs mt-5 underline underline-offset-4"
          >
            {t("Sign out")}
          </button>
        </section>
      ) : !session ? (
        <section className="mt-12 grid gap-12 md:grid-cols-[1fr_0.8fr]">
          {mode === "forgot_password" && resetEmailSent ? (
            <div className="space-y-5">
              <h2 className="font-serif text-3xl">{t("Check your inbox")}</h2>
              <p className="text-sm text-muted-foreground">
                {t(
                  "If an account exists for {email}, you’ll receive a link to reset the password. Check spam if it doesn’t arrive.",
                  { email: emailInput.trim() },
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode("sign_in");
                  setResetEmailSent(false);
                  setNotice("");
                }}
                className="label-xs underline underline-offset-4"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                if (mode === "forgot_password") {
                  event.preventDefault();
                  void sendPasswordReset();
                } else {
                  void submitAuth(event);
                }
              }}
              className="space-y-4"
            >
              <h2 className="font-serif text-3xl">
                {mode === "sign_in"
                  ? t("Sign in")
                  : mode === "sign_up"
                    ? t("Create your account")
                    : t("Reset your password")}
              </h2>
              {mode === "sign_up" ? (
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder={t("Full name")}
                  className={field}
                />
              ) : null}
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("Email address")}
                value={emailInput}
                onChange={(event) => setEmailInput(event.currentTarget.value)}
                className={field}
              />
              {mode !== "forgot_password" ? (
                <>
                  <input
                    required
                    name="password"
                    type="password"
                    minLength={mode === "sign_up" ? 12 : undefined}
                    autoComplete={mode === "sign_in" ? "current-password" : "new-password"}
                    placeholder={
                      mode === "sign_up" ? t("Password (at least 12 characters)") : t("Password")
                    }
                    className={field}
                  />
                  <AhabButton type="submit" size="lg" className="w-full" disabled={busy}>
                    {busy
                      ? t("Please wait…")
                      : mode === "sign_in"
                        ? t("Sign in")
                        : t("Create account")}
                  </AhabButton>
                </>
              ) : (
                <AhabButton type="submit" size="lg" className="w-full" disabled={busy}>
                  {busy ? t("Sending…") : t("Send reset link")}
                </AhabButton>
              )}
              {mode === "sign_in" || (mode === "sign_up" && verificationPending) ? (
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setMode("forgot_password");
                      setNotice("");
                    }}
                    className="label-xs text-muted-foreground underline underline-offset-4"
                  >
                    {t("Forgot password?")}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void resendVerificationEmail()}
                    className="label-xs text-muted-foreground underline underline-offset-4"
                  >
                    {t("Resend verification email")}
                  </button>
                </div>
              ) : null}
              {verificationPending ? (
                <p className="text-sm text-muted-foreground">
                  {t(
                    "This account still needs email verification. Check spam, or resend the verification email above.",
                  )}
                </p>
              ) : null}
              {mode !== "forgot_password" ? (
                <p className="text-sm text-muted-foreground">
                  {mode === "sign_in" ? t("New to AHAB?") : t("Already have an account?")}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "sign_in" ? "sign_up" : "sign_in");
                      setNotice("");
                    }}
                    className="text-foreground underline underline-offset-4"
                  >
                    {mode === "sign_in" ? t("Create an account") : t("Sign in")}
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign_in");
                    setNotice("");
                  }}
                  className="label-xs underline underline-offset-4"
                >
                  Back to sign in
                </button>
              )}
            </form>
          )}
          <div className="border-t border-border pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <h2 className="font-serif text-3xl">{t("Made for you")}</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>{t("See orders placed while signed in, or saved from their tracking links.")}</li>
              <li>{t("Keep your wishlist in sync across devices.")}</li>
              <li>{t("Save delivery addresses for a quicker checkout.")}</li>
            </ul>
            <AhabLink to="/wishlist" className="mt-8">
              {t("Continue as a guest")}
            </AhabLink>
          </div>
        </section>
      ) : (
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {session.user.email_confirmed_at
                  ? t("Email verified")
                  : t("Email verification pending")}
              </p>
              {session.user.app_metadata?.role === "admin" ? (
                <AhabLink to="/admin/custom-orders" className="mt-3">
                  {t("Manage custom requests")}
                </AhabLink>
              ) : null}
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void signOut()}
              className="label-xs underline underline-offset-4"
            >
              {t("Sign out")}
            </button>
          </div>

          <section className="mt-8 max-w-2xl border border-border p-6">
            <h2 className="font-serif text-2xl">{t("Account security")}</h2>
            {mfaEnrollment ? (
              <form onSubmit={verifyMfaEnrollment} className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("Scan this QR code with an authenticator app, then enter its six-digit code.")}
                </p>
                <img
                  src={mfaEnrollment.qrCode}
                  alt={t("Authenticator setup QR code")}
                  className="h-48 w-48 border border-border bg-white p-2"
                />
                <p className="break-all text-xs text-muted-foreground">
                  {t("Setup key: {secret}", { secret: mfaEnrollment.secret })}
                </p>
                <input
                  required
                  name="enrollment-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(event) => setMfaCode(event.currentTarget.value.replace(/\D/g, ""))}
                  placeholder="6-digit code"
                  className={field}
                />
                <AhabButton type="submit" disabled={busy}>
                  {busy ? t("Verifying…") : t("Enable authenticator")}
                </AhabButton>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void cancelMfaEnrollment()}
                  className="label-xs ml-4 underline underline-offset-4"
                >
                  {t("Cancel setup")}
                </button>
              </form>
            ) : mfaRequired ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("Authenticator verification is required when you sign in.")}
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void disableMfa()}
                  className="label-xs underline underline-offset-4"
                >
                  {busy ? t("Please wait…") : t("Disable authenticator sign-in")}
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "Add an authenticator app for an extra sign-in step. It is optional and can be disabled later.",
                  )}
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void startMfa()}
                  className="label-xs underline underline-offset-4"
                >
                  {busy
                    ? t("Please wait…")
                    : mfaFactorId
                      ? t("Activate authenticator sign-in")
                      : t("Set up an authenticator")}
                </button>
              </div>
            )}
          </section>

          <div className="grid gap-14 py-10 lg:grid-cols-[1.2fr_0.8fr]">
            <section>
              <h2 className="font-serif text-3xl">{t("Your orders")}</h2>
              {loadingData ? (
                <p className="mt-5 text-sm text-muted-foreground">{t("Loading your orders…")}</p>
              ) : orders.length === 0 ? (
                <div className="mt-5 border border-border p-6">
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Orders placed while signed in appear here. For earlier orders, open the tracking link and choose “Save to my account”.",
                    )}
                  </p>
                  <AhabLink to="/shop" className="mt-5">
                    {t("Discover the collection")}
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
                            {formatDate(order.createdAt, locale)}
                          </p>
                        </div>
                        <p className="text-right text-sm">
                          {formatPrice(order.total)}
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {t(order.status)} ·{" "}
                            {t(paymentStatusLabel(order.paymentStatus, order.paymentMethod))}
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
              <h2 className="font-serif text-3xl">{t("Saved addresses")}</h2>
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
                          {t("Remove")}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  {t("Save an address to make your next checkout quicker.")}
                </p>
              )}

              <form onSubmit={addAddress} className="mt-6 space-y-3">
                <h3 className="label-xs text-gold">{t("Add an address")}</h3>
                <input
                  required
                  maxLength={60}
                  name="label"
                  placeholder={t("Label (e.g. Home)")}
                  className={field}
                />
                <input
                  required
                  maxLength={200}
                  name="recipient_name"
                  placeholder={t("Recipient name")}
                  autoComplete="name"
                  className={field}
                />
                <input
                  required
                  maxLength={40}
                  name="phone"
                  type="tel"
                  placeholder={t("Phone")}
                  autoComplete="tel"
                  className={field}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    maxLength={100}
                    name="sub_city"
                    placeholder={t("Sub-city")}
                    className={field}
                  />
                  <input
                    required
                    maxLength={100}
                    name="city"
                    placeholder={t("City")}
                    defaultValue="Addis Ababa"
                    className={field}
                  />
                </div>
                <input
                  required
                  maxLength={500}
                  name="address"
                  placeholder={t("Street, building or landmark")}
                  autoComplete="street-address"
                  className={field}
                />
                <AhabButton type="submit" variant="outline" disabled={busy}>
                  {t("Save address")}
                </AhabButton>
              </form>
            </section>
          </div>
        </section>
      )}
    </div>
  );
}
