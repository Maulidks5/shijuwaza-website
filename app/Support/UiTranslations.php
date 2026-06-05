<?php

namespace App\Support;

class UiTranslations
{
    public static function get(string $locale): array
    {
        $translations = [
            'en' => [
                'nav.home' => 'Home',
                'nav.about' => 'About Us',
                'nav.programs' => 'Programs',
                'nav.resources' => 'Publications',
                'nav.publications' => 'Publications',
                'nav.members' => 'Members',
                'nav.gallery' => 'Gallery',
                'nav.news' => 'Updates',
                'nav.contact' => 'Contact',
                'nav.donate' => 'Donate',
                'nav.partner' => 'Partner With Us',
                'nav.toggle' => 'Toggle navigation menu',
                'language.label' => 'Language',
                'footer.mission' => 'Advancing disability rights, inclusion, and accountable participation for persons with disabilities in Zanzibar.',
                'footer.quick_links' => 'Quick Links',
                'footer.resources' => 'Publications',
                'footer.contact' => 'Contact',
                'footer.portal_login' => 'Portal Login',
                'footer.login' => 'Login',
                'footer.reports' => 'Reports',
                'footer.newsletters' => 'Newsletters',
                'footer.strategic_plan' => 'Strategic Plan',
                'footer.articles' => 'Articles & Success Stories',
                'footer.email_placeholder' => 'Email address',
                'footer.join' => 'Join',
                'footer.newsletter_label' => 'Newsletter subscription',
                'footer.copyright' => 'All rights reserved. This website is designed to support accessible information and inclusive participation.',
            ],
            'sw' => [
                'nav.home' => 'Nyumbani',
                'nav.about' => 'Kuhusu Sisi',
                'nav.programs' => 'Programu',
                'nav.resources' => 'Machapisho',
                'nav.publications' => 'Machapisho',
                'nav.members' => 'Wanachama',
                'nav.gallery' => 'Picha',
                'nav.news' => 'Matukio',
                'nav.contact' => 'Mawasiliano',
                'nav.donate' => 'Changia',
                'nav.partner' => 'Shirikiana Nasi',
                'nav.toggle' => 'Fungua au funga menyu',
                'language.label' => 'Lugha',
                'footer.mission' => 'Kuendeleza haki za watu wenye ulemavu, ujumuishi, na ushiriki wenye uwajibikaji Zanzibar.',
                'footer.quick_links' => 'Viungo Muhimu',
                'footer.resources' => 'Machapisho',
                'footer.contact' => 'Mawasiliano',
                'footer.portal_login' => 'Ingia Portalini',
                'footer.login' => 'Ingia',
                'footer.reports' => 'Ripoti',
                'footer.newsletters' => 'Jarida',
                'footer.strategic_plan' => 'Mpango Mkakati',
                'footer.articles' => 'Makala na Simulizi za Mafanikio',
                'footer.email_placeholder' => 'Barua pepe',
                'footer.join' => 'Jiunge',
                'footer.newsletter_label' => 'Usajili wa taarifa',
                'footer.copyright' => 'Haki zote zimehifadhiwa. Tovuti hii imeundwa kusaidia taarifa zinazofikika na ushiriki jumuishi.',
            ],
        ];

        return $translations[$locale] ?? $translations['en'];
    }
}
