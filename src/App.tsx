import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import UserContextProvider from "./contexts/UserContext";
import Signup from "./components/Signup";
import logo from "./assets/logo.png";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import CreateJob from "./components/CreateJob";
import JobContextProvider from "./contexts/JobContext";
import Job from "./components/Job";

function App(): JSX.Element {
	return (
		<div className="App">
			<div className="logo">
				<img src={logo} alt="Job Hunt Logo" />
			</div>
			<UserContextProvider>
				<JobContextProvider>
					<Router>
						<Navbar />
						<div className="container">
							<Route exact path="/" component={Home} />
							<Route path="/signup" component={Signup} />
							<Route path="/login" component={Login} />
							<Route path="/create-job" component={CreateJob} />
							<Route path="/jobs/:id" component={Job} />
						</div>
					</Router>
				</JobContextProvider>
			</UserContextProvider>
		</div>
	);
}

export default App;
