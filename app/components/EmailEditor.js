// src/Tiptap.tsx
"use client";
import { EditorContent } from '@tiptap/react'

const styles ={
  button: {
    padding: "4px 8px",
    fontSize: 12,
    fontWeight: "300",
    color: "#000000",
    backgroundColor: "#fafafa",
    border: "2px solid #2563eb",
    borderRadius: 5,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }
}

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-1 mb-1">
      <button
       style={styles.button}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        bold
      </button>
      <button
       style={styles.button}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        italic
      </button>
      <button
       style={styles.button}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        strike
      </button>
    </div>
  );
};

const EmailEditor = ({editor}) => {
  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default EmailEditor

