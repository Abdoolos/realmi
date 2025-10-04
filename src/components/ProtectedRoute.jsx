import React from 'react';

// في النسخة المجانية الكاملة، جميع الطرق محمية بنفس الطريقة الأساسية
// لا توجد قيود على الميزات بناءً على نوع الاشتراك
const ProtectedRoute = ({ children, requiredPlan, requiredRole }) => {
  // في النسخة المجانية، نسمح بالوصول لكل شيء
  return children;
};

export default ProtectedRoute;