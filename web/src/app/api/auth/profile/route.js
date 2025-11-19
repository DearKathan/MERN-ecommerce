import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Decode and verify token
    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(token, "base64").toString());
    } catch (e) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check expiration
    if (decoded.exp && Date.now() > decoded.exp) {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }

    // Get user from database
    const users = await sql`
      SELECT id, name, email, is_admin
      FROM users
      WHERE id = ${decoded.userId}
    `;

    if (users.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    return Response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return Response.json({ error: "Failed to get profile" }, { status: 500 });
  }
}
