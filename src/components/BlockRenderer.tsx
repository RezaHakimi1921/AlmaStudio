import type { ContentBlock } from "@/lib/types";
import { GlassCard } from "./GlassCard";

type Props = {
  block: ContentBlock;
  pagePhone?: string;
  accentGarden?: boolean;
  index?: number;
};

export function BlockRenderer({
  block,
  pagePhone = "",
  accentGarden = false,
  index = 0,
}: Props) {
  const bold = block.bold ? " is-bold" : "";
  const delay = { animationDelay: `${0.06 + index * 0.04}s` };

  if (block.type === "image") {
    return (
      <div className="block-item" style={delay}>
        <GlassCard className={`block-image${bold}`}>
          {block.title ? <h3>{block.title}</h3> : null}
          {block.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.imageUrl} alt={block.imageAlt || block.title || ""} />
          ) : (
            <p>تصویر تنظیم نشده</p>
          )}
        </GlassCard>
      </div>
    );
  }

  if (block.type === "price") {
    return (
      <div className="block-item" style={delay}>
        <GlassCard className={`block-price${bold}`}>
          {block.title ? <h3>{block.title}</h3> : null}
          {block.body ? <p>{block.body}</p> : null}
          {block.price ? <p className="price-value">{block.price}</p> : null}
        </GlassCard>
      </div>
    );
  }

  if (block.type === "note") {
    return (
      <div className="block-item" style={delay}>
        <div className={`solid-card block-note${bold}`}>
          {block.title ? <h3>{block.title}</h3> : null}
          {block.body ? <p>{block.body}</p> : null}
        </div>
      </div>
    );
  }

  if (block.type === "contact") {
    const phone = (block.phone || pagePhone || "").trim();
    const ready = phone.length > 0;
    return (
      <div className="block-item" style={delay}>
        <GlassCard className={`block-contact${bold}`}>
          {block.title ? <h3>{block.title}</h3> : null}
          {block.body ? <p>{block.body}</p> : null}
          {ready ? (
            <a
              className={`cta-btn${accentGarden ? " cta-btn--garden" : ""}`}
              href={`tel:${phone.replace(/\s+/g, "")}`}
              style={{ marginTop: "0.75rem" }}
            >
              تماس با آتلیه
            </a>
          ) : (
            <button
              type="button"
              className="cta-btn is-disabled"
              disabled
              style={{ marginTop: "0.75rem" }}
              title="شماره هنوز در ادمین تنظیم نشده"
            >
              تماس (شماره تنظیم نشده)
            </button>
          )}
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="block-item" style={delay}>
      <div className={`block-text${bold}`}>
        {block.title ? <h3>{block.title}</h3> : null}
        {block.body ? <p>{block.body}</p> : null}
      </div>
    </div>
  );
}
