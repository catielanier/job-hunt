import React, { useState, useContext } from "react";
import axios from "axios";
import { JobContext } from "../contexts/JobContext";
import DatePicker from "react-datepicker";

interface IEditProps {
	title: string;
	company: string;
	datePosted: Date | null;
	dateApplied: Date | null;
	contactName: string;
	contactEmail: string;
	status: string;
	postingUrl: string;
	directPosting: boolean;
	feedback: string;
	setEdit(arg0: boolean): any;
	fetchData: () => void;
}

const EditJob = (props: IEditProps) => {
	const { fetchData, setEdit } = props;
	const { fetchData: fetchGlobalData } = useContext(JobContext);
	const possibleStatus: Array<string> = [
		"Active",
		"Positive",
		"Rejected",
		"Failed",
		"Scam",
		"Ghosted",
	];
	const [datePosted, setDatePosted] = useState(props.datePosted);
	const [dateApplied, setDateApplied] = useState(props.dateApplied);
	const [company, setCompany] = useState(props.company);
	const [title, setTitle] = useState(props.title);
	const [directPosting, setDirectPosting] = useState(props.directPosting);
	const [postingUrl, setPostingUrl] = useState(props.postingUrl);
	const [status, setStatus] = useState(props.status);
	const [feedback, setFeedback] = useState(props.feedback);
	const [contactName, setContactName] = useState(props.contactName);
	const [contactEmail, setContactEmail] = useState(props.contactEmail);

	return (
		<div className="edit-job-grid-container">
			<h2>Edit Job</h2>
			<form>
				<fieldset>
					<div>
						<label htmlFor="title">Job Title:</label>
						<input
							type="text"
							value={title}
							placeholder="Job Title"
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="company">Company:</label>
						<input
							type="text"
							value={company}
							placeholder="Company"
							onChange={(e) => setCompany(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="datePosted">Date Posted:</label>
						<DatePicker
							selected={datePosted}
							onChange={(date) => {
								setDatePosted(date);
							}}
							isClearable
							calendarClassName="calendar"
						/>
					</div>
					<div>
						<label htmlFor="dateApplied">Date Applied:</label>
						<DatePicker
							selected={dateApplied}
							onChange={(date) => {
								setDateApplied(date);
							}}
							isClearable
							calendarClassName="calendar"
						/>
					</div>
					<div className="status-container">
						<label htmlFor="status">Application Status:</label>
						<div className="status-flex">
							{possibleStatus.map((statusType: string) => {
								return (
									<label htmlFor="status-option">
										<input
											type="radio"
											value={statusType}
											checked={status === statusType}
											onChange={(e) => {
												setStatus(e.target.value);
											}}
										/>
										{statusType}
									</label>
								);
							})}
						</div>
					</div>
					<div>
						<label htmlFor="direct">This was a direct referral.</label>
						<input
							type="checkbox"
							checked={directPosting}
							onChange={() => {
								setDirectPosting(!directPosting);
							}}
						/>
					</div>
					<div>
						{!directPosting && (
							<>
								<label htmlFor="postingUrl">Posting URL:</label>
								<input
									type="text"
									placeholder="Posting URL"
									value={postingUrl}
									onChange={(e) => {
										setPostingUrl(e.target.value);
									}}
								/>
							</>
						)}
					</div>
					<div>
						<label htmlFor="contactName">Contact Name:</label>
						<input
							type="text"
							placeholder="Contact Name"
							value={contactName}
							onChange={(e) => setContactName(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="contactEmail">Contact Email:</label>
						<input
							type="text"
							value={contactEmail}
							placeholder="Contact Email"
							onChange={(e) => setContactEmail(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="feedback">Feedback:</label>
						<input
							type="text"
							value={feedback}
							placeholder="Feedback"
							onChange={(e) => {
								setFeedback(e.target.value);
							}}
						/>
					</div>
					<div>
						<button type="submit">Edit Job</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								setEdit(false);
							}}
						>
							Cancel
						</button>
					</div>
				</fieldset>
			</form>
		</div>
	);
};

export default EditJob;
