import http from "./httpService";

export function getLocations() {
  return http.get("/locations");
}
