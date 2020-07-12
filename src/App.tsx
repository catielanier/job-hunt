import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import UserContextProvider from "./contexts/UserContext";
import Signup from "./components/Signup";
import logo from "./assets/logo.png";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";

function App() {
	return (
		<div className="App">
			<div className="logo">
				<img src={logo} alt="Job Hunt Logo" />
			</div>
			<UserContextProvider>
				<Router>
					<Navbar />
					<div className="container">
						<Route exact path="/" component={Home} />
						<Route path="/signup" component={Signup} />
						<Route path="/login" component={Login} />
					</div>
				</Router>
			</UserContextProvider>
		</div>
	);
}

export default App;
