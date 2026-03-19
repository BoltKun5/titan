export type BaseEntity<T> = Omit<T, 'createdAt' | 'deletedAt' | 'updatedAt'>;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
