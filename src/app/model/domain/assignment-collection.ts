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
  const oldAssignment = state[assignment.id];
  const newState = copy(state);
  newState[assignment.id] = { ...assignment, ...oldAssignment };
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

export function completeAssignment(state: AssignmentCollection, key: string): AssignmentCollection {
  const assignment = state[key];
  if (assignment === undefined) {
    return state;
  }
  const newState = copy(state);
  const newAssignment = copy(assignment);
  newAssignment.completedOn = Date.now();
  newState[key] = newAssignment;
  return newState;
}
