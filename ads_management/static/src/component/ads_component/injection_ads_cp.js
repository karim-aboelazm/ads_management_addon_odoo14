odoo.define('ads_management.ControlPanelAds', function (require) {
    'use strict';

    const ControlPanel = require('web.ControlPanel');
    const rpc = require('web.rpc');
    const QWeb = require('web.core').qweb;

    class ControlPanelAds extends ControlPanel {
        constructor(parent, options) {
            super(parent, options);
            this.state = {
                ads: [],
                model_name: options.model_name || null,
            };
        }

        start() {
            return super.start().then(() => {
                const modelName = this.state.model_name || this.$('.ads-container').data('model');
                if (!modelName) {
                    console.error("Model name is undefined!");
                    return;
                }

                this.state.model_name = modelName;
                return this._fetchAds().then(() => {
                    this._renderAds();
                });
            });
        }

        _fetchAds() {
            return rpc.query({
                model: 'ads.management',
                method: 'get_ads_for_model',
                args: [],
                kwargs: { model_name: this.state.model_name },
            }).then(data => {
                console.log('Fetched ads:', data);
                this.state.ads = data || [];
            }).catch(err => {
                console.error("Error fetching ads:", err);
                this.state.ads = [];
            });
        }

        _renderAds() {
            const $adsContainer = this.$('.ads-container');
            $adsContainer.empty();

            if (this.state.ads.length === 0) {
                $adsContainer.append(`
                    <div class="alert alert-info" role="alert">
                        No advertisements are available for this model.
                    </div>
                `);
                return;
            }

            this.state.ads.forEach(ad => {
                const adHtml = QWeb.render('ads_management.AdCardTemplate', { ad });
                $adsContainer.append(adHtml);
            });
        }
    }

    ControlPanelAds.defaultProps = {};
    ControlPanelAds.template = 'ads_management.AdsComponentTemplate';

    return ControlPanelAds;
});


odoo.define('ads_management.ControlPanelOverride', function (require) {
    'use strict';

    const { ControlPanel } = require('web.ControlPanel');
    const ControlPanelAds = require('ads_management.ControlPanelAds');

    class ControlPanelExtended extends ControlPanel {
        async start() {
            // Call the parent class start method
            await super.start();

            // Create and render the ControlPanelAds component
            const adsComponent = new ControlPanelAds(this, { model_name: this.modelName });
            adsComponent.append(`<h1>1233254675432</h1>`);
//            adsComponent.appendTo(this.$el.find('.ads-container'));
        }
    }

    return ControlPanelExtended;
});

