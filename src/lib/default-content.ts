import type { SiteContent } from "./types";

const IG = "https://www.instagram.com/";
const MAPS =
  "https://maps.google.com/?q=%D8%A2%D8%AA%D9%84%DB%8C%D9%87+%D8%A2%D9%84%D9%85%D8%A7+%D8%B4%D9%87%D8%B1+%D8%B1%DB%8C";

/** Real photography under /public/heroes — admin can replace URLs anytime */
const HERO = {
  studioNewborn: "/heroes/studio-newborn.jpg",
  studioSet: "/heroes/studio-set.jpg",
  gardenFamily: "/heroes/garden-family.jpg",
  gardenMorning: "/heroes/garden-morning.jpg",
};

export const defaultContent: SiteContent = {
  hub: {
    title: "آتلیه آلما",
    subtitle: "عکاسی نوزاد، بارداری و فضای باز — لینک‌های اختصاصی مشتریان",
    heroImageUrl: HERO.gardenMorning,
  },
  pages: [
    {
      slug: "studio-conditions",
      title: "شرایط آتلیه آلما",
      subtitle: "رزرو، پرداخت و تحویل",
      moodTag: "شفافیت و اعتبار",
      brandLabel: "آتلیه آلما",
      heroImageUrl: HERO.studioNewborn,
      introTheme: "studio-conditions",
      introLabel: "لحظه‌های ماندگار",
      phone: "",
      bodyHtml: `<p>سلام دوست عزیز، از اینکه <b>آلما</b> را برای ثبت لحظه‌های زیبایتان انتخاب کردید سپاسگزاریم.</p>
<p>طبق مرحله دهم قانون مالیات از دی ۱۴۰۲، آتلیه موظف است <b>۱۰٪ مالیات بر ارزش افزوده</b> را به فاکتور نهایی اضافه کند.</p>
<p>از نبود پارکینگ اختصاصی و سختی یافتن جای پارک در محدوده آتلیه پوزش می‌طلبیم.</p>`,
      packagesText: `نمونه پکیج استودیو: عکاسی نوزاد + انتخاب فایل‌ها — جزئیات در فاکتور شعبه`,
      notesText: `بیعانه و رزرو: پس از واریز، رسید را در پیام‌رسان ارسال کنید. عدم ارسال رسید تا ۴ ساعت موجب لغو رزرو می‌شود.
تغییر نوبت حداقل ۴۸ ساعت قبل؛ تحویل فایل‌های نهایی طبق زمان اعلام‌شده در فاکتور.`,
      closingMessage: "با مهر، آتلیه آلما",
      addressTitle: "آدرس آتلیه آلما",
      address:
        "تهران، شهرری، میدان شاه‌عبدالعظیم، خیابان زکریای رازی، پاساژ مروارید طبقه ۵ واحد ۵۰۳",
      instagramUrl: IG,
      mapsUrl: MAPS,
      showInstagram: true,
      showMaps: true,
      published: true,
    },
    {
      slug: "studio-prep",
      title: "آمادگی جهت عکاسی",
      subtitle: "آمادگی جهت عکاسی در آتلیه آلما",
      moodTag: "حرفه‌ای و صمیمی",
      brandLabel: "آتلیه آلما",
      heroImageUrl: HERO.studioSet,
      introTheme: "studio-prep",
      introLabel: "نور و آرامش",
      phone: "",
      bodyHtml: `<p>پدر و مادر نازنین، با تشکر از حسن انتخاب شما، ورودتان را به <b>آتلیه آلما</b> خیرمقدم عرض می‌نماییم.</p>
<p><b>آدرس شعبه شهرری:</b> تهران، شهرری، ابتدای خیابان ۲۴ متری، پاساژ مروارید طبقه ۵ واحد ۵۰۳.</p>
<p>لطفاً سر ساعت حضور یابید تا بتوانیم تمامی دکورهای مدنظرتان را عکاسی کنیم. ترافیک مسیر را در نظر بگیرید.</p>
<p>لباس راحت و هماهنگ با تم جلسه همراه داشته باشید. برای نوزاد، پتو و وسایل تعویض ضروری است.</p>`,
      packagesText: "",
      notesText: `پارکینگ عمومی دور میدان شاه‌عبدالعظیم می‌باشد؛ محدوده آتلیه جای پارک نیست.
اگر بعد از یک ماه با شما تماس گرفته نشد، خودتان با آتلیه تماس بگیرید.`,
      closingMessage: "منتظر حضور گرمتان هستیم",
      addressTitle: "آدرس و مسیریابی",
      address:
        "تهران، شهرری، ابتدای خیابان ۲۴ متری، پاساژ مروارید طبقه ۵ واحد ۵۰۳",
      instagramUrl: IG,
      mapsUrl: MAPS,
      showInstagram: true,
      showMaps: true,
      published: true,
    },
    {
      slug: "outdoor-conditions",
      title: "شرایط فضای باز",
      subtitle: "فیلمبرداری و عکاسی در باغ",
      moodTag: "طبیعت و اعتماد",
      brandLabel: "آتلیه آلما",
      heroImageUrl: HERO.gardenFamily,
      introTheme: "outdoor-conditions",
      introLabel: "طبیعت و خانواده",
      phone: "",
      bodyHtml: `<p>سلام دوست عزیز</p>
<p>فیلمبرداری و عکاسی در باغ (۳ عنوان: <b>کودک</b>، بارداری، تعیین جنسیت).</p>
<p>عکاسی و فیلمبرداری فضای باز در مکان عمومی انجام می‌شود. پرداخت هزینه به منزله پذیرش شرایط است.</p>`,
      packagesText: `یک کودک: کلیپ ۳٫۵ دقیقه‌ای + ۴ ورق ۱۶×۲۱ — ۴٫۸۲۰ میلیون تومان
دو کودک: کلیپ ۴ دقیقه‌ای + ۶ ورق ۱۶×۲۱ — ۶٫۴۸۰ میلیون تومان
فقط عکاسی (بدون کلیپ): یک کودک ۳٫۹۶۰ — دو کودک ۴٫۹۵۰ میلیون تومان`,
      notesText: `آتلیه فقط تا سه ماه پس از تحویل نهایی مسئول نگهداری فایل‌های انتخاب‌شده است.`,
      closingMessage: "منتظر حضور گرمتان هستیم",
      addressTitle: "",
      address: "",
      instagramUrl: IG,
      mapsUrl: MAPS,
      showInstagram: true,
      showMaps: false,
      published: true,
    },
    {
      slug: "outdoor-prep",
      title: "آمادگی فضای باز",
      subtitle: "آمادگی جهت عکاسی در فضای باز",
      moodTag: "آرامش و راهنمایی",
      brandLabel: "آتلیه آلما",
      heroImageUrl: HERO.gardenMorning,
      introTheme: "outdoor-prep",
      introLabel: "صبح باغ",
      phone: "",
      bodyHtml: `<p>سلام دوست عزیز</p>
<p>لطفاً قبل از تاریخ فیلمبرداری، <b>تسویه فاکتور</b> را انجام دهید.</p>
<p><b>چک‌لیست:</b> لباس هماهنگ خانواده، کفش راحت، آب و میان‌وعده کودک، و رسیدن زودتر از موعد با احتساب ترافیک.</p>`,
      packagesText: "",
      notesText: `ورود هر همراه به باغ ۵۰۰ تومان است.
به ازای هر نیم‌ساعت تأخیر، باغ مبلغ ۵۰۰ تومان اضافه دریافت می‌کند.
آتلیه مسئولیتی در قبال تمیزی کفش‌ها ندارد.`,
      closingMessage: "منتظر حضور گرمتان هستیم",
      addressTitle: "آدرس باغ",
      address:
        "تهران، شهرری، میدان بسیج، پمپ بنزین، باغ قصر سفید (هماهنگی دقیق مسیر از طریق استودیو)",
      instagramUrl: IG,
      mapsUrl: MAPS,
      showInstagram: true,
      showMaps: true,
      published: true,
    },
  ],
};
