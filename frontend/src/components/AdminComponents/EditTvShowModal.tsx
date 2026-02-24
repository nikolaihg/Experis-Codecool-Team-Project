import { useState, useEffect } from "react";
import type { TVShow } from "../../types";
import { updateTvShow } from "../../services/api/tvshows.api";
import styles from "./EditTvShowModal.module.css";

interface EditTvShowModalProps {
    isOpen: boolean;
    tvShow: TVShow | null;
    onClose: () => void;
    onSave: (updatedShow: TVShow) => void;
}

export function EditTvShowModal({ isOpen, tvShow, onClose, onSave }: EditTvShowModalProps) {
    const [formData, setFormData] = useState<TVShow | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (tvShow) {
            setFormData({ ...tvShow });
            setError(null);
        }
    }, [tvShow, isOpen]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            if (!prev) return null;
            
            // Handle number fields
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
        if (!formData) return;

        setLoading(true);
        setError(null);

        try {
            await updateTvShow(formData.id, formData);
            onSave(formData);
            onClose();
        } catch (err) {
            console.error("Failed to update TV show", err);
            setError("Failed to update TV show. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                
                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
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
