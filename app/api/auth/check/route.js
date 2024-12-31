import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = 'votre_secret_jwt_super_securise'; // Utiliser la même clé que dans l'endpoint de login

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Vérifier le token
    verify(token.value, JWT_SECRET);

    return new Response(JSON.stringify({ message: 'Authentifié' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Token invalide' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
