'use strict';
import PB from '../core/constants';
import DOM from '../core/dom';
import Component from '../core/component';
import store from '../store/index';
import DashboardTemplate from "./templates/dashboard.html";

export default class Dashboard extends Component {
    constructor(modal) {
        super({
            store
        });

        this.element = null;
        this.modal = modal;
        this.dashboard = false;
    }
    
    render() {

        let self = this;
        self.log('unlocked...render');

        let widget = DOM.elid('photoblock-widget-photo');

        if (store.state.currentState === PB.STATE_READY) {
            self.modal.content.innerHTML = '';
            self.modal.content.insertAdjacentHTML('beforeend', self.localizer.localize(DashboardTemplate));
            self.element = DOM.elid('photoblock-dash-wrapper'); 
            self.element = DOM.elid('photoblock-photo');  

            if (store.state.photoEngine != null) {
                store.state.photoEngine.getDataUri((img) => {
                    self.element.src = img;                    
                });
            }

            self.element.addEventListener('click', () => {
                self.toggleDashboard();
            });

            let nextButton = DOM.elid('photoblock-action-lock');
            nextButton.addEventListener('click', () => {
                self.element = null;
                store.dispatch('lock', { });
            });    


            if ((widget !== null) && (store.state.photoEngine !== null)) {
                store.state.photoEngine.getDataUri((img) => {
                    widget.src = img;                    
                });    
                widget.setAttribute('style', 'display:block;');
            }

            window.setTimeout(() => {
                self.toggleDashboard(true);
            }, 100)
        } else {
            if (widget !== null) {
                widget.src = '';
                widget.removeAttribute('style');
            }
        }


    }
 
    toggleDashboard(show) {
        let self = this;

        self.dashboard = show || !self.dashboard;
        let dashboardWrapper = DOM.elid('photoblock-dashboard-wrapper');
        dashboardWrapper.className = self.dashboard ? 'photoblock-dashboard-slide' : '';

        if (self.dashboard) {
            store.state.currentContext.handlers.updateDashboard(store.state.currentAccount);
        }
    }

}
