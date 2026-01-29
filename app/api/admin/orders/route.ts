import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReceivedEmail, sendOrderShippedEmail, sendTrackingUpdateEmail } from '@/lib/emails';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to create notification
async function createNotification(userId: string, type: string, title: string, message: string, orderId: string) {
  try {
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        order_id: orderId,
        link: '/account/orders',
        read: false
      });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, updates, sendEmail, trackingUpdate } = await request.json();

    if (!orderId || !updates) {
      return NextResponse.json({ error: 'Missing orderId or updates' }, { status: 400 });
    }

    // Get current order first
    const { data: currentOrder } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    // Update the order
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send emails and notifications based on status change
    if (currentOrder && data) {
      const orderShortId = orderId.slice(0, 8).toUpperCase();
      const customerName = currentOrder.shipping_info?.fullName || 'Customer';
      const customerEmail = currentOrder.user_email;
      const userId = currentOrder.user_id;

      // Payment Received
      if (updates.status === 'payment_received' && currentOrder.status !== 'payment_received') {
        // Send email
        if (customerEmail) {
          await sendPaymentReceivedEmail({
            customerName,
            customerEmail,
            orderId,
            orderTotal: currentOrder.total,
            usdtAmount: currentOrder.usdt_amount,
            items: currentOrder.items || []
          });
        }

        // Create notification
        if (userId) {
          await createNotification(
            userId,
            'payment',
            'Payment Received',
            `Your payment for order #${orderShortId} has been confirmed. We're now preparing your order.`,
            orderId
          );
        }
      }

      // Order Shipped
      if (updates.status === 'shipped' && currentOrder.status !== 'shipped') {
        if (customerEmail) {
          await sendOrderShippedEmail({
            customerName,
            customerEmail,
            orderId,
            orderTotal: currentOrder.total,
            usdtAmount: currentOrder.usdt_amount,
            items: currentOrder.items || [],
            trackingNumber: updates.tracking_number || currentOrder.tracking_number,
            shippingAddress: currentOrder.shipping_info ? {
              address: currentOrder.shipping_info.address,
              city: currentOrder.shipping_info.city,
              state: currentOrder.shipping_info.state,
              country: currentOrder.shipping_info.country,
              zipCode: currentOrder.shipping_info.zipCode
            } : undefined
          });
        }

        if (userId) {
          await createNotification(
            userId,
            'shipping',
            'Order Shipped!',
            `Great news! Your order #${orderShortId} has been shipped and is on its way.`,
            orderId
          );
        }
      }

      // Tracking Update Added
      if (trackingUpdate && userId) {
        // Send tracking update email
        if (customerEmail && sendEmail !== false) {
          await sendTrackingUpdateEmail({
            customerName,
            customerEmail,
            orderId,
            orderTotal: currentOrder.total,
            usdtAmount: currentOrder.usdt_amount,
            items: currentOrder.items || [],
            trackingStatus: trackingUpdate.label,
            trackingLocation: trackingUpdate.location,
            trackingDescription: trackingUpdate.description
          });
        }

        await createNotification(
          userId,
          'tracking',
          'Shipping Update',
          `${trackingUpdate.label} - ${trackingUpdate.location}`,
          orderId
        );
      }

      // Order Delivered/Completed
      if ((updates.status === 'completed' || updates.status === 'delivered') && 
          currentOrder.status !== 'completed' && currentOrder.status !== 'delivered') {
        if (userId) {
          await createNotification(
            userId,
            'delivery',
            'Order Delivered!',
            `Your order #${orderShortId} has been delivered. Thank you for shopping with Luxero!`,
            orderId
          );
        }
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
