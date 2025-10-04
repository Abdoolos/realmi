import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getStripeEventStatus } from '@/api/functions';
import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
    const config = {
        processed: { icon: CheckCircle, className: 'bg-green-100 text-green-800 border-green-200' },
        failed: { icon: XCircle, className: 'bg-red-100 text-red-800 border-red-200' },
        skipped: { icon: Clock, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    };
    
    const { icon: Icon, className } = config[status] || config.skipped;
    
    return (
        <Badge className={`border ${className}`}>
            <Icon className="w-3 h-3 mr-1" />
            {status === 'processed' ? 'معالج' : status === 'failed' ? 'فشل' : 'تم تخطيه'}
        </Badge>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.string.isRequired
};

export default function StripeEventMonitor() {
    const [events, setEvents] = useState([]);
    const [searchEventId, setSearchEventId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const loadRecentEvents = async () => {
        setIsLoading(true);
        try {
            const { data } = await getStripeEventStatus();
            setEvents(data.events || []);
        } catch (error) {
            console.error('Error loading events:', error);
        }
        setIsLoading(false);
    };

    const searchSpecificEvent = async () => {
        if (!searchEventId.trim()) return;
        
        setIsSearching(true);
        setSearchResult(null);
        
        try {
            const { data } = await getStripeEventStatus({ event_id: searchEventId.trim() });
            setSearchResult(data);
        } catch (error) {
            console.error('Error searching event:', error);
            setSearchResult({ 
                found: false, 
                message: `خطأ في البحث: ${error.message}` 
            });
        }
        setIsSearching(false);
    };

    useEffect(() => {
        loadRecentEvents();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6" dir="rtl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">مراقبة أحداث Stripe</h1>
                <p className="text-gray-600">مراقبة ومتابعة معالجة أحداث الدفع والاشتراكات</p>
            </div>

            {/* البحث عن حدث محدد */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        البحث عن حدث محدد
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="أدخل معرف الحدث (Event ID)..."
                            value={searchEventId}
                            onChange={(e) => setSearchEventId(e.target.value)}
                            className="flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && searchSpecificEvent()}
                        />
                        <Button 
                            onClick={searchSpecificEvent}
                            disabled={isSearching || !searchEventId.trim()}
                        >
                            {isSearching ? 'جاري البحث...' : 'بحث'}
                        </Button>
                    </div>

                    {searchResult && (
                        <div className="mt-4">
                            {searchResult.found ? (
                                <Alert className="bg-green-50 border-green-200">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        <div className="space-y-2">
                                            <div><strong>معرف الحدث:</strong> {searchResult.event_id}</div>
                                            <div><strong>نوع الحدث:</strong> {searchResult.event_type}</div>
                                            <div className="flex items-center gap-2">
                                                <strong>الحالة:</strong> 
                                                <StatusBadge status={searchResult.status} />
                                            </div>
                                            <div><strong>الرسالة:</strong> {searchResult.message}</div>
                                            <div><strong>تاريخ المعالجة:</strong> {formatDate(searchResult.processed_at)}</div>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert className="bg-red-50 border-red-200">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        {searchResult.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* الأحداث الأخيرة */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>الأحداث الأخيرة (آخر 100)</CardTitle>
                    <Button 
                        variant="outline" 
                        onClick={loadRecentEvents}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        تحديث
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p>جاري تحميل الأحداث...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            لا توجد أحداث بعد
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {events.map((event) => (
                                <div 
                                    key={event.event_id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                {event.event_id}
                                            </code>
                                            <StatusBadge status={event.status} />
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatDate(event.processed_at)}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{event.event_type}</span>
                                        <span className="text-sm text-gray-600">{event.message}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
