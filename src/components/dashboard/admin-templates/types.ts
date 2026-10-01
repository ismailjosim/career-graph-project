import type { TemplateFormData } from "./templateForm.constants";

export interface StatsSummary {
  total: number;
  active: number;
  pro: number;
  free: number;
}

export interface AdminTemplateItem extends TemplateFormData {
  _id: string;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  totalTemplates: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
