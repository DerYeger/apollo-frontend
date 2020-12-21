import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FOLGraph } from '../model/domain/fol.graph';

const host = environment.backendUrl;

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private readonly http: HttpClient) {}

  public checkModel(graph: FOLGraph, formula: string): Promise<boolean> {
    return this.http
      .post<boolean>(host + '/modelchecker', { graph, formula })
      .toPromise();
  }
}
