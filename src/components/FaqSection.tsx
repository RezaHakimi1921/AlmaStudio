import type { FaqItem } from "@/lib/types";
import { ChevronDownIcon, QuestionIcon } from "./Icons";

export function FaqSection({ items }: { items: FaqItem[] }) {
  const visible = items.filter((i) => i.visible && i.question.trim());
  if (!visible.length) return null;

  return (
    <section className="glass section-card faq" data-reveal>
      <h2 className="card-title">
        <span className="card-title__icon">
          <QuestionIcon />
        </span>
        سوالات پرتکرار
      </h2>
      <div className="faq__list">
        {visible.map((item) => (
          <details key={item.id} className="faq__item" name="alma-faq">
            <summary>
              <span>{item.question}</span>
              <ChevronDownIcon className="faq__chevron" />
            </summary>
            <div className="faq__answer">
              {item.answer.split(/\n+/).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
