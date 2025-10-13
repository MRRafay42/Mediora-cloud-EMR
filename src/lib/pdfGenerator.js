// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

// export async function generateInvoicePDF(invoice, doctor) {
//   const doc = new jsPDF();
  
//   // Header - Clinic Info
//   doc.setFontSize(22);
//   doc.setFont(undefined, 'bold');
//   doc.text(doctor.clinic_name || 'Medical Clinic', 20, 20);
  
//   doc.setFontSize(10);
//   doc.setFont(undefined, 'normal');
//   doc.text(doctor.full_name, 20, 30);
//   doc.text(doctor.specialization || '', 20, 35);
//   doc.text(doctor.email, 20, 40);
//   if (doctor.phone_number) doc.text(doctor.phone_number, 20, 45);
//   if (doctor.clinic_address) doc.text(doctor.clinic_address, 20, 50);

//   // Invoice Title
//   doc.setFontSize(20);
//   doc.setFont(undefined, 'bold');
//   doc.text('INVOICE', 150, 20);
  
//   doc.setFontSize(10);
//   doc.setFont(undefined, 'normal');
//   doc.text(`Invoice #: ${invoice.invoice_number}`, 150, 30);
//   doc.text(`Date: ${new Date(invoice.invoice_date).toLocaleDateString()}`, 150, 35);
//   doc.text(`Status: ${invoice.payment_status.toUpperCase()}`, 150, 40);

//   // Line separator
//   doc.line(20, 60, 190, 60);

//   // Patient Info
//   doc.setFontSize(12);
//   doc.setFont(undefined, 'bold');
//   doc.text('Bill To:', 20, 70);
  
//   doc.setFontSize(10);
//   doc.setFont(undefined, 'normal');
//   doc.text(invoice.patient.full_name, 20, 77);
//   doc.text(`Age: ${invoice.patient.age || 'N/A'}`, 20, 82);
//   doc.text(`Gender: ${invoice.patient.gender || 'N/A'}`, 20, 87);
//   if (invoice.patient.phone_number) {
//     doc.text(`Phone: ${invoice.patient.phone_number}`, 20, 92);
//   }

//   // Items Table
//   const tableData = invoice.items.map(item => [
//     item.item_name,
//     item.quantity.toString(),
//     `PKR ${item.unit_price.toFixed(2)}`,
//     `PKR ${item.total_price.toFixed(2)}`
//   ]);

//   doc.autoTable({
//     startY: 105,
//     head: [['Item', 'Qty', 'Unit Price', 'Total']],
//     body: tableData,
//     theme: 'grid',
//     headStyles: { fillColor: [66, 139, 202] },
//     margin: { left: 20, right: 20 }
//   });

//   // Totals
//   const finalY = doc.lastAutoTable.finalY + 10;
//   const subtotal = invoice.subtotal || invoice.items.reduce((sum, item) => sum + item.total_price, 0);
  
//   doc.setFontSize(10);
//   doc.text('Subtotal:', 130, finalY);
//   doc.text(`PKR ${subtotal.toFixed(2)}`, 170, finalY, { align: 'right' });

//   if (invoice.tax_amount > 0) {
//     doc.text('Tax:', 130, finalY + 5);
//     doc.text(`PKR ${invoice.tax_amount.toFixed(2)}`, 170, finalY + 5, { align: 'right' });
//   }

//   if (invoice.discount_amount > 0) {
//     doc.text('Discount:', 130, finalY + 10);
//     doc.text(`-PKR ${invoice.discount_amount.toFixed(2)}`, 170, finalY + 10, { align: 'right' });
//   }

//   doc.setFont(undefined, 'bold');
//   doc.setFontSize(12);
//   const totalY = invoice.tax_amount > 0 || invoice.discount_amount > 0 ? finalY + 15 : finalY + 5;
//   doc.text('Total:', 130, totalY);
//   doc.text(`PKR ${invoice.total_amount.toFixed(2)}`, 170, totalY, { align: 'right' });

//   // Payment Method
//   doc.setFont(undefined, 'normal');
//   doc.setFontSize(10);
//   doc.text(`Payment Method: ${invoice.payment_method.toUpperCase()}`, 20, totalY + 10);

