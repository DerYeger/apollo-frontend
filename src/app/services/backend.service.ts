import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ModelCheckerRequest } from '../model/api/api.model-checker-request';
import { ModelCheckerResponse } from '../model/api/api.model-checker-response';
import { FOLGraph } from '../model/domain/fol.graph';
import { Language } from '../store/state';

const host = environment.backendUrl;

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private readonly http: HttpClient, private translate: TranslateService) {}

  public checkModel(graph: FOLGraph, formula: string): Promise<ModelCheckerResponse> {
    const request: ModelCheckerRequest = {
      formula,
      graph,
      language: this.translate.currentLang === 'de' ? 'de' : 'en',
    };
    return this.http.post<ModelCheckerResponse>(host + '/modelchecker', request).toPromise();
  }
}
