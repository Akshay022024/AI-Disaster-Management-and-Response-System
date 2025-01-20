import { useState } from "react";
import './Login.css'; // Assuming you'll create a CSS file for styling

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");  // For Sign Up form
    const [isSignUp, setIsSignUp] = useState(false);  // To toggle between Login and Sign Up

    // Handle Login Form Submission
    const handleLoginSubmit = (event) => {
        event.preventDefault();
        if (email === "" || password === "") {
            alert("Both fields are required!");
        } else {
            alert("Login Successful!");
        }
    };

    // Handle Sign Up Form Submission
    const handleSignUpSubmit = (event) => {
        event.preventDefault();
        if (name === "" || email === "" || password === "") {
            alert("All fields are required!");
        } else {
            alert("Sign Up Successful!");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isSignUp ? "Sign Up" : "Login"}</h2>

                {/* Toggle Button */}
                <button 
                    className="toggle-btn" 
                    onClick={() => setIsSignUp(!isSignUp)}
                >
                    {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </button>

                {/* Conditional Rendering of Login or Sign Up */}
                {isSignUp ? (
                    <form onSubmit={handleSignUpSubmit}>
                        <div className="textbox">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="textbox">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="textbox">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <input type="submit" value="Sign Up" className="btn" />
                    </form>
                ) : (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="textbox">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="textbox">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <input type="submit" value="Login" className="btn" />
                    </form>
                )}

                {/* Google Login Option */}
                <div className="google-login">
                    <button className="google-btn">Login with Google</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
