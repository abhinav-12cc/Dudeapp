import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

// Create a custom mutation in Convex that we'll use
const customApi = {
  deleteUser: "deleteUser" as const,
};

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    console.log(`API route: Attempting to delete user ${userId}`);

    // Call the deleteUser mutation
    await convex.mutation(api.users.deleteUser, { id: userId as Id<"users"> });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        error: "Failed to delete user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
