/**
 * Terminates an event by preventing its default action and stopping propagation.
 *
 * @param event The event to be terminated.
 */
export function terminate(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
}
