import React from 'react';
import { logger } from '@/utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    logger.error('ErrorBoundary Caught Exception', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div style={{
          padding: '2rem',
          margin: '2rem',
          backgroundColor: '#fff3f3',
          border: '1px solid #ffcdd2',
          borderRadius: '8px',
          color: '#d32f2f',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h2 style={{ marginTop: 0 }}>Something went wrong.</h2>
          <p>We're sorry, an unexpected error occurred while rendering this component.</p>
          {import.meta.env.MODE === 'development' && (
            <pre style={{ 
              background: '#ffebee', 
              padding: '1rem', 
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: '0.9em'
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
