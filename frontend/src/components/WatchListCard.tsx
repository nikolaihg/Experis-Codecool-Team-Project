import { useAuth } from "../auth/AuthContext";
import { deleteList } from "../services/api/lists.api";
import type { UserList } from "../types";
import { TVShowCard } from "./TVShowCard";
import styles from "./WatchListCard.module.css";

type WatchListProps = {
  userList: UserList;
  onChange: () => void;
};

export function WatchListCard({ userList, onChange }: WatchListProps) {
  const { token } = useAuth();

  async function handleDelete() {
    if (!token) return;

    const ok = await deleteList(userList.id, token);

    if (ok) onChange();
  }

  return (
    <div className={styles.card}>
      <button className={styles.deleteBtn} onClick={handleDelete}>
        ✕
      </button>

      <h2>{userList.name}</h2>

      {userList.userShowEntryList.length === 0 ? (
        <p>No tv shows entries yet. Add your first show!</p>
      ) : (
        userList.userShowEntryList.map((e) => (
          <TVShowCard key={e.id} entry={e} onChange={onChange} />
        ))
      )}
    </div>
  );
}