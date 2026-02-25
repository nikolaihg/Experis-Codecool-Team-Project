import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./AddTvShow.module.css";
import type { UserShowEntry } from "../types";
import { useAuth } from "../auth/AuthContext";

export const STATUS_MAP = {
  0: "Planning",
  1: "Watching",
  2: "Completed",
  3: "OnHold",
  4: "Dropped",
} as const;

type EditForm = {
  status: number;
  rating: number | "";
};

type EditTvShowProps = {
  open: boolean;
  entry: UserShowEntry | null;
  onClose: () => void;
  onSaved: () => void;
};

export function EditTvShow({ open, entry, onClose, onSaved }: EditTvShowProps) {
  const { token } = useAuth();
  const [form, setForm] = useState<EditForm>({ status: 1, rating: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !entry) return;
    setError("");
    setForm({
      status: entry.status ?? 1,
      rating: entry.rating ?? "",
    });
  }, [open, entry]);

  if (!open || !entry) return null;

  async function saveUpdate() {
    if (!token || !entry) return;

    const rating = form.rating === "" ? undefined : Number(form.rating);
    if (rating !== undefined && (Number.isNaN(rating) || rating < 1 || rating > 10)) {
      setError("Rating must be a whole number from 1 to 10.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/lists/${entry.userListId}/items/${entry.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: Number(form.status),
            rating,
          }),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to update entry");
      }

      onClose();
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update entry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  
  const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return null;


  return ReactDOM.createPortal(
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void saveUpdate();
          }}
        >
          <button
            className={styles.modalCloseButton}
            type="button"
            onClick={onClose}
            aria-label="Close edit form"
          >
            ×
          </button>

          <h2 style={{ marginTop: 4, marginBottom: 6 }}>Edit entry</h2>
          
          <p style={{ marginTop: 4, opacity: 0.8 }}>{entry.tvShow.title}</p>

          <div>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: Number(e.target.value),
                }))
              }
            >
              {Object.entries(STATUS_MAP).map(([code, label]) => (
                <option key={code} value={Number(code)}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rating">Rating (1-10)</label>
            <input
              id="rating"
              type="number"
              min={1}
              max={10}
              step={1}
              value={form.rating}
              onChange={(e) => {
                const raw = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  rating: raw === "" ? "" : Number(raw),
                }));
              }}
            />
          </div>

          {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}

          <div style={{ display: "flex", gap: 8 }}>
            <button className={styles.modalCancelButton} type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.modalAddButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    modalRoot
  );
}
