import '../styles/ErrorMessage.css'

export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{message}</span>
      <button 
        className="error-close"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  )
}
