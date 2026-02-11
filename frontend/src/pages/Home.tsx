import React from "react";
import { TVShowCard } from "../components/TVShowCard";


const Home: React.FC = () => {
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


  return (
    <>
      <div>
        <h2>Recent diary</h2>
        {recentEntries.length === 0 ?
          <p>No diary entries yet. Add your first show!</p>
          :
          recentEntries.map(e => <TVShowCard tvShow={e} />)
        }
      </div>
    </>

  )
};

export default Home;
