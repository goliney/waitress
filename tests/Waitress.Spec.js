describe('VIO.Queue', function () {
    beforeEach(function () {
        this.q = new Waitress();
        this.spy1 = jasmine.createSpy('spy1');
        this.spy2 = jasmine.createSpy('spy2');
        this.spy3 = jasmine.createSpy('spy3');
        this.spy4 = jasmine.createSpy('spy4');
        this.spy5 = jasmine.createSpy('spy5');
        this.context = {'this': 'smth'};

        this.q.add(this.spy1, [window, 1, 2]);
        this.q.add(this.spy2, [this.context, 3, 4]);
        this.q.add(this.spy3);

    });

    it('should have methods', function () {
        expect(this.q.add).toBeDefined();
        expect(this.q.run).toBeDefined();
        expect(this.q.flush).toBeDefined();
    });

    it('should be able to run methods with stored params', function () {
        expect(this.spy1).not.toHaveBeenCalled();
        expect(this.spy2).not.toHaveBeenCalled();
        expect(this.spy3).not.toHaveBeenCalled();

        this.q.run();
        expect(this.spy1).toHaveBeenCalled();
        expect(this.spy2).toHaveBeenCalled();
        expect(this.spy3).toHaveBeenCalled();
        expect(this.spy1.calls.all()).toEqual([{object: window, args: [1, 2]}]);
        expect(this.spy2.calls.all()).toEqual([{object: this.context, args: [3, 4]}]);
        expect(this.spy3.calls.all()).toEqual([{object: window, args: []}]);

        this.q.add(this.spy4, [window, 5, 6]);
        expect(this.spy4).not.toHaveBeenCalled();

        this.q.run();
        expect(this.spy4).toHaveBeenCalled();
        expect(this.spy4.calls.all()).toEqual([{object: window, args: [5, 6]}]);
        expect(this.spy2.calls.count()).toBe(2);
        expect(this.spy2.calls.mostRecent()).toEqual({object: this.context, args: [3, 4]});
    });

    it('should be able to flush methods with stored params', function () {
        expect(this.spy1).not.toHaveBeenCalled();
        expect(this.spy2).not.toHaveBeenCalled();
        expect(this.spy3).not.toHaveBeenCalled();

        this.q.flush();
        expect(this.spy1).toHaveBeenCalled();
        expect(this.spy2).toHaveBeenCalled();
        expect(this.spy3).toHaveBeenCalled();
        expect(this.spy1.calls.all()).toEqual([{object: window, args: [1, 2]}]);
        expect(this.spy2.calls.all()).toEqual([{object: this.context, args: [3, 4]}]);
        expect(this.spy3.calls.all()).toEqual([{object: window, args: []}]);

        this.q.add(this.spy4, [window, 5, 6]);
        expect(this.spy4).toHaveBeenCalled();
        expect(this.spy4.calls.all()).toEqual([{object: window, args: [5, 6]}]);

        this.q.flush();
        //all methods were flushed after first flush()
        expect(this.spy1.calls.count()).toBe(1);
        expect(this.spy3.calls.count()).toBe(1);
        expect(this.spy4.calls.count()).toBe(1);

        this.q.add(this.spy5);
        expect(this.spy5).toHaveBeenCalled();
    });

});