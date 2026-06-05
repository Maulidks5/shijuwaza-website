<?php

namespace Database\Seeders;

use App\Models\HomepageStat;
use App\Models\Announcement;
use App\Models\Donation;
use App\Models\HeroSection;
use App\Models\MediaAlbum;
use App\Models\MediaItem;
use App\Models\MemberOrganization;
use App\Models\NewsPost;
use App\Models\Partner;
use App\Models\PartnershipRequest;
use App\Models\Program;
use App\Models\ResourceItem;
use App\Models\SiteSetting;
use App\Models\User;
use App\Support\ModuleAccess;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $actionPermissions = [
            'view dashboard',
            'manage visibility',
            'delete records',
        ];
        $permissions = array_values(array_unique([...$actionPermissions, ...ModuleAccess::permissions()]));

        collect($permissions)->each(fn (string $permission) => Permission::findOrCreate($permission, 'web'));
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $superAdminRole = Role::findOrCreate('Super Admin', 'web');
        $adminRole = Role::findOrCreate('Admin', 'web');
        $editorRole = Role::findOrCreate('Editor', 'web');
        Role::findOrCreate('Member', 'web')->syncPermissions([]);

        $superAdminRole->syncPermissions($permissions);
        $adminRole->syncPermissions(['view dashboard', 'manage visibility']);
        $editorRole->syncPermissions(['view dashboard']);

        User::updateOrCreate(
            ['email' => 'admin@shijuwaza.or.tz'],
            [
                'name' => 'SHIJUWAZA Admin',
                'password' => 'Admin2026@',
                'role' => 'admin',
            ],
        )->syncRoles(['Super Admin']);

        User::updateOrCreate(
            ['email' => 'superadmin@example.com'],
            ['name' => 'Super Admin', 'password' => 'password', 'role' => 'super_admin'],
        )->syncRoles(['Super Admin']);

        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => 'password', 'role' => 'admin'],
        )->syncRoles(['Admin'])->syncPermissions([
            'manage hero section',
            'manage homepage stats',
            'manage programs',
            'manage news',
            'manage announcements',
            'manage resources',
            'manage media',
            'manage members',
            'manage leadership profiles',
            'manage partners',
            'manage member submissions',
            'manage donations',
            'manage partnership requests',
            'manage contact messages',
            'manage whistleblower reports',
            'manage visitor analytics',
        ]);

        User::updateOrCreate(
            ['email' => 'editor@example.com'],
            ['name' => 'Editor User', 'password' => 'password', 'role' => 'editor'],
        )->syncRoles(['Editor'])->syncPermissions([
            'manage programs',
            'manage news',
            'manage announcements',
            'manage resources',
            'manage media',
        ]);

        $memberUsers = collect([
            ['email' => 'juwauza@example.com', 'name' => 'JUWAUZA Member', 'slug' => 'juwauza'],
            ['email' => 'uwz@example.com', 'name' => 'UWZ Member', 'slug' => 'uwz'],
            ['email' => 'zaao@example.com', 'name' => 'ZAAO Member', 'slug' => 'zaao'],
        ])->mapWithKeys(function (array $memberUser) {
            $user = User::updateOrCreate(
                ['email' => $memberUser['email']],
                ['name' => $memberUser['name'], 'password' => 'password', 'role' => 'member'],
            );

            $user->syncRoles(['Member']);
            $user->syncPermissions([]);

            return [$memberUser['slug'] => $user->id];
        });

        HeroSection::updateOrCreate(
            ['id' => 1],
            [
                'eyebrow' => 'Uniting OPDs since 2014',
                'title' => 'Advancing Disability Rights and Inclusion in Zanzibar',
                'subtitle' => 'SHIJUWAZA is a federation of Disabled People Organizations empowering OPDs, promoting equal participation, and strengthening accountability for disability-inclusive development.',
                'primary_button_text' => 'Learn More',
                'primary_button_url' => '#about-us',
                'secondary_button_text' => 'Our Programs',
                'secondary_button_url' => '#programs',
                'quote' => 'Nothing About Us Without Us',
                'established_year' => '2014',
                'established_label' => 'Federation established',
                'focus_items' => [
                    ['label' => 'OPD-led advocacy', 'icon' => 'Landmark'],
                    ['label' => 'Capacity building', 'icon' => 'UsersRound'],
                    ['label' => 'Inclusive partnerships', 'icon' => 'HandHeart'],
                ],
                'slides' => [
                    ['image' => '/images/activities/shijuwaza-training-08.jpeg', 'alt' => 'SHIJUWAZA representative speaking during an organizational meeting in Zanzibar', 'label' => 'Advocacy leadership', 'title' => 'OPD voices shaping public decisions'],
                    ['image' => '/images/activities/shijuwaza-training-05.jpeg', 'alt' => 'SHIJUWAZA annual meeting with members and partners in Zanzibar', 'label' => 'Organizational accountability', 'title' => 'Partners and members working together for inclusion'],
                    ['image' => '/images/activities/shijuwaza-training-06.jpeg', 'alt' => 'SHIJUWAZA staff participating in a capacity-building session', 'label' => 'Capacity building', 'title' => 'Strengthening skills for sustainable OPD leadership'],
                    ['image' => '/images/activities/shijuwaza-training-01.jpeg', 'alt' => 'Participants in conversation during a SHIJUWAZA community dialogue', 'label' => 'Inclusive dialogue', 'title' => 'Creating space for participation and shared action'],
                ],
                'is_active' => true,
            ],
        );

        collect([
            ['label' => 'Member OPDs', 'value' => '20+', 'description' => 'Organizations represented', 'icon' => 'UsersRound', 'sort_order' => 1],
            ['label' => 'Trainings Conducted', 'value' => '45+', 'description' => 'Leadership and inclusion sessions', 'icon' => 'GraduationCap', 'sort_order' => 2],
            ['label' => 'Advocacy Engagements', 'value' => '80+', 'description' => 'Policy and community dialogues', 'icon' => 'Megaphone', 'sort_order' => 3],
            ['label' => 'Community Reach', 'value' => '12k+', 'description' => 'People reached through programs', 'icon' => 'BarChart3', 'sort_order' => 4],
        ])->each(fn ($stat) => HomepageStat::updateOrCreate(['label' => $stat['label']], $stat));

        collect([
            [
                'title' => 'Advocacy & Rights Promotion',
                'slug' => 'advocacy-rights-promotion',
                'short_description' => 'Championing disability rights, inclusive policy dialogue, and stronger participation in public decision-making.',
                'description' => 'SHIJUWAZA supports OPD-led advocacy so persons with disabilities can influence decisions, services, and accountability systems.',
                'icon' => 'Landmark',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'title' => 'Capacity Building & Training',
                'slug' => 'capacity-building-training',
                'short_description' => 'Strengthening OPD leadership, governance, communication, accountability, and organizational resilience.',
                'description' => 'Training activities equip member organizations with practical skills for leadership, planning, reporting, and community engagement.',
                'icon' => 'Presentation',
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'title' => 'Inclusive Development',
                'slug' => 'inclusive-development',
                'short_description' => 'Supporting institutions and communities to design programs that include persons with disabilities from the start.',
                'description' => 'Inclusive development work helps partners improve access, participation, and disability-responsive program delivery.',
                'icon' => 'Network',
                'sort_order' => 3,
                'is_featured' => true,
            ],
            [
                'title' => 'Partnerships & Collaboration',
                'slug' => 'partnerships-collaboration',
                'short_description' => 'Building trusted relationships with government, media, civil society, and development partners.',
                'description' => 'SHIJUWAZA coordinates relationships that connect OPD priorities with institutions able to support long-term change.',
                'icon' => 'Handshake',
                'sort_order' => 4,
                'is_featured' => true,
            ],
        ])->each(fn ($program) => Program::updateOrCreate(['slug' => $program['slug']], $program));

        collect([
            [
                'title' => 'Staff capacity building strengthens accountable program delivery',
                'slug' => 'staff-capacity-building-strengthens-accountable-program-delivery',
                'category' => 'training',
                'excerpt' => 'A practical training session focused on inclusive planning, transparent reporting, and coordinated support for member OPDs.',
                'body' => 'SHIJUWAZA staff joined a capacity-building session focused on improving program planning, reporting, and practical coordination with member organizations.',
                'featured_image' => '/images/activities/shijuwaza-training-06.jpeg',
                'activity_date' => now()->subDays(10)->toDateString(),
                'published_at' => now()->subDays(8),
                'status' => 'published',
                'sort_order' => 1,
            ],
            [
                'title' => 'Dialogue advances accountability in disability-inclusive development',
                'slug' => 'dialogue-advances-accountability-in-disability-inclusive-development',
                'category' => 'advocacy',
                'excerpt' => 'Stakeholders explored ways to make services, budgets, and community programs more responsive to persons with disabilities.',
                'body' => 'The dialogue brought together representatives to discuss accountability, access, and participation in disability-inclusive development across Zanzibar.',
                'featured_image' => '/images/activities/shijuwaza-training-01.jpeg',
                'activity_date' => now()->subDays(32)->toDateString(),
                'published_at' => now()->subDays(30),
                'status' => 'published',
                'sort_order' => 2,
            ],
            [
                'title' => 'Journalist engagement promotes respectful disability reporting',
                'slug' => 'journalist-engagement-promotes-respectful-disability-reporting',
                'category' => 'press',
                'excerpt' => 'Media professionals joined OPD representatives to strengthen public communication on rights, dignity, and inclusion.',
                'body' => 'The session encouraged rights-based language, better story framing, and stronger collaboration between journalists and OPD leaders.',
                'featured_image' => '/images/activities/shijuwaza-training-04.jpeg',
                'activity_date' => now()->subDays(58)->toDateString(),
                'published_at' => now()->subDays(55),
                'status' => 'published',
                'sort_order' => 3,
            ],
        ])->each(fn ($post) => NewsPost::updateOrCreate(['slug' => $post['slug']], $post));

        collect([
            [
                'title' => 'Call for OPD updates and coordination notes',
                'slug' => 'call-for-opd-updates-and-coordination-notes',
                'excerpt' => 'Member OPDs are invited to submit verified updates, documents, and coordination notes through the member portal.',
                'body' => 'SHIJUWAZA invites member organizations to share verified updates, documents, and coordination notes through the member portal. Approved submissions will help strengthen visibility, learning, and collaboration across the network.',
                'published_at' => now()->subDays(4),
                'status' => 'published',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'title' => 'Partner briefing on disability-inclusive development',
                'slug' => 'partner-briefing-on-disability-inclusive-development',
                'excerpt' => 'SHIJUWAZA will share a partner briefing focused on inclusive planning, participation, and OPD-led accountability.',
                'body' => 'The partner briefing will bring together stakeholders interested in strengthening disability-inclusive development and practical collaboration with Organizations of Persons with Disabilities.',
                'published_at' => now()->subDays(10),
                'status' => 'published',
                'sort_order' => 2,
            ],
        ])->each(fn ($announcement) => Announcement::updateOrCreate(['slug' => $announcement['slug']], $announcement));

        collect([
            [
                'title' => 'Quarterly Newsletter: Inclusion Highlights',
                'slug' => 'quarterly-newsletter-inclusion-highlights',
                'category' => 'newsletter',
                'excerpt' => 'A concise update on SHIJUWAZA advocacy, member coordination, training activities, and community inclusion highlights.',
                'body' => 'This newsletter shares organizational highlights, member updates, and practical progress from SHIJUWAZA work across Zanzibar.',
                'published_at' => now()->subDays(12),
                'status' => 'published',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'title' => 'Annual Program and Accountability Report',
                'slug' => 'annual-program-and-accountability-report',
                'category' => 'report',
                'excerpt' => 'A partner-facing overview of program delivery, participation, lessons, and organizational accountability.',
                'body' => 'This report summarizes SHIJUWAZA program activities, stakeholder engagement, and accountability priorities for disability-inclusive development.',
                'published_at' => now()->subDays(20),
                'status' => 'published',
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'title' => 'Strategic Direction for Disability Inclusion',
                'slug' => 'strategic-direction-for-disability-inclusion',
                'category' => 'strategic_plan',
                'excerpt' => 'A strategic direction note outlining SHIJUWAZA priorities for OPD coordination, advocacy, and institutional strengthening.',
                'body' => 'The strategic direction focuses on stronger OPD leadership, inclusive services, evidence-based advocacy, and trusted partnerships.',
                'published_at' => now()->subDays(35),
                'status' => 'published',
                'sort_order' => 3,
                'is_featured' => true,
            ],
            [
                'title' => 'Success Story: Strengthening OPD Voice',
                'slug' => 'success-story-strengthening-opd-voice',
                'category' => 'article_success_story',
                'excerpt' => 'A story on how coordinated OPD engagement supports participation, dignity, and inclusion in public decision-making.',
                'body' => 'Through coordinated advocacy and capacity building, member OPDs continue to strengthen collective voice and practical participation.',
                'published_at' => now()->subDays(45),
                'status' => 'published',
                'sort_order' => 4,
                'is_featured' => true,
            ],
        ])->each(fn ($resource) => ResourceItem::updateOrCreate(['slug' => $resource['slug']], $resource));

        $mediaAlbums = collect([
            ['name' => 'Training & Capacity Building', 'slug' => 'training-capacity-building', 'description' => 'Workshops and learning sessions with member OPDs, community leaders, and stakeholders.', 'sort_order' => 1],
            ['name' => 'Advocacy & Dialogue', 'slug' => 'advocacy-dialogue', 'description' => 'Community dialogues, policy engagement, and rights promotion activities.', 'sort_order' => 2],
            ['name' => 'Partnerships & Events', 'slug' => 'partnerships-events', 'description' => 'Partner visits, annual meetings, and collaborative institutional moments.', 'sort_order' => 3],
        ])->mapWithKeys(fn ($album) => [
            $album['slug'] => MediaAlbum::updateOrCreate(['slug' => $album['slug']], $album),
        ]);

        collect([
            ['title' => 'Featured story', 'type' => 'image', 'image' => '/images/activities/shijuwaza-training-08.jpeg', 'description' => 'Voices of OPD leaders and communities working toward inclusive Zanzibar.', 'sort_order' => 1, 'is_featured' => true, 'album' => 'advocacy-dialogue'],
            ['title' => 'Training workshop', 'type' => 'image', 'image' => '/images/activities/shijuwaza-training-02.jpeg', 'sort_order' => 2, 'album' => 'training-capacity-building'],
            ['title' => 'Community dialogue', 'type' => 'image', 'image' => '/images/activities/shijuwaza-training-07.jpeg', 'sort_order' => 3, 'album' => 'advocacy-dialogue'],
            ['title' => 'Partner visit', 'type' => 'image', 'image' => '/images/activities/shijuwaza-training-03.jpeg', 'sort_order' => 4, 'album' => 'partnerships-events'],
            ['title' => 'Advocacy forum', 'type' => 'image', 'image' => '/images/activities/shijuwaza-training-04.jpeg', 'sort_order' => 5, 'album' => 'advocacy-dialogue'],
            ['title' => 'Annual meeting', 'type' => 'image', 'image' => '/images/activities/shijuwaza-training-05.jpeg', 'sort_order' => 6, 'album' => 'partnerships-events'],
        ])->each(function ($item) use ($mediaAlbums): void {
            $albumSlug = $item['album'];
            unset($item['album']);
            $item['media_album_id'] = $mediaAlbums[$albumSlug]?->id;

            MediaItem::updateOrCreate(['title' => $item['title']], $item);
        });

        collect([
            ['name' => 'Government Institutions', 'description' => 'Public institutions supporting disability-inclusive services and policy engagement.', 'sort_order' => 1],
            ['name' => 'Civil Society Organizations', 'description' => 'Rights-based organizations collaborating on inclusion and accountability.', 'sort_order' => 2],
            ['name' => 'Media Partners', 'description' => 'Journalists and media houses advancing respectful public communication.', 'sort_order' => 3],
            ['name' => 'Development Partners', 'description' => 'Organizations supporting sustainable disability-inclusive development.', 'sort_order' => 4],
        ])->each(fn ($partner) => Partner::updateOrCreate(['name' => $partner['name']], $partner));

        collect([
            ['key' => 'site_phone', 'value' => '+255 000 000 000', 'group' => 'contact'],
            ['key' => 'whatsapp_number', 'value' => '+255 716 110 270', 'group' => 'contact'],
            ['key' => 'site_email', 'value' => 'info@shijuwaza.or.tz', 'group' => 'contact'],
            ['key' => 'site_location', 'value' => 'Zanzibar, Tanzania', 'group' => 'contact'],
            ['key' => 'organization_phone', 'value' => '+255 000 000 000', 'group' => 'contact'],
            ['key' => 'organization_email', 'value' => 'info@shijuwaza.or.tz', 'group' => 'contact'],
            ['key' => 'organization_location', 'value' => 'Zanzibar, Tanzania', 'group' => 'contact'],
            ['key' => 'office_hours', 'value' => 'Monday to Friday, 9:00 AM - 5:00 PM', 'group' => 'contact'],
            ['key' => 'donation_bank_name', 'value' => 'Bank of Tanzania Placeholder', 'group' => 'donation'],
            ['key' => 'donation_account_name', 'value' => 'SHIJUWAZA', 'group' => 'donation'],
            ['key' => 'donation_account_number', 'value' => '0000000000', 'group' => 'donation'],
            ['key' => 'donation_mobile_money_name', 'value' => 'SHIJUWAZA Donations', 'group' => 'donation'],
            ['key' => 'donation_mobile_money_number', 'value' => '+255 000 000 000', 'group' => 'donation'],
            ['key' => 'instagram_url', 'value' => 'https://www.instagram.com/shijuwaza_znz?igsh=cGE1NGVjZXNrM2F5', 'group' => 'social'],
            ['key' => 'facebook_url', 'value' => 'https://web.facebook.com/profile.php?id=100090167520147', 'group' => 'social'],
            ['key' => 'linkedin_url', 'value' => 'https://www.linkedin.com/in/shijuwaza-znz-952712374/', 'group' => 'social'],
            ['key' => 'youtube_url', 'value' => 'https://www.youtube.com/@znz_shijuwaza', 'group' => 'social'],
        ])->each(fn ($setting) => SiteSetting::updateOrCreate(['key' => $setting['key']], $setting));

        collect([
            [
                'name' => 'Jumuiya ya Watu Wenye Ulemavu Zanzibar',
                'slug' => 'juwauza',
                'user_id' => $memberUsers['juwauza'],
                'acronym' => 'JUWAUZA',
                'description' => 'JUWAUZA is a member organization representing persons with disabilities in Zanzibar and supporting collective advocacy, participation, and community inclusion.',
                'location' => 'Zanzibar, Tanzania',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Umoja wa Watu Wenye Ulemavu Zanzibar',
                'slug' => 'uwz',
                'user_id' => $memberUsers['uwz'],
                'acronym' => 'UWZ',
                'description' => 'UWZ brings together persons with disabilities to strengthen voice, mutual support, and engagement in disability-inclusive development across Zanzibar.',
                'location' => 'Zanzibar, Tanzania',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Jumuiya ya Watu Wenye Ualbino Zanzibar',
                'slug' => 'zaao',
                'user_id' => $memberUsers['zaao'],
                'acronym' => 'ZAAO',
                'description' => 'ZAAO advocates for the rights, dignity, safety, and inclusion of persons with albinism through awareness, representation, and community coordination.',
                'location' => 'Zanzibar, Tanzania',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ])->each(fn ($member) => MemberOrganization::updateOrCreate(['slug' => $member['slug']], $member));

        collect([
            [
                'donor_name' => 'Community Supporter',
                'donor_email' => 'supporter@example.org',
                'donor_phone' => '+255 711 000 001',
                'amount' => 150000,
                'currency' => 'TZS',
                'donation_type' => 'one_time',
                'payment_method' => 'mobile_money',
                'message' => 'Supporting inclusive training for OPD leaders.',
                'status' => 'pending',
            ],
            [
                'donor_name' => 'Institutional Friend',
                'donor_email' => 'partner@example.org',
                'donor_phone' => '+255 711 000 002',
                'amount' => 500000,
                'currency' => 'TZS',
                'donation_type' => 'monthly',
                'payment_method' => 'bank_transfer',
                'message' => 'Monthly support for advocacy coordination.',
                'status' => 'confirmed',
            ],
        ])->each(fn ($donation) => Donation::updateOrCreate(
            ['donor_email' => $donation['donor_email'], 'amount' => $donation['amount']],
            $donation,
        ));

        collect([
            [
                'organization_name' => 'Inclusive Development Foundation',
                'contact_person' => 'Amina Hassan',
                'email' => 'amina@example.org',
                'phone' => '+255 711 000 003',
                'partnership_type' => 'funding',
                'message' => 'We would like to explore support for OPD-led accountability and community engagement.',
                'status' => 'new',
            ],
            [
                'organization_name' => 'Zanzibar Media Initiative',
                'contact_person' => 'Juma Ali',
                'email' => 'juma@example.org',
                'phone' => '+255 711 000 004',
                'partnership_type' => 'media',
                'message' => 'We are interested in collaboration on respectful disability reporting and public awareness.',
                'status' => 'reviewed',
            ],
        ])->each(fn ($request) => PartnershipRequest::updateOrCreate(['email' => $request['email']], $request));
    }
}
