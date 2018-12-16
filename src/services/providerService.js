import http from "./httpService";

const apiEndpoint = "/providers";

function providerUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getProviders() {
  return http.get(apiEndpoint);
}

export function getProvider(providerId) {
  return http.get(providerUrl(providerId));
}

export function saveProvider(provider) {
  if (provider._id) {
    const body = { ...provider };
    delete body._id;
    return http.put(providerUrl(provider._id), body);
  }

  return http.post(apiEndpoint, provider);
}

export function deleteProvider(providerId) {
  return http.delete(providerUrl(providerId));
}
