"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";

// Custom fontSize extension via TextStyle
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: Record<string, string | null>) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: { chain: () => ReturnType<ReturnType<typeof useEditor>["chain"]> }) => {
          return chain().setMark("textStyle", { fontSize: size }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => ReturnType<ReturnType<typeof useEditor>["chain"]> }) => {
          return chain().setMark("textStyle", { fontSize: null }).run();
        },
    } as Record<string, (...args: unknown[]) => unknown>;
  },
});

// Custom draggable image extension with position attributes for free placement
const CustomImage = TiptapImage.extend({
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("style"),
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
      class: {
        default: "editor-image",
        parseHTML: (element: HTMLElement) => element.getAttribute("class"),
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
      "data-float-x": {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("data-float-x"),
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes["data-float-x"]) return {};
          return { "data-float-x": attributes["data-float-x"] };
        },
      },
      "data-float-y": {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("data-float-y"),
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes["data-float-y"]) return {};
          return { "data-float-y": attributes["data-float-y"] };
        },
      },
    };
  },
});

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Paintbrush,
  Highlighter,
  ImageIcon,
  Undo2,
  Redo2,
  ChevronDown,
  Copy,
  Check,
  Minus,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Simple markdown-to-HTML converter (no external libs)
// ---------------------------------------------------------------------------

function isHtml(content: string): boolean {
  const trimmed = content.trim();
  return /^<[a-z][\s\S]*>/i.test(trimmed) || /<(?:p|h[1-6]|ul|ol|li|strong|em|blockquote|div|br\s*\/?)[\s>]/i.test(trimmed);
}

function markdownToHtml(markdown: string): string {
  if (isHtml(markdown)) {
    return markdown;
  }

  const lines = markdown.split("\n");
  const htmlParts: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) {
      htmlParts.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      htmlParts.push("</ol>");
      inOl = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      closeList();
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      closeList();
      htmlParts.push("<hr />");
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      closeList();
      const text = convertInline(trimmed.slice(2));
      htmlParts.push(`<blockquote><p>${text}</p></blockquote>`);
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const text = convertInline(headingMatch[2]);
      htmlParts.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    // Unordered list items (- or *)
    if (/^[-*]\s+/.test(trimmed)) {
      if (inOl) {
        htmlParts.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        htmlParts.push("<ul>");
        inUl = true;
      }
      const text = convertInline(trimmed.replace(/^[-*]\s+/, ""));
      htmlParts.push(`<li>${text}</li>`);
      continue;
    }

    // Ordered list items (1. 2. etc.)
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (inUl) {
        htmlParts.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        htmlParts.push("<ol>");
        inOl = true;
      }
      const text = convertInline(olMatch[2]);
      htmlParts.push(`<li>${text}</li>`);
      continue;
    }

    // Regular paragraph
    closeList();
    const text = convertInline(trimmed);
    htmlParts.push(`<p>${text}</p>`);
  }

  closeList();
  return htmlParts.join("");
}

/** Convert inline markdown formatting to HTML */
function convertInline(text: string): string {
  let result = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/__(.+?)__/g, "<strong>$1</strong>");
  result = result.replace(/(?<!\w)\*(?!\*)(.+?)(?<!\*)\*(?!\w)/g, "<em>$1</em>");
  result = result.replace(/(?<!\w)_(?!_)(.+?)(?<!_)_(?!\w)/g, "<em>$1</em>");
  result = result.replace(/~~(.+?)~~/g, "<s>$1</s>");
  result = result.replace(/`(.+?)`/g, "<code>$1</code>");
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return result;
}

// ---------------------------------------------------------------------------
// Font size steps
// ---------------------------------------------------------------------------

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

function getCurrentFontSize(editor: ReturnType<typeof useEditor>): number {
  if (!editor) return 16;
  const attrs = editor.getAttributes("textStyle");
  if (attrs.fontSize) {
    const parsed = parseInt(attrs.fontSize, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 16;
}

// ---------------------------------------------------------------------------
// Preset colors for the text color picker & highlight picker
// ---------------------------------------------------------------------------

const PRESET_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Dark Gray", value: "#4b5563" },
  { name: "Red", value: "#dc2626" },
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#16a34a" },
  { name: "Purple", value: "#9333ea" },
  { name: "Orange", value: "#ea580c" },
  { name: "Pink", value: "#ec4899" },
] as const;

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Purple", value: "#e9d5ff" },
  { name: "Orange", value: "#fed7aa" },
] as const;

// ---------------------------------------------------------------------------
// Toolbar button component
// ---------------------------------------------------------------------------

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Toolbar separator
// ---------------------------------------------------------------------------

function ToolbarSeparator() {
  return <div className="mx-1 h-6 w-px shrink-0 bg-border" />;
}

// ---------------------------------------------------------------------------
// Color picker dropdown (for text color)
// ---------------------------------------------------------------------------

