import React, {useState, useEffect, useContext, useCallback} from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { JobContext } from "../contexts/JobContext";
import EditJob from "./EditJob";

const Job: React.FC = () => {
	const id: string = window.location.pathname.replace("/jobs/", "");
	const [job, setJob] = useState<any>({});
	const [edit, setEdit] = useState(false);
	const [modal, setModal] = useState(false);
	const [success, setSuccess] = useState(false);
	const { fetchData: fetchGlobalData } = useContext(JobContext);

	const fetchData = useCallback((): void => {
		axios.get(`/api/jobs/job/${id}`).then((res: any) => {
			setJob(res.data.data);
		});
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	let dt1: Date | null = null;
	let dt2: Date | null = null;
	if (job.date_posted !== undefined && job.date_posted !== null) {
		dt1 = new Date(job.date_posted.$date);
	}
	if (job.date_applied !== undefined) {
		dt2 = new Date(job.date_applied.$date);
	}
	const datePosted = dt1 ? dt1.toLocaleString("en-us") : "";
	const dateApplied = dt2 ? dt2.toLocaleString("en-us") : "";
	const datePostedArr = datePosted ? datePosted.split(",") : null;
	const dateAppliedArr = dateApplied.split(",");

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
				id={id}
			/>
		);
	}

	return (
		<div className="single-job">
			{modal && (
				<div className="modal">
					<h3>Confirm deletion</h3>
					<p>Are you sure you want to delete this job?</p>
					<button
						onClick={(e) => {
							e.preventDefault();
							axios.delete(`/api/jobs/${id}`).then((res: any) => {
								console.log(res);
								fetchGlobalData();
								setSuccess(true);
							});
						}}
					>
						Yes
					</button>{" "}
					<button
						className="btn-cancel"
						onClick={(e) => {
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
				<span>Date Posted:</span> {dt1 && datePostedArr![0]}
			</p>
			<p>
				<span>Date Applied:</span> {dt2 && dateAppliedArr[0]}
			</p>
			<p>
				<span>Job Posting:</span>{" "}
				{!job.direct_posting ? (
					<a href={job.posting_url} target="_blank" rel="noreferrer">
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
				className="btn-cancel"
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
