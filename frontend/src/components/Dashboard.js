import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const Logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/")
    }

    useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8000/api/user/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Hiba a felhasználó lekérdezésénél', error);
      }
    };

    fetchUser();
  }, []);

    return (
        <div>
            <h1>Szia {user?.username}</h1>
            <button onClick={Logout}>Kijelentkezés</button>
        </div>
        
    )
}

export default Dashboard;