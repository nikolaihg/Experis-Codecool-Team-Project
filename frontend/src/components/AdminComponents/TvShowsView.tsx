import { useEffect, useState } from "react";
import type { TVShow } from "../../types";
import { getAllTvShows, deleteTvShow } from "../../services/api/tvshows.api";
import "./TvShowsView.css";
import { getStatusLabel } from "../../services/utils/tvshowUtil";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { TvShowModal } from "./TvShowModal";

export function TvShowsView() {
    const [tvShows, setTvShows] = useState<TVShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showToDelete, setShowToDelete] = useState<string | null>(null);
    const [showToEdit, setShowToEdit] = useState<TVShow | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadTvShows();
    }, []);

    async function loadTvShows() {
        try {
            setLoading(true);
            const data = await getAllTvShows();
            setTvShows(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load TV shows", err);
            setError("Failed to load TV shows. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirmDelete() {
        if (!showToDelete) return;

        try {
            await deleteTvShow(showToDelete);
            setTvShows((prev) => prev.filter((show) => show.id !== showToDelete));
        } catch (err) {
            console.error("Failed to delete TV show", err);
            setError("Failed to delete TV show.");
        } finally {
            setShowToDelete(null);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-view-container">
            <div className="admin-view-header">
                <h2 className="admin-view-title">Manage TV Shows</h2>
                <p className="admin-view-description">Here you can add, edit, and delete TV shows for the database reference.</p>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Year</th>
                            <th>Status</th>
                            <th>Episodes</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tvShows.map((show) => (
                            <tr key={show.id}>
                                <td>{show.id}</td>
                                <td>
                                    <div className="tvshow-title-cell">
                                        {show.posterUrl && <img src={show.posterUrl} alt={show.title} className="tvshow-mini-poster" />}
                                        {show.title}
                                    </div>
                                </td>
                                <td>{show.genre}</td>
                                <td>{show.releaseYear}</td>
                                <td>{getStatusLabel(show.status)}</td>
                                <td>{show.amountOfEpisodes}</td>
                                <td>{show.imdbRating}</td>
                                <td>
                                    <div className="action-buttons-container">
                                        <button className="btn-small edit-btn" onClick={() => setShowToEdit(show)}>Edit</button>
                                        <button className="btn-small delete-btn" onClick={() => setShowToDelete(show.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="create-tvshow-container">
                <button className="create-tvshow-btn" onClick={() => setIsCreating(true)}>Create New TV Show</button>
            </div>

            <TvShowModal
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                onSave={loadTvShows}
            />

            <TvShowModal
                isOpen={!!showToEdit}
                tvShow={showToEdit}
                onClose={() => setShowToEdit(null)}
                onSave={() => {
                    loadTvShows();
                    setShowToEdit(null);
                }}
            />

            <ConfirmationModal 
                isOpen={!!showToDelete}
                title="Delete TV Show?"
                description="Are you sure you want to delete this TV show? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowToDelete(null)}
            />
        </div>
    )
}
