import sql from "@/app/api/utils/sql";

// GET all products with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";

    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];
    let paramCount = 0;

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND LOWER(name) LIKE LOWER($${paramCount})`;
      params.push(`%${search}%`);
    }

    // Add category filter
    if (category && category !== "all") {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    // Add sorting
    if (sort === "price-asc") {
      query += " ORDER BY price ASC";
    } else if (sort === "price-desc") {
      query += " ORDER BY price DESC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    const products = await sql(query, params);

    return Response.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    return Response.json({ error: "Failed to get products" }, { status: 500 });
  }
}

// POST new product (admin only)
export async function POST(request) {
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

    // Check if admin
    if (!decoded.isAdmin) {
      return Response.json(
        { error: "Not authorized - Admin access required" },
        { status: 403 },
      );
    }

    const { name, description, price, image, category, countInStock } =
      await request.json();

    // Validate input
    if (!name || !description || !price || !image || !category) {
      return Response.json(
        { error: "Please provide all required fields" },
        { status: 400 },
      );
    }

    // Create product
    const newProduct = await sql`
      INSERT INTO products (name, description, price, image, category, count_in_stock)
      VALUES (${name}, ${description}, ${price}, ${image}, ${category}, ${countInStock || 0})
      RETURNING *
    `;

    return Response.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
