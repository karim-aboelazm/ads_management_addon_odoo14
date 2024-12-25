from odoo import http
from odoo.http import request


class MyAdsController(http.Controller):

    @http.route('/ads/<string:model_name>', auth='user', type='json')
    def get_panel_data(self,model_name):
       ads_list = request.env['ads.management'].get_ads_for_model(model_name=model_name)
       vals = {'ads': ads_list}
       return {
           'html':request.env.ref('ads_management.ads_banner_template_view')._render({
               'object': request.env[model_name],
               'values': vals
           })
       }
