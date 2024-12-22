from odoo import http
from odoo.http import request


class MyAdsController(http.Controller):
    @http.route('/get_sales_ads', type='json', auth='public',website=True)
    def list_of_sales_ads(self):
        ads = request.env['ads.management'].sudo().search([('target_model_id.model', '=', 'sale.order'), ('status', '=', 'active')])
        return [{
            'name': ad.name,
            'image': ad.image,
            'url': ad.url,
            'description': ad.description,
        } for ad in ads]
