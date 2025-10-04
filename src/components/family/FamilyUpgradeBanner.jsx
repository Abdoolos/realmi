import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Crown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FamilyUpgradeBanner() {
    return (
        <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-6">
            <Crown className="h-5 w-5 text-amber-600" />
            <AlertDescription className="flex items-center justify-between w-full">
                <div>
                    <strong className="text-amber-800">ترقية مطلوبة</strong>
                    <p className="text-amber-700 mt-1">للوصول لجميع ميزات إدارة العائلة، يرجى الترقية للخطة العائلية.</p>
                </div>
                <Link to={createPageUrl("Pricing")}>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                        <ArrowLeft className="w-4 h-4 ml-2" />
                        ترقية الآن
                    </Button>
                </Link>
            </AlertDescription>
        </Alert>
    );
}
