export interface Video {
  id: number;
  title: string;
  slug: string;
  description: string;
  amazonLink: string;
  tags: string[];
  categoryId: string;
  isPublished: boolean;
  createdAt: string;
  views: number;
  likes: number;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface VideosParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
}
