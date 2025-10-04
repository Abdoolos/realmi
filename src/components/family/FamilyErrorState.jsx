import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function FamilyErrorState({ onRetry }) {
    return (
        <div className="max-w-2xl mx-auto">
            <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>فشل في تحميل بيانات العائلة</AlertTitle>
                <AlertDescription className="flex justify-between items-center w-full mt-2">
                    <span>حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="mr-2"
                    >
                        <RefreshCw className="w-4 h-4 ml-2" />
                        إعادة المحاولة
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    );
}
