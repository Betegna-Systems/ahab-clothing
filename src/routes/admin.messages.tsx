import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { AhabButton, AhabLink } from "@/components/site/ui";
import { initializeSupabaseBrowser, supabase } from "@/integrations/supabase/client";
import type { FeatureDatabase } from "@/lib/feature-database";
import {
  CONTACT_MESSAGE_STATUSES,
  getAdminContactMessages,
  updateAdminContactMessageStatus,
} from "@/lib/contact-messages.functions";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

type MessageStatus = (typeof CONTACT_MESSAGE_STATUSES)[number];
type ContactMessage = FeatureDatabase["public"]["Tables"]["contact_messages"]["Row"];
type ViewStatus = "all" | MessageStatus;

const statusLabels: Record<MessageStatus, string> = {
  new: "New",
  replied: "Replied",
  closed: "Closed",
};

export const Route = createFileRoute("/admin/messages")({
  head: () =>
    seo("Admin · Messages", "Private AHAB contact message inbox.", {
      path: "/admin/messages",
      index: false,
    }),
  component: AdminMessages,
});

function AdminMessages() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [notice, setNotice] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [viewStatus, setViewStatus] = useState<ViewStatus>("new");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const refreshMessages = useCallback(async (activeSession: Session) => {
    setLoadingMessages(true);
    setNotice("");
    try {
      const results = await getAdminContactMessages({
        data: { accessToken: activeSession.access_token },
      });
      setMessages(results);
      setAuthorized(true);
    } catch {
      console.error("Admin contact messages could not be loaded.");
      setAuthorized(false);
      setNotice("We couldn't load messages. Check administrator access and try again.");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    void initializeSupabaseBrowser()
      .then(async (configured) => {
        if (!active) return;
        if (!configured) {
          setNotice("Admin sign-in is not configured for this deployment.");
          setLoading(false);
          return;
        }

        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (!active) return;
          setSession(nextSession);
          if (nextSession) {
            window.setTimeout(() => void refreshMessages(nextSession), 0);
          } else {
            setMessages([]);
            setAuthorized(false);
            setLoadingMessages(false);
          }
        });
        unsubscribe = () => data.subscription.unsubscribe();

        const { data: sessionData, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error) throw error;
        setSession(sessionData.session);
        setLoading(false);
        if (sessionData.session) await refreshMessages(sessionData.session);
      })
      .catch(() => {
        if (!active) return;
        console.error("Admin session check failed.");
        setNotice("We couldn't verify your administrator sign-in.");
        setLoading(false);
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [refreshMessages]);

  const visibleMessages = useMemo(
    () =>
      viewStatus === "all" ? messages : messages.filter((message) => message.status === viewStatus),
    [messages, viewStatus],
  );

  const updateStatus = async (messageId: string, value: string) => {
    if (!session || !CONTACT_MESSAGE_STATUSES.includes(value as MessageStatus)) return;
    const status = value as MessageStatus;
    setUpdatingId(messageId);
    try {
      await updateAdminContactMessageStatus({
        data: { accessToken: session.access_token, messageId, status },
      });
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? { ...message, status, updated_at: new Date().toISOString() }
            : message,
        ),
      );
      toast.success(`Marked as ${statusLabels[status].toLowerCase()}.`);
    } catch {
      console.error("Admin contact message update failed.");
      toast.error("We couldn't update this message.");
    } finally {
      setUpdatingId(null);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      console.error("Admin sign-out failed.");
      toast.error("We couldn't sign you out. Please try again.");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label-xs text-gold">AHAB administration</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">Messages</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Messages sent from the website's Contact page.
          </p>
        </div>
        {session && authorized ? (
          <div className="flex items-center gap-4">
            <AhabLink to="/admin/custom-orders" variant="outline">
              Custom orders
            </AhabLink>
            <AhabButton
              type="button"
              variant="outline"
              disabled={loadingMessages}
              onClick={() => void refreshMessages(session)}
            >
              {loadingMessages ? "Refreshing…" : "Refresh"}
            </AhabButton>
            <button type="button" onClick={() => void signOut()} className="label-xs underline">
              Sign out
            </button>
          </div>
        ) : null}
      </div>

      {notice ? (
        <p role="status" className="mt-8 border border-border p-4 text-sm">
          {notice}
        </p>
      ) : null}

      {loading ? (
        <p role="status" className="mt-10 text-sm text-muted-foreground">
          Checking administrator access…
        </p>
      ) : !session ? (
        <section className="mt-10 max-w-xl border border-border p-6">
          <h2 className="font-serif text-2xl">Administrator sign-in required</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in with an AHAB admin account to read customer messages.
          </p>
          <AhabLink to="/account" className="mt-6">
            Go to sign in
          </AhabLink>
        </section>
      ) : authorized ? (
        <>
          <div
            role="tablist"
            aria-label="Filter messages by status"
            className="mt-10 flex flex-wrap gap-2 border-b border-border"
          >
            {(["new", "replied", "closed", "all"] as ViewStatus[]).map((status) => {
              const label = status === "all" ? "All messages" : statusLabels[status];
              const count =
                status === "all"
                  ? messages.length
                  : messages.filter((message) => message.status === status).length;
              return (
                <button
                  key={status}
                  type="button"
                  role="tab"
                  aria-selected={viewStatus === status}
                  onClick={() => setViewStatus(status)}
                  className={`border-b-2 px-3 py-3 text-sm ${
                    viewStatus === status
                      ? "border-gold text-foreground"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  {label} <span className="ml-1 text-xs">{count}</span>
                </button>
              );
            })}
          </div>

          {loadingMessages ? (
            <p role="status" className="mt-8 text-sm text-muted-foreground">
              Loading messages…
            </p>
          ) : visibleMessages.length === 0 ? (
            <p className="mt-8 border border-border p-8 text-sm text-muted-foreground">
              No messages in this view.
            </p>
          ) : (
            <ul className="mt-8 space-y-5">
              {visibleMessages.map((message) => (
                <li key={message.id} className="border border-border p-5 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <h2 className="font-serif text-2xl">{message.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                    <label className="grid gap-1">
                      <span className="label-xs text-muted-foreground">Status</span>
                      <select
                        aria-label={`Status for message from ${message.name}`}
                        value={message.status}
                        disabled={updatingId === message.id}
                        onChange={(event) =>
                          void updateStatus(message.id, event.currentTarget.value)
                        }
                        className="h-10 border border-border bg-background px-3 text-sm"
                      >
                        {CONTACT_MESSAGE_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="break-all">
                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your message to AHAB")}`}
                        className="underline underline-offset-2"
                      >
                        {message.email}
                      </a>
                    </dd>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      {message.phone ? (
                        <a href={`tel:${message.phone}`} className="underline underline-offset-2">
                          {message.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not provided</span>
                      )}
                    </dd>
                  </dl>

                  <p className="mt-5 whitespace-pre-wrap border-l-2 border-border pl-4 text-sm">
                    {message.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : session ? (
        <section className="mt-10 max-w-xl border border-border p-6">
          <h2 className="font-serif text-2xl">Access restricted</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            This page is only available to accounts with the AHAB administrator role.
          </p>
          <button type="button" onClick={() => void signOut()} className="label-xs mt-5 underline">
            Sign out
          </button>
        </section>
      ) : null}
    </main>
  );
}
