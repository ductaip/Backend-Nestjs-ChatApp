// fcm.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import serviceAccount from '../../serviceAccountKey.json';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    }
  }

  async sendNotification(token: string, title: string, body: string) {
    const message = {
      data: {
        title,
        body,
      },
      token,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
