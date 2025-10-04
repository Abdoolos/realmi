import { useEffect, useState } from 'react';
import { validateConfig } from '@/components/utils/configValidator';
import { getEnvironmentInfo } from '@/components/utils/envUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export default function ProductionCheck({ children }) {
  const [validationResult, setValidationResult] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const env = getEnvironmentInfo();

  useEffect(() => {
    // فحص الإعدادات فقط في الإنتاج
    if (env.isProduction) {
      performCheck();
    } else {
      setIsChecking(false);
    }
  }, [env.isProduction]);

  const performCheck = async () => {
    setIsChecking(true);
    
    // تأخير صغير للسماح للتطبيق بالتحميل
    setTimeout(() => {
      const result = validateConfig();
      setValidationResult(result);
      setIsChecking(false);
    }, 1000);
  };

  const handleRetry = () => {
    performCheck();
  };

  const handleReload = () => {
    window.location.reload();
  };

  // في بيئة التطوير، أعرض التطبيق مباشرة
  if (!env.isProduction) {
    return children;
  }

  // أثناء الفحص
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-emerald-600">جاري فحص إعدادات التطبيق...</p>
        </div>
      </div>
    );
  }

  // إذا كان هناك أخطاء حرجة
  if (validationResult && !validationResult.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>خطأ في إعدادات التطبيق</strong>
              <ul className="mt-2 space-y-1">
                {validationResult.errors.map((error, index) => (
                  <li key={index} className="text-sm">• {error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              إعادة المحاولة
            </Button>
            <Button onClick={handleReload}>
              إعادة تحميل الصفحة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // إذا كانت هناك تحذيرات فقط، أعرض التطبيق مع التحذيرات
  if (validationResult && validationResult.warnings.length > 0) {
    return (
      <>
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>تحذيرات النظام:</strong>
            <ul className="mt-1">
              {validationResult.warnings.map((warning, index) => (
                <li key={index} className="text-sm">• {warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
        {children}
      </>
    );
  }

  // التطبيق يعمل بشكل طبيعي
  return (
    <>
      {env.isProduction && (
        <div className="hidden">
          <CheckCircle className="text-green-600" />
          Production checks passed
        </div>
      )}
      {children}
    </>
  );
}
