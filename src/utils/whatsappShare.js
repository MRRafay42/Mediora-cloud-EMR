// src/utils/whatsappShare.js

/**
 * Share PDF directly via WhatsApp Web API
 * This creates a shareable link that opens WhatsApp with the message
 */
export const shareInvoiceViaWhatsApp = async (invoiceId, patientPhone, patientName) => {
  try {
    const token = localStorage.getItem('token');
    
    // Fetch the PDF
    const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    
    // Create a temporary download link for the PDF
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoiceId}.pdf`;
    
    // Download the PDF first (this is required for mobile sharing)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Format phone number (remove all non-numeric characters)
    const cleanPhone = patientPhone.replace(/[^0-9]/g, '');
    
    // Create WhatsApp message
    const message = `Hello ${patientName},\n\nYour medical invoice has been generated.\n\n📄 *Invoice Details:*\nPlease check the PDF file that has been downloaded.\n\nThank you for visiting our clinic!\n\n_This is an automated message from our clinic management system._`;
    
    // WhatsApp Web URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new window
    window.open(whatsappUrl, '_blank');
    
    // Show instructions to user
    setTimeout(() => {
      alert('✅ PDF downloaded!\n\n📱 WhatsApp is opening...\n\nPlease attach the downloaded PDF file to your WhatsApp message.');
    }, 500);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error sharing via WhatsApp:', error);
    alert('Failed to share via WhatsApp. Please try downloading the PDF manually.');
  }
};

/**
 * Share Prescription via WhatsApp
 */
export const sharePrescriptionViaWhatsApp = async (prescriptionId, patientPhone, patientName) => {
  try {
    const token = localStorage.getItem('token');
    
    // Fetch the PDF
    const response = await fetch(`/api/prescriptions/${prescriptionId}/pdf`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    
    // Create a temporary download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription-${prescriptionId}.pdf`;
    
    // Download the PDF
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Format phone number
    const cleanPhone = patientPhone.replace(/[^0-9]/g, '');
    
    // Create WhatsApp message
    const message = `Hello ${patientName},\n\n💊 *Your Medical Prescription*\n\nYour prescription has been prepared by our doctor.\n\n📋 Important:\n• Please follow the dosage instructions carefully\n• Complete the full course of medication\n• Contact us if you have any questions\n\nThe prescription PDF has been downloaded to your device. Please attach it to this chat.\n\nGet well soon! 🌟\n\n_This is an automated message from our clinic._`;
    
    // WhatsApp Web URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show instructions
    setTimeout(() => {
      alert('✅ Prescription PDF downloaded!\n\n📱 WhatsApp is opening...\n\nPlease attach the downloaded PDF file to your WhatsApp message.');
    }, 500);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error sharing prescription via WhatsApp:', error);
    alert('Failed to share via WhatsApp. Please try downloading the PDF manually.');
  }
};

/**
 * Alternative: Share using Web Share API (for mobile devices)
 * This works on mobile browsers and allows native sharing
 */
export const shareViaNativeShare = async (pdfBlob, fileName, text) => {
  try {
    // Check if Web Share API is supported
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }

    // Create a File from the blob
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    // Check if files can be shared
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Medical Document',
        text: text,
      });
      
      return true;
    } else {
      throw new Error('File sharing not supported');
    }
  } catch (error) {
    console.error('Native share error:', error);
    return false;
  }
};

/**
 * Smart share function that tries native share first, then falls back to WhatsApp
 */
export const smartShareInvoice = async (invoiceId, patientPhone, patientName, invoiceNumber, totalAmount) => {
  try {
    const token = localStorage.getItem('token');
    
    // Fetch the PDF
    const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    const fileName = `Invoice_${invoiceNumber}.pdf`;
    const shareText = `Medical Invoice ${invoiceNumber} - PKR ${totalAmount}`;
    
    // Try native share first (works on mobile)
    const nativeShareSuccess = await shareViaNativeShare(blob, fileName, shareText);
    
    if (!nativeShareSuccess) {
      // Fallback to WhatsApp Web share
      await shareInvoiceViaWhatsApp(invoiceId, patientPhone, patientName);
    }
    
  } catch (error) {
    console.error('Smart share error:', error);
    alert('Failed to share. Please try downloading the PDF manually.');
  }
};

/**
 * Enhanced WhatsApp Business API sharing (requires WhatsApp Business API setup)
 * This is for future implementation if you set up WhatsApp Business API
 */
export const shareViaWhatsAppBusinessAPI = async (phoneNumber, pdfBase64, message) => {
  // This would require a backend endpoint that connects to WhatsApp Business API
  // For now, this is a placeholder for future enhancement
  
  try {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        phone: phoneNumber,
        message: message,
        pdfData: pdfBase64,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send via WhatsApp Business API');
    }

    return await response.json();
  } catch (error) {
    console.error('WhatsApp Business API error:', error);
    throw error;
  }
};