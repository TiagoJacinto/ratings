export interface IdTracker {
  moveToNextId(name: string): Promise<number>;
}
