import React, { useState, createContext } from "react";
import axios from "axios";
import { setToken, removeToken } from "../services/tokenService";

interface IUser {
	user: string | null;
	success: boolean;
	loading: boolean;
	error: string;
	doSignup: (
		email: string,
		password: string,
		verifyPassword: string,
		name: string
	) => void;
	doLogin: (email: string, password: string) => void;
	doLogout: () => void;
}

export const UserContext = createContext<IUser>({
	user: null,
	success: false,
	loading: false,
	error: "",
	doSignup: (
		email: string,
		password: string,
		verifyPassword: string,
		name: string
	) => {
		return null;
	},
	doLogin: (email: string, password: string) => {
		return null;
	},
	doLogout: () => {
		return null;
	},
});

const UserContextProvider: React.FC = (props) => {
	const [user, setUser] = useState(localStorage.getItem("id") || null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const doSignup = (
		email: string,
		password: string,
		verifyPassword: string,
		name: string
	): void => {
		setLoading(true);
		setError("");
		//check for matching password
		if (password === verifyPassword) {
			axios({
				method: "POST",
				url: "/api/users/signup",
				data: {
					email,
					password,
					name,
				},
			})
				.then((res: {}) => {
					console.log(res);
					setLoading(false);
					setSuccess(true);
				})
				.catch((err: {}) => {
					setLoading(false);
					setError("User already exists");
				});
		} else {
			setLoading(false);
			setError("Passwords do not match.");
		}
	};

	const doLogin = (email: string, password: string): void => {
		setLoading(true);
		setError("");
		axios({
			method: "POST",
			url: "/api/users/login",
			data: {
				email,
				password,
			},
		})
			.then((res: any) => {
				const { token } = res.data;
				const id = res.data.data._id.$oid;
				setToken(token);
				localStorage.setItem("id", id);
				setUser(id);
				setLoading(false);
				setSuccess(true);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setError("Invalid username or password.");
			});
	};

	const doLogout = (): void => {
		removeToken();
		localStorage.removeItem("id");
		setUser(null);
	};

	return (
		<UserContext.Provider
			value={{ user, doSignup, doLogin, error, loading, success, doLogout }}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
