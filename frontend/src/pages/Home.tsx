import React, { useEffect, useState } from "react";
import { TVShowCard } from "../components/TVShowCard";
import { useAuth } from "../auth/AuthContext";


const Home: React.FC = () => {
  const { user, token } = useAuth()
  const [diary, setDiary] = useState(null)
  const [data, setData] = useState([])

  const recentEntries = [{
    id: "1",
    title: "Spider-Man",
    posterUrl: "https://original.fontsinuse.com/fontsinuse.com/use-images/165/165448/165448.jpeg",
    rating: 4,
    releaseYear: 2002,
    genre: "Action"
  },
  {
    id: "2",
    title: "Spider-Man 2",
    posterUrl: "https://www.movieposters.com/cdn/shop/products/2a27abf44e604b54903eb8e2beba66eb_2fafebce-cc32-41e1-a559-2b078d0f15f6_grande.jpg?v=1762513052",
    rating: 4,
    releaseYear: 2004,
    genre: "Action"
  }]

  useEffect(() => {
  // Code for the side effect
    async function fetchDiary() {
      if (!user) return
      console.log("heii")
          try {
              const response = await fetch(`http://localhost:5102/api/User/${user.id}/lists`, 
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
              console.log("heiii")
              const json = await response.json()
              const diaryList = json.find((item: { type: number; }) => item.type === 0);
              setDiary(diaryList)
          } catch(err) {
              if (err instanceof Error)
                  console.log(err.message)
          }
      }
    fetchDiary()
    
  }, [user, token]);


  useEffect(() => {
    async function fetchTvShows() {
      if (!user) return
          try {
              const response = await fetch(`http://localhost:5102/api/tvshow/`, 
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
              console.log(json)
          } catch(err) {
              if (err instanceof Error)
                  console.log(err.message)
          }
      }
    fetchTvShows()
    
  }, []);



  return (
    <>
      <div>
        <h2>Recent diary</h2>
        {/* {recentEntries.length === 0 ?
          <p>No diary entries yet. Add your first show!</p>
          :
          recentEntries.map(e => <TVShowCard tvShow={e} />)
        } */}
        {data.length === 0 ?
          <p>No diary entries yet. Add your first show!</p>
          :
          data.map(e => <TVShowCard tvShow={e} />)
        }
        
        {/* {diary ? "Something is here"  : "It is not here"} */}
      </div>
    </>

  )
};

export default Home;
