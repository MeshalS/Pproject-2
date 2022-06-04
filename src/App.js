import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { checkResponse, fetcher } from "./utils/fetcher";
import { isAuthenticated } from "./utils/authenticated";
import Alert from "./utils/alert";
import paths from "./constants/paths";

import Header from "./components/Header";

import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  useEffect(() => {
    if (isAuthenticated()) {
      fetcher("test/me", true)
        .then((res) => {
          if (checkResponse(res.data) === false) {
            localStorage.removeItem("token");
          }
        })
        .catch(Alert.error);
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path={paths.posts} element={<Posts />} />
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.register} element={<Register />} />
        <Route
          path="*"
          element={<Navigate to={paths.posts} replace={true} />}
        />
      </Routes>
    </>
  );
}

export default App;
