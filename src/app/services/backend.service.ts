import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ModelCheckerRequest } from '../model/api/api.model-checker-request';
import { ModelCheckerTrace } from '../model/api/model-checker-trace';
import { FOLGraph } from '../model/domain/fol.graph';

const host = environment.backendUrl;

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private readonly http: HttpClient, private translate: TranslateService) {}

  public checkModel(graph: FOLGraph, formula: string): Promise<ModelCheckerTrace> {
    const request: ModelCheckerRequest = {
      formula,
      graph,
      language: this.translate.currentLang === 'de' ? 'de' : 'en',
    };
    return this.http.post<ModelCheckerTrace>(host + '/modelchecker', request).toPromise();
  }
}
