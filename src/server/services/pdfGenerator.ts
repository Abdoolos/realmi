import puppeteer from 'puppeteer';
import { MonthlyReportData, YearlyReportData } from './reportService';

export class PDFGenerator {
  private async generateHTML(reportData: MonthlyReportData | YearlyReportData, type: 'monthly' | 'yearly'): Promise<string> {
    const isMonthly = type === 'monthly';
    const monthlyData = isMonthly ? reportData as MonthlyReportData : null;
    const yearlyData = !isMonthly ? reportData as YearlyReportData : null;

    const arabicFont = `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
    `;

    const css = `
      <style>
        ${arabicFont}
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Noto Sans Arabic', Arial, sans-serif;
          direction: rtl;
          text-align: right;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
          color: #2d3748;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .header .subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
        }
        
        .content {
          padding: 40px;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .summary-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        
        .summary-card .value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e40af;
          display: block;
        }
        
        .summary-card .label {
          font-size: 0.9rem;
          color: #64748b;
          margin-top: 5px;
        }
        
        .positive {
          color: #059669 !important;
        }
        
        .negative {
          color: #dc2626 !important;
        }
        
        .category-list {
          list-style: none;
        }
        
        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          margin-bottom: 10px;
          background: #f8fafc;
          border-radius: 8px;
          border-right: 4px solid #4f46e5;
        }
        
        .category-name {
          font-weight: 500;
        }
        
        .category-amount {
          font-weight: 600;
          color: #1e40af;
        }
        
        .category-percentage {
          font-size: 0.9rem;
          color: #64748b;
          margin-right: 10px;
        }
        
        .recommendations {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          padding: 20px;
          border-radius: 12px;
          border-right: 4px solid #10b981;
        }
        
        .recommendations ul {
          list-style: none;
        }
        
        .recommendations li {
          padding: 8px 0;
          border-bottom: 1px solid #d1fae5;
        }
        
        .recommendations li:last-child {
          border-bottom: none;
        }
        
        .recommendations li:before {
          content: "✓";
          color: #10b981;
          font-weight: bold;
          margin-left: 10px;
        }
        
        .trends {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }
        
        .trend-item {
          text-align: center;
          padding: 15px;
          background: #f1f5f9;
          border-radius: 8px;
        }
        
        .trend-value {
          font-size: 1.5rem;
          font-weight: 600;
          display: block;
        }
        
        .trend-label {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 5px;
        }
        
        .footer {
          background: #f8fafc;
          padding: 20px;
          text-align: center;
          color: #64748b;
          font-size: 0.9rem;
        }
        
        .avatar-credit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }
        
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .container {
            box-shadow: none;
            border-radius: 0;
          }
        }
      </style>
    `;

    const monthlyContent = monthlyData ? `
      <div class="summary-grid">
        <div class="summary-card">
          <span class="value positive">${monthlyData.summary.totalIncome.toLocaleString('ar-SA')} ر.س</span>
          <div class="label">إجمالي الدخل</div>
        </div>
        <div class="summary-card">
          <span class="value negative">${monthlyData.summary.totalExpenses.toLocaleString('ar-SA')} ر.س</span>
          <div class="label">إجمالي المصاريف</div>
        </div>
        <div class="summary-card">
          <span class="value ${monthlyData.summary.netAmount >= 0 ? 'positive' : 'negative'}">${monthlyData.summary.netAmount.toLocaleString('ar-SA')} ر.س</span>
          <div class="label">صافي المبلغ</div>
        </div>
        <div class="summary-card">
          <span class="value ${monthlyData.summary.savingsRate >= 0 ? 'positive' : 'negative'}">${monthlyData.summary.savingsRate.toFixed(1)}%</span>
          <div class="label">معدل الادخار</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">توزيع المصاريف حسب الفئات</div>
        <ul class="category-list">
          ${monthlyData.expensesByCategory.map(category => `
            <li class="category-item">
              <span class="category-name">${category.categoryName}</span>
              <div>
                <span class="category-percentage">${category.percentage.toFixed(1)}%</span>
                <span class="category-amount">${category.total.toLocaleString('ar-SA')} ر.س</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="section">
        <div class="section-title">توزيع الدخل حسب النوع</div>
        <ul class="category-list">
          ${monthlyData.incomeByType.map(income => `
            <li class="category-item">
              <span class="category-name">${this.getIncomeTypeLabel(income.type)}</span>
              <div>
                <span class="category-percentage">${income.percentage.toFixed(1)}%</span>
                <span class="category-amount">${income.total.toLocaleString('ar-SA')} ر.س</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>

      ${monthlyData.budgetComparison ? `
        <div class="section">
          <div class="section-title">مقارنة الميزانية</div>
          <div class="summary-grid">
            <div class="summary-card">
              <span class="value">${monthlyData.budgetComparison.totalLimit.toLocaleString('ar-SA')} ر.س</span>
              <div class="label">حد الميزانية</div>
            </div>
            <div class="summary-card">
              <span class="value negative">${monthlyData.budgetComparison.totalSpent.toLocaleString('ar-SA')} ر.س</span>
              <div class="label">المبلغ المُستخدم</div>
            </div>
            <div class="summary-card">
              <span class="value positive">${monthlyData.budgetComparison.remainingAmount.toLocaleString('ar-SA')} ر.س</span>
              <div class="label">المبلغ المتبقي</div>
            </div>
            <div class="summary-card">
              <span class="value ${monthlyData.budgetComparison.percentageUsed > 100 ? 'negative' : 'positive'}">${monthlyData.budgetComparison.percentageUsed.toFixed(1)}%</span>
              <div class="label">نسبة الاستخدام</div>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-title">مقارنة بالشهر السابق</div>
        <div class="trends">
          <div class="trend-item">
            <span class="trend-value ${monthlyData.trends.comparedToPreviousMonth.incomeChange >= 0 ? 'positive' : 'negative'}">
              ${monthlyData.trends.comparedToPreviousMonth.incomeChange >= 0 ? '+' : ''}${monthlyData.trends.comparedToPreviousMonth.incomeChange.toFixed(1)}%
            </span>
            <div class="trend-label">تغيير الدخل</div>
          </div>
          <div class="trend-item">
            <span class="trend-value ${monthlyData.trends.comparedToPreviousMonth.expenseChange <= 0 ? 'positive' : 'negative'}">
              ${monthlyData.trends.comparedToPreviousMonth.expenseChange >= 0 ? '+' : ''}${monthlyData.trends.comparedToPreviousMonth.expenseChange.toFixed(1)}%
            </span>
            <div class="trend-label">تغيير المصاريف</div>
          </div>
          <div class="trend-item">
            <span class="trend-value ${monthlyData.trends.comparedToPreviousMonth.savingsChange >= 0 ? 'positive' : 'negative'}">
              ${monthlyData.trends.comparedToPreviousMonth.savingsChange >= 0 ? '+' : ''}${monthlyData.trends.comparedToPreviousMonth.savingsChange.toFixed(1)}%
            </span>
            <div class="trend-label">تغيير الادخار</div>
          </div>
        </div>
      </div>
    ` : '';

    const yearlyContent = yearlyData ? `
      <div class="summary-grid">
        <div class="summary-card">
          <span class="value positive">${yearlyData.summary.totalIncome.toLocaleString('ar-SA')} ر.س</span>
          <div class="label">إجمالي الدخل السنوي</div>
        </div>
        <div class="summary-card">
          <span class="value negative">${yearlyData.summary.totalExpenses.toLocaleString('ar-SA')} ر.س</span>
          <div class="label">إجمالي المصاريف السنوية</div>
        </div>
        <div class="summary-card">
          <span class="value ${yearlyData.summary.netAmount >= 0 ? 'positive' : 'negative'}">${yearlyData.summary.netAmount.toLocaleString('ar-SA')} ر.س</span>
          <div class="label">صافي المبلغ السنوي</div>
        </div>
        <div class="summary-card">
          <span class="value positive">${yearlyData.summary.averageMonthlySavings.toLocaleString('ar-SA')} ر.س</span>
          <div class="label">متوسط الادخار الشهري</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">أفضل وأسوأ الأشهر</div>
        <div class="summary-grid">
          <div class="summary-card">
            <span class="value positive">${this.getMonthName(yearlyData.summary.bestMonth.month)}</span>
            <div class="label">أفضل شهر (${yearlyData.summary.bestMonth.savings.toLocaleString('ar-SA')} ر.س)</div>
          </div>
          <div class="summary-card">
            <span class="value negative">${this.getMonthName(yearlyData.summary.worstMonth.month)}</span>
            <div class="label">أصعب شهر (${yearlyData.summary.worstMonth.savings.toLocaleString('ar-SA')} ر.س)</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">تحليل الفئات السنوي</div>
        <ul class="category-list">
          ${yearlyData.categoryAnalysis.map(category => `
            <li class="category-item">
              <span class="category-name">${category.categoryName}</span>
              <div>
                <span class="category-percentage">${category.percentage.toFixed(1)}%</span>
                <span class="category-amount">${category.totalSpent.toLocaleString('ar-SA')} ر.س</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="section">
        <div class="section-title">الرؤى السنوية</div>
        <div class="recommendations">
          <ul>
            ${yearlyData.insights.map(insight => `<li>${insight}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : '';

    const recommendations = isMonthly ? monthlyData?.recommendations : [];

    return `
      <!DOCTYPE html>
      <html lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isMonthly ? 'التقرير الشهري' : 'التقرير السنوي'}</title>
        ${css}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isMonthly ? 'التقرير المالي الشهري' : 'التقرير المالي السنوي'}</h1>
            <div class="subtitle">
              ${isMonthly 
                ? `${monthlyData!.period.monthName} ${monthlyData!.period.year}` 
                : `السنة ${yearlyData!.year}`
              }
            </div>
          </div>
          
          <div class="content">
            ${isMonthly ? monthlyContent : yearlyContent}
            
            ${recommendations && recommendations.length > 0 ? `
              <div class="section">
                <div class="section-title">التوصيات والنصائح</div>
                <div class="recommendations">
                  <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                  </ul>
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <div>تم إنشاء هذا التقرير في ${new Date().toLocaleDateString('ar-SA')}</div>
            <div class="avatar-credit">
              <span>تطبيق الميزانية الذكية</span>
              <div class="avatar">RM</div>
              <span>تطبيق ريال مايند</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async generateMonthlyReportPDF(reportData: MonthlyReportData): Promise<Buffer> {
    const html = await this.generateHTML(reportData, 'monthly');
    return await this.generatePDFFromHTML(html);
  }

  async generateYearlyReportPDF(reportData: YearlyReportData): Promise<Buffer> {
    const html = await this.generateHTML(reportData, 'yearly');
    return await this.generatePDFFromHTML(html);
  }

  private async generatePDFFromHTML(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Set content and wait for fonts to load
      await page.setContent(html, { 
        waitUntil: ['networkidle0', 'domcontentloaded'] 
      });
      
      // Wait a bit more for Google Fonts to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private getIncomeTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      salary: 'راتب',
      freelance: 'عمل حر',
      investment: 'استثمار',
      other: 'أخرى'
    };
    return labels[type] || type;
  }

  private getMonthName(month: number): string {
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return monthNames[month - 1];
  }
}

export const pdfGenerator = new PDFGenerator();
