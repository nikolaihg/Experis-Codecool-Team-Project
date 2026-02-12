import { useState, useEffect } from 'react'
import styles from "./TVShowCard.module.css"
<<<<<<< HEAD
import { AddTvShow } from './addTvShow';
=======
import { AddTvShow} from './addTvShow';
>>>>>>> 81b0cf8 (added fetching userlists (now it doesn't work because we can't log in and get a token)
// import './App.css'

type TVShow = {
    id: string,
    title: string,
    posterUrl: string,
    rating: number,
    releaseYear: number,
    genre: string
}

type TVShowCardProps = {
    tvShow: TVShow;
};


export function TVShowCard({ tvShow }: TVShowCardProps ) {
  const [data, setData] = useState([])
  const [adding, setAdding] = useState(false)

  return (
    <>
        <div className={styles.card}>
            <img className={styles.poster} src={tvShow.posterUrl} alt={tvShow.title} width={150} height={200} />
            
            <div className={styles.content1}>
                <h3>{tvShow.title}</h3>
                <p>{tvShow.releaseYear}</p>
                <p>Rating: {tvShow.rating} / 10</p>
                <p>{tvShow.genre}</p>
            </div>
            <button className={styles.button} onClick={() => setAdding(!adding)}> + </button>
            {adding ? <AddTvShow tvShow={tvShow}/> : null}
        </div>
    </>
  )
}
