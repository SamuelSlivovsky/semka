export default function GetUserData(token) {
  if (!token) {
    return null;
  }
  token = token.split(".")[1];
  token.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(token));
}
