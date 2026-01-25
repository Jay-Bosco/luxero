/**
 * Escrow Service
 * 
 * Handles the escrow payment flow:
 * 1. Buyer places order → payment held in escrow
 * 2. Seller ships item → tracking provided
 * 3. Buyer receives item → confirms delivery
 * 4. Funds released to seller
 * 
 * Dispute flow:
 * - Buyer can dispute within X days of delivery
 * - Admin reviews and decides outcome
 * - Funds released or refunded accordingly
 */

import { createAdminClient } from './supabase/server';
import { Order, EscrowStatus } from '@/types';

// Configuration
const ESCROW_CONFIG = {
  // Days after delivery before auto-release
  AUTO_RELEASE_DAYS: 7,
  // Days buyer has to dispute after delivery
  DISPUTE_WINDOW_DAYS: 14,
  // Platform fee percentage (if applicable)
  PLATFORM_FEE_PERCENT: 0,
};

export interface EscrowResult {
  success: boolean;
  escrowId?: string;
  error?: string;
}

export interface PaymentIntent {
  clientSecret: string;
  escrowId: string;
  amount: number;
}

/**
 * Create a new escrow transaction for an order
 * This would integrate with your payment provider (Stripe, etc.)
 */
export async function createEscrowPayment(
  orderId: string,
  amount: number,
  currency: string = 'USD'
): Promise<PaymentIntent> {
  const supabase = createAdminClient();
  
  // Generate escrow reference
  const escrowId = `ESC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // TODO: Integrate with actual payment provider
  // Example with Stripe:
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount,
  //   currency,
  //   capture_method: 'manual', // Don't capture immediately - hold funds
  //   metadata: { orderId, escrowId }
  // });
  
  // Record escrow transaction
  await supabase.from('escrow_transactions').insert({
    order_id: orderId,
    type: 'fund',
    amount,
    currency,
    status: 'pending',
    provider_reference: escrowId,
    metadata: { created_by: 'system' }
  });
  
  // Update order with escrow ID
  await supabase
    .from('orders')
    .update({ 
      escrow_id: escrowId,
      escrow_status: 'pending'
    })
    .eq('id', orderId);
  
  return {
    clientSecret: 'mock_client_secret', // Replace with actual payment intent
    escrowId,
    amount
  };
}

/**
 * Mark escrow as funded (payment received and held)
 * Called after successful payment
 */
export async function fundEscrow(orderId: string): Promise<EscrowResult> {
  const supabase = createAdminClient();
  
  try {
    // Update order status
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        escrow_status: 'funded'
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    // Record transaction
    const { data: order } = await supabase
      .from('orders')
      .select('total, currency, escrow_id')
      .eq('id', orderId)
      .single();
    
    await supabase.from('escrow_transactions').insert({
      order_id: orderId,
      type: 'fund',
      amount: order.total,
      currency: order.currency,
      status: 'completed',
      provider_reference: order.escrow_id
    });
    
    return { success: true, escrowId: order.escrow_id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Mark order as shipped
 * Seller provides tracking information
 */
export async function markAsShipped(
  orderId: string,
  trackingNumber: string,
  trackingUrl?: string
): Promise<EscrowResult> {
  const supabase = createAdminClient();
  
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'shipped',
        tracking_number: trackingNumber,
        tracking_url: trackingUrl
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    // TODO: Send notification to buyer
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Mark order as delivered
 * Can be triggered by tracking update or manual confirmation
 */
export async function markAsDelivered(orderId: string): Promise<EscrowResult> {
  const supabase = createAdminClient();
  
  try {
    // Calculate auto-release date
    const autoReleaseDate = new Date();
    autoReleaseDate.setDate(autoReleaseDate.getDate() + ESCROW_CONFIG.AUTO_RELEASE_DAYS);
    
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'delivered',
        escrow_release_date: autoReleaseDate.toISOString()
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    // TODO: Send notification to buyer to confirm receipt
    // TODO: Schedule auto-release job
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Buyer confirms receipt - release funds to seller
 */
export async function confirmDeliveryAndRelease(orderId: string): Promise<EscrowResult> {
  const supabase = createAdminClient();
  
  try {
    // Get order details
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (fetchError || !order) throw fetchError || new Error('Order not found');
    
    // Verify order is in correct state
    if (order.escrow_status !== 'funded') {
      throw new Error('Escrow is not in funded state');
    }
    
    // TODO: Release funds via payment provider
    // Example with Stripe:
    // await stripe.paymentIntents.capture(order.stripe_payment_intent_id);
    
    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        escrow_status: 'released'
      })
      .eq('id', orderId);
    
    if (updateError) throw updateError;
    
    // Record release transaction
    await supabase.from('escrow_transactions').insert({
      order_id: orderId,
      type: 'release',
      amount: order.total,
      currency: order.currency,
      status: 'completed',
      provider_reference: order.escrow_id
    });
    
    // TODO: Send confirmation to both parties
    
    return { success: true, escrowId: order.escrow_id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Buyer raises a dispute
 */
export async function raiseDispute(
  orderId: string,
  reason: string,
  userId: string
): Promise<EscrowResult> {
  const supabase = createAdminClient();
  
  try {
    // Update order status
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'disputed',
        escrow_status: 'disputed',
        notes: reason
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    // Record in history
    await supabase.from('order_status_history').insert({
      order_id: orderId,
      previous_status: 'delivered',
      new_status: 'disputed',
      changed_by: userId,
      reason
    });
    
    // TODO: Notify admin for review
    // TODO: Send confirmation to buyer
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Process refund (admin action or dispute resolution)
 */
export async function processRefund(
  orderId: string,
  reason: string
): Promise<EscrowResult> {
  const supabase = createAdminClient();
  
  try {
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (!order) throw new Error('Order not found');
    
    // TODO: Process refund via payment provider
    // await stripe.refunds.create({ payment_intent: order.stripe_payment_intent_id });
    
    // Update order
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'refunded',
        escrow_status: 'refunded',
        notes: reason
      })
      .eq('id', orderId);
    
    if (error) throw error;
    
    // Record refund transaction
    await supabase.from('escrow_transactions').insert({
      order_id: orderId,
      type: 'refund',
      amount: order.total,
      currency: order.currency,
      status: 'completed',
      provider_reference: order.escrow_id,
      metadata: { reason }
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Get escrow status for an order
 */
export async function getEscrowStatus(orderId: string) {
  const supabase = createAdminClient();
  
  const { data: order } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      escrow_status,
      escrow_id,
      escrow_release_date,
      total,
      currency
    `)
    .eq('id', orderId)
    .single();
  
  const { data: transactions } = await supabase
    .from('escrow_transactions')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });
  
  return {
    order,
    transactions,
    canRelease: order?.status === 'delivered' && order?.escrow_status === 'funded',
    canDispute: order?.status === 'delivered' && order?.escrow_status === 'funded',
    autoReleaseDate: order?.escrow_release_date
  };
}
