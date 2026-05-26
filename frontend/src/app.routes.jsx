import { createBrowserRouter, Outlet } from "react-router"; // Added Outlet here
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import { InterviewProvider } from "./features/interview/interview.context"; 

const InterviewLayout = () => (
    <InterviewProvider>
        <Outlet />
    </InterviewProvider>
);

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        element: <Protected><InterviewLayout /></Protected>, // Wrapped properly
        children: [
            { 
                path: "/", 
                element: <Home /> 
            },
            { 
                path: "/interview/:interviewId", 
                element: <Interview /> 
            }
        ]
    }
]);