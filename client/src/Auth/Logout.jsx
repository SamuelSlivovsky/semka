import { useEffect } from 'react';
import { useNavigate } from 'react-router';
export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    if (token != null) {
      const headers = { authorization: 'Bearer ' + token };
      fetch('/api/auth/logout', { headers });
      localStorage.removeItem('hospit-user');
    }
    navigate('/login');
    window.location.reload(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
