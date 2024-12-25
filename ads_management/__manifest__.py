{
    'name': 'Ads Management',
    'version': '1.0',
    'summary': 'Dynamic Advertisement Management System',
    'description': 'Manage and display advertisements dynamically in Odoo 14.',
    'author': 'Karim Mohammed Aboelazm',
    'category': 'Tools',
    'depends': ['base', 'web', 'sale'],
    'data': [
        'security/ir.model.access.csv',
        'data/ads_management_sequence.xml',
        'views/ads_management_views.xml',
        'views/templates.xml',
        'views/ads_banner_view.xml',
        'views/view.xml',
    ],
    'qweb': [
        'static/src/component/*/*.xml',
    ],
    'installable': True,
    'application': True,
}
