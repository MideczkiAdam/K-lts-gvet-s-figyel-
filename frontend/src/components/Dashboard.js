import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Dashboard.css';

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
        <div className='main'>
            <div className='name'>
              <h1>Szia, {user?.username}</h1>
              <button onClick={Logout} className='kijelentkezes'>Kijelentkezés</button>
            </div>
            <div className='adatok'>
              <div className='kiadasok_havi adat'>
                <h3>Kiadások a hónapban</h3>
                <p><span>123000</span> Ft</p>
              </div>
              <div className='bevetelek_havi adat'>
                <h3>Bevételek a hónapban</h3>
                <p><span>210000</span> Ft</p>
              </div>
              <div className='egyenleg adat'>
                <h3>egyenleg</h3>
                <p><span>87000</span> Ft</p>
              </div>
              <div className='kiadasok_heti adat'>
                <h3>Kiadások a héten</h3>
                <p><span>21000</span> Ft</p>
              </div>
            </div>
            <div className='diagramok'>
              <div className='oszlop'>
                <h2>Havi kiadások</h2>
                <div className='diagram1'></div>
              </div>
              <div className='kor'>
                <h2>Kiadások kategóriák szerint</h2>
                <div className='diagram2'></div>
              </div>
            </div>
            <div className='kiadaskezelo'>
              <div className='kiadasok'>
                <h2>Legutóbbi tranzakciók</h2>
                <table></table>
              </div>
              <div className='gombok'>
                <button className='uj_bevetel'>Új bevétel hozzáadása</button>
                <button className='uj_kiadas'>Új kiadás hozzáadása</button>
              </div>
            </div> 
        </div>
        
    )
}

export default Dashboard;