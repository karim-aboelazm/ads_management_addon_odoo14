from odoo import models, fields, api, _


class AdsManagement(models.Model):
    _name = 'ads.management'
    _description = 'Advertisement Management'

    name = fields.Char(string="Ad Name", required=True)
    description = fields.Text(string="Ad Description")
    image = fields.Binary(string="Ad Image", attachment=True)
    url = fields.Char(string="Ad URL", help="URL to redirect when the ad is clicked")
    placement = fields.Selection([
        ('control_panel', 'Control Panel'),
        ('content_area', 'Content Area'),
    ], string="Placement", required=True)
    target_model_id = fields.Many2one(
        'ir.model', string="Target Model",
        help="Select the model where this advertisement will be displayed."
    )
    start_date = fields.Date(string="Start Date", required=True)
    end_date = fields.Date(string="End Date", required=True)
    status = fields.Selection([
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('expired', 'Expired'),
    ], string="Status", compute="_compute_status", store=True)
    reference = fields.Char(string="Reference", required=True, copy=False, readonly=True, default=lambda self: _('New'))

    @api.depends('start_date', 'end_date')
    def _compute_status(self):
        today = fields.Date.today()
        for record in self:
            if record.start_date and record.end_date:
                if record.start_date <= today <= record.end_date:
                    record.status = 'active'
                elif today > record.end_date:
                    record.status = 'expired'
                else:
                    record.status = 'draft'
            else:
                record.status = 'draft'

    @api.model
    def get_ads_for_model(self, model_name=None):
        if not model_name:
            return []
        ads = self.search([('target_model_id.model', '=', model_name)])  # Ensure this is correct
        return [{
            'name': ad.name,
            'image': ad.image,
            'url': ad.url,
            'description': ad.description,
            'placement': ad.placement,
            'start_date': fields.Date.to_string(ad.start_date),
            'end_date': fields.Date.to_string(ad.end_date),
            'status': ad.status,
        } for ad in ads]

    @api.model
    def has_ads_for_model(self, model_name):
        # Check if there are any ads for the given model
        ad_count = self.search_count([('model_name.model', '=', model_name)])
        return {'hasAds': ad_count > 0}

    @api.model
    def create(self, vals):
        if vals.get('reference', _('New')) == _('New'):
            vals['reference'] = self.env['ir.sequence'].next_by_code('ads.management') or _('New')
        return super(AdsManagement, self).create(vals)


class SaleOrder(models.Model):
    _inherit = 'sale.order'

    ads = fields.Many2many(
        'ads.management',
        string='Advertisements',
        compute='_compute_ads',
        # store=True
    )

    # @api.depends('_name')
    def _compute_ads(self):
        self.ads = self.env['ads.management'].search(
            [('target_model_id.model', '=', 'sale.order'), ('status', '=', 'active')])

    @api.model
    def get_ads_for_sale_order(self):
        # Fetch ads for sale.order, based on active status
        ads = self.env['ads.management'].search([
            ('target_model_id.model', '=', 'sale.order'),
            ('status', '=', 'active')
        ])
        return ads
