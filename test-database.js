/**
 * سكريبت اختبار قاعدة البيانات
 * يقوم بإنشاء بيانات تجريبية والتحقق من حفظها
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabase() {
  console.log('🧪 بدء اختبار قاعدة البيانات...\n')

  try {
    // 1. إنشاء مستخدم تجريبي
    console.log('1️⃣ إنشاء مستخدم تجريبي...')
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'مستخدم تجريبي',
        currency: 'SAR',
        timezone: 'Asia/Riyadh',
      },
    })
    console.log('✅ تم إنشاء المستخدم:', {
      id: testUser.id,
      email: testUser.email,
      name: testUser.name,
      currency: testUser.currency,
    })
    console.log('')

    // 2. إنشاء تصنيف مصروف
    console.log('2️⃣ إنشاء تصنيف مصروف...')
    const testCategory = await prisma.category.create({
      data: {
        name: 'طعام وشراب',
        icon: '🍽️',
        color: '#FF6B6B',
        isDefault: false,
      },
    })
    console.log('✅ تم إنشاء التصنيف:', {
      id: testCategory.id,
      name: testCategory.name,
      icon: testCategory.icon,
    })
    console.log('')

    // 3. إنشاء مصروف تجريبي
    console.log('3️⃣ إنشاء مصروف تجريبي...')
    const testExpense = await prisma.expense.create({
      data: {
        amount: 250.5,
        description: 'غداء في مطعم',
        date: new Date(),
        notes: 'اختبار حفظ البيانات',
        userId: testUser.id,
        categoryId: testCategory.id,
      },
    })
    console.log('✅ تم إنشاء المصروف:', {
      id: testExpense.id,
      amount: testExpense.amount,
      description: testExpense.description,
      date: testExpense.date.toLocaleDateString('ar-SA'),
    })
    console.log('')

    // 4. إنشاء دخل تجريبي
    console.log('4️⃣ إنشاء دخل تجريبي...')
    const testIncome = await prisma.income.create({
      data: {
        amount: 5000,
        type: 'salary',
        description: 'راتب شهري',
        date: new Date(),
        userId: testUser.id,
      },
    })
    console.log('✅ تم إنشاء الدخل:', {
      id: testIncome.id,
      amount: testIncome.amount,
      type: testIncome.type,
    })
    console.log('')

    // 5. إنشاء ميزانية
    console.log('5️⃣ إنشاء ميزانية...')
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)
    
    const testBudget = await prisma.budget.create({
      data: {
        name: 'ميزانية شهر أكتوبر',
        totalLimit: 3000,
        startDate: startDate,
        endDate: endDate,
        userId: testUser.id,
      },
    })
    console.log('✅ تم إنشاء الميزانية:', {
      id: testBudget.id,
      name: testBudget.name,
      totalLimit: testBudget.totalLimit,
    })
    console.log('')

    // 6. قراءة البيانات للتحقق من الحفظ
    console.log('6️⃣ قراءة البيانات المحفوظة...')

    const savedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        expenses: true,
        incomes: true,
        budgets: true,
      },
    })

    console.log('✅ تم استرجاع بيانات المستخدم:')
    console.log('   - المستخدم:', savedUser.name)
    console.log('   - عدد المصاريف:', savedUser.expenses.length)
    console.log('   - عدد الدخول:', savedUser.incomes.length)
    console.log('   - عدد الميزانيات:', savedUser.budgets.length)
    console.log('')

    // 7. حساب إجمالي المصاريف
    console.log('7️⃣ حساب إجمالي المصاريف والدخول...')
    const totalExpenses = await prisma.expense.aggregate({
      where: { userId: testUser.id },
      _sum: { amount: true },
      _count: true,
    })
    
    const totalIncomes = await prisma.income.aggregate({
      where: { userId: testUser.id },
      _sum: { amount: true },
      _count: true,
    })
    
    console.log('✅ المصاريف:', {
      count: totalExpenses._count,
      total: `${totalExpenses._sum.amount} ${savedUser.currency}`,
    })
    console.log('✅ الدخول:', {
      count: totalIncomes._count,
      total: `${totalIncomes._sum.amount} ${savedUser.currency}`,
    })
    console.log('✅ الصافي:', `${Number(totalIncomes._sum.amount) - Number(totalExpenses._sum.amount)} ${savedUser.currency}`)
    console.log('')

    // 8. اختبار تحديث البيانات
    console.log('8️⃣ اختبار تحديث البيانات...')
    const updatedExpense = await prisma.expense.update({
      where: { id: testExpense.id },
      data: { amount: 300 },
    })
    console.log('✅ تم تحديث المصروف من', testExpense.amount, 'إلى', updatedExpense.amount)
    console.log('')

    // 9. حذف البيانات التجريبية
    console.log('9️⃣ تنظيف البيانات التجريبية...')
    await prisma.budget.delete({ where: { id: testBudget.id } })
    await prisma.income.delete({ where: { id: testIncome.id } })
    await prisma.expense.delete({ where: { id: testExpense.id } })
    await prisma.category.delete({ where: { id: testCategory.id } })
    await prisma.user.delete({ where: { id: testUser.id } })
    console.log('✅ تم حذف جميع البيانات التجريبية')
    console.log('')

    // النتيجة النهائية
    console.log('═══════════════════════════════════════════')
    console.log('🎉 نجح الاختبار! قاعدة البيانات تعمل بشكل صحيح')
    console.log('═══════════════════════════════════════════')
    console.log('')
    console.log('✅ تم إنشاء البيانات بنجاح')
    console.log('✅ تم حفظ البيانات في قاعدة البيانات')
    console.log('✅ تم استرجاع البيانات بنجاح')
    console.log('✅ تم تحديث البيانات بنجاح')
    console.log('✅ تم حساب الإجماليات بشكل صحيح')
    console.log('✅ تم حذف البيانات التجريبية')
    console.log('')
    console.log('📊 ملخص الاختبار:')
    console.log('   - مستخدم: تم إنشاؤه وحذفه بنجاح')
    console.log('   - تصنيف: تم إنشاؤه وحذفه بنجاح')
    console.log('   - مصروف: تم إنشاؤه، تحديثه، وحذفه بنجاح')
    console.log('   - دخل: تم إنشاؤه وحذفه بنجاح')
    console.log('   - ميزانية: تم إنشاؤها وحذفها بنجاح')
    console.log('')
  } catch (error) {
    console.error('❌ فشل الاختبار:', error.message)
    console.error('\nتفاصيل الخطأ:')
    console.error(error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// تشغيل الاختبار
testDatabase()
  .then(() => {
    console.log('✅ اكتمل الاختبار بنجاح')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ خطأ في تشغيل الاختبار')
    process.exit(1)
  })
