
import { useState } from 'react';
import { User } from '@/api/entities';
import { Family } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, UserPlus, Copy, Trash2, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { useFamily } from '@/components/hooks/useFamily';
import FamilyUpgradeBanner from '@/components/family/FamilyUpgradeBanner';
import FamilyLoadingState from '@/components/family/FamilyLoadingState';
import FamilyErrorState from '@/components/family/FamilyErrorState';

export default function MyFamilyPage() {
    const {
        family,
        members,
        currentUser,
        isLoading,
        error,
        hasFamily,
        hasFamilyPlan,
        canManage,
        retry
    } = useFamily();

    // other component states
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [familyName, setFamilyName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    // This function is kept locally as it's used by handleCreateFamily, which is also local.
    function generateInviteCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const handleCreateFamily = async () => {
        if (!familyName.trim() || !currentUser) return;
        setIsCreating(true);

        try {
            const newFamily = await Family.create({
                family_name: familyName.trim(),
                invitation_code: generateInviteCode(),
                admin_user_id: currentUser.id
            });

            await User.updateMyUserData({
                family_id: newFamily.id,
                family_role: 'admin'
            });

            setShowCreateDialog(false);
            setFamilyName('');
            toast.success("تم إنشاء العائلة بنجاح!");
            retry(); // Reload family data using the hook's retry function
        } catch (error) {
            console.error("Error creating family:", error);
            if (error.response?.status === 429) {
                toast.error("الخدمة مشغولة حالياً. يرجى المحاولة مرة أخرى بعد قليل.");
            } else {
                toast.error("حدث خطأ في إنشاء العائلة. يرجى المحاولة مرة أخرى.");
            }
        }
        setIsCreating(false);
    };

    const handleJoinFamily = async () => {
        if (!inviteCode.trim()) return;
        setIsJoining(true);

        try {
            const families = await Family.filter({ invitation_code: inviteCode.trim().toUpperCase() });
            if (families.length === 0) {
                toast.error("كود الدعوة غير صحيح أو منتهي الصلاحية.");
                setIsJoining(false);
                return;
            }

            await User.updateMyUserData({
                family_id: families[0].id,
                family_role: 'member'
            });

            setShowJoinDialog(false);
            setInviteCode('');
            toast.success("تم الانضمام للعائلة بنجاح!");
            retry(); // Reload family data using the hook's retry function
        } catch (error) {
            console.error("Error joining family:", error);
            if (error.response?.status === 429) {
                toast.error("الخدمة مشغولة حالياً. يرجى المحاولة مرة أخرى بعد قليل.");
            } else {
                toast.error("حدث خطأ في الانضمام للعائلة. يرجى المحاولة مرة أخرى.");
            }
        }
        setIsJoining(false);
    };

    const handleLeaveFamily = async () => {
        if (!window.confirm("هل أنت متأكد من مغادرة العائلة؟")) return;

        try {
            await User.updateMyUserData({ family_id: null, family_role: null });
            toast.success("تم مغادرة العائلة بنجاح.");
            retry(); // Reload family data using the hook's retry function
        } catch (error) {
            console.error("Error leaving family:", error);
            if (error.response?.status === 429) {
                toast.error("الخدمة مشغولة حالياً. يرجى المحاولة مرة أخرى بعد قليل.");
            } else {
                toast.error("فشل مغادرة العائلة.");
            }
        }
    };

    const handleCopyCode = async () => {
        if (!family?.invitation_code) return;
        try {
            await navigator.clipboard.writeText(family.invitation_code);
            toast.success("تم نسخ كود الدعوة!");
        } catch (error) {
            console.error("Failed to copy:", error);
            toast.error("فشل نسخ كود الدعوة.");
        }
    };

    if (isLoading) {
        return <FamilyLoadingState />;
    }

    if (error) {
        return <FamilyErrorState error={error} onRetry={retry} />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
                    <Users className="w-8 h-8" />
                    عائلتي
                </h1>
                <p className="text-emerald-600 mt-1">
                    {hasFamily ? `مرحباً بك في عائلة "${family.family_name}"` : "شارك المصاريف والميزانيات مع عائلتك"}
                </p>
            </motion.div>

            {!hasFamilyPlan && <FamilyUpgradeBanner />}

            {hasFamily ? (
                <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                    <CardHeader>
                        <CardTitle className="text-emerald-800">{family.family_name}</CardTitle>
                        <CardDescription>
                            قائمة بجميع أفراد العائلة وأدوارهم
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 border rounded-lg bg-emerald-50 border-emerald-200">
                                <Label htmlFor="invitation_code" className="text-emerald-700">كود دعوة العائلة</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        id="invitation_code"
                                        value={family.invitation_code}
                                        readOnly
                                        className="font-mono"
                                        disabled={!canManage}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCopyCode}
                                        disabled={!canManage}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-emerald-600 mt-2">
                                    {canManage ? "شارك هذا الكود مع أفراد عائلتك للانضمام." : "اطلب من مدير العائلة مشاركة هذا الكود."}
                                </p>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>الاسم</TableHead>
                                        <TableHead>الدور</TableHead>
                                        <TableHead>البريد الإلكتروني</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.map(member => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                {member.data?.family_role === 'admin' && <Crown className="w-4 h-4 text-amber-500" />}
                                                {member.full_name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={member.data?.family_role === 'admin' ? 'default' : 'secondary'}>
                                                    {member.data?.family_role === 'admin' ? 'مدير' : 'عضو'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{member.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="pt-4">
                                <Button
                                    variant="destructive"
                                    onClick={handleLeaveFamily}
                                    disabled={!canManage}
                                >
                                    <Trash2 className="w-4 h-4 ml-2" />
                                    مغادرة العائلة
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-emerald-800 mb-2">الحساب العائلي</h1>
                        <p className="text-emerald-600">انضم لعائلة أو أنشئ حساباً عائلياً جديداً</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Create Family Card */}
                        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-800">
                                    <Users className="w-6 h-6" />
                                    إنشاء عائلة جديدة
                                </CardTitle>
                                <CardDescription>كن مديراً لحساب عائلتك</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">إنشاء عائلة جديدة</Button>
                                    </DialogTrigger>
                                    <DialogContent dir="rtl">
                                        <DialogHeader>
                                            <DialogTitle>إنشاء عائلة جديدة</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="familyName">اسم العائلة</Label>
                                                <Input id="familyName" value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="مثال: عائلة الأحمد" />
                                            </div>
                                            <Button onClick={handleCreateFamily} disabled={isCreating || !familyName.trim()} className="w-full">
                                                {isCreating ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري الإنشاء...</> : 'إنشاء العائلة'}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>

                        {/* Join Family Card */}
                        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-800">
                                    <UserPlus className="w-6 h-6" />
                                    الانضمام لعائلة
                                </CardTitle>
                                <CardDescription>انضم باستخدام كود الدعوة</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Dialog open={showJoinDialog} onOpenChange={(isOpen) => { setShowJoinDialog(isOpen); }}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full border-emerald-300 hover:bg-emerald-50">الانضمام لعائلة</Button>
                                    </DialogTrigger>
                                    <DialogContent dir="rtl">
                                        <DialogHeader>
                                            <DialogTitle>الانضمام لعائلة</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="inviteCode">كود الدعوة</Label>
                                                <Input id="inviteCode" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="أدخل كود الدعوة" maxLength={6} />
                                            </div>
                                            <Button onClick={handleJoinFamily} disabled={isJoining || !inviteCode.trim()} className="w-full">
                                                {isJoining ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري الانضمام...</> : 'انضمام للعائلة'}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
