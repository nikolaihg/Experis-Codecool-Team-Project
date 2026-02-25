import { useState } from "react"
import styles from "../components/addTvShow.module.css"
import { AddTvShow } from "../components/addTvShow"

type AddTvShowButtonProps = {
    onChange: () => void
}

export function AddTvShowButton({ onChange }: AddTvShowButtonProps) {
    const [adding, setAdding] = useState(false)

    return (
        <>
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
                        <AddTvShow onAdd={onChange} />
                    </div>
                </div>
            ) : null}
        </>
    )
}