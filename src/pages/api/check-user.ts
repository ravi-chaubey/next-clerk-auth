import { isExistingUser } from '@/services/userService';

export const config = {
  runtime: "edge",
};

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();
    const userExists = await isExistingUser(phoneNumber);

    return new Response(JSON.stringify({ exists: userExists }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in check-user API:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export default async function handler(req: Request) {
  if (req.method === 'POST') {
    return POST(req);
  }
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 405,
  });
}