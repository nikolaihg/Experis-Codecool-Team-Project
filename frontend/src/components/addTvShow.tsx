import { useMemo, useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./TVShowCard.module.css";
import { getUserLists, addTvShowToList } from "../services/api";
import { useAuth } from "../auth/AuthContext"

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
	tvShowId: number;
	status?: string;
	rating?: number;
};

type AddTvShowProps = {
	tvShow: TVShowOption;
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

export function AddTvShow({ tvShow }: AddTvShowProps) {
	const [form, setForm] = useState<FormState>(defaultForm);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
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

		console.log("Submitting form with values:", form);

		if (form.userListId === "") {
			setError("Choose a list before adding.");
			console.log("Submission error: No list selected");
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
				await addTvShowToList(userId.toString(), payload.userListId, payload.tvShowId.toString(), payload.status, payload.rating)
				setSuccess("Added to list.");
				setForm(defaultForm);
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

			<button className={styles.button} type="submit" >
				{isSubmitting ? "Adding..." : "Add to list"}
			</button>
		</form>
	);
}