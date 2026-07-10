"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm ${
        active ? "bg-brand text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-brand underline" } }),
      Image,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: "ProseMirror min-h-[200px] rounded-b-lg border border-t-0 border-gray-300 bg-white",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="h-[240px] animate-pulse rounded-lg bg-gray-100" />;
  }

  function setLink() {
    const prev = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập URL:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt("Nhập URL ảnh:");
    if (!url) return;
    editor!.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t-lg border border-gray-300 bg-gray-50 p-2">
        <ToolbarButton
          title="In đậm"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="In nghiêng"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          title="Tiêu đề H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Tiêu đề H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          title="Danh sách bullet"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          title="Danh sách số"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton title="Liên kết" active={editor.isActive("link")} onClick={setLink}>
          Link
        </ToolbarButton>
        <ToolbarButton title="Chèn ảnh" onClick={addImage}>
          Ảnh
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
