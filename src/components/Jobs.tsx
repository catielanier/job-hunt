import React from "react";
import { Link } from "react-router-dom";

interface IJobProps {
	job: any;
}

const Jobs = (props: IJobProps) => {
	let dt1: Date | null = null;
	let dt2: Date | null = null;
	if (props.job.date_posted !== undefined && props.job.date_posted !== null) {
		dt1 = new Date(props.job.date_posted.$date);
	}
	if (props.job.date_applied !== undefined) {
		dt2 = new Date(props.job.date_applied.$date);
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
	const { status } = props.job;
	return (
		<div className={`job-grid-row ${status.toLowerCase().replace(" ", "-")}`}>
			<div>{props.job.title}</div>
			<div>{props.job.company}</div>
			<div>{dt1 ? datePostedArr[0] : null}</div>
			<div>{dt2 ? dateAppliedArr[0] : null}</div>
			<div>{status}</div>
			<div>
				<Link to={`/jobs/${props.job._id.$oid}`}>{">>"}</Link>
			</div>
		</div>
	);
};

export default Jobs;
