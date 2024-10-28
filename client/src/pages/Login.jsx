import React, { useState } from 'react';
import LoginForm from "../components/template/LoginForm";
import SignupForm from "../components/template/SignupForm";

const App = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleLogin = () => setIsLogin((prev) => !prev);

    return (
        <div className="bg-sky-400 h-screen flex items-center justify-center">
            {isLogin ? <LoginForm toggleLogin={toggleLogin} /> : <SignupForm toggleLogin={toggleLogin} />}
        </div>
    );
};

export default App;