//   // Notes
//   if (invoice.notes) {
//     doc.setFont(undefined, 'bold');
//     doc.text('Notes:', 20, totalY + 20);
//     doc.setFont(undefined, 'normal');
//     const splitNotes = doc.splitTextToSize(invoice.notes, 170);
//     doc.text(splitNotes, 20, totalY + 25);
//   }

//   // Footer
//   doc.setFontSize(8);
//   doc.text('Thank you for your visit!', 105, 280, { align: 'center' });

//   return doc.output('arraybuffer');
// }

// export async function generatePrescriptionPDF(prescription, doctor) {
//   const doc = new jsPDF();
  
//   // Header - Clinic Info
//   doc.setFontSize(22);
//   doc.setFont(undefined, 'bold');
//   doc.text(doctor.clinic_name || 'Medical Clinic', 20, 20);
  
//   doc.setFontSize(10);
//   doc.setFont(undefined, 'normal');
//   doc.text(`Dr. ${doctor.full_name}`, 20, 30);
//   doc.text(doctor.specialization || 'General Physician', 20, 35);
//   doc.text(doctor.email, 20, 40);
//   if (doctor.phone_number) doc.text(doctor.phone_number, 20, 45);
//   if (doctor.clinic_address) doc.text(doctor.clinic_address, 20, 50);
//   if (doctor.license_number) doc.text(`License: ${doctor.license_number}`, 20, 55);

//   // Rx Symbol and Title
//   doc.setFontSize(28);
//   doc.setFont(undefined, 'bold');
//   doc.text('℞', 175, 20);
  
//   doc.setFontSize(16);
//   doc.text('PRESCRIPTION', 145, 30);
  
//   doc.setFontSize(10);
//   doc.setFont(undefined, 'normal');
//   doc.text(`Date: ${new Date(prescription.prescription_date).toLocaleDateString()}`, 145, 37);

//   // Line separator
//   doc.line(20, 65, 190, 65);

//   // Patient Info
//   doc.setFontSize(12);
//   doc.setFont(undefined, 'bold');
//   doc.text('Patient Information:', 20, 75);
  
//   doc.setFontSize(10);
//   doc.setFont(undefined, 'normal');
//   doc.text(`Name: ${prescription.patient.full_name}`, 20, 82);
//   doc.text(`Age: ${prescription.patient.age || 'N/A'}`, 90, 82);
//   doc.text(`Gender: ${prescription.patient.gender || 'N/A'}`, 140, 82);

//   let yPos = 92;

//   // Diagnosis
//   if (prescription.diagnosis) {
//     doc.setFont(undefined, 'bold');
//     doc.text('Diagnosis:', 20, yPos);
//     yPos += 5;
//     doc.setFont(undefined, 'normal');
//     const diagnosisSplit = doc.splitTextToSize(prescription.diagnosis, 170);
//     doc.text(diagnosisSplit, 20, yPos);
//     yPos += diagnosisSplit.length * 5 + 5;
//   }

//   // Symptoms
//   if (prescription.symptoms) {
//     doc.setFont(undefined, 'bold');
//     doc.text('Symptoms:', 20, yPos);
//     yPos += 5;
//     doc.setFont(undefined, 'normal');
//     const symptomsSplit = doc.splitTextToSize(prescription.symptoms, 170);
//     doc.text(symptomsSplit, 20, yPos);
//     yPos += symptomsSplit.length * 5 + 5;
//   }

//   // Vital Signs
//   if (prescription.vital_signs) {
//     doc.setFont(undefined, 'bold');
//     doc.text('Vital Signs:', 20, yPos);
//     yPos += 5;
//     doc.setFont(undefined, 'normal');
//     const vitalsSplit = doc.splitTextToSize(prescription.vital_signs, 170);
//     doc.text(vitalsSplit, 20, yPos);
//     yPos += vitalsSplit.length * 5 + 5;
//   }

//   // Medicines Section
//   yPos += 5;
//   doc.setFontSize(14);
//   doc.setFont(undefined, 'bold');
//   doc.text('Prescription:', 20, yPos);
//   yPos += 10;

//   // List Medicines
//   doc.setFontSize(10);
//   prescription.items.forEach((item, index) => {
//     if (yPos > 260) {
//       doc.addPage();
//       yPos = 20;
//     }

