
// في النسخة المجانية الكاملة، جميع الطرق محمية بنفس الطريقة الأساسية
// لا توجد قيود على الميزات بناءً على نوع الاشتراك
const ProtectedRoute = ({ children }) => {
  // في النسخة المجانية، نسمح بالوصول لكل شيء
  return children;
};

export default ProtectedRoute;
