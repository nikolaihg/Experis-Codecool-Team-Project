import { useMemo, useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./addTvShow.module.css";
import { useAuth } from "../auth/AuthContext"
import TvShowSearch from "./TvShowSearch";
import type { TVShow } from "../types";
import type { FormState, TVShowOption, UserListOption, AddTvShowPayload } from "../types";
import { getUserLists } from "../services/api/lists.api";
import { addTvShowToList } from "../services/api/tvshows.api";

type AddTvShowProps = {
  tvShow?: TVShowOption | null;
  onAdd?: (payload: AddTvShowPayload) => Promise<void> | void;
};

const defaultForm: FormState = {
	userListId: "",
	tvShowId: "",
	status: "0",
	rating: "",
};

export function AddTvShow({ tvShow }: AddTvShowProps) {
	const [form, setForm] = useState<FormState>(defaultForm);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lists, setLists] = useState<UserListOption[]>([]);
	const [listsError, setListsError] = useState<string>("");
	const [selectedShow, setSelectedShow] = useState<TVShowOption | null>(tvShow ?? null);

	const { user } = useAuth();
	const userId = user?.id;

	console.log("User in AddTvShow: ", user); // Debug log

	useEffect(() => {
		setSelectedShow(tvShow ?? null);
		setForm((prev) => ({ ...prev, tvShowId: tvShow?.id ?? "" }));
	}, [tvShow]);

	const handleShowSelect = (show: TVShow) => {
		const selected: TVShowOption = {
			id: show.id,
			title: show.title,
		};
		setSelectedShow(selected);
		setForm((prev) => ({ ...prev, tvShowId: selected.id }));
	};

	useEffect(() => {
		let isActive = true;

		const loadLists = async () => {
			try {
				if (!userId) {
					setListsError("Sign in to load your lists.");
					setLists([]);
					return;
				}

				console.log(`Fetching lists for user ${userId}`); // Debug log
				
				const data = await getUserLists();
				if (isActive) {
					setLists(data);
					setListsError("");
				}
			} catch (err) {
				console.error("Failed to fetch user lists: ", err);
				if (isActive) {
					setListsError("Failed to load lists.");
					setLists([]);
				}
			}
		};

		loadLists();
		return () => {
			isActive = false;
		};
	}, [userId]);

	const canSubmit = useMemo(() => {
		return form.userListId !== "" && form.tvShowId !== "" && !isSubmitting;
	}, [form.userListId, form.tvShowId, isSubmitting]);

	const handleChange = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm((prev) => ({ ...prev, [key]: e.target.value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (form.userListId === "") {
			setError("Choose a list before adding.");
			console.log("Submission error: No list selected");
			return;
		}

		if (form.tvShowId === "") {
			setError("Choose a TV show before adding.");
			return;
		}

		const ratingValue = form.rating.trim() === "" ? undefined : Number(form.rating);
		if (ratingValue !== undefined && (Number.isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5)) {
			setError("Rating must be a number from 0 to 5.");
			console.log("Submission error: Invalid rating value");
			return;
		}

		const payload: AddTvShowPayload = {
			userListId: Number(form.userListId),
			tvShowId: Number(form.tvShowId),
			status: form.status || undefined,
			rating: ratingValue,
		};

		try {
			setIsSubmitting(true);
			if(userId){
				await addTvShowToList(Number(payload.userListId), payload.tvShowId.toString(), Number(payload.status), payload.rating);
				setSuccess("Added to list.");
				setForm(defaultForm);
				setSelectedShow(null);
			} else {
				console.log("UserId was undefined when adding tvshow")
			}
		
		} catch (err) {
			setError("Failed to add TV show. Try again.");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Add TV show</h2>

			<div>
				<label>TV show</label>
				<TvShowSearch onSelect={handleShowSelect} />
				{selectedShow ? <p>Selected: {selectedShow.title}</p> : null}
			</div>

			<div>
				<label htmlFor="list">List</label>
				<select id="list" value={form.userListId} onChange={handleChange("userListId")}>
					<option value="">Select a list</option>
					{lists.map((list) => (
						<option key={list.id} value={list.id}>
							{list.name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="status">Status</label>
				<select id="status" value={form.status} onChange={handleChange("status")}>
					<option value="0">Planning</option>
					<option value="1">Watching</option>
					<option value="2">Completed</option>
					<option value="3">On Hold</option>
					<option value="4">Dropped</option>
				</select>
			</div>

			<div>
				<label htmlFor="rating">Rating (0-5)</label>
				<input
					id="rating"
					type="number"
					min={0}
					max={5}
					step={1}
					value={form.rating}
					onChange={handleChange("rating")}
				/>
			</div>
			{listsError && <p>{listsError}</p>}
			{error && <p>{error}</p>}
			{success && <p>{success}</p>}

			<button className={styles.modalAddButton} type="submit" disabled={!canSubmit}>
				{isSubmitting ? "Adding..." : "Add to list"}
			</button>
		</form>
	);
}