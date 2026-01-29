import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'Luxero <noreply@luxero.com>';

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to Luxero - Your Journey Begins',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #111111; border: 1px solid #333;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #c9a227;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 300; color: #c9a227; letter-spacing: 4px;">
                LUXERO
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 300; color: #ffffff;">
                Welcome, ${name}
              </h2>
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.7; color: #a0a0a0;">
                Thank you for joining Luxero. You've just taken the first step into a world of exceptional timepieces and unparalleled craftsmanship.
              </p>
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.7; color: #a0a0a0;">
                As a valued member, you'll enjoy:
              </p>
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #a0a0a0; font-size: 15px; line-height: 2;">
                <li>Exclusive access to new arrivals</li>
                <li>Personalized recommendations</li>
                <li>Priority customer support</li>
                <li>Special member-only offers</li>
              </ul>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'}/watches" 
                       style="display: inline-block; padding: 16px 40px; background-color: #c9a227; color: #0a0a0a; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">
                      EXPLORE COLLECTION
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; border-top: 1px solid #333;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #666; text-align: center;">
                © ${new Date().getFullYear()} Luxero. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
                Questions? Contact us at luxerowatches01@gmail.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendVerificationEmail(to: string, name: string, verificationLink: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Verify Your Luxero Account',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #111111; border: 1px solid #333;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #c9a227;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 300; color: #c9a227; letter-spacing: 4px;">
                LUXERO
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 300; color: #ffffff;">
                Verify Your Email
              </h2>
              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.7; color: #a0a0a0;">
                Hello ${name},
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.7; color: #a0a0a0;">
                Please verify your email address to complete your Luxero account registration and gain access to our exclusive collection.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${verificationLink}" 
                       style="display: inline-block; padding: 16px 40px; background-color: #c9a227; color: #0a0a0a; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">
                      VERIFY EMAIL
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; font-size: 14px; color: #666;">
                This link will expire in 24 hours. If you didn't create an account with Luxero, please ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; border-top: 1px solid #333;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #666; text-align: center;">
                © ${new Date().getFullYear()} Luxero. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(
  to: string, 
  name: string, 
  orderId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #333; color: #a0a0a0;">
        ${item.name} × ${item.quantity}
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #333; color: #ffffff; text-align: right;">
        $${(item.price / 100).toLocaleString()}
      </td>
    </tr>
  `).join('');

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Order Confirmed - ${orderId.slice(0, 8)}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #111111; border: 1px solid #333;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #c9a227;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 300; color: #c9a227; letter-spacing: 4px;">
                LUXERO
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 300; color: #ffffff;">
                Order Confirmed
              </h2>
              <p style="margin: 0 0 10px; font-size: 16px; color: #a0a0a0;">
                Thank you, ${name}!
              </p>
              <p style="margin: 0 0 30px; font-size: 14px; color: #666;">
                Order ID: ${orderId}
              </p>
              
              <!-- Order Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding-bottom: 15px; border-bottom: 1px solid #c9a227; color: #c9a227; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
                    Item
                  </td>
                  <td style="padding-bottom: 15px; border-bottom: 1px solid #c9a227; color: #c9a227; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; text-align: right;">
                    Price
                  </td>
                </tr>
                ${itemsHtml}
                <tr>
                  <td style="padding-top: 20px; color: #ffffff; font-weight: 600;">
                    Total
                  </td>
                  <td style="padding-top: 20px; color: #c9a227; font-size: 20px; text-align: right;">
                    $${(total / 100).toLocaleString()}
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; font-size: 14px; color: #666;">
                We'll send you another email when your order ships.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; border-top: 1px solid #333;">
              <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
                © ${new Date().getFullYear()} Luxero. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}