//     doc.setFont(undefined, 'bold');
//     doc.text(`${index + 1}. ${item.medicine_name}`, 20, yPos);
//     yPos += 5;

//     doc.setFont(undefined, 'normal');
//     const details = [];
//     if (item.dosage) details.push(`Dosage: ${item.dosage}`);
//     if (item.frequency) details.push(`Frequency: ${item.frequency}`);
//     if (item.duration) details.push(`Duration: ${item.duration}`);
//     if (item.quantity) details.push(`Quantity: ${item.quantity}`);

//     doc.text(details.join(' | '), 25, yPos);
//     yPos += 5;

//     if (item.instructions) {
//       doc.setFont(undefined, 'italic');
//       const instrSplit = doc.splitTextToSize(`Instructions: ${item.instructions}`, 165);
//       doc.text(instrSplit, 25, yPos);
//       yPos += instrSplit.length * 5;
//     }

//     yPos += 5;
//   });

//   // Notes
//   if (prescription.notes) {
//     yPos += 5;
//     doc.setFont(undefined, 'bold');
//     doc.text('Additional Notes:', 20, yPos);
//     yPos += 5;
//     doc.setFont(undefined, 'normal');
//     const notesSplit = doc.splitTextToSize(prescription.notes, 170);
//     doc.text(notesSplit, 20, yPos);
//     yPos += notesSplit.length * 5 + 5;
//   }

//   // Follow-up
//   if (prescription.follow_up_date) {
//     yPos += 5;
//     doc.setFont(undefined, 'bold');
//     doc.text(`Follow-up Date: ${new Date(prescription.follow_up_date).toLocaleDateString()}`, 20, yPos);
//     yPos += 10;
//   }

//   // Signature Area
//   yPos = Math.max(yPos + 10, 240);
//   doc.line(130, yPos, 190, yPos);
//   doc.setFont(undefined, 'normal');
//   doc.setFontSize(10);
//   doc.text(`Dr. ${doctor.full_name}`, 160, yPos + 5, { align: 'center' });
//   if (doctor.specialization) {
//     doc.text(doctor.specialization, 160, yPos + 10, { align: 'center' });
//   }

//   // Footer
//   doc.setFontSize(8);
//   doc.setFont(undefined, 'italic');
//   doc.text('This is a computer-generated prescription. Please follow the instructions carefully.', 105, 285, { align: 'center' });

//   return doc.output('arraybuffer');
// }






