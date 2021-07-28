import copy from 'fast-copy';

import { Assignment } from 'src/app/model/api/assignment';

/**
 * Collection of assignments, associated by their ids.
 */
export interface AssignmentCollection {
  [key: string]: Assignment;
}

/**
 * Adds an assignment to the specified collection.
 *
 * @param state The target collection.
 * @param assignment The assignment to be added.
 */
export function setAssignment(state: AssignmentCollection, assignment: Assignment): AssignmentCollection {
  const newState = copy(state);
  newState[assignment.id] = assignment;
  return newState;
}

/**
 * Removes an assignment from the specified collection.
 *
 * @param state The source collection.
 * @param key The name of the assignment to be removed.
 */
export function unsetAssignment(state: AssignmentCollection, key: string): AssignmentCollection {
  const newState = copy(state);
  delete newState[key];
  return newState;
}
