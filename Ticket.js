// src/components/Ticket.js
import React from 'react';
import '../styles/Ticket.css';

const Ticket = ({ ticket, user }) => {
    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 4:
                return '⚡'; // Urgent
            case 3:
                return '🔴'; // High
            case 2:
                return '🟡'; // Medium
            case 1:
                return '🟢'; // Low
            default:
                return '⚪'; // No priority
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 4:
                return 'Urgent';
            case 3:
                return 'High';
            case 2:
                return 'Medium';
            case 1:
                return 'Low';
            default:
                return 'No Priority';
        }
    };

    return (
        <div className="ticket">
            <div className="ticket-header">
                <span className="ticket-id">{ticket.id}</span>
                <div className="user-avatar" title={user.name}>
                    {user.name ? user.name[0].toUpperCase() : '?'}
                    <span className={`status-dot ${user.available ? 'available' : 'busy'}`}></span>
                </div>
            </div>
            <div className="ticket-title">{ticket.title}</div>
            <div className="ticket-tags">
                <div className="tag priority" title={getPriorityText(ticket.priority)}>
                    {getPriorityIcon(ticket.priority)}
                </div>
                {ticket.tag && (
                    <div className="tag feature">
                        <span>●</span> {ticket.tag}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ticket;