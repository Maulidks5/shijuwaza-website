<?php

use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DonationController as AdminDonationController;
use App\Http\Controllers\Admin\HeroSectionController;
use App\Http\Controllers\Admin\LeadershipProfileController;
use App\Http\Controllers\Admin\HomepageStatController;
use App\Http\Controllers\Admin\MediaItemController;
use App\Http\Controllers\Admin\MediaAlbumController;
use App\Http\Controllers\Admin\MemberOrganizationController;
use App\Http\Controllers\Admin\MemberSubmissionController as AdminMemberSubmissionController;
use App\Http\Controllers\Admin\NewsPostController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\PartnershipRequestController as AdminPartnershipRequestController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ProgramController;
use App\Http\Controllers\Admin\ResourceItemController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VisitorAnalyticsController;
use App\Http\Controllers\Admin\WhistleblowerReportController as AdminWhistleblowerReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Public\ContactMessageController;
use App\Http\Controllers\Public\DonationController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\MemberController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\Public\PartnershipRequestController;
use App\Http\Controllers\Public\WhistleblowerReportController;
use App\Http\Controllers\Member\DashboardController as MemberDashboardController;
use App\Http\Controllers\Member\ProfileController as MemberProfileController;
use App\Http\Controllers\Member\SubmissionController as MemberSubmissionController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/language/{locale}', LocaleController::class)->name('language.switch');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/programs', [PageController::class, 'programs'])->name('programs');
Route::get('/programs/{program:slug}', [PageController::class, 'programShow'])->name('programs.show');
Route::get('/news', [PageController::class, 'news'])->name('news.index');
Route::get('/news/{newsPost:slug}', [PageController::class, 'newsShow'])->name('news.show');
Route::get('/gallery', [PageController::class, 'gallery'])->name('gallery');
Route::get('/gallery/{album:slug}', [PageController::class, 'galleryAlbum'])->name('gallery.album');
Route::get('/media', [PageController::class, 'media'])->name('media');
Route::get('/announcements', [PageController::class, 'announcements'])->name('announcements');
Route::get('/announcements/{announcement:slug}', [PageController::class, 'announcementShow'])->name('announcements.show');
Route::get('/reports', [PageController::class, 'reports'])->name('reports');
Route::get('/newsletters', [PageController::class, 'newsletters'])->name('newsletters');
Route::get('/strategic-plan', [PageController::class, 'strategicPlan'])->name('strategic-plan');
Route::get('/articles', [PageController::class, 'articles'])->name('articles');
Route::get('/resources/{resourceItem:slug}', [PageController::class, 'resourceShow'])->name('resources.show');
Route::get('/members', [MemberController::class, 'index'])->name('members.index');
Route::get('/members/{memberOrganization:slug}', [MemberController::class, 'show'])->name('members.show');
Route::get('/members-portal', [PageController::class, 'membersPortal'])->name('members-portal');
Route::get('/member-updates', [PageController::class, 'memberUpdates'])->name('member-updates');
Route::get('/partners', [PageController::class, 'partners'])->name('partners');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::post('/contact', [ContactMessageController::class, 'store'])->middleware('throttle:6,1')->name('contact.store');
Route::get('/donate', [DonationController::class, 'create'])->name('donate');
Route::post('/donate', [DonationController::class, 'store'])->middleware('throttle:6,1')->name('donate.store');
Route::get('/partner-with-us', [PartnershipRequestController::class, 'create'])->name('partner-with-us');
Route::post('/partner-with-us', [PartnershipRequestController::class, 'store'])->middleware('throttle:6,1')->name('partner-with-us.store');
Route::get('/whistle-blowers', [PageController::class, 'whistleBlowers'])->name('whistle-blowers');
Route::post('/whistle-blowers', [WhistleblowerReportController::class, 'store'])->middleware('throttle:4,1')->name('whistle-blowers.store');

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthController::class, 'create'])->middleware('no_back_history')->name('login');
    Route::get('/admin/login', [AuthController::class, 'create'])->defaults('portal', 'admin')->middleware('no_back_history')->name('admin.login');
    Route::get('/member/login', [AuthController::class, 'create'])->defaults('portal', 'member')->middleware('no_back_history')->name('member.login');
});

Route::post('/login', [AuthController::class, 'store'])->middleware('throttle:login')->name('login.store');

Route::post('/logout', [AuthController::class, 'destroy'])->middleware('auth')->name('logout');
Route::post('/security/close-session', [AuthController::class, 'closeSession'])->middleware('auth')->name('security.close-session');

