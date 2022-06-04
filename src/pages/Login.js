import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import { checkResponse, fetcher } from "../utils/fetcher";
import Alert from "../utils/alert";
import { isAuthenticated } from "../utils/authenticated";
import paths from "../constants/paths";
import messages from "../constants/messages";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(paths.posts);
    }
  }, [navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    if (!username) return Alert.error("Username", messages.required);
    if (!password) return Alert.error("Password", messages.required);
    Alert.loading("Logging in");
    fetcher("users/login", false, {
      user: {
        username,
        password,
      },
    })
      .then((res) => {
        const data = checkResponse(res.data);
        if (data) {
          localStorage.setItem("token", data.token);
          Alert.success("Logged in Successfully", data.message, () => {
            navigate(paths.posts);
          });
        }
      })
      .catch(Alert.error);
  }

  return (
    <div className="mx-5 sm:mx-auto sm:w-[600px] md:mx-auto md:w-[625px] lg:w-[900px]">
      <div className="box flex flex-col gap-4 p-5">
        <div className="mb-3 select-none text-center text-xl font-bold md:text-2xl">
          LOGIN
        </div>
        <div>
          <Label className="mb-2 block text-lg" htmlFor="username">
            Username
          </Label>
          <TextInput
            id="username"
            type="text"
            onInput={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2 block text-lg" htmlFor="password">
            Password
          </Label>
          <TextInput
            id="password"
            type="password"
            onInput={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button onClick={submit}>LOGIN</Button>
        <div className="mt-4">
          <Link to={paths.register}>
            <Button>Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
