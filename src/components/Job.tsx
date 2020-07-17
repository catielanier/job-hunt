import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { JobContext } from "../contexts/JobContext";
import EditJob from "./EditJob";

const Job: React.FC = () => {
	const id: string = window.location.pathname.replace("/jobs/", "");
	const [job, setJob] = useState<any>({});
	const [edit, setEdit] = useState(false);
	const [modal, setModal] = useState(false);
	const { success, fetchData: fetchGlobalData } = useContext(JobContext);

	const fetchData = () => {
		axios.get(`/api/jobs/job/${id}`).then((res: any) => {
			setJob(res.data.data);
		});
	};

	useEffect(() => {
		fetchData();
	}, [id]);

	let dt1: Date | null = null;
	let dt2: Date | null = null;
	if (job.date_posted !== undefined) {
		dt1 = new Date(job.date_posted.$date);
	}
	if (job.date_applied !== undefined) {
		dt2 = new Date(job.date_applied.$date);
	}
	let datePosted: string = "";
	let dateApplied: string = "";
	if (dt1) {
		datePosted = dt1.toLocaleString("en-us");
	}
	if (dt2) {
		dateApplied = dt2.toLocaleString("en-us");
	}
	const datePostedArr: Array<string> | null = datePosted.split(",") || null;
	const dateAppliedArr: Array<string> = dateApplied.split(",");

	if (success) {
		return <Redirect to="/" />;
	}

	if (edit) {
		return (
			<EditJob
				title={job.title}
				company={job.company}
				datePosted={dt1 || null}
				dateApplied={dt2 || null}
				contactName={job.contact_name}
				contactEmail={job.contact_email}
				postingUrl={job.posting_url}
				directPosting={job.direct_posting}
				status={job.status}
				feedback={job.feedback || ""}
				setEdit={setEdit}
				fetchData={fetchData}
			/>
		);
	}

	return (
		<div className="single-job">
			{modal && (
				<div className="modal">
					<h3>Confirm deletion</h3>
					<p>Are you sure you want to delete this job?</p>
					<button>Yes</button>{" "}
					<button
						onSubmit={(e) => {
							e.preventDefault();
							setModal(false);
						}}
					>
						No
					</button>
				</div>
			)}
			<h2>
				{job.title} @ {job.company}
			</h2>
			<p>
				<span>Date Posted:</span> {dt1 && datePostedArr[0]}
			</p>
			<p>
				<span>Date Applied:</span> {dateAppliedArr[0]}
			</p>
			<p>
				<span>Job Posting:</span>{" "}
				{!job.direct_posting ? (
					<a href={job.posting_url} target="_blank">
						Go to Posting
					</a>
				) : (
					"Direct Referral"
				)}
			</p>
			<p>
				<span>Contact:</span>{" "}
				{job.contact_email !== "" ? (
					<a href={`mailto:${job.contact_email}`}>{job.contact_name}</a>
				) : job.contact_name !== "" ? (
					job.contact_name
				) : null}
			</p>
			<p>
				<span>Status:</span> {job.status}
			</p>
			<p>
				<span>Feedback:</span> {job.feedback && job.feedback}
			</p>
			<button
				onClick={(e) => {
					e.preventDefault();
					setEdit(true);
				}}
			>
				Edit Job
			</button>{" "}
			<button
				onClick={(e) => {
					e.preventDefault();
					setModal(true);
				}}
			>
				Delete Job
			</button>
		</div>
	);
};

export default Job;
