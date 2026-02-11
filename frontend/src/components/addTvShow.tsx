<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./TVShowCard.module.css";
import { getUserLists, addTvShowToList } from "../services/api";
import { useAuth } from "../auth/AuthContext";
=======
import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
>>>>>>> ed64079 (Started working on addTvShow)

type UserListOption = {
	id: number;
	name: string;
};

type TVShowOption = {
	id: string;
	title: string;
};

export type AddTvShowPayload = {
	userListId: number;
<<<<<<< HEAD
	tvShowId: number;
=======
	tvShowId: string;
>>>>>>> ed64079 (Started working on addTvShow)
	status?: string;
	rating?: number;
};

type AddTvShowProps = {
<<<<<<< HEAD
	tvShow: TVShowOption;
=======
	lists: UserListOption[];
	tvShows: TVShowOption[];
>>>>>>> ed64079 (Started working on addTvShow)
	onAdd?: (payload: AddTvShowPayload) => Promise<void> | void;
};

type FormState = {
	userListId: string;
	tvShowId: string;
	status: string;
	rating: string;
};

const defaultForm: FormState = {
	userListId: "",
	tvShowId: "",
	status: "Planning",
	rating: "",
};

<<<<<<< HEAD
export function AddTvShow({ tvShow }: AddTvShowProps) {
=======
export function AddTvShow({ lists, tvShows, onAdd }: AddTvShowProps) {
>>>>>>> ed64079 (Started working on addTvShow)
	const [form, setForm] = useState<FormState>(defaultForm);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
<<<<<<< HEAD
	const [lists, setLists] = useState<UserListOption[]>([]);
	const [listsError, setListsError] = useState<string>("");

	const { user } = useAuth();
	const userId = user?.id;

	useEffect(() => {
		setForm((prev) => ({ ...prev, tvShowId: tvShow.id }));
	}, [tvShow.id]);

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
				
				const data = await getUserLists(userId);
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
=======
>>>>>>> ed64079 (Started working on addTvShow)

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

<<<<<<< HEAD
		if (form.userListId === "") {
			setError("Choose a list before adding.");
			console.log("Submission error: No list selected");
=======
		if (form.userListId === "" || form.tvShowId === "") {
			setError("Choose a list and a TV show before adding.");
>>>>>>> ed64079 (Started working on addTvShow)
			return;
		}

		const ratingValue = form.rating.trim() === "" ? undefined : Number(form.rating);
		if (ratingValue !== undefined && (Number.isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5)) {
			setError("Rating must be a number from 0 to 5.");
<<<<<<< HEAD
			console.log("Submission error: Invalid rating value");
=======
>>>>>>> ed64079 (Started working on addTvShow)
			return;
		}

		const payload: AddTvShowPayload = {
			userListId: Number(form.userListId),
<<<<<<< HEAD
			tvShowId: Number(form.tvShowId),
=======
			tvShowId: form.tvShowId,
>>>>>>> ed64079 (Started working on addTvShow)
			status: form.status || undefined,
			rating: ratingValue,
		};

		try {
			setIsSubmitting(true);
<<<<<<< HEAD
			if(userId){
				await addTvShowToList(userId.toString(), payload.userListId, payload.tvShowId.toString(), payload.status, payload.rating)
				setSuccess("Added to list.");
				setForm(defaultForm);
			} else {
				console.log("UserId was undefined when adding tvshow")
			}
		
=======
			if (onAdd) {
				await onAdd(payload);
			} else {
				console.log("AddTvShow payload:", payload);
			}
			setSuccess("Added to list.");
			setForm(defaultForm);
>>>>>>> ed64079 (Started working on addTvShow)
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
<<<<<<< HEAD
				<label htmlFor="status">Status</label>
				<select id="status" value={form.status} onChange={handleChange("status")}>
					<option value="0">Planning</option>
					<option value="1">Watching</option>
					<option value="2">Completed</option>
					<option value="3">On Hold</option>
					<option value="4">Dropped</option>
=======
				<label htmlFor="tvshow">TV Show</label>
				<select id="tvshow" value={form.tvShowId} onChange={handleChange("tvShowId")}
				>
					<option value="">Select a TV show</option>
					{tvShows.map((show) => (
						<option key={show.id} value={show.id}>
							{show.title}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="status">Status</label>
				<select id="status" value={form.status} onChange={handleChange("status")}>
					<option value="Planning">Planning</option>
					<option value="Watching">Watching</option>
					<option value="Completed">Completed</option>
					<option value="OnHold">On Hold</option>
					<option value="Dropped">Dropped</option>
>>>>>>> ed64079 (Started working on addTvShow)
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
<<<<<<< HEAD
			{listsError && <p>{listsError}</p>}
			{error && <p>{error}</p>}
			{success && <p>{success}</p>}

			<button className={styles.button} type="submit" disabled={!canSubmit}>
=======
			{error && <p>{error}</p>}
			{success && <p>{success}</p>}

			<button type="submit" disabled={!canSubmit}>
>>>>>>> ed64079 (Started working on addTvShow)
				{isSubmitting ? "Adding..." : "Add to list"}
			</button>
		</form>
	);
}