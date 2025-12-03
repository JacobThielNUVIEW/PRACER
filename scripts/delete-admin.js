#!/usr/bin/env node
// scripts/delete-admin.js
// Usage: ADMIN_EMAIL=admin@example.com SUPABASE_SERVICE_ROLE_KEY=<key> NEXT_PUBLIC_SUPABASE_URL=<url> node scripts/delete-admin.js

let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch;
} else {
  fetch = require('node-fetch');
}

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  if (!email) {
    console.error('Usage: node scripts/delete-admin.js <email>\nOr set ADMIN_EMAIL env var.');
    process.exit(1);
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
    process.exit(1);
  }

  try {
    // 1) Get user by email via Supabase Admin endpoint
  const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!listRes.ok) {
      const txt = await listRes.text();
      console.error('Failed to list users:', listRes.status, txt);
      process.exit(1);
    }

    const users = await listRes.json();
    if (!Array.isArray(users) || users.length === 0) {
      console.log(`No users found for email: ${email}`);
      return;
    }

    const userId = users[0].id;
    console.log('Found user:', userId);

    // 2) Delete user via Supabase Admin endpoint
  const deleteRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!deleteRes.ok) {
      const txt = await deleteRes.text();
      console.error('Failed to delete user:', deleteRes.status, txt);
      process.exit(1);
    }

    console.log(`User ${email} (${userId}) deleted.`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
