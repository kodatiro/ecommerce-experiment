import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if user exists
    const existingUser = Array.from(dataStore.users.values()).find(
      user => user.email === body.email
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const id = `user-${Date.now()}`;
    const newUser = {
      id,
      email: body.email,
      password: body.password,
      name: body.name,
      created_at: new Date().toISOString(),
    };

    dataStore.users.set(id, newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// GET /api/users?email=xxx - Get user by email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = Array.from(dataStore.users.values()).find(
      user => user.email === email
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