Route::middleware(['auth', 'account_active', 'secure_session', 'member', 'no_back_history'])->prefix('member')->name('member.')->group(function (): void {
    Route::redirect('/', '/member/dashboard');
    Route::get('/dashboard', MemberDashboardController::class)->name('dashboard');
    Route::get('/profile', [MemberProfileController::class, 'show'])->name('profile.show');
    Route::patch('/profile', [MemberProfileController::class, 'update'])->name('profile.update');
    Route::get('/submissions', [MemberSubmissionController::class, 'index'])->name('submissions.index');
    Route::get('/submissions/create', [MemberSubmissionController::class, 'create'])->name('submissions.create');
    Route::post('/submissions', [MemberSubmissionController::class, 'store'])->name('submissions.store');
    Route::get('/submissions/{submission}/edit', [MemberSubmissionController::class, 'edit'])->name('submissions.edit');
    Route::put('/submissions/{submission}', [MemberSubmissionController::class, 'update'])->name('submissions.update');
    Route::delete('/submissions/{submission}', [MemberSubmissionController::class, 'destroy'])->name('submissions.destroy');
});

Route::middleware(['auth', 'account_active', 'secure_session', 'admin', 'no_back_history'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::redirect('/', '/admin/dashboard');
    Route::get('/dashboard', DashboardController::class)->middleware('permission:view dashboard')->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    Route::middleware(['role:Super Admin', 'permission:manage users'])->group(function (): void {
        Route::resource('/users', UserController::class)->except('show');
        Route::patch('/users/{user}/block', [UserController::class, 'toggleBlock'])->name('users.block');
    });

    Route::middleware(['role:Super Admin', 'permission:manage settings'])->group(function (): void {
        Route::get('/settings', [SiteSettingController::class, 'index'])->name('settings.index');
        Route::patch('/settings', [SiteSettingController::class, 'update'])->name('settings.update');
    });

    Route::resource('/stats', HomepageStatController::class)->middleware('permission:manage homepage stats')->except(['show', 'destroy']);
    Route::middleware('permission:manage hero section')->group(function (): void {
        Route::get('/hero-section', [HeroSectionController::class, 'edit'])->name('hero-section.edit');
        Route::patch('/hero-section', [HeroSectionController::class, 'update'])->name('hero-section.update');
    });
    Route::resource('/programs', ProgramController::class)->middleware('permission:manage programs')->except(['show', 'destroy']);
    Route::resource('/news', NewsPostController::class)->middleware('permission:manage news')->parameters(['news' => 'news'])->except(['show', 'destroy']);
    Route::resource('/announcements', AnnouncementController::class)->middleware('permission:manage announcements')->except(['show', 'destroy']);
    Route::resource('/resources', ResourceItemController::class)->middleware('permission:manage resources')->parameters(['resources' => 'resource'])->except(['show', 'destroy']);
    Route::resource('/media-albums', MediaAlbumController::class)->middleware('permission:manage media')->parameters(['media-albums' => 'album'])->except(['show', 'destroy']);
    Route::resource('/media', MediaItemController::class)->middleware('permission:manage media')->parameters(['media' => 'medium'])->except(['show', 'destroy']);
    Route::resource('/members', MemberOrganizationController::class)->middleware('role_or_permission:Super Admin|manage members')->parameters(['members' => 'member'])->except(['show', 'destroy']);
    Route::patch('/members/{member}/account-block', [MemberOrganizationController::class, 'toggleAccountBlock'])->middleware('role_or_permission:Super Admin|manage members')->name('members.account-block');
    Route::resource('/partners', PartnerController::class)->middleware('permission:manage partners')->except(['show', 'destroy']);
    Route::resource('/leadership-profiles', LeadershipProfileController::class)->middleware('permission:manage leadership profiles')->except(['show', 'destroy']);
    Route::patch('/leadership-profiles/{leadershipProfile}/clear-photo', [LeadershipProfileController::class, 'clearPhoto'])->middleware('permission:manage leadership profiles')->name('leadership-profiles.clear-photo');

    Route::middleware('permission:manage visibility')->group(function (): void {
        Route::patch('/stats/{stat}/visibility', [HomepageStatController::class, 'toggleVisibility'])->name('stats.visibility');
        Route::patch('/programs/{program}/visibility', [ProgramController::class, 'toggleVisibility'])->name('programs.visibility');
        Route::patch('/news/{news}/archive', [NewsPostController::class, 'archive'])->name('news.archive');
        Route::patch('/announcements/{announcement}/archive', [AnnouncementController::class, 'archive'])->name('announcements.archive');
        Route::patch('/resources/{resource}/archive', [ResourceItemController::class, 'archive'])->name('resources.archive');
        Route::patch('/media-albums/{album}/visibility', [MediaAlbumController::class, 'toggleVisibility'])->name('media-albums.visibility');
        Route::patch('/media/{medium}/visibility', [MediaItemController::class, 'toggleVisibility'])->name('media.visibility');
        Route::patch('/members/{member}/visibility', [MemberOrganizationController::class, 'toggleVisibility'])->name('members.visibility');
        Route::patch('/partners/{partner}/visibility', [PartnerController::class, 'toggleVisibility'])->name('partners.visibility');
        Route::patch('/leadership-profiles/{leadershipProfile}/visibility', [LeadershipProfileController::class, 'toggleVisibility'])->name('leadership-profiles.visibility');
    });

    Route::middleware('permission:manage contact messages')->group(function (): void {
        Route::get('/contact-messages', [AdminContactMessageController::class, 'index'])->name('contact-messages.index');
        Route::get('/contact-messages/{contactMessage}', [AdminContactMessageController::class, 'show'])->name('contact-messages.show');
        Route::patch('/contact-messages/{contactMessage}', [AdminContactMessageController::class, 'update'])->name('contact-messages.update');
    });

    Route::middleware('permission:manage member submissions')->group(function (): void {
        Route::get('/member-submissions', [AdminMemberSubmissionController::class, 'index'])->name('member-submissions.index');
        Route::get('/member-submissions/{memberSubmission}', [AdminMemberSubmissionController::class, 'show'])->name('member-submissions.show');
        Route::patch('/member-submissions/{memberSubmission}', [AdminMemberSubmissionController::class, 'update'])->name('member-submissions.update');
    });

    Route::middleware('permission:manage donations')->group(function (): void {
        Route::get('/donations', [AdminDonationController::class, 'index'])->name('donations.index');
        Route::get('/donations/{donation}', [AdminDonationController::class, 'show'])->name('donations.show');
        Route::get('/donations/{donation}/invoice', [AdminDonationController::class, 'printInvoice'])->name('donations.invoice');
        Route::get('/donations/{donation}/invoice.pdf', [AdminDonationController::class, 'downloadInvoice'])->name('donations.invoice.pdf');
        Route::patch('/donations/{donation}', [AdminDonationController::class, 'update'])->name('donations.update');
        Route::post('/donations/{donation}/send-instructions', [AdminDonationController::class, 'sendInstructions'])->name('donations.send-instructions');
    });

    Route::middleware('permission:manage partnership requests')->group(function (): void {
        Route::get('/partnership-requests', [AdminPartnershipRequestController::class, 'index'])->name('partnership-requests.index');
        Route::get('/partnership-requests/{partnershipRequest}', [AdminPartnershipRequestController::class, 'show'])->name('partnership-requests.show');
        Route::patch('/partnership-requests/{partnershipRequest}', [AdminPartnershipRequestController::class, 'update'])->name('partnership-requests.update');
    });

    Route::get('/visitors', VisitorAnalyticsController::class)->middleware('permission:manage visitor analytics')->name('visitors.index');

    Route::middleware('permission:manage whistleblower reports')->group(function (): void {
        Route::get('/whistleblower-reports', [AdminWhistleblowerReportController::class, 'index'])->name('whistleblower-reports.index');
        Route::get('/whistleblower-reports/{whistleblowerReport}', [AdminWhistleblowerReportController::class, 'show'])->name('whistleblower-reports.show');
        Route::patch('/whistleblower-reports/{whistleblowerReport}', [AdminWhistleblowerReportController::class, 'update'])->name('whistleblower-reports.update');
    });

    Route::middleware('permission:delete records')->group(function (): void {
        Route::delete('/stats/{stat}', [HomepageStatController::class, 'destroy'])->name('stats.destroy');
        Route::delete('/programs/{program}', [ProgramController::class, 'destroy'])->name('programs.destroy');
        Route::delete('/news/{news}', [NewsPostController::class, 'destroy'])->name('news.destroy');
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
        Route::delete('/resources/{resource}', [ResourceItemController::class, 'destroy'])->name('resources.destroy');
        Route::delete('/media-albums/{album}', [MediaAlbumController::class, 'destroy'])->name('media-albums.destroy');
        Route::delete('/media/{medium}', [MediaItemController::class, 'destroy'])->name('media.destroy');
        Route::delete('/members/{member}', [MemberOrganizationController::class, 'destroy'])->name('members.destroy');
        Route::delete('/partners/{partner}', [PartnerController::class, 'destroy'])->name('partners.destroy');
        Route::delete('/leadership-profiles/{leadershipProfile}', [LeadershipProfileController::class, 'destroy'])->name('leadership-profiles.destroy');
        Route::delete('/member-submissions/{memberSubmission}', [AdminMemberSubmissionController::class, 'destroy'])->name('member-submissions.destroy');
        Route::delete('/contact-messages/{contactMessage}', [AdminContactMessageController::class, 'destroy'])->name('contact-messages.destroy');
        Route::delete('/donations/{donation}', [AdminDonationController::class, 'destroy'])->name('donations.destroy');
        Route::delete('/partnership-requests/{partnershipRequest}', [AdminPartnershipRequestController::class, 'destroy'])->name('partnership-requests.destroy');
        Route::delete('/whistleblower-reports/{whistleblowerReport}', [AdminWhistleblowerReportController::class, 'destroy'])->name('whistleblower-reports.destroy');
    });
});
