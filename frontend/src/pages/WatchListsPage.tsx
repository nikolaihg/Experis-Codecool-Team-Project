import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { UserList } from "../types";
import { WatchListCard } from "../components/WatchListCard";
import { AddTvShowButton } from "../components/AddTvShowButton";
import styles from "./WatchListsPage.module.css";
import { LoadingComponent } from "../components/Loading/Loading";
import { useDelayedSpinner } from "../hooks/useDelayedSpinner";

function WatchListsPage() {
  const { token } = useAuth();
  const [watchLists, setWatchLists] = useState<UserList[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const showSpinner = useDelayedSpinner(loading);

  useEffect(() => {
    fetchWatchLists();
  }, [token]);

  async function fetchWatchLists() {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/lists`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Unable to fetch lists");

      const json = await response.json();
      const lists = json.filter((item: { type: number }) => item.type === 1);
      setWatchLists(lists);

    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onChange() {
    await fetchWatchLists();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createWatchList();
    setName("");
  }

  async function createWatchList() {
    if (!token) return;

    const watchList = {
      name,
      type: 1,
      isPublic: true,
    };

    try {
      const response = await fetch(`/api/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(watchList),
      });

      if (!response.ok) throw new Error("Unable to create watchlist");

      onChange();
      await response.json();

    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    }
  }

  if (loading && showSpinner) return <LoadingComponent />;
  if (loading && !showSpinner) return null;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Watchlists</h1>

        <form className={styles.createForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Watchlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Create watchlist</button>
        </form>
      </div>

      {watchLists.length === 0 ? (
        <p>No watchlists yet. Create your first watchlist!</p>
      ) : (
        <div className={styles.watchlistsContainer}>
          {watchLists.map((l) => (
            <WatchListCard key={l.id} userList={l} onChange={onChange} />
          ))}
        </div>
      )}

      <AddTvShowButton onChange={onChange} />
    </div>
  );
};

export default WatchListsPage;