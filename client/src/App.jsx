import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./util/helpers/http.js";
import RootLayout from "./pages/Root.jsx";
import Protected from "./pages/Protected.jsx";
import HomePage from "./pages/HomePage.jsx";
import WeeklyRecapPage from "./pages/WeeklyRecapPage.jsx";
import StandingsPage from "./pages/StandingsPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/weeklyrecap",
        element: <WeeklyRecapPage />
      },
      {
        path: "/standings",
        element: <StandingsPage />
      },
    ],
  },
]);

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
