// src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Ticket from './components/Ticket';
import './styles/App.css';

function App() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [grouping, setGrouping] = useState(localStorage.getItem('grouping') || 'status');
    const [sorting, setSorting] = useState(localStorage.getItem('sorting') || 'priority');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        localStorage.setItem('grouping', grouping);
        localStorage.setItem('sorting', sorting);
    }, [grouping, sorting]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
            const data = await response.json();
            setTickets(data.tickets);
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getGroupedTickets = () => {
        let grouped = {};

        // Group tickets
        tickets.forEach(ticket => {
            let groupKey;
            switch (grouping) {
                case 'status':
                    groupKey = ticket.status;
                    break;
                case 'user':
                    const user = users.find(u => u.id === ticket.userId);
                    groupKey = user ? user.name : 'Unassigned';
                    break;
                case 'priority':
                    const priorities = {
                        4: 'Urgent',
                        3: 'High',
                        2: 'Medium',
                        1: 'Low',
                        0: 'No Priority'
                    };
                    groupKey = priorities[ticket.priority];
                    break;
                default:
                    groupKey = 'Other';
            }

            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(ticket);
        });

        // Sort tickets within each group
        Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) => {
                if (sorting === 'priority') {
                    return b.priority - a.priority;
                }
                return a.title.localeCompare(b.title);
            });
        });

        return grouped;
    };

    return (
        <div className="app">
            <Header 
                grouping={grouping}
                sorting={sorting}
                onGroupingChange={setGrouping}
                onSortingChange={setSorting}
            />
            <div className="board">
                {Object.entries(getGroupedTickets()).map(([group, groupTickets]) => (
                    <div key={group} className="column">
                        <div className="column-header">
                            <h3>{group}</h3>
                            <span className="ticket-count">{groupTickets.length}</span>
                        </div>
                        <div className="tickets">
                            {groupTickets.map(ticket => (
                                <Ticket
                                    key={ticket.id}
                                    ticket={ticket}
                                    user={users.find(u => u.id === ticket.userId) || {}}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;