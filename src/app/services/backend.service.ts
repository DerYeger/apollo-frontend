import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Feedback, ModelCheckerRequest } from '../model/api/model-checker-request';
import { ModelCheckerResponse } from '../model/api/model-checker-response';
import { FOLGraph } from '../model/domain/fol.graph';

const host = environment.backendUrl;

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public constructor(private readonly http: HttpClient, private translate: TranslateService) {}

  public checkModel(graph: FOLGraph, formula: string, feedback: Feedback): Observable<HttpEvent<ModelCheckerResponse>> {
    const request: ModelCheckerRequest = {
      formula,
      graph,
      language: this.translate.currentLang === 'de' ? 'de' : 'en',
      feedback,
    };
    return this.http.post(host + '/modelchecker', request, { reportProgress: true, observe: 'events' }) as Observable<HttpEvent<ModelCheckerResponse>>;
  }
}
