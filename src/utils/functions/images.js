export function parseImageURL(url) {
  console.log(url);
  let res;
  if (url[0] == "/") {
    res = `${import.meta.env.VITE_BACKEND_URL}${url}`;
  } else res = url;
  return res;
}
