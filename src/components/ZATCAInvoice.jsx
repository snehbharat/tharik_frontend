import React from "react";

export const ZATCAInvoice = ({
  invoiceNumber,
  issueDate,
  issueTime,
  dueDate,
  deliveryDate,
  paymentReference,
  company,
  client,
  items,
  subtotal,
  discount,
  totalVAT,
  total,
  paymentMethod,
  paymentMethodAr,
  bankInfo,
  notes,
  notesAr,
}) => {
  // Generate QR Code data according to ZATCA requirements
  const generateQRData = () => {
    const qrData = {
      sellerName: company.nameAr,
      vatNumber: company.vatNumber,
      invoiceDate: `${issueDate}T${issueTime}:00Z`,
      totalAmount: total.toFixed(2),
      vatAmount: totalVAT.toFixed(2),
      invoiceHash: generateInvoiceHash(),
    };

    return btoa(unescape(encodeURIComponent(JSON.stringify(qrData))));
  };

  const generateInvoiceHash = () => {
    const hashData = `${invoiceNumber}-${total}-${issueDate}-${company.vatNumber}`;
    return btoa(hashData).substring(0, 64).toUpperCase();
  };

  // Simple QR Code placeholder component
  const QRCodePlaceholder = ({ value, size }) => (
    <div
      style={{
        width: size,
        height: size,
        background: "white",
        border: "2px solid #e0e7ff",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        color: "#4a5568",
        textAlign: "center",
        padding: "10px",
      }}
    >
      QR Code
      <br />
      {value}
    </div>
  );

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} SAR`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA");
  };

  return (
    <div style={styles.invoiceContainer}>
      {/* Watermark */}
      <div style={styles.watermark}>فاتورة ضريبية</div>

      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.companyInfo}>
          <div style={styles.companyName}>{company.nameAr}</div>
          <div style={styles.companyAddress}>{company.addressAr}</div>
        </div>

        <div style={styles.invoiceTitle}>
          <h1 style={styles.arabicTitle}>فاتورة ضريبية</h1>
          <h2 style={styles.englishTitle}>TAX INVOICE</h2>
        </div>

        <div style={styles.invoiceMeta}>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>رقم الفاتورة:</div>
            <div style={styles.metaValue}>{invoiceNumber}</div>
          </div>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>تاريخ الفاتورة:</div>
            <div style={styles.metaValue}>{formatDate(issueDate)}</div>
          </div>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>تاريخ الاستحقاق:</div>
            <div style={styles.metaValue}>{formatDate(dueDate)}</div>
          </div>
          <div style={styles.badges}>
            <div style={styles.badge}>متوافق مع متطلبات الزكاة</div>
            <div style={styles.badge}>ZATCA Compliant</div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        {/* Supplier & Customer Info */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>معلومات المورد والعميل</span>
          </div>

          <div style={styles.customerDetails}>
            <div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>اسم المورد:</div>
                <div style={styles.detailValue}>{company.nameAr}</div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>السجل التجاري:</div>
                <div style={styles.detailValue}>{company.crNumber}</div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>الرقم الضريبي:</div>
                <div style={styles.detailValue}>{company.vatNumber}</div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>العنوان:</div>
                <div style={styles.detailValue}>{company.addressAr}</div>
              </div>
            </div>

            <div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>اسم العميل:</div>
                <div style={styles.detailValue}>{client.nameAr}</div>
              </div>
              {client.vatNumber && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>الرقم الضريبي:</div>
                  <div style={styles.detailValue}>{client.vatNumber}</div>
                </div>
              )}
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>العنوان:</div>
                <div style={styles.detailValue}>{client.addressAr}</div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>البريد الإلكتروني:</div>
                <div style={styles.detailValue}>{client.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>البنود</span>
          </div>

          <table style={styles.itemsTable}>
            <thead>
              <tr>
                <th style={{ ...styles.tableHeader, width: "35%" }}>
                  <div style={styles.dualHeader}>
                    <span style={styles.headerAr}>الوصف</span>
                    <span style={styles.headerEn}>Description</span>
                  </div>
                </th>
                <th style={{ ...styles.tableHeader, width: "10%" }}>
                  <div style={styles.dualHeader}>
                    <span style={styles.headerAr}>الكمية</span>
                    <span style={styles.headerEn}>Quantity</span>
                  </div>
                </th>
                <th style={{ ...styles.tableHeader, width: "15%" }}>
                  <div style={styles.dualHeader}>
                    <span style={styles.headerAr}>سعر الوحدة</span>
                    <span style={styles.headerEn}>Unit Price</span>
                  </div>
                </th>
                <th style={{ ...styles.tableHeader, width: "15%" }}>
                  <div style={styles.dualHeader}>
                    <span style={styles.headerAr}>الصافي</span>
                    <span style={styles.headerEn}>Net Amount</span>
                  </div>
                </th>
                <th style={{ ...styles.tableHeader, width: "15%" }}>
                  <div style={styles.dualHeader}>
                    <span style={styles.headerAr}>الضريبة 15%</span>
                    <span style={styles.headerEn}>VAT 15%</span>
                  </div>
                </th>
                <th style={{ ...styles.tableHeader, width: "15%" }}>
                  <div style={styles.dualHeader}>
                    <span style={styles.headerAr}>الإجمالي</span>
                    <span style={styles.headerEn}>Total</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ ...styles.tableCell, textAlign: "right" }}>
                    {item.descriptionAr}
                  </td>
                  <td style={styles.tableCellCenter}>
                    {item.quantity.toFixed(2)}
                  </td>
                  <td style={styles.tableCellCenter}>
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td style={styles.tableCellCenter}>
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>
                  <td style={styles.tableCellCenter}>
                    {formatCurrency(item.vatAmount)}
                  </td>
                  <td style={styles.tableCellCenter}>
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <div style={styles.totals}>
            <div style={styles.totalRow}>
              <span>الإجمالي الفرعي:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>خصم:</span>
              <span style={styles.textRed}>{formatCurrency(discount)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>الضريبة القيمة المضافة:</span>
              <span>{formatCurrency(totalVAT)}</span>
            </div>
            <div style={{ ...styles.totalRow, ...styles.grandTotal }}>
              <span>المبلغ المستحق:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div style={styles.paymentInfo}>
            <div style={styles.paymentRow}>
              <div style={styles.paymentLabel}>طريقة الدفع:</div>
              <div style={styles.paymentValue}>{paymentMethodAr}</div>
            </div>
            <div style={styles.paymentRow}>
              <div style={styles.paymentLabel}>الحساب البنكي:</div>
              <div style={styles.paymentValue}>{bankInfo.iban}</div>
            </div>
            <div style={styles.paymentRow}>
              <div style={styles.paymentLabel}>اسم البنك:</div>
              <div style={styles.paymentValue}>{bankInfo.bankNameAr}</div>
            </div>
            <div style={styles.paymentRow}>
              <div style={styles.paymentLabel}>اسم المستفيد:</div>
              <div style={styles.paymentValue}>{company.nameAr}</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div style={styles.notes}>
          <div style={styles.notesTitle}>ملاحظات:</div>
          <ul style={styles.notesContent}>
            <li>جميع المبالغ بعملة الريال السعودي (SAR)</li>
            <li>
              الضريبة المضافة 15% حسب لوائح الهيئة العامة للزكاة والضريبة
              والجمارك
            </li>
            <li>الدفع خلال 30 يوم من تاريخ الفاتورة</li>
            <li>فواتير غير مدفوعة تخضع لرسوم تأخير 2% شهريًا</li>
            <li>يرجى إرفاق رقم الفاتورة عند التحويل البنكي</li>
            {notesAr && <li>{notesAr}</li>}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.qrContainer}>
          <div style={styles.qrCode}>
            <QRCodePlaceholder value={generateQRData()} size={100} />
          </div>
          <div style={styles.qrTitle}>رمز الاستجابة السريعة</div>
        </div>

        <div style={styles.signature}>
          <div style={styles.signatureLabel}>توقيع المورد/المفوض</div>
          <div style={styles.signatureLine}></div>
          <div>ختم الشركة</div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Styles with Modern Design
const styles = {
  invoiceContainer: {
    width: "210mm",
    minHeight: "297mm",
    background: "white",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    borderRadius: "8px",
    overflow: "hidden",
    position: "relative",
    margin: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "120px",
    opacity: 0.03,
    fontWeight: "800",
    color: "#2c3e50",
    pointerEvents: "none",
    zIndex: 0,
    whiteSpace: "nowrap",
  },
  header: {
    background: "linear-gradient(to right, #2e5bff, #8c54ff)",
    color: "white",
    padding: "25px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "5px",
  },
  companyAddress: {
    fontSize: "14px",
    opacity: 0.9,
  },
  invoiceTitle: {
    textAlign: "center",
  },
  arabicTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "5px",
    margin: 0,
  },
  englishTitle: {
    fontSize: "18px",
    fontWeight: "500",
    opacity: 0.9,
    margin: 0,
  },
  invoiceMeta: {
    flex: 1,
    textAlign: "right",
  },
  metaItem: {
    marginBottom: "8px",
    display: "flex",
    justifyContent: "flex-end",
  },
  metaLabel: {
    fontWeight: "600",
    minWidth: "120px",
  },
  metaValue: {
    minWidth: "150px",
  },
  badges: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    justifyContent: "flex-end",
  },
  badge: {
    background: "rgba(255, 255, 255, 0.2)",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  content: {
    padding: "30px 40px",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2e5bff",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "2px solid #e0e7ff",
    display: "flex",
    alignItems: "center",
  },
  customerDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  detailItem: {
    marginBottom: "12px",
    display: "flex",
  },
  detailLabel: {
    fontWeight: "600",
    minWidth: "130px",
    color: "#4a5568",
  },
  detailValue: {
    color: "#2d3748",
  },
  itemsTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    background: "#f8f9ff",
    padding: "15px 12px",
    textAlign: "center",
    fontWeight: "600",
    color: "#2d3748",
    border: "1px solid #e0e7ff",
  },
  tableCell: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #e0e7ff",
  },
  tableCellCenter: {
    padding: "12px",
    textAlign: "center",
    border: "1px solid #e0e7ff",
  },
  dualHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  headerAr: {
    fontWeight: "700",
  },
  headerEn: {
    fontWeight: "500",
    color: "#718096",
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    marginTop: "30px",
  },
  totals: {
    background: "#f8f9ff",
    borderRadius: "8px",
    padding: "20px",
    border: "1px solid #e0e7ff",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px dashed #e0e7ff",
  },
  grandTotal: {
    fontWeight: "700",
    fontSize: "18px",
    color: "#2e5bff",
    borderBottom: "none",
  },
  textRed: {
    color: "#e53e3e",
  },
  paymentInfo: {
    background: "#f8f9ff",
    borderRadius: "8px",
    padding: "20px",
    border: "1px solid #e0e7ff",
  },
  paymentRow: {
    marginBottom: "15px",
  },
  paymentLabel: {
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "5px",
  },
  paymentValue: {
    color: "#2d3748",
  },
  notes: {
    background: "#f8f9ff",
    borderRadius: "8px",
    padding: "20px",
    border: "1px solid #e0e7ff",
    marginTop: "20px",
  },
  notesTitle: {
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "10px",
  },
  notesContent: {
    color: "#4a5568",
    lineHeight: "1.6",
    paddingRight: "20px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "30px 40px",
    background: "#f8f9ff",
    borderTop: "1px solid #e0e7ff",
  },
  qrContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  qrCode: {
    width: "120px",
    height: "120px",
    background: "white",
    border: "1px solid #e0e7ff",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  qrTitle: {
    fontWeight: "600",
    color: "#4a5568",
  },
  signature: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  signatureLabel: {
    fontWeight: "600",
    color: "#4a5568",
  },
  signatureLine: {
    width: "250px",
    height: "1px",
    background: "#cbd5e0",
    marginTop: "10px",
  },
};

export default ZATCAInvoice;
