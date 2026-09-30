import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";

const women = [
  ["XS", "80", "62", "88"],
  ["S", "84", "66", "92"],
  ["M", "90", "72", "98"],
  ["L", "96", "78", "104"],
  ["XL", "102", "84", "110"],
];
const men = [
  ["S / 46", "92", "78"],
  ["M / 48", "98", "84"],
  ["L / 50", "104", "90"],
  ["XL / 52", "110", "96"],
  ["XXL / 54", "116", "102"],
];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} className="label-xs border-b border-border py-3 text-left text-foreground">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]}>
            {r.map((c, i) => (
              <td key={i} className="border-b border-border py-3">{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const Route = createFileRoute("/size-guide")({
  head: () => seo("Size Guide", "Find your AHAB size — bust, waist and hip measurements for women, men and kids."),
  component: () => (
    <InfoPage eyebrow="Customer care" title="Size guide">
      <p>All measurements are in centimetres. Between sizes? Choose the larger, or contact us for a tailored fit.</p>
      <h2>Women</h2>
      <Table head={["Size", "Bust", "Waist", "Hip"]} rows={women} />
      <h2>Men</h2>
      <Table head={["Size", "Chest", "Waist"]} rows={men} />
      <h2>Kids</h2>
      <p>Kids sizes follow age (2Y–10Y). For a roomier fit, size up one year.</p>
    </InfoPage>
  ),
});
