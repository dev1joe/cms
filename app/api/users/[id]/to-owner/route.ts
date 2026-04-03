import { ResourceNotFoundError } from "@/lib/errors";
import { ApiResponseHandler } from "@/lib/http/ApiResponseHandler";
import { convertToOwner } from "@/services/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await convertToOwner(id);
    if (result.rowCount !== null && result.rowCount < 1) {
      throw new ResourceNotFoundError();
    }

    return NextResponse.json(
      ApiResponseHandler.success("user type converted to owner successfully"),
      { status: 200 }
    );

  } catch (e: unknown) {
    console.error(e);

    if (e instanceof ResourceNotFoundError) {
      return NextResponse.json(
        ApiResponseHandler.error("User not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      ApiResponseHandler.error("error converting user type to owner"),
      { status: 500 }
    )
  }
}
