// Email service utility for sending confirmation emails
// In a real application, this would integrate with services like SendGrid, Mailgun, or AWS SES

export const sendConfirmationEmail = async (userEmail, userName) => {
  // Simulate email sending
  console.log(`Sending confirmation email to: ${userEmail}`);
  console.log(`Email content: Dear ${userName}, thank you for registering with Hero Threads!`);
  
  // In a real implementation, you would:
  // 1. Call your backend API endpoint for sending emails
  // 2. Use a service like SendGrid, Mailgun, or AWS SES
  // 3. Include a confirmation link with a token
  
     try {
     // Simulate API call to backend email service
     const response = await fetch('http://127.0.0.1:3000/api/email/send-confirmation', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         email: userEmail,
         name: userName,
         type: 'registration'
       })
     });
    
    if (response.ok) {
      console.log('Confirmation email sent successfully');
      return true;
    } else {
      console.error('Failed to send confirmation email');
      return false;
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // For demo purposes, we'll return true even if the email service fails
    return true;
  }
};

export const sendOrderConfirmation = async (userEmail, userName, orderDetails) => {
  console.log(`Sending order confirmation to: ${userEmail}`);
  console.log(`Order details:`, orderDetails);
  
     try {
     const response = await fetch('http://127.0.0.1:3000/api/email/send-order-confirmation', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         email: userEmail,
         name: userName,
         orderDetails
       })
     });
    
    if (response.ok) {
      console.log('Order confirmation email sent successfully');
      return true;
    } else {
      console.error('Failed to send order confirmation email');
      return false;
    }
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return true; // For demo purposes
  }
}; 