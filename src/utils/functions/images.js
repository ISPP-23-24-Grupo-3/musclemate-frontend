export function parseImageURL(url) {
  let res;
  if (url[0] == "/") {
    res = `${import.meta.env.VITE_BACKEND_URL}${url}`;
  } else res = url;
  return res;
}
