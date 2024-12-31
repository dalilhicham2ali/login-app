import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, orderBy, limit } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, address, phone } = await request.json();
    
    // Vérifier si l'email existe déjà
    const usersRef = collection(db, 'users');
    const emailQuery = query(usersRef, where('email', '==', email));
    const emailQuerySnapshot = await getDocs(emailQuery);
    
    if (!emailQuerySnapshot.empty) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
    }

    // Trouver le dernier ID numérique utilisé
    const lastUserQuery = query(usersRef, orderBy('numericId', 'desc'), limit(1));
    const lastUserSnapshot = await getDocs(lastUserQuery);
    
    let nextNumericId = 1; // ID par défaut si aucun utilisateur n'existe
    
    if (!lastUserSnapshot.empty) {
      const lastUser = lastUserSnapshot.docs[0].data();
      nextNumericId = (lastUser.numericId || 0) + 1;
    }

    // Créer un ID de document formaté (par exemple: USER_0001)
    const documentId = `USER_${String(nextNumericId).padStart(4, '0')}`;

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer le nouvel utilisateur avec un ID spécifique
    const userDoc = doc(db, 'users', documentId);
    await setDoc(userDoc, {
      numericId: nextNumericId,
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      address: address || '',
      phone: phone || '',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true,
      message: 'Inscription réussie',
      userId: documentId
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'inscription' 
    }, { 
      status: 500 
    });
  }
}