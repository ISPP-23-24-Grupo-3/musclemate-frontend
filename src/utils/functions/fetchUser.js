import { getFromApi } from "./api";

export async function fetchClient(username) {
  const response = await getFromApi("clients/");
  const clients = await response.json();
  return clients.find((client) => client.user === username);
}
export async function fetchOwner(username) {
  const response = await getFromApi("clients/");
  const owners = await response.json();
  return owners.find((owner) => owner.userCustom === username);
}
