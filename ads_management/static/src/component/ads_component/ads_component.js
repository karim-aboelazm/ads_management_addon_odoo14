odoo.define('ads_management.AdsComponent', function (require) {
    "use strict";

    const AbstractAction = require('web.AbstractAction');
    const rpc = require('web.rpc');
    const core = require('web.core');
    const QWeb = core.qweb;

    const AdsComponent = AbstractAction.extend({
        template: 'ads_management.AdsComponentTemplate', // Ensure this is defined in your XML

        init: function (parent, options) {
            this._super(parent, options);
            this.state = {
                ads: [],
                model_name: options.model_name || null,
            };
        },

        start: function () {
            this._super.apply(this, arguments);

            const modelName = this.state.model_name || this.$('.ads-container').data('model');
            console.log(modelName);
            console.error("Model is : " + modelName);
            if (!modelName) {
                console.error("Model name is undefined!");
                return;
            }

            this.state.model_name = modelName;
            return this._fetchAds().then(() => {
                this._renderAds();
            });
        },

        _fetchAds: function () {
            return rpc.query({
                model: 'ads.management',
                method: 'get_ads_for_model',
                args: [],
                kwargs: { model_name: this.state.model_name },
            }).then(data => {
                console.log('Fetched ads:', data);
                this.state.ads = data || [];
            });
        },

        _renderAds: function () {
            const $adsContainer = this.$('.ads-container');
            $adsContainer.empty();

            if (this.state.ads.length === 0) {
                $adsContainer.append(
                    `<div class="alert alert-info" role="alert">
                        No advertisements are available for this model.
                     </div>`
                );
                return;
            }

            this.state.ads.forEach(ad => {
                const adHtml = QWeb.render('ads_management.AdCardTemplate', { ad });
                $adsContainer.append(adHtml);
            });
        }
    });

    core.action_registry.add('ads_management.adsManagementsClient', AdsComponent);

    return AdsComponent;
});
