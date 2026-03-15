export interface SpringDataPageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

/**
 * Standard PagedModel structure introduced in Spring Data 3.3.
 */
export interface SpringDataPagedModel<T> {
  content: T[];
  page: SpringDataPageMetadata;
}
