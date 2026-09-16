"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useCallback, useState } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Rows3,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Align = "none" | "left" | "center" | "right";

/**
 * Google-Docs-style image node view: drag-corner resizing with aspect-ratio
 * lock (width drives height automatically), alignment / text-wrap modes, and
 * an inline hover toolbar with delete.
 */
export function ResizableImage({
  node,
  updateAttributes,
  deleteNode,
  selected,
  editor,
}: NodeViewProps) {
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) || "";
  const title = (node.attrs.title as string) || undefined;
  const width = (node.attrs.width as string) || undefined;
  const align = ((node.attrs.align as string) || "none") as Align;

  const editable = editor.isEditable;
  const [liveWidth, setLiveWidth] = useState<string | null>(null);

  const startResize = useCallback(
    (e: React.PointerEvent, side: "left" | "right") => {
      e.preventDefault();
      e.stopPropagation();

      // Reference width = the editor's content column width.
      const editorWidth = editor.view.dom.clientWidth || 1;
      const frame = (e.currentTarget as HTMLElement).parentElement;
      const startPx = e.clientX;
      const startWidth = frame ? frame.offsetWidth : editorWidth;

      const onMove = (ev: PointerEvent) => {
        const delta = ev.clientX - startPx;
        const dir = side === "right" ? 1 : -1;
        let next = startWidth + dir * delta;
        next = Math.max(60, Math.min(next, editorWidth));
        const pct = Math.max(10, Math.min(100, Math.round((next / editorWidth) * 100)));
        setLiveWidth(`${pct}%`);
      };
      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        setLiveWidth((current) => {
          if (current) updateAttributes({ width: current });
          return null;
        });
      };
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [editor, updateAttributes]
  );

  const appliedWidth = liveWidth || width;

  return (
    <NodeViewWrapper
      className={cn("ri-wrapper", `ri-align-${align}`)}
      style={appliedWidth ? { width: appliedWidth } : undefined}
      data-align={align}
    >
      <div className={cn("ri-frame", selected && "ri-selected")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} title={title} draggable={false} />

        {editable && selected && (
          <>
            <div className="ri-toolbar" contentEditable={false}>
              <button
                type="button"
                title="Wrap left"
                onClick={() => updateAttributes({ align: "left" })}
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Center"
                onClick={() => updateAttributes({ align: "center" })}
              >
                <AlignCenter className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Wrap right"
                onClick={() => updateAttributes({ align: "right" })}
              >
                <AlignRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="In line (no wrap)"
                onClick={() => updateAttributes({ align: "none" })}
              >
                <Rows3 className="h-3.5 w-3.5" />
              </button>
              <span className="ri-toolbar-sep" />
              <button type="button" title="Delete image" onClick={() => deleteNode()}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <span
              className="ri-handle ri-handle-l"
              onPointerDown={(e) => startResize(e, "left")}
            />
            <span
              className="ri-handle ri-handle-r"
              onPointerDown={(e) => startResize(e, "right")}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
