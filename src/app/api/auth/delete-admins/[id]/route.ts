import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { getToken } from "next-auth/jwt";
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Get the session token and verify authentication
        const token = await getToken({ req: request });
        if (!token) {
            return new NextResponse("Unauthorized - Please login", { status: 401 });
        }
        await connectToMongoDB();
        // Get admin to be deleted
        const adminToDelete = await Admin.findById(params.id);
        if (!adminToDelete) {
            return new NextResponse("Admin not found", { status: 404 });
        }
        // Delete the admin
        await Admin.findByIdAndDelete(params.id);
        return new NextResponse(
            JSON.stringify({ message: "Admin deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting admin:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}