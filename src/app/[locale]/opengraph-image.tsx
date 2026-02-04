import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "FreeChef — Home-Cooked Meals from Local Cooks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const titles: Record<string, { line1: string; line2: string; sub: string }> = {
    en: {
      line1: "Hire a Home Cook",
      line2: "for Any Occasion",
      sub: "Dinner parties · Birthdays · Date nights · Corporate events",
    },
    ru: {
      line1: "Домашний повар",
      line2: "на любой случай",
      sub: "Ужины · Дни рождения · Романтические вечера · Мероприятия",
    },
    es: {
      line1: "Contrata un Chef",
      line2: "para Cualquier Ocasión",
      sub: "Cenas · Cumpleaños · Citas · Eventos corporativos",
    },
  };

  const t = titles[locale] || titles.en;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1c1917",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #44403c 0%, transparent 50%), radial-gradient(circle at 75% 75%, #292524 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #c2410c, #9a3412)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🍳
            </div>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#fafaf9",
              }}
            >
              Free
              <span style={{ color: "#c2410c" }}>Chef</span>
            </span>
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#fafaf9",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            {t.line1}
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#c2410c",
              textAlign: "center",
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            {t.line2}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#a8a29e",
              textAlign: "center",
            }}
          >
            {t.sub}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
