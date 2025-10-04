import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.handleReload = this.handleReload.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // إرسال تقرير الخطأ في بيئة الإنتاج
    const isProduction = window.location.hostname.includes('base44.app');
    if (isProduction) {
      this.reportError(error, errorInfo);
    }
  }

  reportError(error, errorInfo) {
    try {
      // يمكن إرسال التقرير إلى خدمة مراقبة الأخطاء
      console.error('Production Error Report:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString()
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  handleReload() {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = window.location.hostname.includes('localhost');
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-red-800">حدث خطأ غير متوقع</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                نعتذر عن هذا الإزعاج. حدث خطأ أثناء تحميل التطبيق.
              </p>
              
              {isDevelopment && this.state.error && (
                <details className="text-left bg-gray-100 p-3 rounded text-sm">
                  <summary className="cursor-pointer font-semibold">تفاصيل الخطأ (بيئة التطوير)</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button onClick={this.handleReset} variant="outline">
                  إعادة المحاولة
                </Button>
                <Button onClick={this.handleReload} className="bg-red-600 hover:bg-red-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة تحميل الصفحة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
