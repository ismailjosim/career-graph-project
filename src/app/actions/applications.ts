"use server";

import { connectDB } from "@/lib/db";
import { JobApplication } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";
import type { JobApplication as IJobApplication } from "@/lib/validation";

export interface GetApplicationsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  employmentType?: string;
  sortBy?: "appliedAt" | "fitScore" | "company" | "jobTitle";
  sortOrder?: "asc" | "desc";
}

export interface ApplicationsPaginationMeta {
  total: number;
  totalAll: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedApplicationsResult {
  success: boolean;
  applications: IJobApplication[];
  pagination: ApplicationsPaginationMeta;
  error?: string;
}

export async function getPaginatedApplicationsAction(
  params: GetApplicationsParams = {},
): Promise<PaginatedApplicationsResult> {
  try {
    const user = await getSessionUser();
    if (!user?.id) {
      return {
        success: false,
        applications: [],
        pagination: {
          total: 0,
          totalAll: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
        error: "Unauthorized",
      };
    }

    await connectDB();

    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { userId: user.id };

    // Search filter across jobTitle, company, location, and notes
    if (params.search?.trim()) {
      const searchRegex = { $regex: params.search.trim(), $options: "i" };
      query.$or = [
        { jobTitle: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
        { notes: searchRegex },
      ];
    }

    // Status filter
    if (params.status && params.status !== "all") {
      query.status = params.status;
    }

    // Employment type filter
    if (params.employmentType && params.employmentType !== "all") {
      query.employmentType = params.employmentType;
    }

    // Sorting
    const sortField = params.sortBy || "appliedAt";
    const sortDirection = params.sortOrder === "asc" ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };

    // Run parallel queries for data and counts
    const [rawApplications, totalFiltered, totalAll] = await Promise.all([
      JobApplication.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      JobApplication.countDocuments(query),
      JobApplication.countDocuments({ userId: user.id }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));

    // Convert MongoDB documents to serializable plain JSON objects
    const applications: IJobApplication[] = JSON.parse(
      JSON.stringify(rawApplications),
    );

    return {
      success: true,
      applications,
      pagination: {
        total: totalFiltered,
        totalAll,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error in getPaginatedApplicationsAction:", error);
    return {
      success: false,
      applications: [],
      pagination: {
        total: 0,
        totalAll: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      error:
        error instanceof Error ? error.message : "Failed to fetch applications",
    };
  }
}

export async function deleteApplicationAction(id: string) {
  try {
    const user = await getSessionUser();
    if (!user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const deleted = await JobApplication.findOneAndDelete({
      _id: id,
      userId: user.id,
    });

    if (!deleted) {
      return { success: false, error: "Application not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteApplicationAction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete application",
    };
  }
}
