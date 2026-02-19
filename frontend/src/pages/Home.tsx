import React, { useEffect, useState } from "react";
import { TVShowCard } from "../components/TVShowCard";
import { useAuth } from "../auth/AuthContext";
import type { UserShowEntry } from "../types";


const Home: React.FC = () => {
  const { token } = useAuth()
  const [diaryEntryList, setDiaryEntryList] = useState<UserShowEntry[]>([])


  useEffect(() => {
    async function fetchDiary() {
      if (!token) return
          try {
              const response = await fetch(`/api/lists`, 
                  {
                      method: 'GET',
                      headers: { 'Authorization': `Bearer ${token}` }
                  })
              if (!response.ok) {
                  throw new Error("Unable to fetch diary");
              }
              const json = await response.json()
              const diaryList = json.find((item: { type: number; }) => item.type === 0);
              setDiaryEntryList(diaryList.userShowEntryList)
              console.log(diaryList)
          } catch(err) {
              if (err instanceof Error)
                  console.log(err.message)
          }
      }
    fetchDiary()
    
  }, [token]);



  return (
    <div className="page-container" style={{maxWidth: 500}}>
      <h2>Diary</h2>
        {diaryEntryList.length === 0 ?
          <p>No diary entries yet. Add your first show!</p>
          :
          diaryEntryList.map(e => <TVShowCard key={e.id} entry={e} />)
        }
      </div>
  )
};

export default Home;
