import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [incomeAmount, setIncomeAmount] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [balance, setBalance] = useState(0)
    const [monthlyIncome, setMonthlyIncome] = useState(0)

    const Logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/")
    }

    const fetchUser = async () => {
        const token = localStorage.getItem('access');
        // document.body.style.overflow = 'hidden';
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
    }

    useEffect(() => {
      fetchUser();
      fetchBalance();
    }, []);

    const handleAddIncome = async () => {
      const token = localStorage.getItem('access')
      try {
        await axios.post('http://localhost:8000/api/transactions/', {
          amount: incomeAmount,
          type: 'income'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShowIncomeModal(false);
        setIncomeAmount('');
        fetchUser();
        fetchBalance();
      } catch (error) {
        console.error("Hiba bevétel hozzáadásakor:", error)
      }
    }

    const fetchBalance = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8000/api/balance/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBalance(response.data.balance);
        setMonthlyIncome(response.data.monthly_income);
      } catch (error) {
        console.error("Hiba az egyenleg lekérdezésénél:", error);
      }
    }

    
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
                <p><span>{monthlyIncome}</span> Ft</p>
              </div>
              <div className='egyenleg adat'>
                <h3>egyenleg</h3>
                <p><span>{balance}</span> Ft</p>
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
                <button className='uj_bevetel' onClick={() => setShowIncomeModal(true)}>Új bevétel hozzáadása</button>
                <button className='uj_kiadas' onClick={() => setShowExpenseModal(true)}>Új kiadás hozzáadása</button>
              </div>
            </div> 

            {showIncomeModal && (
              <div className="modal-overlay" onClick={() => setShowIncomeModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-content">
                    <h3>Új bevétel hozzáadása</h3>
                    <input
                      type="number"
                      placeholder="Add meg az összeget"
                      value={incomeAmount}
                      onChange={(e) => setIncomeAmount(e.target.value)}
                    />
                    <div className='buttons'>
                      <button onClick={handleAddIncome} className='plus'>Hozzáadás</button>
                      <button onClick={() => setShowIncomeModal(false)} className='minus'>Mégsem</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showExpenseModal && (
              <div className="modal-overlay" onClick={() => setShowExpenseModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-content">
                    <h3>Új kiadás hozzáadása</h3>
                    <input
                      type="number"
                      placeholder="Add meg az összeget"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                    <div className='buttons'>
                      {<button/* ide baszd be a handleAddExpense függvényt, meg írd is meg  */className='plus'>Hozzáadás</button>}
                      <button onClick={() => setShowExpenseModal(false)} className='minus'>Mégsem</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>            
    )   
}

export default Dashboard;