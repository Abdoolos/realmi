import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

export default function FamilyLoadingState() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Users className="w-8 h-8 text-emerald-600" />
                <Skeleton className="h-8 w-32" />
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 flex-1" />
                            <Skeleton className="h-9 w-12" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-6 w-24" />
                        <div className="border rounded-lg">
                            <Skeleton className="h-12 w-full" />
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 p-4 border-t">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
