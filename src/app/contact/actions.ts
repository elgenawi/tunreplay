'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BEARER_TOKEN = process.env.NEXT_BEARER_TOKEN;


interface ReportData {
  email: string;
  type: string;
  msg: string;
  token: string;
}

export async function submitReport(data: ReportData) {
  try {
    // Verify turnstile token first
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: data.token,
      }),
    });

    const turnstileData = await turnstileResponse.json();
    if (!turnstileData.success) {
      throw new Error('فشل التحقق من الكابتشا');
    }

    // Submit the report
    const response = await fetch(`${API_URL}/items/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`
      },
      body: JSON.stringify({
        email: data.email,
        type: data.type,
        msg: data.msg
      })
    });

    if (!response.ok) {
      throw new Error('فشل في إرسال التقرير');
    }

    return { success: true };
  } catch (error) {
    console.error('Submit error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال التقرير'
    };
  }
} 