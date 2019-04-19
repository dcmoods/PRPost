import { TestBed } from '@angular/core/testing';
import { PostsService } from './posts.service';
describe('PostsService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(PostsService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=posts.service.spec.js.map