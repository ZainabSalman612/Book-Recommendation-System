import '../styles/LoadingSpinner.css'

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Searching for books...</p>
    </div>
  )
}
