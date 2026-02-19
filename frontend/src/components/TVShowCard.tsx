import styles from "./TVShowCard.module.css"
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
        </div>
    </>
  )
}
