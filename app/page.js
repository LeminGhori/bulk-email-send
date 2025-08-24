"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import EmailEditor from "./components/EmailEditor";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function EmailSender() {
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [emails, setEmails] = useState([]); // array of {label, value}
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");

  // Initialize editor with localStorage value if present
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      localStorage.setItem("editorContent", editor.getHTML());
    },
  });

  // Load saved inputs from localStorage
  useEffect(() => {
    
    const savedEmail = localStorage.getItem("useremail");
    const savedPassword = localStorage.getItem("password");
    const savedSubject = localStorage.getItem("subject");
    const savedEditorContent = localStorage.getItem("editorContent");

    if (savedEditorContent)  editor?.commands?.setContent(savedEditorContent);
    if (savedEmail) setUseremail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    if (savedSubject) setSubject(savedSubject);
  }, [editor]);

  // Save useremail, password, subject whenever they change
  useEffect(() => {
    if (useremail) localStorage.setItem("useremail", useremail);
  }, [useremail]);

  useEffect(() => {
    if (password) localStorage.setItem("password", password);
  }, [password]);

  useEffect(() => {
    if (subject) localStorage.setItem("subject", subject);
  }, [subject]);

  // Validate email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle creation and validation of new emails
  const handleEmailsChange = (selectedOptions) => {
    const filtered = selectedOptions.filter((opt) => isValidEmail(opt.value));
    if (filtered.length !== selectedOptions.length) {
      alert("One or more emails have invalid format and were removed.");
    }
    setEmails(filtered);
  };

  const handleInputChange = (inputValue, { action }) => {
    // just accept input normally
  };

  const handleKeyDown = (event) => {
    if (!event.target.value) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
      case ",":
        event.preventDefault();
        const inputValue = event.target.value.trim();
        if (inputValue && isValidEmail(inputValue)) {
          if (!emails.find((e) => e.value === inputValue)) {
            setEmails([...emails, { label: inputValue, value: inputValue }]);
            event.target.value = "";
          }
        } else {
          alert("Invalid email format");
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  const handleSendEmails = async () => {
    if (
      !useremail ||
      !password ||
      emails.length === 0 ||
      !subject ||
      !editor?.getHTML()?.toString()
    ) {
      setStatus("Please fill all fields correctly.");
      return;
    }
    setStatus("Sending emails...");

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          useremail,
          password,
          emailList: emails.map((e) => e.value),
          subject,
          content: editor?.getHTML()?.toString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Emails sent successfully!");
        setEmails([]);
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Email Sender</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionHeader}>Sender Credentials</h2>
        <input
          type="email"
          placeholder="Your Gmail"
          value={useremail}
          onChange={(e) => setUseremail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="App password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeader}>Recipients</h2>
        <Select
          isMulti
          value={emails}
          onChange={handleEmailsChange}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type email and press enter"
          noOptionsMessage={() => "Type email and press Enter or Tab"}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: 44,
              borderRadius: 8,
              borderColor: "#cbd5e1",
              fontSize: 16,
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#2563eb",
              color: "white",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "white",
              fontWeight: "600",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "white",
              ":hover": {
                backgroundColor: "#1e40af",
                color: "white",
                cursor: "pointer",
              },
            }),
          }}
          formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
          isClearable
          backspaceRemovesValue
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeader}>Subject</h2>
        <input
          type="text"
          placeholder="Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={styles.input}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeader}>Email Content</h2>
        <div style={styles.quillContainer}>
          <EmailEditor editor={editor} />
        </div>
      </section>

      <button style={styles.button} onClick={handleSendEmails}>
        Send Emails
      </button>

      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: "0 20px 40px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    color: "#222",
    fontWeight: "700",
    marginBottom: 30,
    fontSize: "2.5rem",
  },
  section: {
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: "1px solid #e2e8f0",
  },
  sectionHeader: {
    fontSize: "1.5rem",
    marginBottom: 16,
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.5px solid #cbd5e1",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
    marginBottom: 16,
  },
  quillContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "inset 0 0 8px rgba(149, 157, 165, 0.2)",
  },
  button: {
    width: "100%",
    padding: "14px 20px",
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)",
    transition: "background-color 0.2s ease",
  },
  status: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "600",
    color: "#334155",
  },
};
