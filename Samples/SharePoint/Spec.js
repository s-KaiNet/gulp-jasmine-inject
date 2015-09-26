describe("The 'toEqual' matcher", function() {
    
    it("customScriptLoaded should be true", function(){
      expect(window.customScriptLoaded).toBeTruthy();
    });
    
    it("works for simple literals and variables", function() {
      var a = 12;
      expect(a).toEqual(12);
    });

    it("should work for objects", function() {
      var foo = {
        a: 12,
        b: 34
      };
      var bar = {
        a: 12,
        b: 34
      };
      expect(foo).toEqual(bar);
    });
    
    it("The 'toMatch' matcher is for regular expressions", function() {
      var message = "foo bar baz";
  
      expect(message).toMatch(/bar/);
      expect(message).toMatch("bar");
      expect(message).not.toMatch(/quux/);
    });
  
    it("The 'toBeDefined' matcher compares against `undefined`", function() {
      var a = {
        foo: "foo"
      };
  
      expect(a.foo).toBeDefined();
      expect(a.bar).not.toBeDefined();
    });
  
    it("The `toBeUndefined` matcher compares against `undefined`", function() {
      var a = {
        foo: "foo"
      };
  
      expect(a.foo).not.toBeUndefined();
      expect(a.bar).toBeUndefined();
    });
  
    it("The 'toBeNull' matcher compares against null", function() {
      var a = null;
      var foo = "foo";
  
      expect(null).toBeNull();
      expect(a).toBeNull();
      expect(foo).not.toBeNull();
    });
  
    it("The 'toBeTruthy' matcher is for boolean casting testing", function() {
      var a, foo = "foo";
  
      expect(foo).toBeTruthy();
      expect(a).not.toBeTruthy();
    });
  
    it("The 'toBeFalsy' matcher is for boolean casting testing", function() {
      var a, foo = "foo";
  
      expect(a).toBeFalsy();
      expect(foo).not.toBeFalsy();
    });
  
    it("The 'toContain' matcher is for finding an item in an Array", function() {
      var a = ["foo", "bar", "baz"];
  
      expect(a).toContain("bar");
      expect(a).not.toContain("quux");
    });
  });