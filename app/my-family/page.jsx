'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  Crown, 
  Settings, 
  Mail, 
  Copy, 
  Edit2, 
  Trash2,
  Shield,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyFamilyPage() {
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    try {
      const response = await fetch('/api/family');
      if (response.ok) {
        const data = await response.json();
        setFamilyData(data);
      }
    } catch (error) {
      console.error('Error loading family data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Mock data
  const mockData = familyData || {
    family: {
      id: 1,
      name: 'عائلة العوضي',
      inviteCode: 'FAM-AWD123',
      createdAt: '2024-01-15'
    },
    members: [
      {
        id: 1,
        name: 'أحمد العوضي',
        email: 'ahmed@example.com',
        role: 'admin',
        avatar: '/avatars/ahmed.jpg',
        joinedAt: '2024-01-15',
        isCurrentUser: true
      },
      {
        id: 2,
        name: 'فاطمة العوضي',
        email: 'fatima@example.com',
        role: 'admin',
        avatar: '/avatars/fatima.jpg',
        joinedAt: '2024-01-15'
      },
      {
        id: 3,
        name: 'محمد العوضي',
        email: 'mohammed@example.com',
        role: 'member',
        avatar: '/avatars/mohammed.jpg',
        joinedAt: '2024-02-01'
      },
      {
        id: 4,
        name: 'نورا العوضي',
        email: 'nora@example.com',
        role: 'member',
        avatar: '/avatars/nora.jpg',
        joinedAt: '2024-03-01'
      }
    ]
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(mockData.family.inviteCode);
    // يمكن إضافة toast notification هنا
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'مدير';
      case 'member':
        return 'عضو';
      default:
        return 'عضو';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-amber-100 text-amber-800';
      case 'member':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">إدارة العائلة</h1>
          <p className="text-emerald-600 mt-2">إدارة أفراد العائلة والصلاحيات</p>
        </div>
        <Button 
          onClick={() => setShowInviteForm(true)}
          className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white"
        >
          <UserPlus className="w-4 h-4 ml-2" />
          دعوة عضو جديد
        </Button>
      </motion.div>

      {/* Family Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800 flex items-center gap-2">
              <Users className="w-6 h-6" />
              معلومات العائلة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">اسم العائلة</label>
                <p className="text-lg font-semibold text-gray-800">{mockData.family.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">كود الدعوة</label>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-3 py-1 rounded text-gray-800 font-mono">
                    {mockData.family.inviteCode}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyInviteCode}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">تاريخ الإنشاء</label>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(mockData.family.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invite Form */}
      {showInviteForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-xl text-emerald-800">دعوة عضو جديد</CardTitle>
              <CardDescription>أدخل البريد الإلكتروني للعضو الجديد</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="flex-1"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Mail className="w-4 h-4 ml-2" />
                  إرسال دعوة
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInviteForm(false)}
                >
                  إلغاء
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                أو شارك كود الدعوة: <code className="bg-gray-100 px-2 py-1 rounded">{mockData.family.inviteCode}</code>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800 flex items-center gap-2">
              <Users className="w-6 h-6" />
              أفراد العائلة ({mockData.members.length})
            </CardTitle>
            <CardDescription>إدارة صلاحيات ومعلومات أفراد العائلة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                      {member.role === 'admin' && (
                        <Crown className="w-5 h-5 text-amber-500" />
                      )}
                      {member.isCurrentUser && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          أنت
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-1">{member.email}</p>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleColor(member.role)}>
                        {member.role === 'admin' ? (
                          <Shield className="w-3 h-3 ml-1" />
                        ) : (
                          <User className="w-3 h-3 ml-1" />
                        )}
                        {getRoleLabel(member.role)}
                      </Badge>
                      
                      <span className="text-xs text-gray-500">
                        انضم في {new Date(member.joinedAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!member.isCurrentUser && (
                    <>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Family Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-xl text-amber-800 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              إعدادات العائلة
            </CardTitle>
            <CardDescription className="text-amber-600">
              إعدادات متقدمة لإدارة العائلة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-16 flex-col gap-2 border-amber-200 hover:bg-amber-50">
                <Shield className="w-6 h-6 text-amber-600" />
                <span className="text-amber-700">إدارة الصلاحيات</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex-col gap-2 border-amber-200 hover:bg-amber-50">
                <Settings className="w-6 h-6 text-amber-600" />
                <span className="text-amber-700">إعدادات الخصوصية</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex-col gap-2 border-red-200 hover:bg-red-50 text-red-600">
                <Trash2 className="w-6 h-6" />
                <span>حذف العائلة</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex-col gap-2 border-amber-200 hover:bg-amber-50">
                <Copy className="w-6 h-6 text-amber-600" />
                <span className="text-amber-700">إنشاء كود جديد</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
