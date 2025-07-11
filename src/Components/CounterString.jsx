import React, { useState, useRef } from "react";
import "../App.css";
import { CopyIcon, DeleteIcon, CloseIcon } from "./Icons";

// Function to count words in the text
function getWordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
// Function to count sentences in the text
function getSentenceCount(text) {
  return text.trim()
    ? (text.match(/[^.!?]+[.!?]+/g) || []).length +
        (text.match(/[^.!?]+$/) ? 1 : 0)
    : 0;
}
// Function to count paragraphs in the text (paragraph = non-empty line)
function getParagraphCount(text) {
  return text.trim()
    ? text.split(/\n/).filter((line) => line.trim().length > 0).length
    : 0;
}

function CounterString({ theme, onToggleTheme }) {
  // State for textarea value
  const [text, setText] = useState("");
  // State for showing copy popover
  const [copyMsg, setCopyMsg] = useState(false);
  // State for showing delete modal
  const [deleteMsg, setDeleteMsg] = useState(false);
  // State for 'don't show again' checkbox
  const [dontShowDelete, setDontShowDelete] = useState(
    localStorage.getItem("dontShowDelete") === "true"
  );
  // State for showing delete success popover
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  // Ref for copy popover timeout
  const copyTimeout = useRef();
  // Ref for delete popover timeout
  const deleteTimeout = useRef();

  // Handle textarea change
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Ref for textarea (for scrollbar)
  const textareaRef = useRef();

  // Handle copy button click
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text); // Copy text to clipboard
      setCopyMsg(true); // Show popover
      clearTimeout(copyTimeout.current); // Clear previous timeout
      copyTimeout.current = setTimeout(() => setCopyMsg(false), 3000); // Hide after 3s
    } catch {}
  };
  // Close copy popover
  const handleCloseCopy = () => setCopyMsg(false);

  // Handle delete button click
  const handleDelete = () => {
    setDeleteMsg(true); // Always show modal
  };
  // Confirm delete in modal
  const handleConfirmDelete = () => {
    setText(""); // Delete text
    setDeleteMsg(false); // Hide modal
    setDeleteSuccess(true); // Show delete success popover
    clearTimeout(deleteTimeout.current);
    deleteTimeout.current = setTimeout(() => setDeleteSuccess(false), 3000);
  };
  // Close delete modal
  const handleCloseDelete = () => setDeleteMsg(false);
  // Handle 'don't show again' checkbox
  const handleDontShowAgain = (e) => {
    setDontShowDelete(e.target.checked);
    localStorage.setItem("dontShowDelete", e.target.checked);
  };
  // Allow clicking label to check checkbox
  const handleLabelClick = () => {
    setDontShowDelete((v) => {
      localStorage.setItem("dontShowDelete", !v);
      return !v;
    });
  };

  // Calculate stats
  const charCount = text.length;
  const wordCount = getWordCount(text);
  const sentenceCount = getSentenceCount(text);
  const paragraphCount = getParagraphCount(text);

  // Render component
  return (
    <>
      <div
        className={`counter-container ${theme}`}
        style={{
          margin: "auto",
          maxWidth: 520,
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          padding:
            window.innerWidth < 600
              ? "18px 14px 16px 14px"
              : "40px 28px 28px 28px",
        }}
      >
        <div className="counter-header">
          <h2>Counter String Project</h2>
          {/* Theme toggle button */}
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={
              theme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? (
              <span style={{ fontWeight: 700 }}>&#9728; Light</span>
            ) : (
              <span style={{ fontWeight: 700 }}>&#9790; Dark</span>
            )}
          </button>
        </div>
        {/* Textarea for input */}
        <textarea
          ref={textareaRef}
          className={`counter-textarea${
            text ? " has-text" : ""
          }`}
          value={text}
          onChange={handleChange}
          placeholder="Type something..."
          rows={6}
          style={{
            overflowY: text.length > 0 ? "auto" : "hidden",
          }}
        />
        <div className="counter-footer">
          {/* Stats for character, word, sentence, paragraph */}
          <div className="counter-stats">
            <span className="counter-number">
              Character: <b>{charCount}</b>
            </span>
            <span className="counter-number">
              Words: <b>{wordCount}</b>
            </span>
            <span className="counter-number">
              Sentences: <b>{sentenceCount}</b>
            </span>
            <span className="counter-number">
              Paragraphs: <b>{paragraphCount}</b>
            </span>
          </div>
          {/* Copy and reset icons: left (copy), right (reset) */}
          <div className="counter-actions-row">
            <button
              className="counter-icon-btn"
              title="Copy all text"
              onClick={handleCopy}
              style={{ marginRight: 8 }}
            >
              <CopyIcon
                size={24}
                color={theme === "dark" ? "#bae6fd" : "#2563eb"}
              />
            </button>
            <button
              className="counter-icon-btn"
              title="Reset/Delete all text"
              onClick={handleDelete}
              style={{ marginLeft: 8 }}
            >
              <DeleteIcon
                size={24}
                color={theme === "dark" ? "#f87171" : "#ef4444"}
              />
            </button>
          </div>
        </div>
      </div>
      {/* Copy message popover */}
      {copyMsg && (
        <div className={`copy-popover ${theme}`}>
          Text copied!{" "}
          <button
            className="close-popover"
            onClick={handleCloseCopy}
            title="Close"
          >
            <CloseIcon
              size={18}
              color={theme === "dark" ? "#bae6fd" : "#2563eb"}
            />
          </button>
        </div>
      )}
      {/* Delete success popover */}
      {deleteSuccess && (
        <div className={`copy-popover ${theme}`}>
          All text deleted!{" "}
          <button
            className="close-popover"
            onClick={() => setDeleteSuccess(false)}
            title="Close"
          >
            <CloseIcon
              size={18}
              color={theme === "dark" ? "#bae6fd" : "#2563eb"}
            />
          </button>
        </div>
      )}
      {/* Delete confirm modal */}
      {deleteMsg && (
        <div className="modal-overlay">
          <div className={`delete-modal ${theme}`}>
            <button
              className="close-modal"
              onClick={handleCloseDelete}
              title="Close"
            >
              <CloseIcon
                size={22}
                color={theme === "dark" ? "#bae6fd" : "#2563eb"}
              />
            </button>
            <h3>Delete all text</h3>
            <p>You're about to delete all of the text.</p>
            <label
              className="dont-show-again"
              onClick={handleLabelClick}
              style={{ cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={dontShowDelete}
                onChange={handleDontShowAgain}
                style={{ cursor: "pointer" }}
              />{" "}
              Don't show again
            </label>
            <div className="modal-actions">
              <button className="modal-continue" onClick={handleConfirmDelete}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CounterString; // Export CounterString component