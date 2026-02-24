import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { UserList } from "../types";
import { WatchListCard } from "../components/WatchListCard";
import { AddTvShowButton } from "../components/AddTvShowButton";

const WatchListsPage: React.FC = () => {
  const { token } = useAuth()
  const [watchLists, setWatchLists] = useState<UserList[]>([])
  const [name, setName] = useState("");



  useEffect(() => {
    fetchWatchLists()

  }, [token]);

  async function fetchWatchLists() {
    if (!token) return
    try {
      const response = await fetch(`/api/lists`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error("Unable to fetch lists")
      const json = await response.json()
      const lists = json.filter((item: { type: number; }) => item.type === 1);
      setWatchLists(lists)
      console.log(lists)
    } catch (err) {
      if (err instanceof Error) console.log(err.message)
    }
  }

  async function onChange() {
    await fetchWatchLists()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createWatchList()

    setName("");
  }

  async function createWatchList() {
    if (!token) return

    const watchList = {
      name: name,
      type: 1,
      isPublic: true
    }

    try {
      const response = await fetch(`/api/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(watchList),
      })
      if (!response.ok) throw new Error("Unable to create watchlist")
      onChange()
      const json = await response.json()
      console.log(json)
    } catch (err) {
      if (err instanceof Error) console.log(err.message)
    }
  }


  return (
    <div className="page-container" style={{ maxWidth: 1000 }}>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Watchlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>

      {watchLists.length === 0 ?
        <p>No watchlists yet. Create your first watchlist!</p>
        :
        watchLists.map(l => <WatchListCard key={l.id} userList={l} onChange={onChange} />)
      }

      <AddTvShowButton onChange={onChange} />
    </div>
  )
};

export default WatchListsPage;