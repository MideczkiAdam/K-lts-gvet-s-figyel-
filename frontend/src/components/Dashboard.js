import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
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
    const [monthlyExpense, setMonthlyExpense] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [monthlyExpenseData, setMonthlyExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [chartData, setChartData] = useState([]);
    const COLORS = ['#3B82F6', '#F97316', '#10B981', '#EF4444', '#6366F1'];
    const [weeklyExpense, setWeeklyExpense] = useState(0);

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
        setMonthlyExpense(response.data.monthly_expense)
      } catch (error) {
        console.error("Hiba az egyenleg lekérdezésénél:", error);
      }
    }

    const fetchTransactions = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8000/api/transactions/list/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTransactions(response.data)
      } catch (error) {
        console.error("Hiba a tranzakciók lekérésekor:", error);
      }
    }

    const fetchMonthlyExpenses = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8000/api/expenses/monthly/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMonthlyExpenseData(response.data)
      } catch (error) {
        console.error("Hiba a havi kiadások lekérdezésekor:", error);
      }

    }

    const fetchCategories = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8000/api/categories/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].id);
        }
      } catch (error) {
        console.error("Hiba a kategóriák lekérdezésekor:", error);
      }
    }

    const fetchChartData = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get("http://localhost:8000/api/stats/spending-by-category/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setChartData(response.data);
      } catch (error) {
        console.error("Hiba a grafikon adatainak lekérésekor:", error);
      }
    }

    const fetchWeeklyExpense = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8000/api/expenses/weekly/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWeeklyExpense(response.data.weekly_expense);
      } catch (error) {
        console.error("Hiba a heti kiadások lekérdezésekor:", error);
      }
    };

    useEffect(() => {
      fetchUser();
      fetchBalance();
      fetchTransactions();
      fetchMonthlyExpenses();
      fetchCategories();
      fetchChartData();
      fetchWeeklyExpense();
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
        fetchTransactions();
      } catch (error) {
        console.error("Hiba bevétel hozzáadásakor:", error)
      }
    }

    const handleAddExpense = async () => {
      const token = localStorage.getItem('access')
      try {
        await axios.post('http://localhost:8000/api/transactions/', {
          amount: expenseAmount,
          type: 'expense',
          category_id: selectedCategory
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShowExpenseModal(false);
        setExpenseAmount('');
        fetchUser();
        fetchBalance();
        fetchTransactions();
      } catch (error) {
        console.error("Hiba kiadás hozzáadásakor:", error)
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
                <p><span>{monthlyExpense}</span> Ft</p>
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
                <p><span>{weeklyExpense}</span> Ft</p>
              </div>
            </div>
            <div className='diagramok'>
              <div className='oszlop'>
                <h2>Havi kiadások</h2>
                <div className='diagram1' style={{ width: '100%', height: '90%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyExpenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="honap" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="kiadas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className='kor'>
                <h2>Kiadások kategóriák szerint</h2>
                <div className='diagram2' style={{ width: '100%', height: '90%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="total"
                          nameKey="category__name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className='kiadaskezelo'>
              <div className='kiadasok'>
                <h2>Legutóbbi tranzakciók</h2>
                <table className='table'>
                        <thead>
                            <tr>
                                <th>Összeg</th>
                                <th>Tipus</th>
                                <th>Dátum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className='tr_amount'>{transaction.amount} Ft</td>
                                    <td className='tr_type'>{transaction.type === 'income' ? 'Bevétel' : 'Kiadás'}</td>
                                    <td className='tr_date'>{new Date(transaction.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
              </div>
              <div className='gombok'>
                <button className='uj_bevetel' onClick={() => setShowIncomeModal(true)}>Új bevétel hozzáadása</button>
                <button className='uj_kiadas' onClick={() => setShowExpenseModal(true)}>Új kiadás hozzáadása</button>
              </div>
            </div> 

            {showIncomeModal && (
              <div
                className="modal-overlay" 
                style={{ top: 0, height: '100vh', width: '100vw', position: 'fixed'}}
                onClick={() => setShowIncomeModal(false)}
              >
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
              <div
                className="modal-overlay"
                style={{ top: 0, height: '100vh', width: '100vw', position: 'fixed' }}
                onClick={() => setShowExpenseModal(false)}
              >
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-content">
                    <h3>Új kiadás hozzáadása</h3>
                    <input
                      type="number"
                      placeholder="Add meg az összeget"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                    <select
                      className='category'
                      value={selectedCategory || ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ marginTop: '10px' }}
                    >
                      {categories.map((cat) => (
                        <option 
                          style={{ borderRadius: 'none'}}
                          key={cat.id} value={cat.id}
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className='buttons'>
                      {<button onClick={handleAddExpense} className='plus'>Hozzáadás</button>}
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