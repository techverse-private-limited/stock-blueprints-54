
export interface PrintBillData {
  billNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export const printBill = (billData: PrintBillData) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const convertNumberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    if (num === 0) return 'Zero';

    const convertHundreds = (n: number): string => {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result;
    };

    let result = '';
    let thousandIndex = 0;
    
    while (num > 0) {
      if (num % 1000 !== 0) {
        result = convertHundreds(num % 1000) + thousands[thousandIndex] + ' ' + result;
      }
      num = Math.floor(num / 1000);
      thousandIndex++;
    }
    
    return result.trim();
  };

  const totalInWords = convertNumberToWords(Math.floor(billData.totalAmount));

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt</title>
      <style>
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            width: 80mm;
            margin: 0;
            padding: 5mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.2;
          }
        }
        body {
          width: 80mm;
          margin: 0 auto;
          padding: 5mm;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.2;
        }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .line { border-bottom: 1px dashed #000; margin: 5px 0; }
        .header { font-size: 16px; font-weight: bold; }
        .small { font-size: 10px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 2px 0; }
        .item-row td { border-bottom: none; }
      </style>
    </head>
    <body>
      <div class="center header">TASTY BITE</div>
      <div class="center small">MARAIKAR PALLIVASAL 2nd STREET</div>
      <div class="center small">TENKASI</div>
      <div class="center small">Phone: 7358921445, 7548881441</div>
      <br>
      <div class="center small">Company name: Techverse infotech Private Limited</div>
      <br>
      <div class="center small">GSTIN: _______________________</div>
      <div class="line"></div>
      
      <div>Invoice No/Date: ${billData.billNumber}</div>
      <div>Date: ${billData.date}</div>
      <div>Customer Name: ${billData.customerName}</div>
      ${billData.customerPhone ? `<div>Cust Mobile No: ${billData.customerPhone}</div>` : ''}
      <div class="line"></div>
      
      <table>
        <tr class="bold small">
          <td>Sl</td>
          <td>Product</td>
          <td class="right">Price</td>
          <td class="center">Qty</td>
          <td class="right">Amt</td>
        </tr>
        <tr><td colspan="5" class="line"></td></tr>
        ${billData.items.map((item, index) => `
          <tr class="item-row small">
            <td>${index + 1}</td>
            <td>${item.name.length > 16 ? item.name.substring(0, 16) + '...' : item.name}</td>
            <td class="right">${item.price.toFixed(2)}</td>
            <td class="center">${item.quantity}</td>
            <td class="right">${item.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>
      <div class="line"></div>
      
      <div class="center small">Rupees ${totalInWords} Only</div>
      <br>
      
      <table class="small">
        <tr><td>Total GST :</td><td class="right">0.00</td></tr>
        <tr><td>Total Sale :</td><td class="right">0.00</td></tr>
        <tr><td>Total Savings :</td><td class="right">0.00</td></tr>
        <tr class="bold"><td>Net Payable :</td><td class="right">${billData.totalAmount.toFixed(2)}</td></tr>
      </table>
      <div class="line"></div>
      
      <div class="center bold">THANK YOU, VISIT US AGAIN!</div>
      
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
};
