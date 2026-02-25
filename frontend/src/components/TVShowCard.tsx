import styles from "./TVShowCard.module.css"
import type { UserShowEntry } from '../types';
import { useAuth } from "../auth/AuthContext";
import { EditTvShow } from "./EditTvShow";
import { useState } from "react";


const STATUS_MAP = {
  0: "Planning",
  1: "Watching",
  2: "Completed",
  3: "OnHold",
  4: "Dropped",
}

const getStatus = (code: number) => STATUS_MAP[code as keyof typeof STATUS_MAP] ?? "Unknown";


type TVShowCardProps = {
    entry: UserShowEntry
    onChange: () => void
};

export function TVShowCard({ entry, onChange }: TVShowCardProps ) {
    const { token } = useAuth()
    const [editing, setEditing] = useState(false);
    const openEdit = () => setEditing(true);
    const closeEdit = () => setEditing(false);


    async function DeleteEntry(userListId: number, entryId: number) {
        if (!token) return
        let res: Response
        try {
            res = await fetch(`/api/lists/${userListId}/items/${entryId}`,
            {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
        } catch {
            console.error("Network error");
            return;
        }

        if (res.status === 204) {
            onChange()
            return
        }

        const message = await res.text();
        if (!res.ok) {
            console.error("Delete failed:", message || "Unknown error");
            return;
        }
    }


  return (
    <>
        <div className={styles.card}>
            <div className={styles.actions}>
                <button className={styles.editButton} onClick={openEdit}>Edit</button>
                <button
                    className={styles.deleteButton}
                    onClick={() => DeleteEntry(entry.userListId, entry.id)}
                >
                    ✕
                </button>
            </div>

            <img
                className={styles.poster}
                src={entry.tvShow.posterUrl}
                alt={entry.tvShow.title}
            />

            <div className={styles.content}>
                <h3 className={styles.title}>{entry.tvShow.title}</h3>

                <div className={styles.meta}>
                <span>{entry.tvShow.releaseYear}</span>
                <span className={styles.dot}>•</span>
                <span>{entry.tvShow.genre}</span>
                <span className={styles.dot}>•</span>
                <span>IMDb {entry.tvShow.imdbRating}/10</span>
                </div>

                <div className={styles.row}>
                <span className={styles.label}>Status:</span>
                <span>{getStatus(entry.status)}</span>
                </div>

                <div className={styles.row}>
                <span className={styles.label}>Your rating:</span>
                <span>{entry.rating}/10</span>
                </div>
            </div>

            <EditTvShow
                open={editing}
                entry={entry}
                onClose={closeEdit}
                onSaved={onChange}
            />
        </div>
    </>
  )
}