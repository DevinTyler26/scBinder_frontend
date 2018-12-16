import http from "./httpService";

const apiEndpoint = "/users";


export function register(user) {
  return http.post(apiEndpoint, {
    username: user.username.toLowerCase(),
    password: user.password,
    name: user.name
  })
}