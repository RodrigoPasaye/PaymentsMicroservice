import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {

  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {

    const { currency, items } = paymentSessionDto;

    const lineItems = items.map( item => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name
          },
          unit_amount: Math.round(item.price * 100), //Equivale a 20 dolares, los dos primeros digitos de la derecha equivalen a los decimales            
        },
        quantity: item.quantity
      }
    });
    
    const session = await this.stripe.checkout.sessions.create({
      //Colocar el ID de la orden
      payment_intent_data: {
        metadata: {}
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel',
    });

    return session;
  }

  async stripeWebhook() {
    return '';
  }
}
