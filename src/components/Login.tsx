import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Redirect } from "react-router-dom";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { doLogin, success, loading, error } = useContext(UserContext);

	if (success) {
		return <Redirect to="/" />;
	}

	return (
		<div className="login">
			<h2>Login</h2>
			{error && <p>{error}</p>}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					doLogin(email, password);
				}}
			>
				<fieldset disabled={loading}>
					<div className="form-grid-container">
						<div>
							<label htmlFor="email">Email Address:</label>
							<input
								type="text"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
								}}
								name="email"
								placeholder="Email Address"
							/>
						</div>
						<div>
							<label htmlFor="password">Password:</label>
							<input
								type="password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								name="password"
								placeholder="Password"
							/>
						</div>
						<div>
							<button type="submit">Login</button>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	);
};

export default Login;
