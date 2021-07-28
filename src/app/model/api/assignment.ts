export interface Assignment {
  id: string;
  title: string;
  formula: string;
  description?: string;
  completedOn?: number;
}

export const exampleAssignment: Assignment = {
  id: 'example-assignment',
  title: 'Example',
  formula: '∀x. ∃y. x ≐ y',
};
