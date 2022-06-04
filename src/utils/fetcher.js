import axios from "axios";
import Alert from "./alert";

const API_URL = "https://strangers-things.herokuapp.com/api";
const API_CLASS = "2006-CPU-RM-WEB-PT";

export async function fetcher(
  path,
  auth = false,
  body = undefined,
  method = undefined
) {
  try {
    return await axios(`${API_URL}/${API_CLASS}/${path}`, {
      method: method ? method : body ? "POST" : "GET",
      headers: auth
        ? {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        : undefined,
      data: body,
    });
  } catch (error) {
    return error.response;
  }
}

export function checkResponse(res, property) {
  if (res.success) {
    if (res.data) {
      return property ? res.data[property] : res.data;
    } else {
      return true;
    }
  } else if (res.error) {
    Alert.error(res.error.type || res.error.name, res.error.message);
  } else {
    Alert.error();
  }
  return false;
}
