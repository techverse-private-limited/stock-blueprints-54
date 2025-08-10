import jsPDF from 'jspdf';

export interface PDFBillData {
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

export const generateBillPDF = (billData: PDFBillData) => {
  // Create PDF with thermal printer size (80mm width ≈ 226 points, height calculated automatically)
  const pdf = new jsPDF('portrait', 'pt', [226, 600]); // 80mm width, 600pt initial height
  
  const pageWidth = 226; // 80mm in points
  const margin = 10;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin + 10;
  
  // Set font
  pdf.setFont('helvetica');
  
  // Header - Restaurant Name
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TASTY BITE', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Address
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('MARAIKAR PALLIVASAL 2nd STREET', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  pdf.text('TENKASI', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  pdf.text('Phone: 7358921445, 7548881441', pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;
  
  // Company name
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Company name: Techverse infotech Private Limited', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // GSTIN line
  pdf.setFontSize(8);
  pdf.text('GSTIN: _______________________', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Separator line
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 12;
  
  // Invoice details section
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  pdf.text(`Invoice No/Date: ${billData.billNumber}`, margin, yPos);
  yPos += 10;
  pdf.text(`Date: ${billData.date}`, margin, yPos);
  yPos += 10;
  pdf.text(`Customer Name: ${billData.customerName}`, margin, yPos);
  yPos += 10;
  if (billData.customerPhone) {
    pdf.text(`Cust Mobile No: ${billData.customerPhone}`, margin, yPos);
    yPos += 10;
  }
  
  // Separator line
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 12;
  
  // Table header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  
  // Define column positions for better alignment
  const colSl = margin;
  const colProduct = margin + 18;
  const colPrice = margin + 110;
  const colQty = margin + 150;
  const colAmt = pageWidth - margin;
  
  pdf.text('Sl', colSl, yPos);
  pdf.text('Product', colProduct, yPos);
  pdf.text('Price', colPrice, yPos);
  pdf.text('Qty', colQty, yPos);
  pdf.text('Amt', colAmt, yPos, { align: 'right' });
  
  yPos += 8;
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;
  
  // Items
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  
  billData.items.forEach((item, index) => {
    // Serial number
    pdf.text(`${index + 1}`, colSl, yPos);
    
    // Item name (wrap if too long)
    const itemName = item.name.length > 16 ? item.name.substring(0, 16) + '...' : item.name;
    pdf.text(itemName, colProduct, yPos);
    
    // Price (right aligned within its column)
    pdf.text(item.price.toFixed(2), colPrice + 30, yPos, { align: 'right' });
    
    // Quantity (centered in its column)
    pdf.text(item.quantity.toString(), colQty + 15, yPos, { align: 'center' });
    
    // Amount (right aligned)
    pdf.text(item.total.toFixed(2), colAmt, yPos, { align: 'right' });
    
    yPos += 12;
  });
  
  // Separator line
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;
  
  // Amount in words
  pdf.setFontSize(8);
  const totalInWords = convertNumberToWords(Math.floor(billData.totalAmount));
  pdf.text(`Rupees ${totalInWords} Only`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Summary section
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  // Total GST
  pdf.text('Total GST :', margin, yPos);
  pdf.text('0.00', pageWidth - margin, yPos, { align: 'right' });
  yPos += 10;
  
  // Total Sale
  pdf.text('Total Sale :', margin, yPos);
  pdf.text('0.00', pageWidth - margin, yPos, { align: 'right' });
  yPos += 10;
  
  // Total Savings
  pdf.text('Total Savings :', margin, yPos);
  pdf.text('0.00', pageWidth - margin, yPos, { align: 'right' });
  yPos += 10;
  
  // Net Payable
  pdf.setFont('helvetica', 'bold');
  pdf.text('Net Payable :', margin, yPos);
  pdf.text(billData.totalAmount.toFixed(2), pageWidth - margin, yPos, { align: 'right' });
  yPos += 15;
  
  // Separator line
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;
  
  // Thank you message
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('THANK YOU, VISIT US AGAIN!', pageWidth / 2, yPos, { align: 'center' });
  
  // Download the PDF with thermal receipt size
  pdf.save(`Receipt-${billData.billNumber}.pdf`);
};

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
