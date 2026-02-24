import { useState, useEffect } from "react";
import type { TVShow } from "../../types";
import { createTvShow, updateTvShow } from "../../services/api/tvshows.api";
import styles from "./TvShowModal.module.css";

interface TvShowModalProps {
    isOpen: boolean;
    tvShow?: TVShow | null; // If provided, we are editing. If null/undefined, we are creating.
    onClose: () => void;
    onSave: () => void;
}

const DEFAULT_TV_SHOW: Omit<TVShow, "id"> = {
    title: "",
    description: "",
    genre: "",
    releaseYear: new Date().getFullYear(),
    status: 0,
    amountOfEpisodes: 0,
    imdbRating: 0,
    posterUrl: ""
};

export function TvShowModal({ isOpen, tvShow, onClose, onSave }: TvShowModalProps) {
    const [formData, setFormData] = useState<Omit<TVShow, "id"> & { id?: string }>(DEFAULT_TV_SHOW);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!tvShow;

    useEffect(() => {
        if (isOpen) {
            if (tvShow) {
                setFormData({ ...tvShow });
            } else {
                setFormData(DEFAULT_TV_SHOW);
            }
            setError(null);
        }
    }, [isOpen, tvShow]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            if (["releaseYear", "amountOfEpisodes", "status"].includes(name)) {
                return { ...prev, [name]: parseInt(value) || 0 };
            }
            if (["imdbRating"].includes(name)) {
                return { ...prev, [name]: parseFloat(value) || 0 };
            }
            
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing && formData.id) {
                await updateTvShow(formData.id, formData as TVShow);
            } else {
                const { ...createData } = formData; 
                await createTvShow(createData);
            }
            onSave();
            onClose();
        } catch (err) {
            console.error(isEditing ? "Failed to update TV show" : "Failed to create TV show", err);
            setError(isEditing ? "Failed to update TV show. Please try again." : "Failed to create TV show. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                
                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 style={{ marginBottom: "1rem", color: "var(--color-text-main)" }}>
                        {isEditing ? "Edit TV Show" : "Create New TV Show"}
                    </h2>

                    <div className={styles.field}>
                        <label className={styles.label}>Title</label>
                        <input
                            type="text"
                            name="title"
                            className={styles.input}
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            name="description"
                            className={styles.textarea}
                            value={formData.description || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Genre</label>
                        <input
                            type="text"
                            name="genre"
                            className={styles.input}
                            value={formData.genre}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Year</label>
                            <input
                                type="number"
                                name="releaseYear"
                                className={styles.input}
                                value={formData.releaseYear}
                                onChange={handleChange}
                                min="1900"
                                max="2100"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Status</label>
                            <select
                                name="status"
                                className={styles.select}
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value={0}>Ongoing</option>
                                <option value={1}>Ended</option>
                                <option value={2}>Hiatus</option>
                                <option value={3}>Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Episodes</label>
                            <input
                                type="number"
                                name="amountOfEpisodes"
                                className={styles.input}
                                value={formData.amountOfEpisodes}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Rating</label>
                            <input
                                type="number"
                                name="imdbRating"
                                className={styles.input}
                                value={formData.imdbRating}
                                onChange={handleChange}
                                min="0"
                                max="10"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Poster URL</label>
                        <input
                            type="text"
                            name="posterUrl"
                            className={styles.input}
                            value={formData.posterUrl || ""}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className={`${styles.button} ${styles.save}`} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
