import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Feedback, ModelCheckerRequest } from '../model/api/model-checker-request';
import { ModelCheckerResponse } from '../model/api/model-checker-response';
import { FOLGraph } from '../model/domain/fol.graph';

const host = environment.backendUrl;

/**
 * Service for communication with the backend.
 */
@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public constructor(private readonly http: HttpClient, private translate: TranslateService) {}

  /**
   * Request the execution of the ModelChecking algorithm for the given graph, formula and feedback.
   *
   * @param graph The graph of the request.
   * @param formula The formula of the request.
   * @param feedback The selected feedback of the request.
   */
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
