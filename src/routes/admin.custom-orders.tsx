import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { AhabButton, AhabLink } from "@/components/site/ui";
import { initializeSupabaseBrowser, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  getAdminCustomCommissions,
  updateAdminCustomCommissionStatus,
} from "@/lib/custom-commissions.functions";
import type { Json } from "@/integrations/supabase/types";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

type CommissionStatus =
  "new" | "contacted" | "consultation" | "quoted" | "in_progress" | "completed" | "declined";
type CommissionRow = Database["public"]["Tables"]["custom_commissions"]["Row"];
type Commission = CommissionRow & { imageUrls: string[] };
type ViewStatus = "all" | CommissionStatus;

const statusLabels: Record<CommissionStatus, string> = {
  new: "New",
  contacted: "Contacted",
  consultation: "Consultation",
  quoted: "Quoted",
  in_progress: "In progress",
  completed: "Completed",
  declined: "Declined",
};

const statusOrder: CommissionStatus[] = [
  "new",
  "contacted",
  "consultation",
  "quoted",
  "in_progress",
  "completed",
  "declined",
];

function measurementEntries(value: Json): [string, Json | undefined][] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return [];
  return Object.entries(value);
}

export const Route = createFileRoute("/admin/custom-orders")({
  head: () =>
    seo("Admin · Custom orders", "Private AHAB custom commission management.", {
      path: "/admin/custom-orders",
      index: false,
    }),
  component: AdminCustomOrders,
});

function AdminCustomOrders() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [notice, setNotice] = useState("");
  const [requests, setRequests] = useState<Commission[]>([]);
  const [viewStatus, setViewStatus] = useState<ViewStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const refreshRequests = useCallback(async (activeSession: Session) => {
    setLoadingRequests(true);
    setNotice("");
    try {
      const results = await getAdminCustomCommissions({
        data: { accessToken: activeSession.access_token },
      });
      setRequests(results);
      setAuthorized(true);
    } catch {
      console.error("Admin custom requests could not be loaded.");
      setAuthorized(false);
      setNotice("We couldn't load custom requests. Check administrator access and try again.");
    } finally {
      setLoadingRequests(false);
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
            window.setTimeout(() => void refreshRequests(nextSession), 0);
          } else {
            setRequests([]);
            setAuthorized(false);
            setLoadingRequests(false);
          }
        });
        unsubscribe = () => data.subscription.unsubscribe();

        const { data: sessionData, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error) throw error;
        setSession(sessionData.session);
        setLoading(false);
        if (sessionData.session) await refreshRequests(sessionData.session);
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
  }, [refreshRequests]);

  const visibleRequests = useMemo(
    () =>
      viewStatus === "all" ? requests : requests.filter((request) => request.status === viewStatus),
    [requests, viewStatus],
  );

  const updateStatus = async (commissionId: string, value: string) => {
    if (!session || !statusOrder.includes(value as CommissionStatus)) return;
    const status = value as CommissionStatus;
    setUpdatingId(commissionId);
    try {
      await updateAdminCustomCommissionStatus({
        data: { accessToken: session.access_token, commissionId, status },
      });
      setRequests((current) =>
        current.map((request) =>
          request.id === commissionId
            ? { ...request, status, updated_at: new Date().toISOString() }
            : request,
        ),
      );
      toast.success("Custom request updated.");
    } catch (error) {
      console.error("Admin custom request update failed.");
      toast.error("We couldn't update this request.");
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
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">Custom commissions</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Customer requests for made-to-measure tops and suits.
          </p>
        </div>
        {session && authorized ? (
          <div className="flex items-center gap-4">
            <AhabButton
              type="button"
              variant="outline"
              disabled={loadingRequests}
              onClick={() => void refreshRequests(session)}
            >
              {loadingRequests ? "Refreshing…" : "Refresh"}
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
            Sign in with an AHAB admin account to view customer requests.
          </p>
          <AhabLink to="/account" className="mt-6">
            Go to sign in
          </AhabLink>
        </section>
      ) : authorized ? (
        <>
          <div
            role="tablist"
            aria-label="Filter custom requests by status"
            className="mt-10 flex flex-wrap gap-2 border-b border-border"
          >
            {(["all", ...statusOrder] as ViewStatus[]).map((status) => {
              const label = status === "all" ? "All requests" : statusLabels[status];
              const count =
                status === "all"
                  ? requests.length
                  : requests.filter((request) => request.status === status).length;
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

          {loadingRequests ? (
            <p role="status" className="mt-8 text-sm text-muted-foreground">
              Loading requests…
            </p>
          ) : visibleRequests.length === 0 ? (
            <p className="mt-8 border border-border p-8 text-sm text-muted-foreground">
              No custom requests in this view yet.
            </p>
          ) : (
            <ul className="mt-8 space-y-5">
              {visibleRequests.map((request) => (
                <li key={request.id} className="border border-border p-5 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="label-xs text-gold">
                        Custom {request.commission_type} · {request.id.slice(0, 8).toUpperCase()}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl">{request.customer_name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                    <label className="grid gap-1">
                      <span className="label-xs text-muted-foreground">Request status</span>
                      <select
                        aria-label={`Status for request ${request.id.slice(0, 8)}`}
                        value={request.status}
                        disabled={updatingId === request.id}
                        onChange={(event) =>
                          void updateStatus(request.id, event.currentTarget.value)
                        }
                        className="h-10 border border-border bg-background px-3 text-sm"
                      >
                        {statusOrder.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href={`tel:${request.phone}`} className="underline underline-offset-2">
                          {request.phone}
                        </a>
                      </dd>
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="break-all">
                        <a
                          href={`mailto:${request.email}`}
                          className="underline underline-offset-2"
                        >
                          {request.email}
                        </a>
                      </dd>
                      <dt className="text-muted-foreground">Occasion</dt>
                      <dd>{request.occasion}</dd>
                      <dt className="text-muted-foreground">Style</dt>
                      <dd>{request.style}</dd>
                      <dt className="text-muted-foreground">Colour</dt>
                      <dd>{request.color || "Not specified"}</dd>
                      <dt className="text-muted-foreground">Fabric</dt>
                      <dd>{request.fabric || "Not specified"}</dd>
                      <dt className="text-muted-foreground">Budget</dt>
                      <dd>{request.budget}</dd>
                      {request.fit_preferences ? (
                        <>
                          <dt className="text-muted-foreground">Fit</dt>
                          <dd>{request.fit_preferences}</dd>
                        </>
                      ) : null}
                    </dl>

                    <div>
                      <h3 className="label-xs text-muted-foreground">Measurements (cm)</h3>
                      {measurementEntries(request.measurements).length ? (
                        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                          {measurementEntries(request.measurements).map(([name, value]) => (
                            <div key={name} className="contents">
                              <dt className="capitalize text-muted-foreground">
                                {name.replaceAll("_", " ")}
                              </dt>
                              <dd>{String(value)}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="mt-2 text-sm text-muted-foreground">Not supplied</p>
                      )}
                      {request.notes ? (
                        <>
                          <h3 className="label-xs mt-5 text-muted-foreground">Notes</h3>
                          <p className="mt-2 whitespace-pre-wrap text-sm">{request.notes}</p>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {request.imageUrls.length ? (
                    <div className="mt-6">
                      <h3 className="label-xs text-muted-foreground">Private inspiration images</h3>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {request.imageUrls.map((url, index) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open inspiration image ${index + 1}`}
                          >
                            <img
                              src={url}
                              alt={`Customer inspiration ${index + 1}`}
                              className="h-24 w-24 border border-border object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
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