// src/lib/pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper function to calculate age
const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Generate Invoice PDF
export async function generateInvoicePDF(invoice, doctor) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header - Clinic Info
  doc.setFillColor(37, 99, 235); // Blue
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('MEDICAL INVOICE', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(doctor.full_name || 'Medical Clinic', pageWidth / 2, 22, { align: 'center' });
  if (doctor.specialization) {
    doc.text(doctor.specialization, pageWidth / 2, 28, { align: 'center' });
  }
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Invoice Details Section
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Invoice #:', 14, 45);
  doc.setFont(undefined, 'normal');
  doc.text(invoice.invoice_number, 45, 45);
  
  doc.setFont(undefined, 'bold');
  doc.text('Date:', 14, 52);
  doc.setFont(undefined, 'normal');
  doc.text(new Date(invoice.invoice_date).toLocaleDateString(), 45, 52);
  
  doc.setFont(undefined, 'bold');
  doc.text('Status:', 14, 59);
  doc.setFont(undefined, 'normal');
  doc.text(invoice.payment_status.toUpperCase(), 45, 59);
  
  // Patient Details Box
  doc.setDrawColor(200);
  doc.setFillColor(249, 250, 251);
  doc.rect(14, 68, pageWidth - 28, 22, 'FD');
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('BILL TO:', 18, 75);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`${invoice.patient?.full_name || 'N/A'}`, 18, 81);
  if (invoice.patient?.phone) {
    doc.text(`Phone: ${invoice.patient.phone}`, 18, 86);
  }
  
  // Items Table
  const tableData = invoice.items?.map((item, index) => [
    (index + 1).toString(),
    item.item_name,
    item.quantity.toString(),
    `PKR ${parseFloat(item.unit_price).toFixed(2)}`,
    `PKR ${parseFloat(item.total_price).toFixed(2)}`,
  ]) || [];
  
  autoTable(doc, {
    startY: 98,
    head: [['#', 'Medicine', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 80 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  });
  
  // Calculate position for totals
  const finalY = doc.lastAutoTable.finalY + 10;
  const rightX = pageWidth - 14;
  
  // Totals Section
  doc.setFontSize(10);
  
  // Subtotal
  doc.setFont(undefined, 'normal');
  doc.text('Subtotal:', rightX - 50, finalY);
  doc.text(`PKR ${parseFloat(invoice.subtotal).toFixed(2)}`, rightX, finalY, { align: 'right' });
  
  let currentY = finalY;
  
  // Tax
  if (invoice.tax_amount > 0) {
    currentY += 6;
    doc.text('Tax:', rightX - 50, currentY);
    doc.text(`PKR ${parseFloat(invoice.tax_amount).toFixed(2)}`, rightX, currentY, { align: 'right' });
  }
  
  // Discount
  if (invoice.discount_amount > 0) {
    currentY += 6;
    doc.text('Discount:', rightX - 50, currentY);
    doc.text(`- PKR ${parseFloat(invoice.discount_amount).toFixed(2)}`, rightX, currentY, { align: 'right' });
  }
  
  // Total - Bold and larger
  currentY += 8;
  doc.setDrawColor(0);
  doc.line(rightX - 55, currentY - 2, rightX, currentY - 2);
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', rightX - 50, currentY + 3);
  doc.text(`PKR ${parseFloat(invoice.total_amount).toFixed(2)}`, rightX, currentY + 3, { align: 'right' });
  
  // Payment Method
  currentY += 12;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Payment Method: ${invoice.payment_method.toUpperCase()}`, 14, currentY);
  
  // Notes
  if (invoice.notes) {
    currentY += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Notes:', 14, currentY);
    doc.setFont(undefined, 'normal');
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 28);
    doc.text(splitNotes, 14, currentY + 5);
  }
  
  // Footer
  const footerY = doc.internal.pageSize.height - 20;
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('Thank you for your visit!', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, footerY + 4, { align: 'center' });
  
  if (doctor.phone) {
    doc.text(`Contact: ${doctor.phone}`, pageWidth / 2, footerY + 8, { align: 'center' });
  }
  
  return doc.output('arraybuffer');
}

// Generate Prescription PDF
export async function generatePrescriptionPDF(prescription, doctor) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header - Medical Prescription
  doc.setFillColor(16, 185, 129); // Green
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('℞ PRESCRIPTION', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(doctor.full_name || 'Doctor', pageWidth / 2, 27, { align: 'center' });
  
  if (doctor.specialization) {
    doc.setFontSize(10);
    doc.text(doctor.specialization, pageWidth / 2, 33, { align: 'center' });
  }
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Prescription Date
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Date:', 14, 50);
  doc.setFont(undefined, 'normal');
  doc.text(new Date(prescription.prescription_date).toLocaleDateString(), 32, 50);
  
  // Patient Details Box
  doc.setFillColor(240, 253, 244); // Light green
  doc.rect(14, 58, pageWidth - 28, 28, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.rect(14, 58, pageWidth - 28, 28);
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('PATIENT INFORMATION', 18, 65);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${prescription.patient?.full_name || 'N/A'}`, 18, 72);
  doc.text(`Age: ${calculateAge(prescription.patient?.date_of_birth)} years`, 18, 78);
  
  if (prescription.patient?.phone) {
    doc.text(`Phone: ${prescription.patient.phone}`, 120, 72);
  }
  if (prescription.patient?.blood_group) {
    doc.text(`Blood Group: ${prescription.patient.blood_group}`, 120, 78);
  }
  
  // Diagnosis & Symptoms
  let currentY = 94;
  
  if (prescription.diagnosis) {
    doc.setFont(undefined, 'bold');
    doc.text('Diagnosis:', 14, currentY);
    doc.setFont(undefined, 'normal');
    const diagnosisLines = doc.splitTextToSize(prescription.diagnosis, pageWidth - 60);
    doc.text(diagnosisLines, 42, currentY);
    currentY += diagnosisLines.length * 5 + 3;
  }
  
  if (prescription.symptoms) {
    doc.setFont(undefined, 'bold');
    doc.text('Symptoms:', 14, currentY);
    doc.setFont(undefined, 'normal');
    const symptomsLines = doc.splitTextToSize(prescription.symptoms, pageWidth - 60);
    doc.text(symptomsLines, 42, currentY);
    currentY += symptomsLines.length * 5 + 3;
  }
  
  // Vital Signs
  if (prescription.vital_signs) {
    doc.setFont(undefined, 'bold');
    doc.text('Vital Signs:', 14, currentY);
    doc.setFont(undefined, 'normal');
    
    const vitals = typeof prescription.vital_signs === 'string' 
      ? prescription.vital_signs 
      : JSON.stringify(prescription.vital_signs);
    const vitalLines = doc.splitTextToSize(vitals, pageWidth - 60);
    doc.text(vitalLines, 42, currentY);
    currentY += vitalLines.length * 5 + 5;
  }
  
  currentY += 3;
  
  // Medicines Section Header
  doc.setFillColor(16, 185, 129);
  doc.rect(14, currentY, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('PRESCRIBED MEDICINES', 18, currentY + 5.5);
  doc.setTextColor(0, 0, 0);
  
  currentY += 13;
  
  // Medicines List
  prescription.items?.forEach((item, index) => {
    // Check if we need a new page
    if (currentY > 245) {
      doc.addPage();
      currentY = 20;
    }
    
    // Medicine box
    doc.setDrawColor(200);
    doc.setFillColor(249, 250, 251);
    doc.rect(14, currentY, pageWidth - 28, 23, 'FD');
    
    // Medicine number badge
    doc.setFillColor(16, 185, 129);
    doc.circle(20, currentY + 4.5, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`${index + 1}`, 20, currentY + 5.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    
    // Medicine details
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(item.medicine_name, 26, currentY + 5.5);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Dosage: ${item.dosage}`, 26, currentY + 11);
    doc.text(`Frequency: ${item.frequency}`, 26, currentY + 15.5);
    doc.text(`Duration: ${item.duration}`, 26, currentY + 20);
    
    doc.text(`Qty: ${item.quantity}`, pageWidth - 30, currentY + 11);
    
    if (item.instructions) {
      doc.setFont(undefined, 'italic');
      const instrLines = doc.splitTextToSize(item.instructions, pageWidth - 65);
      doc.text(instrLines, 26, currentY + 20);
    }
    
    currentY += 28;
  });
  
  // Additional Notes
  if (prescription.notes) {
    currentY += 3;
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont(undefined, 'bold');
    doc.text('Additional Instructions:', 14, currentY);
    doc.setFont(undefined, 'normal');
    const notesLines = doc.splitTextToSize(prescription.notes, pageWidth - 28);
    doc.text(notesLines, 14, currentY + 5);
    currentY += notesLines.length * 5 + 8;
  }
  
  // Follow-up
  if (prescription.follow_up_date) {
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont(undefined, 'bold');
    doc.text('Follow-up Date:', 14, currentY);
    doc.setFont(undefined, 'normal');
    doc.text(new Date(prescription.follow_up_date).toLocaleDateString(), 52, currentY);
  }
  
  // Doctor's Signature Section
  const signatureY = doc.internal.pageSize.height - 35;
  doc.setDrawColor(0);
  doc.line(pageWidth - 65, signatureY, pageWidth - 14, signatureY);
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text(doctor.full_name || 'Doctor', pageWidth - 39.5, signatureY + 4, { align: 'center' });
  doc.setFont(undefined, 'normal');
  if (doctor.license_number) {
    doc.text(`License: ${doctor.license_number}`, pageWidth - 39.5, signatureY + 8, { align: 'center' });
  }
  
  // Footer
  const footerY = doc.internal.pageSize.height - 15;
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text('This is a computer-generated prescription', pageWidth / 2, footerY, { align: 'center' });
  if (doctor.phone) {
    doc.text(`Contact: ${doctor.phone}`, pageWidth / 2, footerY + 4, { align: 'center' });
  }
  
  return doc.output('arraybuffer');
}