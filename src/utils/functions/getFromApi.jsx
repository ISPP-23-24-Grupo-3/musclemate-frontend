/* eslint-disable no-undef */


export function getFromApi(url) {
  return fetch(`api/${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('authTokens')).access}`,
    },
  }).then((response) => response.json()).then((data) => console.log(data));
}