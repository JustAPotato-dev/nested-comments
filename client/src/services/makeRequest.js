import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export function makeRequest(url, options) {
  return api(url, options)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err?.response?.data?.message ?? "Something went wrong."))
}
