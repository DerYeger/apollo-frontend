'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">gramoFO</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-26ee5241ebf9ebfad1877dac048c9e02"' : 'data-target="#xs-components-links-module-AppModule-26ee5241ebf9ebfad1877dac048c9e02"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-26ee5241ebf9ebfad1877dac048c9e02"' :
                                            'id="xs-components-links-module-AppModule-26ee5241ebf9ebfad1877dac048c9e02"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExportGraphBottomSheet.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExportGraphBottomSheet</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeedbackSelectionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FeedbackSelectionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FormulaSyntaxDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FormulaSyntaxDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GraphEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GraphEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GraphImportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GraphImportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GraphListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GraphListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HttpProgressDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HttpProgressDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LinkFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LinkFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelCheckerPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModelCheckerPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NodeFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NodeFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultTreeDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResultTreeDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SaveGraphDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SaveGraphDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SymbolEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SymbolEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TraceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TraceComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/D3Graph.html" data-type="entity-link">D3Graph</a>
                            </li>
                            <li class="link">
                                <a href="classes/GramoFOLink.html" data-type="entity-link">GramoFOLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/GramoFONode.html" data-type="entity-link">GramoFONode</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BackendService.html" data-type="entity-link">BackendService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SnackBarService.html" data-type="entity-link">SnackBarService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/D3Link.html" data-type="entity-link">D3Link</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/D3Node.html" data-type="entity-link">D3Node</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeedbackOption.html" data-type="entity-link">FeedbackOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlatTraceNode.html" data-type="entity-link">FlatTraceNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FOLEdge.html" data-type="entity-link">FOLEdge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FOLEntity.html" data-type="entity-link">FOLEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FOLGraph.html" data-type="entity-link">FOLGraph</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FOLNode.html" data-type="entity-link">FOLNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GramofoRoute.html" data-type="entity-link">GramofoRoute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphCollection.html" data-type="entity-link">GraphCollection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphConfiguration.html" data-type="entity-link">GraphConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphSettings.html" data-type="entity-link">GraphSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModelCheckerRequest.html" data-type="entity-link">ModelCheckerRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModelCheckerResponse.html" data-type="entity-link">ModelCheckerResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModelCheckerTrace.html" data-type="entity-link">ModelCheckerTrace</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Settings.html" data-type="entity-link">Settings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/State.html" data-type="entity-link">State</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SymbolEditorConfiguration.html" data-type="entity-link">SymbolEditorConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TranslationDTO.html" data-type="entity-link">TranslationDTO</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});