import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const url = formData.get("url") as string | null;
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) ?? "auto";

    if (!url && !file) {
      return NextResponse.json(
        { error: "Provide either a URL or a file" },
        { status: 400 }
      );
    }

    // ── YouTube URL ──
    if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
      try {
        const { YoutubeTranscript } = await import("youtube-transcript");
        const segments = await YoutubeTranscript.fetchTranscript(url);
        const transcript = segments.map((s) => s.text).join(" ");

        // Try to extract title from the page
        let title = "YouTube Video";
        try {
          const res = await fetch(url);
          const html = await res.text();
          const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (match?.[1]) {
            title = match[1].replace(" - YouTube", "").trim();
          }
        } catch {
          // Keep default title
        }

        return NextResponse.json({
          content: transcript,
          title,
          sourceType: "link",
        });
      } catch {
        return NextResponse.json(
          { error: "Failed to extract YouTube transcript. Make sure the video has captions enabled." },
          { status: 400 }
        );
      }
    }

    // ── Article / web page URL ──
    if (url) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; ContrastAI/1.0)" },
        });
        const html = await res.text();

        const cheerio = await import("cheerio");
        const $ = cheerio.load(html);

        // Remove unwanted elements
        $("script, style, nav, footer, header, aside, iframe, noscript").remove();

        // Extract title
        const title =
          $("meta[property='og:title']").attr("content") ||
          $("title").text().trim() ||
          "Web Article";

        // Extract main content
        const mainSelectors = ["article", "main", "[role='main']", ".post-content", ".entry-content", ".article-body"];
        let content = "";
        for (const sel of mainSelectors) {
          const el = $(sel);
          if (el.length && el.text().trim().length > 200) {
            content = el.text().trim();
            break;
          }
        }

        // Fallback: use body text
        if (!content) {
          content = $("body").text().trim();
        }

        // Clean up whitespace
        content = content.replace(/\s+/g, " ").trim();

        if (content.length < 50) {
          return NextResponse.json(
            { error: "Could not extract meaningful content from this URL." },
            { status: 400 }
          );
        }

        return NextResponse.json({
          content: content.slice(0, 100000),
          title,
          sourceType: "link",
        });
      } catch {
        return NextResponse.json(
          { error: "Failed to fetch or parse the URL. Please check the link." },
          { status: 400 }
        );
      }
    }

    // ── PDF file ──
    if (file && (file.type === "application/pdf" || type === "pdf")) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse");
        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdfParse(buffer);

        return NextResponse.json({
          content: data.text.slice(0, 100000),
          title: file.name.replace(/\.pdf$/i, ""),
          sourceType: "pdf",
        });
      } catch {
        return NextResponse.json(
          { error: "Failed to parse PDF file." },
          { status: 400 }
        );
      }
    }

    // ── Text / document files ──
    if (file) {
      try {
        const text = await file.text();
        return NextResponse.json({
          content: text.slice(0, 100000),
          title: file.name.replace(/\.[^.]+$/, ""),
          sourceType: "document",
        });
      } catch {
        return NextResponse.json(
          { error: "Failed to read the uploaded file." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ error: "Unsupported input" }, { status: 400 });
  } catch (error) {
    console.error("Content extraction error:", error);
    return NextResponse.json(
      { error: "Content extraction failed. Please try again." },
      { status: 500 }
    );
  }
}
