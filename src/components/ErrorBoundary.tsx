import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service if available
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In a real app, you would send this to your error tracking service
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Example: Send to error tracking service
      // errorTrackingService.log(errorData);
      
      console.log('Error logged:', errorData);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: '',
      });
    } else {
      // If max retries reached, reload the page
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    };

    // Copy error report to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert('त्रुटि रिपोर्ट कॉपी की गई। कृपया सहायता टीम को भेजें।');
      })
      .catch(() => {
        alert('त्रुटि रिपोर्ट कॉपी नहीं हो सकी।');
      });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl text-destructive">
                कुछ गलत हुआ है
              </CardTitle>
              <p className="text-muted-foreground">
                एप्लिकेशन में एक अप्रत्याशित त्रुटि हुई है
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error message */}
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>त्रुटि:</strong> {this.state.error?.message || 'अज्ञात त्रुटि'}
                </AlertDescription>
              </Alert>

              {/* Error ID */}
              <div className="text-sm text-muted-foreground">
                <strong>त्रुटि ID:</strong> {this.state.errorId}
              </div>

              {/* Recovery options */}
              <div className="space-y-4">
                <h3 className="font-semibold">समाधान के विकल्प:</h3>
                
                <div className="grid gap-3">
                  {/* Retry button */}
                  <EnhancedButton
                    variant="hero"
                    onClick={this.handleRetry}
                    disabled={this.retryCount >= this.maxRetries}
                    trackingAction="error_boundary_retry"
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {this.retryCount >= this.maxRetries 
                      ? 'अधिकतम प्रयास पूरे हो गए' 
                      : `दोबारा कोशिश करें (${this.retryCount}/${this.maxRetries})`
                    }
                  </EnhancedButton>

                  {/* Go to home */}
                  <EnhancedButton
                    variant="outline"
                    onClick={this.handleGoHome}
                    trackingAction="error_boundary_go_home"
                    className="w-full"
                  >
                    <Home className="h-4 w-4" />
                    मुख्य पृष्ठ पर जाएं
                  </EnhancedButton>

                  {/* Report error */}
                  <EnhancedButton
                    variant="ghost"
                    onClick={this.handleReportError}
                    trackingAction="error_boundary_report"
                    className="w-full"
                  >
                    <Bug className="h-4 w-4" />
                    त्रुटि रिपोर्ट करें
                  </EnhancedButton>
                </div>
              </div>

              {/* Reload page option */}
              {this.retryCount >= this.maxRetries && (
                <div className="pt-4 border-t">
                  <EnhancedButton
                    variant="destructive"
                    onClick={() => window.location.reload()}
                    trackingAction="error_boundary_reload"
                    className="w-full"
                    confirmAction
                    confirmMessage="क्या आप पेज को रीलोड करना चाहते हैं? अनसेव्ड डेटा खो सकता है।"
                  >
                    <RefreshCw className="h-4 w-4" />
                    पेज रीलोड करें
                  </EnhancedButton>
                </div>
              )}

              {/* Help text */}
              <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">सहायता:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• पेज को रिफ्रेश करने की कोशिश करें</li>
                  <li>• ब्राउज़र कैश साफ़ करें</li>
                  <li>• इंटरनेट कनेक्शन जांचें</li>
                  <li>• समस्या बनी रहने पर सहायता टीम से संपर्क करें</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};