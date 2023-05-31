type Branded<T, U extends string> = T & { [key in U]: never };

export type Name = Branded<string, 'Name'>;
