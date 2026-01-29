import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'Luxero <noreply@luxerowatches.com>';

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  orderTotal: number;
  usdtAmount: string;
  items: Array<{
    name: string;
    brand: string;
    price: number;
    image?: string;
  }>;
  trackingNumber?: string;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

// Payment Received Email with Receipt
export async function sendPaymentReceivedEmail(data: OrderEmailData) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #333;">
        <strong style="color: #fff;">${item.name}</strong><br/>
        <span style="color: #888; font-size: 12px;">${item.brand}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right; color: #D4AF37;">
        $${(item.price / 100).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #D4AF37; font-size: 28px; margin: 0; letter-spacing: 2px;">LUXERO</h1>
          <p style="color: #888; font-size: 12px; margin-top: 5px;">LUXURY TIMEPIECES</p>
        </div>

        <!-- Main Content -->
        <div style="background-color: #111; border: 1px solid #333; padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background-color: #22c55e; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #fff; font-size: 30px;">✓</span>
            </div>
            <h2 style="color: #fff; margin: 0 0 10px;">Payment Received</h2>
            <p style="color: #888; margin: 0;">Thank you for your payment, ${data.customerName}!</p>
          </div>

          <!-- Order Info -->
          <div style="background-color: #0a0a0a; padding: 20px; margin-bottom: 20px;">
            <p style="color: #888; margin: 0 0 5px; font-size: 12px;">ORDER NUMBER</p>
            <p style="color: #D4AF37; margin: 0; font-size: 18px; font-family: monospace;">#${data.orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          <!-- Receipt -->
          <h3 style="color: #D4AF37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 30px 0 15px; border-bottom: 1px solid #333; padding-bottom: 10px;">
            📋 Receipt
          </h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
              <td style="padding: 15px 12px; color: #fff; font-weight: bold;">Total</td>
              <td style="padding: 15px 12px; text-align: right; color: #D4AF37; font-size: 20px; font-weight: bold;">
                $${(data.orderTotal / 100).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td style="padding: 5px 12px; color: #888; font-size: 12px;">Paid in USDT</td>
              <td style="padding: 5px 12px; text-align: right; color: #888; font-size: 12px;">
                ${data.usdtAmount} USDT
              </td>
            </tr>
          </table>

          <!-- What's Next -->
          <div style="background-color: #D4AF37; padding: 20px; margin-top: 30px;">
            <h3 style="color: #000; margin: 0 0 10px; font-size: 14px;">What happens next?</h3>
            <p style="color: #000; margin: 0; font-size: 13px; line-height: 1.6;">
              Our team will now process and authenticate your timepiece. You'll receive another email once your order has been shipped with tracking information.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #888; font-size: 12px; margin: 0 0 10px;">
            Questions? Contact us at support@luxerowatches.com
          </p>
          <p style="color: #555; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} Luxero. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: `✅ Payment Received - Order #${data.orderId.slice(0, 8).toUpperCase()}`,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send payment email:', error);
    return { success: false, error };
  }
}

// Order Shipped Email
export async function sendOrderShippedEmail(data: OrderEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #D4AF37; font-size: 28px; margin: 0; letter-spacing: 2px;">LUXERO</h1>
          <p style="color: #888; font-size: 12px; margin-top: 5px;">LUXURY TIMEPIECES</p>
        </div>

        <!-- Main Content -->
        <div style="background-color: #111; border: 1px solid #333; padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background-color: #06b6d4; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #fff; font-size: 30px;">🚚</span>
            </div>
            <h2 style="color: #fff; margin: 0 0 10px;">Your Order Has Shipped!</h2>
            <p style="color: #888; margin: 0;">Great news, ${data.customerName}! Your order is on its way.</p>
          </div>

          <!-- Order Info -->
          <div style="background-color: #0a0a0a; padding: 20px; margin-bottom: 20px;">
            <p style="color: #888; margin: 0 0 5px; font-size: 12px;">ORDER NUMBER</p>
            <p style="color: #D4AF37; margin: 0 0 15px; font-size: 18px; font-family: monospace;">#${data.orderId.slice(0, 8).toUpperCase()}</p>
            
            ${data.trackingNumber ? `
              <p style="color: #888; margin: 0 0 5px; font-size: 12px;">TRACKING NUMBER</p>
              <p style="color: #06b6d4; margin: 0; font-size: 16px; font-family: monospace;">${data.trackingNumber}</p>
            ` : ''}
          </div>

          <!-- Shipping Address -->
          ${data.shippingAddress ? `
            <h3 style="color: #D4AF37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 30px 0 15px;">
              📍 Shipping To
            </h3>
            <div style="background-color: #0a0a0a; padding: 15px;">
              <p style="color: #fff; margin: 0; line-height: 1.6;">
                ${data.customerName}<br/>
                ${data.shippingAddress.address}<br/>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br/>
                ${data.shippingAddress.country}
              </p>
            </div>
          ` : ''}

          <!-- Track Button -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://luxerowatches.com/account/orders" 
               style="display: inline-block; background-color: #D4AF37; color: #000; padding: 15px 40px; text-decoration: none; font-weight: bold; font-size: 14px;">
              TRACK YOUR ORDER →
            </a>
          </div>

          <!-- Info Box -->
          <div style="background-color: #06b6d4; background-color: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); padding: 15px; margin-top: 30px;">
            <p style="color: #06b6d4; margin: 0; font-size: 13px; line-height: 1.6;">
              💡 Track your shipment in real-time by visiting your account or using the tracking number above.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #888; font-size: 12px; margin: 0 0 10px;">
            Questions? Contact us at support@luxerowatches.com
          </p>
          <p style="color: #555; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} Luxero. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: `🚚 Your Order Has Shipped - #${data.orderId.slice(0, 8).toUpperCase()}`,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send shipping email:', error);
    return { success: false, error };
  }
}

// Tracking Update Email
export async function sendTrackingUpdateEmail(data: OrderEmailData & { trackingStatus: string; trackingLocation: string; trackingDescription: string }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #D4AF37; font-size: 28px; margin: 0; letter-spacing: 2px;">LUXERO</h1>
          <p style="color: #888; font-size: 12px; margin-top: 5px;">LUXURY TIMEPIECES</p>
        </div>

        <!-- Main Content -->
        <div style="background-color: #111; border: 1px solid #333; padding: 30px;">
          <h2 style="color: #fff; margin: 0 0 20px; text-align: center;">📦 Shipping Update</h2>
          
          <div style="background-color: #06b6d4; background-color: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); padding: 20px; margin-bottom: 20px;">
            <p style="color: #06b6d4; margin: 0 0 5px; font-size: 14px; font-weight: bold;">${data.trackingStatus}</p>
            <p style="color: #fff; margin: 0 0 5px;">📍 ${data.trackingLocation}</p>
            <p style="color: #888; margin: 0; font-size: 13px;">${data.trackingDescription}</p>
          </div>

          <div style="background-color: #0a0a0a; padding: 15px;">
            <p style="color: #888; margin: 0 0 5px; font-size: 12px;">ORDER NUMBER</p>
            <p style="color: #D4AF37; margin: 0; font-family: monospace;">#${data.orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="https://luxerowatches.com/account/orders" 
               style="display: inline-block; background-color: #D4AF37; color: #000; padding: 12px 30px; text-decoration: none; font-weight: bold; font-size: 13px;">
              VIEW FULL TRACKING →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #555; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} Luxero. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: `📦 Shipping Update - Order #${data.orderId.slice(0, 8).toUpperCase()}`,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send tracking update email:', error);
    return { success: false, error };
  }
}
