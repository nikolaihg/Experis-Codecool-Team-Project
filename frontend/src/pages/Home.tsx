import React, { useEffect, useState } from "react";
import { TVShowCard } from "../components/TVShowCard";
import { useAuth } from "../auth/AuthContext";
import { AddTvShow } from '../components/addTvShow';
import styles from "../components/TVShowCard.module.css"


const Home: React.FC = () => {
  const { user, token } = useAuth()
  const [data, setData] = useState([])

  useEffect(() => {
  // Code for the side effect
    async function fetchDiary() {
      if (!user) return
          try {
              const response = await fetch(`/api/User/${user.id}/lists`, 
                  {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                      }
                  })
              if (!response.ok) {
                  throw new Error("Unable to fetch diary");
              }
              const json = await response.json()
                json.find((item: { type: number; }) => item.type === 0);
          } catch(err) {
              if (err instanceof Error)
                  console.log(err.message)
          }
      }
    fetchDiary()
    
  }, [user, token]);


  useEffect(() => {
    async function fetchTvShows() {
      if (!token) return
          try {
              const response = await fetch(`/api/tvshow/`, 
                  {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                      }
                  })
              if (!response.ok) {
                  throw new Error("Unable to fetch tvshows");
              }
              const json = await response.json()
              setData(json)
              console.log("hei")
              console.log(json)
          } catch(err) {
              if (err instanceof Error)
                  console.log(err.message)
          }
      }
    fetchTvShows()
    
  }, [token]);

  const [adding, setAdding] = useState(false)

  return (
    <div className="page-container" style={{maxWidth: 500}}>
      <h2>Recent diary</h2>
        {data.length === 0 ?
          <p>No diary entries yet. Add your first show!</p>
          :
          data.map(e => <TVShowCard tvShow={e} />)
        }

        <button className={styles.button} onClick={() => setAdding(!adding)}>
          <span className={styles.buttonText}>+</span>
        </button>
        {adding ? (
          <div className={styles.modalBackdrop} onClick={() => setAdding(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.modalCloseButton}
                type="button"
                onClick={() => setAdding(false)}
                aria-label="Close add TV show form"
              >
                ×
              </button>
              <AddTvShow />
            </div>
          </div>
        ) : null}
        
      </div>
  )
};

export default Home;
