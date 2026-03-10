import { ResourceNotFoundError } from "@/lib/errors";
import { ApiResponseHandler } from "@/lib/http/ApiResponseHandler";
import { productUpdateSchema } from "@/schemes/products.schema";
import { deleteProduct, updateProduct } from "@/services/products.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parseResult = productUpdateSchema.parse(body);

    const { userId, ...data } = parseResult;
    const updateResult = await updateProduct(parseInt(id), data);
    console.log("updte result:", updateResult);

    if (updateResult.rowCount && updateResult.rowCount < 1) {
      throw new ResourceNotFoundError("Product not found");
    }

    return NextResponse.json(
      ApiResponseHandler.success("Product updated successfully"),
      { status: 200 }
    );
  } catch (e) {
    console.log("error:", e);

    if (e instanceof ResourceNotFoundError) {
      return NextResponse.json(
        ApiResponseHandler.error("Product not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      ApiResponseHandler.error("Product deleted successfully"),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleteResult = await deleteProduct(parseInt(id));
    console.log("detele result: ", deleteResult);

    if (deleteResult.rowCount && deleteResult.rowCount < 1) {
      throw new ResourceNotFoundError("Product not found");
    }

    return NextResponse.json(
      ApiResponseHandler.success("Product deleted successfully"),
      { status: 200 }
    );
  } catch (e: unknown) {
    console.log("error:", e);

    if (e instanceof ResourceNotFoundError) {
      return NextResponse.json(
        ApiResponseHandler.error("Product not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      ApiResponseHandler.error("Product deleted successfully"),
      { status: 500 }
    );
  }
}
