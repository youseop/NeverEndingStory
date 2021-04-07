import React from 'react';
import './ComplaintCard.css';

function ComplaintCard({complaint}) {
  return (
    <div className="complaintCard_container">
      <div className="complaintCard_title">{complaint.title}</div>
      <div className="complaintCard_description">{complaint.description}</div>
    </div>
  )
}

export default ComplaintCard
