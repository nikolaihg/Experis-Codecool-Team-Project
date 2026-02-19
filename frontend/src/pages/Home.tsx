import React, { useEffect, useState } from "react";
import { TVShowCard } from "../components/TVShowCard";
import { useAuth } from "../auth/AuthContext";
import type { UserShowEntry } from "../types";


const Home: React.FC = () => {
  const { token } = useAuth()
  const [diaryEntryList, setDiaryEntryList] = useState<UserShowEntry[]>([])


  useEffect(() => {
    fetchDiary()

  }, [token]);

  async function fetchDiary() {
    if (!token) return
    try {
      const response = await fetch(`/api/lists`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error("Unable to fetch diary")
      const json = await response.json()
      const diaryList = json.find((item: { type: number; }) => item.type === 0);
      setDiaryEntryList(diaryList.userShowEntryList)
      console.log(diaryList)
    } catch (err) {
      if (err instanceof Error) console.log(err.message)
    }
  }

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
      await fetchDiary()
      return
    }

    const message = await res.text();
    if (!res.ok) {
      console.error("Delete failed:", message || "Unknown error");
      return;
    }
  }


  return (
    <div className="page-container" style={{ maxWidth: 500 }}>
      <h2>Diary</h2>
      {diaryEntryList.length === 0 ?
        <p>No diary entries yet. Add your first show!</p>
        :
        diaryEntryList.map(e => <TVShowCard key={e.id} entry={e} onDelete={DeleteEntry} />)
      }
    </div>
  )
};

export default Home;
