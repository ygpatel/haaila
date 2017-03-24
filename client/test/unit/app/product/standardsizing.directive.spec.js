describe("Directive: standardsizing", function() {
  var el, scope, controller;

  beforeEach (inject(function($compile, $rootScope) {

    el = angular.element("<standardsizing></standardsizing>")
    $compile(el)($rootScope.$new())
    $rootScope.$digest()


    controller = el.controller()

    scope = el.isolateScope() || el.scope()
  }))

  it("should do something to the scope", function() {
    expect(controller).toBeDefined()
  })
})
