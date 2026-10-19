import { MessageCircle, Send } from "lucide-react";
import { telegramLink, whatsappLink } from "@/lib/order-channels";

export function ChatOrderButtons({ message, onBeforeOpen }: { message: string; onBeforeOpen?: () => boolean }) {
  const cls =
    "label-xs flex h-12 flex-1 items-center justify-center gap-2 border border-primary/40 transition-colors hover:bg-secondary";
  const guard = (e: React.MouseEvent) => {
    if (onBeforeOpen && !onBeforeOpen()) e.preventDefault();
  };
  return (
    <div className="flex gap-3">
      <a href={telegramLink(message)} onClick={guard} target="_blank" rel="noreferrer" className={cls}>
        <Send className="h-4 w-4" strokeWidth={1.25} /> Telegram
      </a>
      <a href={whatsappLink(message)} onClick={guard} target="_blank" rel="noreferrer" className={cls}>
        <MessageCircle className="h-4 w-4" strokeWidth={1.25} /> WhatsApp
      </a>
    </div>
  );
}
