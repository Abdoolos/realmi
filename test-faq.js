/**
 * سكريبت اختبار بيانات الأسئلة الشائعة (FAQ)
 */

import { 
  FAQ_DATA, 
  getAllFAQs, 
  getFAQsByCategory, 
  getFAQCategories,
  searchFAQs,
  getFAQById 
} from './src/agents/knowledgeBase.js'

console.log('🧪 اختبار بيانات الأسئلة الشائعة (FAQ)\n')
console.log('═══════════════════════════════════════════\n')

// 1. عرض إجمالي عدد الأسئلة
console.log('1️⃣ إجمالي عدد الأسئلة:')
const allFAQs = getAllFAQs()
console.log(`   ✅ عدد الأسئلة: ${allFAQs.length} سؤال`)
console.log('')

// 2. عرض الفئات المتوفرة
console.log('2️⃣ الفئات المتوفرة:')
const categories = getFAQCategories()
categories.forEach(cat => {
  console.log(`   ${cat.icon} ${cat.name}: ${cat.count} أسئلة`)
})
console.log('')

// 3. اختبار البحث في الأسئلة
console.log('3️⃣ اختبار البحث (كلمة: "مجاني"):')
const searchResults = searchFAQs('مجاني')
console.log(`   ✅ عدد النتائج: ${searchResults.length}`)
searchResults.forEach(faq => {
  console.log(`   - ${faq.question}`)
})
console.log('')

// 4. عرض أسئلة فئة معينة
console.log('4️⃣ أسئلة فئة "التعريف بالتطبيق":')
const categoryFAQs = getFAQsByCategory('التعريف بالتطبيق')
categoryFAQs.forEach(faq => {
  console.log(`   ${faq.id}. ${faq.question}`)
})
console.log('')

// 5. اختبار الحصول على سؤال محدد
console.log('5️⃣ الحصول على سؤال رقم 1:')
const faq1 = getFAQById(1)
if (faq1) {
  console.log(`   السؤال: ${faq1.question}`)
  console.log(`   الجواب: ${faq1.answer}`)
}
console.log('')

// 6. التحقق من البنية الصحيحة
console.log('6️⃣ التحقق من صحة البيانات:')
let validationErrors = 0

FAQ_DATA.forEach(faq => {
  if (!faq.id || !faq.category || !faq.question || !faq.answer) {
    console.log(`   ❌ خطأ في السؤال رقم ${faq.id || 'غير محدد'}`)
    validationErrors++
  }
})

if (validationErrors === 0) {
  console.log('   ✅ جميع الأسئلة صحيحة ومكتملة')
} else {
  console.log(`   ❌ وجدت ${validationErrors} أخطاء`)
}
console.log('')

// النتيجة النهائية
console.log('═══════════════════════════════════════════')
console.log('🎉 اكتمل الاختبار بنجاح!')
console.log('═══════════════════════════════════════════')
console.log('')
console.log('📊 الملخص:')
console.log(`   - إجمالي الأسئلة: ${allFAQs.length}`)
console.log(`   - عدد الفئات: ${categories.length}`)
console.log(`   - حالة البيانات: ${validationErrors === 0 ? '✅ صحيحة' : '❌ بها أخطاء'}`)
console.log('')
console.log('✨ البيانات جاهزة للاستخدام في الشات بوت!')
console.log('')
