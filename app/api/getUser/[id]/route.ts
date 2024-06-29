import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import { getUserByclerkId } from "@/lib/actions/user.actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const userId = params.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is missing" },
        { status: 400 }
      );
    }
    const user = await getUserByclerkId(userId);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user by Clerk ID:", error);
    return NextResponse.json(
      { message: "Failed to fetch user by Clerk ID" },
      { status: 500 }
    );
  }
}
