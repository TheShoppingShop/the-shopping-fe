export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string;
  amazonLink: string;
  tags: string[];
  categoryId: string;
  isPublished: boolean;
  createdAt: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface VideosParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
}
