odoo.define('ads_management.MyComponent', function (require) {
    'use strict';

    const { Component } = require('owl');

    class MyComponent extends Component {
        render() {
            return $('<div><h3>My Custom Ads Component</h3><p>This is a custom component added to the ControlPanel.</p></div>');
        }
    }

    return MyComponent;
});


odoo.define('ads_management.ControlPanelInjection', function (require) {
    'use strict';

    const { mount } = require('owl');
    const MyComponent = require('ads_management.MyComponent');
    const ControlPanel = require('web.ControlPanel');

    ControlPanel.include({
        start: function () {
            this._super.apply(this, arguments);

            const target = document.getElementById('my_component_container');
            if (target) {
                // Mount the component into the target container
                mount(MyComponent, { target });
            }
        },
    });
});
