import React, { Component } from 'react';

/**
 * Global error boundary for CricIQ.
 * Catches unhandled React render errors and displays a dark-themed fallback
 * instead of crashing the entire app to a white screen.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Only allowed console statement in the codebase
    console.error('[CricIQ] Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0B0F1A',
            color: '#E8EDF5',
            fontFamily: "'Inter', 'Space Grotesk', system-ui, sans-serif",
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              background: '#111827',
              border: '1px solid #1E2D4A',
              borderRadius: '12px',
              padding: '2.5rem',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏏</div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: '#00D4FF',
              }}
            >
              CricIQ Hit a Boundary… the Wrong Kind
            </h1>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6B7A99',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
              }}
            >
              Something went wrong while rendering this page. The error has been
              logged. Try reloading or head back to the dashboard.
            </p>

            {this.state.error && (
              <pre
                style={{
                  background: '#0B0F1A',
                  border: '1px solid #1E2D4A',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontSize: '0.75rem',
                  color: '#EF4444',
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: '120px',
                  marginBottom: '1.5rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.toString()}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: '#00D4FF',
                  color: '#0B0F1A',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={(e) => (e.target.style.opacity = '0.85')}
                onMouseOut={(e) => (e.target.style.opacity = '1')}
              >
                ↻ Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: 'transparent',
                  color: '#6B7A99',
                  border: '1px solid #1E2D4A',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseOver={(e) => (e.target.style.borderColor = '#00D4FF')}
                onMouseOut={(e) => (e.target.style.borderColor = '#1E2D4A')}
              >
                ← Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
