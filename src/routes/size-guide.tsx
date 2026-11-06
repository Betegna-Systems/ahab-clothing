import { Link, createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";

const women = [
  ["XS", "80", "62", "88"],
  ["S", "84", "66", "92"],
  ["M", "90", "72", "98"],
  ["L", "96", "78", "104"],
  ["XL", "102", "84", "110"],
];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} className="label-xs border-b border-border py-3 text-left text-foreground">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]}>
            {r.map((c, i) => (
              <td key={i} className="border-b border-border py-3">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const Route = createFileRoute("/size-guide")({
  head: () =>
    seo(
      "Size Guide",
      "Find your AHAB size — bust, waist and hip measurements for our women's suits and tops.",
      {
        path: "/size-guide",
      },
    ),
  component: () => (
    <InfoPage eyebrow="Customer care" title="Size guide">
      <p>
        All measurements are in centimetres. Between sizes? Choose the larger, or contact us for a
        tailored fit.
      </p>
      <h2>Suits & tops</h2>
      <Table head={["Size", "Bust", "Waist", "Hip"]} rows={women} />
      <h2>How to measure</h2>
      <p>
        Measure over light clothing with the tape level and snug, not tight. Bust: around the
        fullest part. Waist: around the narrowest part of your natural waistline. Hip: around the
        fullest part of your hips.
      </p>
      <h2>Suit fit</h2>
      <p>
        Blazers and trousers are sized together. If your bust and hip fall in different sizes,
        choose the larger and we can advise on alterations, or{" "}
        <Link to="/custom" className="text-foreground underline">
          request a made-to-measure suit
        </Link>
        .
      </p>
    </InfoPage>
  ),
});
