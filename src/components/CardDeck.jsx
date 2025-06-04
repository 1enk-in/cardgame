import React from 'react';
import './GameApp.css';

export default function CardDeck({ title, text, revealed, onClick, disabled }) {
  return (
    <div 
      className="card-deck" 
      onClick={!disabled ? onClick : null} 
      style={{ pointerEvents: disabled ? 'none' : 'auto' }} // disables click if disabled
      aria-disabled={disabled}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
    >
      <div className={`card-inner ${revealed ? 'revealed' : ''}`}>
        <div className="card-front">{title}</div>
        <div className="card-back">
  <div className="card-text">{text}</div>
</div>

      </div>
    </div>
  );
}
