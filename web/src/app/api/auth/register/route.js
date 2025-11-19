import sql from "@/app/api/utils/sql";
import argon2 from "argon2";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return Response.json(
        { error: "Please provide name, email, and password" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create user
    const newUser = await sql`
      INSERT INTO users (name, email, password, is_admin)
      VALUES (${name}, ${email}, ${hashedPassword}, false)
      RETURNING id, name, email, is_admin
    `;

    const user = newUser[0];

    // Generate JWT token (simple implementation)
    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      }),
    ).toString("base64");

    return Response.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Failed to register user" }, { status: 500 });
  }
}
