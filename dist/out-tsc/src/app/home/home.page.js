import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
var HomePage = /** @class */ (function () {
    function HomePage(menuCtrl) {
        this.menuCtrl = menuCtrl;
    }
    HomePage.prototype.ionViewWillEnter = function () {
        this.menuCtrl.enable(true);
    };
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map