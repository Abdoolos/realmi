const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إدخال البيانات التجريبية...');

  // إنشاء مستخدم تجريبي
  const user = await prisma.user.upsert({
    where: { email: 'ahmed@example.com' },
    update: {},
    create: {
      email: 'ahmed@example.com',
      name: 'أحمد محمد',
      currency: 'SAR',
      timezone: 'Asia/Riyadh',
    },
  });

  console.log('✅ تم إنشاء المستخدم:', user.name);

  // إنشاء عائلة تجريبية
  const family = await prisma.family.upsert({
    where: { inviteCode: 'FAMILY2024' },
    update: {},
    create: {
      name: 'عائلة أحمد',
      inviteCode: 'FAMILY2024',
      ownerId: user.id,
    },
  });

  console.log('✅ تم إنشاء العائلة:', family.name);

  // إضافة المستخدم كعضو في العائلة
  await prisma.familyMember.upsert({
    where: {
      familyId_userId: {
        familyId: family.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      familyId: family.id,
      userId: user.id,
      role: 'owner',
    },
  });

  // إنشاء الفئات الافتراضية
  const categories = [
    { name: 'طعام وشراب', icon: 'utensils', color: '#EF4444' },
    { name: 'مواصلات', icon: 'car', color: '#3B82F6' },
    { name: 'ترفيه', icon: 'gamepad-2', color: '#8B5CF6' },
    { name: 'تسوق', icon: 'shopping-bag', color: '#10B981' },
    { name: 'فواتير', icon: 'file-text', color: '#F59E0B' },
    { name: 'صحة', icon: 'heart', color: '#EF4444' },
    { name: 'تعليم', icon: 'book', color: '#6366F1' },
    { name: 'أخرى', icon: 'more-horizontal', color: '#6B7280' },
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: {
        id: `cat_${categoryData.name.replace(/\s+/g, '_').toLowerCase()}`,
      },
      update: {},
      create: {
        id: `cat_${categoryData.name.replace(/\s+/g, '_').toLowerCase()}`,
        name: categoryData.name,
        icon: categoryData.icon,
        color: categoryData.color,
        isDefault: true,
        familyId: family.id,
      },
    });
    createdCategories.push(category);
  }

  console.log('✅ تم إنشاء الفئات الافتراضية');

  // إنشاء فئات فرعية للطعام
  const foodCategory = createdCategories.find(c => c.name === 'طعام وشراب');
  if (foodCategory) {
    const foodSubcategories = [
      { name: 'مطاعم', categoryId: foodCategory.id },
      { name: 'بقالة', categoryId: foodCategory.id },
      { name: 'مخبز', categoryId: foodCategory.id },
      { name: 'قهوة', categoryId: foodCategory.id },
    ];

    for (const subcat of foodSubcategories) {
      await prisma.subcategory.upsert({
        where: {
          id: `subcat_${subcat.name.replace(/\s+/g, '_').toLowerCase()}`,
        },
        update: {},
        create: {
          id: `subcat_${subcat.name.replace(/\s+/g, '_').toLowerCase()}`,
          name: subcat.name,
          categoryId: subcat.categoryId,
        },
      });
    }
  }

  // إنشاء فئات فرعية للمواصلات
  const transportCategory = createdCategories.find(c => c.name === 'مواصلات');
  if (transportCategory) {
    const transportSubcategories = [
      { name: 'وقود', categoryId: transportCategory.id },
      { name: 'صيانة', categoryId: transportCategory.id },
      { name: 'أوبر/كريم', categoryId: transportCategory.id },
      { name: 'مواقف', categoryId: transportCategory.id },
    ];

    for (const subcat of transportSubcategories) {
      await prisma.subcategory.upsert({
        where: {
          id: `subcat_${subcat.name.replace(/\s+/g, '_').toLowerCase()}`,
        },
        update: {},
        create: {
          id: `subcat_${subcat.name.replace(/\s+/g, '_').toLowerCase()}`,
          name: subcat.name,
          categoryId: subcat.categoryId,
        },
      });
    }
  }

  console.log('✅ تم إنشاء الفئات الفرعية');

  // إنشاء دخل شهري
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(startOfMonth);
    monthDate.setMonth(monthDate.getMonth() - i);
    
    await prisma.income.upsert({
      where: {
        id: `income_${monthDate.getFullYear()}_${monthDate.getMonth() + 1}`,
      },
      update: {},
      create: {
        id: `income_${monthDate.getFullYear()}_${monthDate.getMonth() + 1}`,
        amount: 8000,
        type: 'salary',
        description: `راتب شهر ${monthDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}`,
        date: monthDate,
        userId: user.id,
        familyId: family.id,
      },
    });
  }

  console.log('✅ تم إنشاء سجلات الدخل للـ 6 أشهر الماضية');

  // إنشاء مصاريف تجريبية للـ 6 أشهر الماضية
  const expenseTemplates = [
    { description: 'تسوق أسبوعي', amount: 400, category: 'طعام وشراب', subcategory: 'بقالة' },
    { description: 'وقود السيارة', amount: 200, category: 'مواصلات', subcategory: 'وقود' },
    { description: 'فاتورة الكهرباء', amount: 300, category: 'فواتير', subcategory: null },
    { description: 'عشاء في مطعم', amount: 150, category: 'طعام وشراب', subcategory: 'مطاعم' },
    { description: 'تذاكر سينما', amount: 80, category: 'ترفيه', subcategory: null },
    { description: 'أدوية', amount: 120, category: 'صحة', subcategory: null },
    { description: 'كتب دراسية', amount: 250, category: 'تعليم', subcategory: null },
    { description: 'ملابس', amount: 300, category: 'تسوق', subcategory: null },
    { description: 'قهوة ستارباكس', amount: 35, category: 'طعام وشراب', subcategory: 'قهوة' },
    { description: 'صيانة السيارة', amount: 500, category: 'مواصلات', subcategory: 'صيانة' },
  ];

  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const monthDate = new Date(startOfMonth);
    monthDate.setMonth(monthDate.getMonth() - monthOffset);
    
    // عدد عشوائي من المصاريف كل شهر (10-20)
    const expenseCount = Math.floor(Math.random() * 11) + 10;
    
    for (let i = 0; i < expenseCount; i++) {
      const template = expenseTemplates[Math.floor(Math.random() * expenseTemplates.length)];
      const category = createdCategories.find(c => c.name === template.category);
      
      if (category) {
        let subcategoryId = null;
        if (template.subcategory) {
          const subcategory = await prisma.subcategory.findFirst({
            where: {
              name: template.subcategory,
              categoryId: category.id,
            },
          });
          subcategoryId = subcategory?.id || null;
        }

        // تاريخ عشوائي في الشهر
        const expenseDate = new Date(monthDate);
        expenseDate.setDate(Math.floor(Math.random() * 28) + 1);
        expenseDate.setHours(Math.floor(Math.random() * 24));
        expenseDate.setMinutes(Math.floor(Math.random() * 60));

        // مبلغ متغير (±30%)
        const baseAmount = template.amount;
        const variance = baseAmount * 0.3;
        const amount = baseAmount + (Math.random() * variance * 2 - variance);

        await prisma.expense.create({
          data: {
            amount: Math.round(amount * 100) / 100,
            description: template.description,
            date: expenseDate,
            notes: Math.random() > 0.7 ? 'ملاحظة تجريبية' : null,
            categoryId: category.id,
            subcategoryId,
            userId: user.id,
            familyId: family.id,
          },
        });
      }
    }
  }

  console.log('✅ تم إنشاء المصاريف التجريبية للـ 6 أشهر الماضية');

  // إنشاء ميزانية للشهر الحالي
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const budget = await prisma.budget.upsert({
    where: {
      id: `budget_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}`,
    },
    update: {},
    create: {
      id: `budget_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}`,
      name: `ميزانية ${currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}`,
      totalLimit: 6000,
      startDate: startOfMonth,
      endDate: endOfMonth,
      userId: user.id,
      familyId: family.id,
    },
  });

  // إنشاء حدود للفئات في الميزانية
  const categoryBudgets = [
    { categoryName: 'طعام وشراب', limit: 2000 },
    { categoryName: 'مواصلات', limit: 800 },
    { categoryName: 'ترفيه', limit: 500 },
    { categoryName: 'تسوق', limit: 1000 },
    { categoryName: 'فواتير', limit: 1200 },
    { categoryName: 'صحة', limit: 300 },
    { categoryName: 'تعليم', limit: 200 },
  ];

  for (const catBudget of categoryBudgets) {
    const category = createdCategories.find(c => c.name === catBudget.categoryName);
    if (category) {
      await prisma.categoryBudget.upsert({
        where: {
          budgetId_categoryId: {
            budgetId: budget.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          budgetId: budget.id,
          categoryId: category.id,
          limit: catBudget.limit,
          spent: 0, // سيتم حسابها لاحقاً
        },
      });
    }
  }

  console.log('✅ تم إنشاء الميزانية الشهرية وحدود الفئات');

  // إنشاء مناسبات تجريبية
  const events = [
    {
      name: 'رمضان 2024',
      type: 'ramadan',
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-04-09'),
      description: 'شهر رمضان المبارك'
    },
    {
      name: 'عيد الفطر 2024',
      type: 'eid',
      startDate: new Date('2024-04-10'),
      endDate: new Date('2024-04-12'),
      description: 'عيد الفطر المبارك'
    },
    {
      name: 'العودة للمدارس',
      type: 'school',
      startDate: new Date('2024-08-20'),
      endDate: new Date('2024-08-30'),
      description: 'موسم العودة للمدارس'
    }
  ];

  for (const eventData of events) {
    await prisma.event.upsert({
      where: {
        id: `event_${eventData.type}_2024`,
      },
      update: {},
      create: {
        id: `event_${eventData.type}_2024`,
        name: eventData.name,
        type: eventData.type,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        description: eventData.description,
        familyId: family.id,
      },
    });
  }

  console.log('✅ تم إنشاء المناسبات التجريبية');

  // إنشاء فاتورة مقسمة تجريبية
  const bill = await prisma.bill.create({
    data: {
      title: 'عشاء عائلي في المطعم',
      totalAmount: 200,
      date: new Date(),
      paidById: user.id,
      familyId: family.id,
      isSettled: false,
    },
  });

  await prisma.billParticipant.create({
    data: {
      billId: bill.id,
      userId: user.id,
      shareAmount: 200,
      hasPaid: true,
    },
  });

  console.log('✅ تم إنشاء فاتورة مقسمة تجريبية');

  // إنشاء نصائح تجريبية
  const advices = [
    {
      type: 'monthly',
      title: 'نصيحة شهرية',
      content: 'حاول تقليل مصاريف الطعام والشراب بنسبة 10% هذا الشهر لتوفير 200 ريال إضافية.',
    },
    {
      type: 'daily',
      title: 'نصيحة يومية',
      content: 'بدلاً من شراء القهوة يومياً، حضرها في المنزل ووفر حتى 30 ريال في الأسبوع.',
    },
    {
      type: 'goal',
      title: 'هدف الادخار',
      content: 'لتحقيق هدف ادخار 5000 ريال، يمكنك توفير 417 ريال شهرياً لمدة 12 شهر.',
    }
  ];

  for (const advice of advices) {
    await prisma.advice.create({
      data: {
        type: advice.type,
        title: advice.title,
        content: advice.content,
        userId: user.id,
        familyId: family.id,
      },
    });
  }

  console.log('✅ تم إنشاء النصائح التجريبية');

  // إنشاء توقعات تجريبية
  const nextMonth = new Date(currentDate);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const forecasts = [
    {
      type: 'expense',
      year: nextMonth.getFullYear(),
      month: nextMonth.getMonth() + 1,
      predictedAmount: 2500,
      confidence: 0.85,
      details: {
        algorithm: 'moving_average',
        factors: ['historical_spending', 'seasonal_trends'],
        lastThreeMonthsAvg: 2400
      }
    },
    {
      type: 'income',
      year: nextMonth.getFullYear(),
      month: nextMonth.getMonth() + 1,
      predictedAmount: 8000,
      confidence: 0.95,
      details: {
        algorithm: 'fixed_salary',
        factors: ['regular_salary'],
        recurring: true
      }
    }
  ];

  for (const forecast of forecasts) {
    await prisma.forecast.upsert({
      where: {
        type_year_month_userId: {
          type: forecast.type,
          year: forecast.year,
          month: forecast.month,
          userId: user.id,
        },
      },
      update: {},
      create: {
        type: forecast.type,
        year: forecast.year,
        month: forecast.month,
        predictedAmount: forecast.predictedAmount,
        confidence: forecast.confidence,
        details: forecast.details,
        userId: user.id,
        familyId: family.id,
      },
    });
  }

  console.log('✅ تم إنشاء التوقعات التجريبية');

  console.log('🎉 تم الانتهاء من إدخال جميع البيانات التجريبية بنجاح!');
  console.log('📊 البيانات المُنشأة:');
  console.log('   - 1 مستخدم (ahmed@example.com)');
  console.log('   - 1 عائلة (عائلة أحمد - كود الدعوة: FAMILY2024)');
  console.log('   - 8 فئات رئيسية مع فئات فرعية');
  console.log('   - 6 أشهر من سجلات الدخل');
  console.log('   - ~60-120 مصروف للـ 6 أشهر الماضية');
  console.log('   - ميزانية شهرية مع حدود للفئات');
  console.log('   - 3 مناسبات (رمضان، عيد الفطر، المدارس)');
  console.log('   - فاتورة مقسمة واحدة');
  console.log('   - 3 نصائح مالية');
  console.log('   - توقعات الشهر القادم');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ خطأ في إدخال البيانات:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
