import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

interface IJobContext {
	loading: boolean;
	success: boolean;
	error: string;
	addJob: (
		title: string,
		company: string,
		datePosted: Date | null,
		dateApplied: Date | null,
		direct: boolean,
		postingUrl: string,
		contactName: string,
		contactEmail: string
	) => void;
	jobs: Array<any>;
}

export const JobContext = createContext<IJobContext>({
	loading: false,
	success: false,
	error: "",
	addJob: (
		title: string,
		company: string,
		datePosted: Date | null,
		dateApplied: Date | null,
		direct: boolean,
		postingUrl: string,
		contactName: string,
		contactEmail: string
	) => {
		return null;
	},
	jobs: [],
});

const JobContextProvider: React.FC = (props) => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [jobs, setJobs] = useState([]);
	const { user } = useContext(UserContext);

	useEffect((): void => {
		const fetchData = (): void => {
			axios.get(`/api/jobs/${user}`).then((res: any) => {
				setJobs(res.data.data);
			});
		};
		if (user) {
			fetchData();
		}
	}, [user]);

	const addJob = (
		title: string,
		company: string,
		datePosted: Date | null,
		dateApplied: Date | null,
		direct: boolean,
		postingUrl: string,
		contactName: string,
		contactEmail: string
	): void => {
		setLoading(true);
		setError("");
		setSuccess(false);
		axios({
			method: "POST",
			url: "/api/jobs",
			data: {
				title,
				company,
				date_posted: datePosted,
				date_applied: dateApplied,
				direct_posting: direct,
				posting_url: postingUrl,
				contact_name: contactName,
				contact_email: contactEmail,
				user,
			},
		})
			.then((res: any) => {
				console.log(res);
				setLoading(false);
				setSuccess(true);
			})
			.catch((err: any) => {
				console.log(err);
				setLoading(false);
				setError("Unable to add job.");
			});
	};

	return (
		<JobContext.Provider value={{ loading, success, error, addJob, jobs }}>
			{props.children}
		</JobContext.Provider>
	);
};

export default JobContextProvider;