interface ColorPickerProps {
  currentColor: string | undefined;
  onSelectColor: (color: string) => void;
  disabled?: boolean;
}

function ColorPicker({ currentColor, onSelectColor, disabled }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseDown={(e) => e.preventDefault()}
        disabled={disabled}
        title="Text Color"
        className={cn(
          "inline-flex items-center justify-center gap-0.5 rounded-md p-1.5 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        <Paintbrush className="h-4 w-4" />
        <ChevronDown className="h-3 w-3" />
        {currentColor && (
          <span
            className="absolute bottom-0.5 left-1.5 right-1.5 h-0.5 rounded-full"
            style={{ backgroundColor: currentColor }}
          />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-border bg-popover p-3 shadow-md min-w-[180px]">
          <p className="text-xs font-medium text-muted-foreground mb-2">Text Color</p>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.name}
                onClick={() => {
                  onSelectColor(color.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-center rounded-md p-1 transition-colors",
                  "hover:bg-accent",
                  currentColor === color.value && "ring-2 ring-primary ring-offset-1"
                )}
              >
                <span
                  className="h-5 w-5 rounded-full border border-border"
                  style={{ backgroundColor: color.value }}
                />
              </button>
            ))}
          </div>
          {currentColor && (
            <button
              type="button"
              onClick={() => {
                onSelectColor("");
                setOpen(false);
              }}
              className="mt-2 w-full rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-center"
            >
              Remove color
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Highlight color picker dropdown
// ---------------------------------------------------------------------------

interface HighlightPickerProps {
  editor: ReturnType<typeof useEditor>;
  disabled?: boolean;
}

function HighlightPicker({ editor, disabled }: HighlightPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isActive = editor?.isActive("highlight");

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseDown={(e) => e.preventDefault()}
        disabled={disabled}
        title="Highlight"
        className={cn(
          "inline-flex items-center justify-center gap-0.5 rounded-md p-1.5 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <Highlighter className="h-4 w-4" />
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-border bg-popover p-3 shadow-md min-w-[180px]">
          <p className="text-xs font-medium text-muted-foreground mb-2">Highlight Color</p>
          <div className="grid grid-cols-3 gap-2">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.name}
                onClick={() => {
                  editor?.chain().focus().toggleHighlight({ color: color.value }).run();
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-center rounded-md p-1.5 transition-colors",
                  "hover:ring-2 hover:ring-primary/50"
                )}
              >
                <span
                  className="h-5 w-10 rounded border border-border"
                  style={{ backgroundColor: color.value }}
                />
              </button>
            ))}
          </div>
          {isActive && (
            <button
              type="button"
              onClick={() => {
                editor?.chain().focus().unsetHighlight().run();
                setOpen(false);
              }}
              className="mt-2 w-full rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-center"
            >
              Remove highlight
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main rich text editor component
// ---------------------------------------------------------------------------

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  editable = true,
}: RichTextEditorProps) {
  const isExternalUpdate = useRef(false);
  const lastContentRef = useRef(content);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        horizontalRule: {},
        blockquote: {},
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({ multicolor: true }),
      CustomImage.configure({
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing your notes...",
      }),
    ],
    content: markdownToHtml(content),
    editable,
    onUpdate: ({ editor: ed }) => {
      if (!isExternalUpdate.current) {
        const html = ed.getHTML();
        lastContentRef.current = html;
        onChange(html);
      }
    },
    editorProps: {
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        const images = Array.from(files).filter((file) =>
          file.type.startsWith("image/")
        );
        if (images.length === 0) return false;

        event.preventDefault();

        images.forEach((image) => {
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            const { schema } = view.state;
            const imageNode = schema.nodes.image.create({ src });
            const pos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            if (pos) {
              const tr = view.state.tr.insert(pos.pos, imageNode);
              view.dispatch(tr);
            }
          };
          reader.readAsDataURL(image);
        });

        return true;
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        const images = Array.from(items).filter((item) =>
          item.type.startsWith("image/")
        );
        if (images.length === 0) return false;

        event.preventDefault();

        images.forEach((item) => {
          const file = item.getAsFile();
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            editor?.chain().focus().setImage({ src }).run();
          };
          reader.readAsDataURL(file);
        });

        return true;
      },
      attributes: {
        class: "editor-content",
      },
    },
  });

  // Sync editable prop
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Sync external content changes
  useEffect(() => {
    if (!editor) return;
    if (content === lastContentRef.current) return;
    lastContentRef.current = content;

    const incomingHtml = markdownToHtml(content);
    const currentHtml = editor.getHTML();
    if (currentHtml !== incomingHtml) {
      isExternalUpdate.current = true;
      editor.commands.setContent(incomingHtml);
      isExternalUpdate.current = false;
    }
  }, [content, editor]);

  // ----- Image drag handler for free positioning -----
  useEffect(() => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper) return;

    let dragImg: HTMLImageElement | null = null;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== "IMG" || !target.classList.contains("editor-image")) return;
      // Only activate on direct image click (not resize handles etc.)
      if (e.button !== 0) return;

      e.preventDefault();
      dragImg = target as HTMLImageElement;
      const rect = dragImg.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Make image absolutely positioned if not already
      if (!dragImg.style.position || dragImg.style.position !== "absolute") {
        const wrapperRect = wrapper.getBoundingClientRect();
        dragImg.style.position = "absolute";
        dragImg.style.left = `${rect.left - wrapperRect.left + wrapper.scrollLeft}px`;
        dragImg.style.top = `${rect.top - wrapperRect.top + wrapper.scrollTop}px`;
        dragImg.style.zIndex = "20";
      }

      dragImg.classList.add("dragging");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragImg) return;
      e.preventDefault();
      const wrapperRect = wrapper.getBoundingClientRect();
      const newLeft = e.clientX - wrapperRect.left + wrapper.scrollLeft - offsetX;
      const newTop = e.clientY - wrapperRect.top + wrapper.scrollTop - offsetY;
      dragImg.style.left = `${Math.max(0, newLeft)}px`;
      dragImg.style.top = `${Math.max(0, newTop)}px`;
    };

    const onMouseUp = () => {
      if (!dragImg) return;
      dragImg.classList.remove("dragging");

      // Update TipTap node attributes to persist position
      if (editor) {
        const pos = dragImg.style.left;
        const top = dragImg.style.top;
        // Find the image node in the document and update its style attribute
        const imgSrc = dragImg.getAttribute("src");
        editor.state.doc.descendants((node, nodePos) => {
          if (node.type.name === "image" && node.attrs.src === imgSrc) {
            const style = `position: absolute; left: ${pos}; top: ${top}; z-index: 20;`;
            editor.view.dispatch(
              editor.state.tr.setNodeMarkup(nodePos, undefined, {
                ...node.attrs,
                style,
                "data-float-x": pos,
                "data-float-y": top,
              })
            );
            return false;
          }
        });
      }

      dragImg = null;
    };

    wrapper.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      wrapper.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [editor]);

  // ----- Toolbar handlers -----

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!editor) return;
    const text = editor.getText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [editor]);

  const handleInsertImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0 || !editor) return;

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      });

      e.target.value = "";
    },
    [editor]
  );

  const handleFontSizeChange = useCallback(
    (direction: "up" | "down") => {
      if (!editor) return;
      const current = getCurrentFontSize(editor);
      const idx = FONT_SIZES.indexOf(current);
      let newSize: number;
      if (direction === "up") {
        newSize = idx >= 0 && idx < FONT_SIZES.length - 1 ? FONT_SIZES[idx + 1] : (current < FONT_SIZES[FONT_SIZES.length - 1] ? FONT_SIZES.find((s) => s > current) || current : current);
      } else {
        newSize = idx > 0 ? FONT_SIZES[idx - 1] : (current > FONT_SIZES[0] ? [...FONT_SIZES].reverse().find((s) => s < current) || current : current);
      }
      if (newSize !== current) {
        editor.chain().focus().setMark("textStyle", { fontSize: `${newSize}px` }).run();
      }
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  const currentFontSize = getCurrentFontSize(editor);

  return (
    <div ref={editorWrapperRef} className="bg-background relative">
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Toolbar */}
      {editable && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5 sticky top-0 z-10"
          )}
        >
          {/* Bold */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>

          {/* Italic */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          {/* Underline */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>

          {/* Strikethrough */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Font Size Controls */}
          <ToolbarButton
            onClick={() => handleFontSizeChange("down")}
            disabled={currentFontSize <= FONT_SIZES[0]}
            title="Decrease font size"
          >
            <Minus className="h-3.5 w-3.5" />
          </ToolbarButton>
          <span
            className="inline-flex items-center justify-center min-w-[2rem] px-1 text-xs font-medium text-muted-foreground select-none"
            title="Current font size"
          >
            {currentFontSize}
          </span>
          <ToolbarButton
            onClick={() => handleFontSizeChange("up")}
            disabled={currentFontSize >= FONT_SIZES[FONT_SIZES.length - 1]}
            title="Increase font size"
          >
            <Plus className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Heading 1 */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>

          {/* Heading 2 */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>

          {/* Heading 3 */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Bullet List */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          {/* Ordered List */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Text Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Text Color */}
          <ColorPicker
            currentColor={editor.getAttributes("textStyle").color}
            onSelectColor={(color) => {
              if (color) {
                editor.chain().focus().setColor(color).run();
              } else {
                editor.chain().focus().unsetColor().run();
              }
            }}
          />

          {/* Highlight with color picker */}
          <HighlightPicker editor={editor} />

          <ToolbarSeparator />

          {/* Image */}
          <ToolbarButton onClick={handleInsertImage} title="Insert Image">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Undo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>

          {/* Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Copy */}
          <ToolbarButton
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </ToolbarButton>
        </div>
      )}

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
