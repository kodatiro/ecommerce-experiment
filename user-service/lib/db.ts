import { sql } from '@vercel/postgres';

// Initialize database tables
export async function initUserDb() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create addresses table
    await sql`
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('User database tables initialized');
  } catch (error) {
    console.error('Error initializing user database:', error);
    throw error;
  }
}

// User operations
export async function createUser(email: string, passwordHash: string, name: string) {
  const { rows } = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${passwordHash}, ${name})
    RETURNING id, email, name, created_at
  `;
  return rows[0];
}

export async function getUserByEmail(email: string) {
  const { rows } = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return rows[0];
}

export async function getUserById(id: string) {
  const { rows } = await sql`
    SELECT id, email, name, created_at FROM users WHERE id = ${id}
  `;
  return rows[0];
}

export async function updateUser(id: string, updates: { name?: string; email?: string }) {
  const fields = [];
  const values = [];

  if (updates.name !== undefined) {
    fields.push('name');
    values.push(updates.name);
  }
  if (updates.email !== undefined) {
    fields.push('email');
    values.push(updates.email);
  }

  if (fields.length === 0) return null;

  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
  const { rows } = await sql.query(
    `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, email, name, created_at`,
    [...values, id]
  );
  return rows[0];
}

// Address operations
export async function getAddressesByUserId(userId: string) {
  const { rows } = await sql`
    SELECT * FROM addresses WHERE user_id = ${userId} ORDER BY created_at DESC
  `;
  return rows;
}

export async function createAddress(
  userId: string,
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
) {
  const { rows } = await sql`
    INSERT INTO addresses (user_id, street, city, state, zip, country)
    VALUES (${userId}, ${address.street}, ${address.city}, ${address.state}, ${address.zip}, ${address.country})
    RETURNING *
  `;
  return rows[0];
}

export async function deleteAddress(id: string, userId: string) {
  await sql`DELETE FROM addresses WHERE id = ${id} AND user_id = ${userId}`;
  return { success: true };
}
