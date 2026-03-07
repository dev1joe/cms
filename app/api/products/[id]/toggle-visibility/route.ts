import { ResourceNotFoundError } from "@/lib/errors";
import { toggleVisiblity } from "@/services/products.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("product id received:", id);

    const result = await toggleVisiblity(parseInt(id));
    console.log("update result", result);

    if (result.rowCount != null && result.rowCount < 1) {
      throw new ResourceNotFoundError()
    }

    return NextResponse.json({ message: "product updated successfuly" }, { status: 200 })
  } catch (e: unknown) {
    console.error("error:", e);

    if (e instanceof ResourceNotFoundError) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "error toggling visiblity" }, { status: 500 })
  }
}
