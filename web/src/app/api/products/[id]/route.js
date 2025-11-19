import sql from "@/app/api/utils/sql";

// GET single product
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const products = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    if (products.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(products[0]);
  } catch (error) {
    console.error("Get product error:", error);
    return Response.json({ error: "Failed to get product" }, { status: 500 });
  }
}

// PUT update product (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params;

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

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(name);
    }
    if (description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(description);
    }
    if (price !== undefined) {
      paramCount++;
      updates.push(`price = $${paramCount}`);
      values.push(price);
    }
    if (image !== undefined) {
      paramCount++;
      updates.push(`image = $${paramCount}`);
      values.push(image);
    }
    if (category !== undefined) {
      paramCount++;
      updates.push(`category = $${paramCount}`);
      values.push(category);
    }
    if (countInStock !== undefined) {
      paramCount++;
      updates.push(`count_in_stock = $${paramCount}`);
      values.push(countInStock);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    values.push(id);

    const query = `
      UPDATE products
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const updatedProduct = await sql(query, values);

    if (updatedProduct.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(updatedProduct[0]);
  } catch (error) {
    console.error("Update product error:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE product (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

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

    const deletedProduct = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
