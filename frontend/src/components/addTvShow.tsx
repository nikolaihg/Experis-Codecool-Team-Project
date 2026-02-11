import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./TVShowCard.module.css";
import { getUserLists } from "../services/api";

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
	tvShowId: string;
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

export function AddTvShow({ tvShow, onAdd }: AddTvShowProps) {
	const [form, setForm] = useState<FormState>(defaultForm);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const lists = getUserLists("currentUserId"); // Replace with actual user ID or context
	form.tvShowId = tvShow.id;

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
			return;
		}

		const ratingValue = form.rating.trim() === "" ? undefined : Number(form.rating);
		if (ratingValue !== undefined && (Number.isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5)) {
			setError("Rating must be a number from 0 to 5.");
			return;
		}

		const payload: AddTvShowPayload = {
			userListId: Number(form.userListId),
			tvShowId: form.tvShowId,
			status: form.status || undefined,
			rating: ratingValue,
		};

		try {
			setIsSubmitting(true);
			if (onAdd) {
				console.log("Calling onAdd with payload:", payload);
				await onAdd(payload);
			} else {
				console.log("AddTvShow payload:", payload);
			}
			setSuccess("Added to list.");
			setForm(defaultForm);
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
					<option value="Planning">Planning</option>
					<option value="Watching">Watching</option>
					<option value="Completed">Completed</option>
					<option value="OnHold">On Hold</option>
					<option value="Dropped">Dropped</option>
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
			{error && <p>{error}</p>}
			{success && <p>{success}</p>}

			<button className={styles.button} type="submit" disabled={!canSubmit}>
				{isSubmitting ? "Adding..." : "Add to list"}
			</button>
		</form>
	);
}