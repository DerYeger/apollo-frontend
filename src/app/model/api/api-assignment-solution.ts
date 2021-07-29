import { FOLGraph } from 'src/app/model/domain/fol.graph';

export interface ApiAssignmentSolution {
  assignmentId: string;
  firstGraph: FOLGraph;
  secondGraph: FOLGraph;
}
