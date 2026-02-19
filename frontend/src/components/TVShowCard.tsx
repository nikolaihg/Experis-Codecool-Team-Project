import styles from "./TVShowCard.module.css"
import type { TVShow, UserShowEntry } from '../types';


export const STATUS_MAP = {
  1: "Planning",
  2: "Watching",
  3: "Completed",
  4: "OnHold",
  5: "Dropped",
}

export const getStatus = (code: number) => STATUS_MAP[code as keyof typeof STATUS_MAP] ?? "Unknown";


type TVShowCardProps = {
    entry: UserShowEntry;
    onDelete: (userListId: number, entryId: number) => void
};

export function TVShowCard({ entry, onDelete }: TVShowCardProps ) {


  return (
    <>
        <div className={styles.card}>
            <button
                className={styles.deleteButton}
                onClick={() => onDelete(entry.userListId, entry.id)}
            >
                ✕
            </button>

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
        </div>
    </>
  )
}