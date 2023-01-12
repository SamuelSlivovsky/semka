export default function GetUserData(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  console.log(JSON.parse(window.atob(base64)));
  return JSON.parse(window.atob(base64));
}
