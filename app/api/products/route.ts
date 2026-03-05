import { productInsertSchema } from "@/schemes/products.schema";
import { createProduct, getProducts } from "@/services/products.service";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ result: products }, { status: 200 })
  } catch (e: unknown) {
    console.log("error:", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const formParseResult = productInsertSchema.parse(body);

    const newProduct = await createProduct(formParseResult);

    if (!newProduct) {
      console.log("product creation failed");
      return NextResponse.json({ error: "product creation failed" }, { status: 500 });
    }

    return NextResponse.json({ result: "product created successfully" }, { status: 200 });
  } catch (e: unknown) {
    // TODO: ApiResponseHandler from previous project ?

    console.log("error:", e);
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e }, { status: 400 });
    } else {
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
}
