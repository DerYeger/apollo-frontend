'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
customElements.define('compodoc-menu', /*#__PURE__*/function (_HTMLElement) {
  _inherits(_class, _HTMLElement);
  var _super = _createSuper(_class);
  function _class() {
    var _this;
    _classCallCheck(this, _class);
    _this = _super.call(this);
    _this.isNormalMode = _this.getAttribute('mode') === 'normal';
    return _this;
  }
  _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render(this.isNormalMode);
    }
  }, {
    key: "render",
    value: function render(isNormalMode) {
      var tp = lithtml.html("\n        <nav>\n            <ul class=\"list\">\n                <li class=\"title\">\n                    <a href=\"index.html\" data-type=\"index-link\">Apollo-Frontend</a>\n                </li>\n\n                <li class=\"divider\"></li>\n                ".concat(isNormalMode ? "<div id=\"book-search-input\" role=\"search\"><input type=\"text\" placeholder=\"Type to search\"></div>" : '', "\n                <li class=\"chapter\">\n                    <a data-type=\"chapter-link\" href=\"index.html\"><span class=\"icon ion-ios-home\"></span>Getting started</a>\n                    <ul class=\"links\">\n                        <li class=\"link\">\n                            <a href=\"overview.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-keypad\"></span>Overview\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"index.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>README\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"changelog.html\"  data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>CHANGELOG\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"license.html\"  data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>LICENSE\n                            </a>\n                        </li>\n                                <li class=\"link\">\n                                    <a href=\"dependencies.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-list\"></span>Dependencies\n                                    </a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"properties.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-apps\"></span>Properties\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class=\"chapter modules\">\n                        <a data-type=\"chapter-link\" href=\"modules.html\">\n                            <div class=\"menu-toggler linked\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"', ">\n                                <span class=\"icon ion-ios-archive\"></span>\n                                <span class=\"link-name\">Modules</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                        </a>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"', ">\n                            <li class=\"link\">\n                                <a href=\"modules/AppModule.html\" data-type=\"entity-link\" >AppModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#components-links-module-AppModule-55276d1eca96bdd721b29d124de061055374489942c7ec12e1dcb2fc09d2bba63e20433bf0bc1e4e9617d5f5bd255fa82778a16944e4cf2f39c4b3c47dd68714"' : 'data-target="#xs-components-links-module-AppModule-55276d1eca96bdd721b29d124de061055374489942c7ec12e1dcb2fc09d2bba63e20433bf0bc1e4e9617d5f5bd255fa82778a16944e4cf2f39c4b3c47dd68714"', ">\n                                            <span class=\"icon ion-md-cog\"></span>\n                                            <span>Components</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="components-links-module-AppModule-55276d1eca96bdd721b29d124de061055374489942c7ec12e1dcb2fc09d2bba63e20433bf0bc1e4e9617d5f5bd255fa82778a16944e4cf2f39c4b3c47dd68714"' : 'id="xs-components-links-module-AppModule-55276d1eca96bdd721b29d124de061055374489942c7ec12e1dcb2fc09d2bba63e20433bf0bc1e4e9617d5f5bd255fa82778a16944e4cf2f39c4b3c47dd68714"', ">\n                                            <li class=\"link\">\n                                                <a href=\"components/AppComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/AssignmentCardComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AssignmentCardComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/AssignmentPage.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AssignmentPage</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/AssignmentSolutionDialog.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AssignmentSolutionDialog</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/AssignmentsPage.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AssignmentsPage</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/DashboardPage.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >DashboardPage</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ExportGraphBottomSheet.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ExportGraphBottomSheet</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/FeedbackSelectionComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >FeedbackSelectionComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/FormulaSyntaxDialog.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >FormulaSyntaxDialog</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/GraphComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >GraphComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/GraphEditorComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >GraphEditorComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/GraphImportComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >GraphImportComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/GraphListComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >GraphListComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/HomePage.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >HomePage</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/HttpProgressDialog.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >HttpProgressDialog</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/LinkFormComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >LinkFormComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ModelCheckerPage.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ModelCheckerPage</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/NodeFormComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >NodeFormComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ResultTreeDialog.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ResultTreeDialog</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/SaveGraphDialog.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >SaveGraphDialog</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/SymbolEditorComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >SymbolEditorComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/TraceComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >TraceComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/UpdateAvailableDialog.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >UpdateAvailableDialog</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/AppRoutingModule.html\" data-type=\"entity-link\" >AppRoutingModule</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/MaterialModule.html\" data-type=\"entity-link\" >MaterialModule</a>\n                            </li>\n                </ul>\n                </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"', ">\n                            <span class=\"icon ion-ios-paper\"></span>\n                            <span>Classes</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"', ">\n                            <li class=\"link\">\n                                <a href=\"classes/ApolloLink.html\" data-type=\"entity-link\" >ApolloLink</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/ApolloNode.html\" data-type=\"entity-link\" >ApolloNode</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/D3Graph.html\" data-type=\"entity-link\" >D3Graph</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"', ">\n                                <span class=\"icon ion-md-arrow-round-down\"></span>\n                                <span>Injectables</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"injectables/BackendService.html\" data-type=\"entity-link\" >BackendService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/SnackBarService.html\" data-type=\"entity-link\" >SnackBarService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/UpdateService.html\" data-type=\"entity-link\" >UpdateService</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"', ">\n                            <span class=\"icon ion-md-information-circle-outline\"></span>\n                            <span>Interfaces</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"', ">\n                            <li class=\"link\">\n                                <a href=\"interfaces/ApiAssignmentSolution.html\" data-type=\"entity-link\" >ApiAssignmentSolution</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ApolloRoute.html\" data-type=\"entity-link\" >ApolloRoute</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Assignment.html\" data-type=\"entity-link\" >Assignment</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/AssignmentCheckResponse.html\" data-type=\"entity-link\" >AssignmentCheckResponse</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/AssignmentCollection.html\" data-type=\"entity-link\" >AssignmentCollection</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/D3Link.html\" data-type=\"entity-link\" >D3Link</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/D3Node.html\" data-type=\"entity-link\" >D3Node</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FeedbackOption.html\" data-type=\"entity-link\" >FeedbackOption</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FlatTraceNode.html\" data-type=\"entity-link\" >FlatTraceNode</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FOLEdge.html\" data-type=\"entity-link\" >FOLEdge</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FOLEntity.html\" data-type=\"entity-link\" >FOLEntity</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FOLGraph.html\" data-type=\"entity-link\" >FOLGraph</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FOLNode.html\" data-type=\"entity-link\" >FOLNode</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/GraphCollection.html\" data-type=\"entity-link\" >GraphCollection</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/GraphConfiguration.html\" data-type=\"entity-link\" >GraphConfiguration</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/GraphSettings.html\" data-type=\"entity-link\" >GraphSettings</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ModelCheckerRequest.html\" data-type=\"entity-link\" >ModelCheckerRequest</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ModelCheckerResponse.html\" data-type=\"entity-link\" >ModelCheckerResponse</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ModelCheckerTrace.html\" data-type=\"entity-link\" >ModelCheckerTrace</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Settings.html\" data-type=\"entity-link\" >Settings</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/State.html\" data-type=\"entity-link\" >State</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/SymbolEditorConfiguration.html\" data-type=\"entity-link\" >SymbolEditorConfiguration</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/TranslationDTO.html\" data-type=\"entity-link\" >TranslationDTO</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"', ">\n                            <span class=\"icon ion-ios-cube\"></span>\n                            <span>Miscellaneous</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"', ">\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/functions.html\" data-type=\"entity-link\">Functions</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/typealiases.html\" data-type=\"entity-link\">Type aliases</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/variables.html\" data-type=\"entity-link\">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"divider\"></li>\n                    <li class=\"copyright\">\n                        Documentation generated using <a href=\"https://compodoc.app/\" target=\"_blank\">\n                            <img data-src=\"images/compodoc-vectorise.png\" class=\"img-responsive\" data-type=\"compodoc-logo\">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        "));
      this.innerHTML = tp.strings;
    }
  }]);
  return _class;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));