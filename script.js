/**
 * ==========================================================================
 * DEBUG CLUB - MAIN CLIENT SCRIPT
 * Features:
 * - Supabase Integration (Events, Member Podium & Leaderboard, Guest Registration)
 * - Public vs. Private Event Logic (Free Entry vs. Registration Required)
 * - Auto Categorization: Upcoming Events vs. Completed / Organized Events
 * - Top Members Hall of Fame (Dynamic 3D Podium & Mobile App Showcase)
 * - Mobile Navigation Menu (Animated Hamburger & Backdrop)
 * - Event Poster Fullscreen Lightbox
 * - Floating Back to Top Button
 * - OTP 60s Resend Cooldown
 * - Multi-language System (English & Arabic with RTL Support)
 * - Google Apps Script Integration (Membership Join & OTP Verification)
 * - Dynamic Event Fields & Safe DOM Rendering (XSS Protection)
 * ==========================================================================
 */

// ---------------------------------------------------------------------------
// Supabase Configuration & Client Initialization
// ---------------------------------------------------------------------------
const SUPABASE_URL = 'https://iewupcxspauflnjicehs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_31x2wH32MH6Yfjhr8Il7hA_2k1yKnMb';

const supabaseClient = (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function')
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ---------------------------------------------------------------------------
// Google Apps Script Membership Endpoint
// ---------------------------------------------------------------------------
const JOIN_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZcOBO8IcJL91jIySzi6A0Ziip4Yrj_S1pjFdW-mpiVF7q1X5tOhMC2_3E_b5mhwVI0w/exec';

// ---------------------------------------------------------------------------
// I18N: Translations Dictionary (English & Arabic)
// ---------------------------------------------------------------------------
const translations = {
  en: {
    lang_btn: "العربية",
    page_title: "Debug Club",
    nav_about: "About",
    nav_events: "Events",
    nav_ranks: "Top Members",
    nav_faq: "FAQ",
    nav_join: "Join Us",
    nav_contact: "Contact Us",
    hero_title: "Welcome to Debug Club",
    hero_desc: "Welcome to our campus community! Whether you want to code, solve challenges, shoot video, create designs, or just play games and break the university routine—you're in the right place. Join our hands-on workshops, free talks, and competitions, and build cool things with us.",
    cta_get_started: "Register Now",
    cta_download_apk: "Download APK via Google Drive",
    about_title: "About Debug Club",
    about_p1: "We are Debug Club, a scientific student club dedicated to learning, creating, and having fun together. We organize practical classes, hands-on workshops, and competitions covering a wide range of fields—including programming, robotics, PC hardware components, graphic design, photography, videography, editing, and competitive problem-solving.",
    about_p2: "Beyond technical skills, we also organize gaming events and social activities where members can play together, connect, and de-stress from academic life. That is just a small glimpse of what we do!",
    events_main_title: "Our Events",
    events_filter_all: "All Events",
    events_filter_upcoming: "Upcoming Events",
    events_filter_past: "Events We've Organized",
    upcoming_events_title: "Upcoming Events",
    past_events_title: "Events We Have Organized",
    badge_private: "🔒 Private Event",
    badge_public: "🌐 Public Event",
    badge_upcoming: "● Upcoming",
    badge_completed: "✓ Completed",
    btn_register_private: "Register via Form",
    btn_public_open: "Free Entry • Open to All",
    btn_event_completed: "Event Completed",
    no_upcoming_events: "No upcoming events scheduled right now. Stay tuned for our next announcement!",
    no_past_events: "No past events recorded yet.",
    public_event_notice: "Free admission for everyone — no registration needed.",
    private_event_notice: "Registration required — spots are limited.",
    event_ended_notice: "This event has already ended. Registrations are closed.",
    public_reg_optional: "Notice: This is a public event with open admission! Filling this form is optional for attendance XP.",
    failed_load_events: "Failed to load events. Please try again later.",
    ranks_title: "Top Club Members",
    ranks_subtitle: "Celebrating our most active members, contributors, and high achievers.",
    rank_1_title: "Champion",
    rank_2_title: "2nd Place",
    rank_3_title: "3rd Place",
    no_ranks: "No ranked members yet.",
    failed_load_ranks: "Failed to load member rankings.",
    faq_title: "Frequently Asked Questions",
    faq_q1: "Do I need prior coding experience to join?",
    faq_a1: "No! We welcome beginners and experienced developers alike across all our tracks (programming, robotics, design, editing, and gaming).",
    faq_q2: "What will I gain by joining the club?",
    faq_a2: "You will gain hands-on technical skills across coding, hardware, and creative design, build real projects with a passionate team, compete in hackathons and club tournaments, earn XP on our mobile app leaderboard, and make lasting friendships that go beyond university walls.",
    faq_q3: "How does the ranking system work on the mobile app?",
    faq_a3: "You earn points and XP by participating in workshops, competing in challenges, and joining club activities.",
    faq_q4: "Will joining the club help my professional career?",
    faq_a4: "Absolutely. You will build a solid portfolio through hands-on team projects, gain experience using modern industry tools, and develop critical soft skills like leadership, teamwork, and problem-solving that set you apart in tech job interviews.",
    faq_q5: "Do members receive certificates for participation or training?",
    faq_a5: "Yes, active members receive recognized certificates of participation upon completing specialized workshops, bootcamps, and hackathons.",
    faq_q6: "How can I host a workshop or manage an event within the club?",
    faq_a6: "We actively encourage knowledge sharing! Any member with a passion or skill can submit a workshop proposal or event initiative. Our core team provides full logistical, technical, and organizational support to bring your idea to life.",
    join_title: "Join Us",
    join_desc: "Fill out the form below or register through our mobile app to become an official member.",
    label_fullname: "Full Name (Latin):",
    ph_fullname: "e.g. Ammari Massil",
    label_fullname_ar: "Full Name (Arabic):",
    ph_fullname_ar: "مثال: عماري ماسيل",
    label_student_id: "Student ID Card (Matricule):",
    ph_student_id: "e.g. 232335012345",
    label_email: "Email Address:",
    ph_email: "e.g. debugclub.fsesnv@univ-biskra.dz",
    btn_send_code: "Send Code",
    btn_resend_code: "Resend Code",
    btn_sending_code: "Sending...",
    label_otp: "Verification Code (sent to your email):",
    ph_otp: "Enter 6-digit code",
    label_phone: "Phone Number:",
    tag_optional: "(Optional)",
    ph_phone: "e.g. 0661234567",
    label_major: "Major (Field of Study, Specialty in university):",
    ph_major: "e.g. Faculty of Science and Technology",
    label_year: "Study Year:",
    opt_choose_year: "Select Study Year",
    label_department: "Department:",
    opt_choose_dept: "Select Department",
    dept_ps: "Problem Solving",
    dept_sm: "Social Media",
    dept_robotic: "Robotic",
    dept_forms: "Forms & Logistics",
    dept_others: "Others",
    label_social_sub: "Social Media Role:",
    opt_choose_role: "Select Role",
    sm_shooting: "Shooting",
    sm_editing: "Editing",
    sm_design: "Design",
    label_other_dept: "Specify Department:",
    ph_other_dept: "Specify your desired department",
    label_why_join: "Why do you want to join us?:",
    ph_why_join: "e.g. I love programming!",
    label_club_exp: "Do you have previous experience with clubs?:",
    ph_club_exp: "If yes, tell us more about your experience",
    label_portfolio: "Portfolio Link:",
    ph_portfolio: "e.g. https://github.com/username",
    btn_submit_app: "Submit Application",
    btn_submitting_app: "Submitting...",
    contact_title: "Contact Us",
    contact_desc: "Connect with us on our official social channels or visit us on campus:",
    contact_email_lbl: "Email:",
    contact_loc_lbl: "Location:",
    contact_loc_val: "University Mohamed Khider Biskra",
    footer_copy: "© 2026 Debug Club. All rights reserved.",
    back_home: "← Back to Home",
    event_reg_title: "Event Registration - Debug Club",
    event_reg_heading: "Event Registration",
    event_reg_desc: "Complete the form below to secure your spot for the event.",
    ph_event_fullname: "e.g. Massil Ammari",
    ph_event_email: "e.g. massil@example.com",
    label_faculty: "Faculty / Specialty:",
    ph_faculty: "e.g. NTIC / Exact Sciences",
    label_why_interested: "Why are you interested?:",
    ph_why_interested: "e.g. Excited to participate!",
    loading_questions: "Loading event questions...",
    no_event_selected: "No event selected. Please choose an event from the homepage.",
    btn_confirm_event_reg: "Confirm Event Registration",
    btn_registering_event: "Registering...",
    alert_enter_email: "Please enter your email address first.",
    alert_enter_otp: "Please enter the verification code sent to your email.",
    alert_select_dept: "Please select a department.",
    alert_select_sm_role: "Please select your Social Media role.",
    alert_specify_other: "Please specify your desired department.",
    alert_conn_error: "Connection error. Please try again.",
    alert_reg_success: "Registered successfully! See you at the event.",
    alert_reg_fail: "Registration failed. Please check your details and try again."
  },
  ar: {
    lang_btn: "English",
    page_title: "نادي Debug Club",
    nav_about: "حول النادي",
    nav_events: "الفعاليات",
    nav_ranks: "أفضل الأعضاء",
    nav_faq: "الأسئلة الشائعة",
    nav_join: "انضم إلينا",
    nav_contact: "تواصل معنا",
    hero_title: "مرحباً بكم في Debug Club",
    hero_desc: "مرحباً بكم في مجتمعنا! سواء كنت تريد تعلم البرمجة، خوض تحديات حل المشكلات، التصوير والتصميم، أو كسر الروتين الجامعي في بطولات الألعاب—مكانك هنا بيننا. انضم لورشاتنا التطبيقية، نقاشاتنا المفتوحة، ومسابقاتنا، وشارِكنا التجربة.",
    cta_get_started: "سجل الآن",
    cta_download_apk: "تحميل التطبيق APK عبر Drive",
    about_title: "عن نادي Debug Club",
    about_p1: "نحن Debug Club، نادٍ علمي طلابي مكرس للتعلم والابتكار وصناعة الإنجاز معاً. ننظم ورش عمل تطبيقية ومسابقات تغطي مجالات متنوعة تشمل البرمجة، الروبوتيكس، مكونات الحاسوب، التصميم الجرافيكي، التصوير، المونتاج وحل المشكلات البرمجية.",
    about_p2: "وإلى جانب المهارات التقنية، ننظم أيضاً أياماً مفتوحة للعب وأنشطة ترفيهية مميزة للتواصل وتخفيف الضغط الدراسي. وهذه مجرد لمحة بسيطة عما نقوم به!",
    events_main_title: "فعاليات النادي",
    events_filter_all: "جميع الفعاليات",
    events_filter_upcoming: "الفعاليات القادمة",
    events_filter_past: "فعاليات نظّمناها",
    upcoming_events_title: "الفعاليات القادمة",
    past_events_title: "فعاليات تم تنظيمها",
    badge_private: "🔒 فعالية خاصة",
    badge_public: "🌐 فعالية عامة",
    badge_upcoming: "● قادمة",
    badge_completed: "✓ تمت الفعالية",
    btn_register_private: "التسجيل في الفعالية",
    btn_public_open: "الدخول حر • مفتوح للجميع",
    btn_event_completed: "انتهت الفعالية",
    no_upcoming_events: "لا توجد فعاليات قادمة في الوقت الحالي. ترقبوا جديدنا قريباً!",
    no_past_events: "لا توجد فعاليات سابقة مسجلة حالياً.",
    public_event_notice: "الدخول مجاني ومفتوح للجميع — لا يتطلب تسجيلاً مسبقاً.",
    private_event_notice: "التسجيل مطلوب لحجز مقعدك — المقاعد محدودة.",
    event_ended_notice: "لقد انتهت هذه الفعالية بالفعل، وباب التسجيل مغلق حالياً.",
    public_reg_optional: "ملاحظة: هذه فعالية عامة والدخول متاح للجميع! التسجيل عبر الاستمارة اختياري لتوثيق الحضور.",
    failed_load_events: "تعذر تحميل الفعاليات. يرجى المحاولة لاحقاً.",
    ranks_title: "لوحة شرف أفضل الأعضاء",
    ranks_subtitle: "نحتفي بالأعضاء الأكثر نشاطاً وتفاعلاً ومساهمةً في أنشطة النادي.",
    rank_1_title: "المركز الأول",
    rank_2_title: "المركز الثاني",
    rank_3_title: "المركز الثالث",
    no_ranks: "لا يوجد أعضاء في لوحة المتصدرين حالياً.",
    failed_load_ranks: "تعذر تحميل ترتيب الأعضاء.",
    faq_title: "الأسئلة الشائعة",
    faq_q1: "هل أحتاج لخبرة سابقة في البرمجة حتى أنضم؟",
    faq_a1: "بالتأكيد لا! نرحب بجميع المستويات من المبتدئين إلى المتمرسين عبر جميع مساراتنا (البرمجة، الروبوتيكس، التصميم، المونتاج، والألعاب).",
    faq_q2: "ما الذي سأستفيده عند انضمامي إلى النادي؟",
    faq_a2: "ستكتسب مهارات تطبيقية قوية في مجالات البرمجة، العتاد، والتصميم الإبداعي، وتعمل على مشاريع حقيقية ضمن فريق شغوف، إلى جانب المشاركة في الهاكاثونات والبطولات التنافسية، وجمع نقاط XP لتصدر الترتيب في التطبيق، وبناء علاقات وصداقات قوية تمتد إلى ما بعد الحياة الجامعية.",
    faq_q3: "كيف يعمل نظام النقاط والتصنيف في التطبيق؟",
    faq_a3: "تكتسب النقاط والـ XP من خلال الحضور في الورش، حل التحديات، والمشاركة في أنشطة النادي.",
    faq_q4: "هل يساعدني النادي في مساري المهني والعملي؟",
    faq_a4: "بالتأكيد. ستعمل على مشاريع تطبيقية تبني بها معرض أعمالك (Portfolio)، وتكتسب خبرة في استخدام أحدث أدوات العمل، وتطور مهارات شخصية وقيادية أساسية تمنحك أفضلية حقيقية في مقابلات العمل.",
    faq_q5: "هل يحصل الأعضاء على شهادات مشاركة أو تدريب؟",
    faq_a5: "نعم، يحصل الأعضاء والملتحقون على شهادات مشاركة عند إتمام الورشات المتخصصة والمعسكرات التدريبية والهاكاثونات.",
    faq_q6: "كيف تتاح لي فرصة تقديم ورشة تدريبية أو إدارة حدث في النادي؟",
    faq_a6: "نشجع دائماً ثقافة تبادل المعرفة! يمكن لأي عضو يمتلك مهارة أو فكرة حدث تقديم مقترح للإدارة، وسيقوم فريق النادي بتوفير كامل الدعم اللوجستي والتقني والتنظيمي لإنجاح ورشته.",
    join_title: "انضم إلينا",
    join_desc: "املأ الاستمارة أدناه أو سجّل عبر تطبيق الهاتف لتصبح عضواً رسمياً في النادي.",
    label_fullname: "الاسم الكامل (باللاتينية):",
    ph_fullname: "مثال: Ammari Massil",
    label_fullname_ar: "الاسم الكامل (بالعربية):",
    ph_fullname_ar: "مثال: عماري ماسيل",
    label_student_id: "رقم بطاقة الطالب (رقم التسجيل الجامعي):",
    ph_student_id: "مثال: 232335012345",
    label_email: "البريد الإلكتروني:",
    ph_email: "مثال: debugclub.fsesnv@univ-biskra.dz",
    btn_send_code: "إرسال الرمز",
    btn_resend_code: "إعادة الإرسال",
    btn_sending_code: "جارٍ الإرسال...",
    label_otp: "رمز التحقق (المُرسل إلى بريدك الإلكتروني):",
    ph_otp: "أدخل الرمز المكون من 6 أرقام",
    label_phone: "رقم الهاتف:",
    tag_optional: "(اختياري)",
    ph_phone: "مثال: 0661234567",
    label_major: "التخصص (المجال الدراسي في الجامعة):",
    ph_major: "مثال: كلية العلوم الدقيقة قسم الإعلام الآلي",
    label_year: "السنة الدراسية:",
    opt_choose_year: "اختر السنة الدراسية",
    label_department: "القسم / اللجنة:",
    opt_choose_dept: "اختر القسم",
    dept_ps: "حل المشكلات البرمجية (Problem Solving)",
    dept_sm: "الإعلام وصناعة المحتوى (Social Media)",
    dept_robotic: "الروبوتيكس (Robotic)",
    dept_forms: "الاستمارات والتنظيم (Forms & Logistics)",
    dept_others: "أخرى (Others)",
    label_social_sub: "التخصص في الإعلام:",
    opt_choose_role: "اختر التخصص الفرعي",
    sm_shooting: "التصوير (Shooting)",
    sm_editing: "المونتاج (Editing)",
    sm_design: "التصميم (Design)",
    label_other_dept: "حدد القسم المطلوب:",
    ph_other_dept: "اكتب القسم الذي ترغب بالانضمام إليه",
    label_why_join: "لماذا ترغب في الانضمام إلينا؟:",
    ph_why_join: "مثال: الشغف بتعلم البرمجة وتطوير المهارات!",
    label_club_exp: "هل لديك تجارب سابقة مع نوادي طلابية؟:",
    ph_club_exp: "إذا كانت الإجابة نعم، أخبرنا عن خبرتك باختصار",
    label_portfolio: "رابط أعمالك أو حسابك (Portfolio):",
    ph_portfolio: "مثال: https://github.com/username",
    btn_submit_app: "إرسال طلب العضوية",
    btn_submitting_app: "جارٍ الإرسال...",
    contact_title: "تواصل معنا",
    contact_desc: "تابعنا عبر شبكات التواصل الرسمية أو تفضل بزيارتنا في الجامعة:",
    contact_email_lbl: "البريد الإلكتروني:",
    contact_loc_lbl: "المقر:",
    contact_loc_val: "جامعة محمد خيضر بسكرة",
    footer_copy: "© 2026 Debug Club. جميع الحقوق محفوظة.",
    back_home: "العودة إلى الرئيسية →",
    event_reg_title: "تسجيل الفعالية - Debug Club",
    event_reg_heading: "تسجيل الفعالية",
    event_reg_desc: "أكمل الاستمارة أدناه لتأكيد حجز مقعدك في الفعالية.",
    ph_event_fullname: "مثال: عماري ماسيل",
    ph_event_email: "مثال: massil@example.com",
    label_faculty: "الكلية / التخصص:",
    ph_faculty: "مثال: كلية العلوم الدقيقة",
    label_why_interested: "لماذا أنت مهتم بحضور الفعالية؟:",
    ph_why_interested: "مثال: متحمس لاكتساب المهارات والتطبيق العملي!",
    loading_questions: "جارٍ تحميل أسئلة الفعالية...",
    no_event_selected: "لم يتم تحديد أي فعالية. يرجى اختيار فعالية من الصفحة الرئيسية.",
    btn_confirm_event_reg: "تأكيد التسجيل في الفعالية",
    btn_registering_event: "جارٍ التسجيل...",
    alert_enter_email: "يرجى كتابة البريد الإلكتروني أولاً.",
    alert_enter_otp: "يرجى إدخال رمز التحقق المرسل لبريدك الإلكتروني.",
    alert_select_dept: "يرجى اختيار القسم المطلوب.",
    alert_select_sm_role: "يرجى اختيار التخصص الفرعي لقسم الإعلام.",
    alert_specify_other: "يرجى كتابة وتحديد القسم المطلوب.",
    alert_conn_error: "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
    alert_reg_success: "تم التسجيل بنجاح! ننتظر حضورك في الفعالية.",
    alert_reg_fail: "تعذر التسجيل. يرجى التأكد من البيانات والمحاولة مجدداً."
  }
};

// ---------------------------------------------------------------------------
// Security & Sanitization Helpers (XSS Protection)
// ---------------------------------------------------------------------------
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/') || trimmed.startsWith('./')) {
    return trimmed;
  }
  return '';
}

// ---------------------------------------------------------------------------
// Event Helper Functions: Type & Status
// ---------------------------------------------------------------------------
function isEventEnded(event) {
  if (!event) return false;
  const status = String(event.status || '').toLowerCase().trim();
  if (status === 'completed' || status === 'ended' || status === 'cancelled') {
    return true;
  }
  if (event.event_date) {
    const eventTime = new Date(event.event_date).getTime();
    if (!isNaN(eventTime)) {
      return eventTime < Date.now();
    }
  }
  return false;
}

function isPrivateEvent(event) {
  if (!event) return false;
  return String(event.event_type || '').toLowerCase().trim() === 'private';
}

// ---------------------------------------------------------------------------
// Language Management
// ---------------------------------------------------------------------------
let activeCustomEventTitle = null;

function getCurrentLang() {
  return localStorage.getItem('debug_club_lang') || 'en';
}

function setLanguage(lang) {
  const selectedLang = (lang === 'ar') ? 'ar' : 'en';
  localStorage.setItem('debug_club_lang', selectedLang);

  document.documentElement.lang = selectedLang;
  document.documentElement.dir = (selectedLang === 'ar') ? 'rtl' : 'ltr';

  const t = translations[selectedLang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.id === 'event-title' && activeCustomEventTitle) {
      el.textContent = activeCustomEventTitle;
      return;
    }
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      el.setAttribute('placeholder', t[key]);
    }
  });

  const langBtn = document.getElementById('lang-switch-btn');
  if (langBtn) {
    langBtn.textContent = t.lang_btn;
  }

  if (typeof renderDynamicFields === 'function') {
    renderDynamicFields();
  }
}

function initLanguageSwitch() {
  const langBtn = document.getElementById('lang-switch-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = (getCurrentLang() === 'en') ? 'ar' : 'en';
      setLanguage(nextLang);
      loadEvents();
      loadLeaderboard();
    });
  }
  setLanguage(getCurrentLang());
}

// ---------------------------------------------------------------------------
// Mobile Navigation (Animated Hamburger Menu & Smooth Scroll)
// ---------------------------------------------------------------------------
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle('nav-open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when clicking any nav link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target) && !toggleBtn.contains(e.target)) {
      nav.classList.remove('nav-open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---------------------------------------------------------------------------
// Floating Back to Top Button
// ---------------------------------------------------------------------------
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top-btn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------------------------------------------------------------------------
// Event Poster Fullscreen Lightbox Modal
// ---------------------------------------------------------------------------
function initImageLightbox() {
  let lightbox = document.getElementById('image-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button type="button" class="lightbox-close" aria-label="Close image">&times;</button>
        <img src="" alt="Enlarged poster" class="lightbox-img">
      </div>
    `;
    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Delegate click for event posters
  document.addEventListener('click', (e) => {
    const imgWrapper = e.target.closest('.event-image-wrapper');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img && img.src) {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Event poster';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Event Card DOM Component (Reusable for Upcoming & Past Events)
// ---------------------------------------------------------------------------
function createEventCard(event, currentLang) {
  const t = translations[currentLang];
  const ended = isEventEnded(event);
  const isPrivate = isPrivateEvent(event);

  let formattedDate = 'TBA';
  let formattedTime = '';
  let isoDate = '';

  if (event.event_date) {
    const d = new Date(event.event_date);
    if (!isNaN(d.getTime())) {
      isoDate = d.toISOString().split('T')[0];
      formattedDate = d.toLocaleDateString(currentLang === 'ar' ? 'ar-DZ' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      formattedTime = d.toLocaleTimeString(currentLang === 'ar' ? 'ar-DZ' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  }

  const card = document.createElement('article');
  card.className = `event-card ${ended ? 'event-card-ended' : 'event-card-upcoming'} ${isPrivate ? 'event-card-private' : 'event-card-public'}`;

  // Image banner
  const safeImageUrl = sanitizeUrl(event.image_url);
  if (safeImageUrl) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'event-image-wrapper';
    imgWrapper.setAttribute('title', 'Click to view full poster');

    const img = document.createElement('img');
    img.src = safeImageUrl;
    img.alt = event.title || 'Event poster';
    img.className = 'event-banner-img';
    img.loading = 'lazy';

    imgWrapper.appendChild(img);
    card.appendChild(imgWrapper);
  }

  // Content wrapper
  const content = document.createElement('div');
  content.className = 'event-content';

  // Badges container
  const badgesContainer = document.createElement('div');
  badgesContainer.className = 'event-badges';

  // Type badge
  const typeBadge = document.createElement('span');
  if (isPrivate) {
    typeBadge.className = 'badge badge-private';
    typeBadge.textContent = t.badge_private;
  } else {
    typeBadge.className = 'badge badge-public';
    typeBadge.textContent = t.badge_public;
  }
  badgesContainer.appendChild(typeBadge);

  // Status badge
  const statusBadge = document.createElement('span');
  if (ended) {
    statusBadge.className = 'badge badge-ended';
    statusBadge.textContent = t.badge_completed;
  } else {
    statusBadge.className = 'badge badge-upcoming';
    statusBadge.textContent = t.badge_upcoming;
  }
  badgesContainer.appendChild(statusBadge);

  content.appendChild(badgesContainer);

  // Title
  const h3 = document.createElement('h3');
  h3.textContent = event.title || 'Untitled Event';
  content.appendChild(h3);

  // Meta (Date & Location)
  const meta = document.createElement('div');
  meta.className = 'event-meta';

  const timeP = document.createElement('p');
  if (isoDate) {
    const timeEl = document.createElement('time');
    timeEl.setAttribute('datetime', isoDate);
    timeEl.textContent = formattedDate;
    timeP.appendChild(timeEl);
    if (formattedTime) {
      timeP.appendChild(document.createTextNode(` | ${formattedTime}`));
    }
  } else {
    timeP.textContent = formattedDate;
  }
  meta.appendChild(timeP);

  const locP = document.createElement('p');
  locP.textContent = `📍 ${event.location || 'TBA'}`;
  meta.appendChild(locP);

  content.appendChild(meta);

  // Notice about registration vs open entry
  const noticeP = document.createElement('p');
  noticeP.className = 'event-type-notice';
  noticeP.textContent = isPrivate ? t.private_event_notice : t.public_event_notice;
  content.appendChild(noticeP);

  // Description
  if (event.description) {
    const descP = document.createElement('p');
    descP.className = 'event-desc';
    descP.textContent = event.description;
    content.appendChild(descP);
  }

  // Action Button / Indicator
  const actionContainer = document.createElement('div');
  actionContainer.className = 'event-action-container';

  if (ended) {
    const endedBtn = document.createElement('span');
    endedBtn.className = 'event-btn btn-ended';
    endedBtn.textContent = `✓ ${t.btn_event_completed}`;
    actionContainer.appendChild(endedBtn);
  } else if (isPrivate) {
    const regBtn = document.createElement('a');
    regBtn.className = 'event-btn btn-register';
    regBtn.href = `form.html?event_id=${encodeURIComponent(event.id)}&title=${encodeURIComponent(event.title || '')}`;
    regBtn.textContent = t.btn_register_private;
    actionContainer.appendChild(regBtn);
  } else {
    const openBtn = document.createElement('span');
    openBtn.className = 'event-btn btn-public-open';
    openBtn.textContent = `🌐 ${t.btn_public_open}`;
    actionContainer.appendChild(openBtn);
  }

  content.appendChild(actionContainer);
  card.appendChild(content);

  return card;
}

// ---------------------------------------------------------------------------
// 1. Home Page: Fetch & Display Events (Separated into Upcoming & Past)
// ---------------------------------------------------------------------------
async function loadEvents() {
  const upcomingContainer = document.getElementById('upcoming-events-container');
  const pastContainer = document.getElementById('past-events-container');
  const singleContainer = document.getElementById('events-container');

  if (!upcomingContainer && !pastContainer && !singleContainer) return;

  const currentLang = getCurrentLang();
  const t = translations[currentLang];

  if (!supabaseClient) {
    const errHtml = `<p class="error-msg">${escapeHTML(t.failed_load_events)}</p>`;
    if (upcomingContainer) upcomingContainer.innerHTML = errHtml;
    if (pastContainer) pastContainer.innerHTML = '';
    if (singleContainer) singleContainer.innerHTML = errHtml;
    return;
  }

  try {
    const { data: events, error } = await supabaseClient
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) throw error;

    const allEvents = events || [];

    const upcomingEvents = [];
    const pastEvents = [];

    allEvents.forEach(ev => {
      if (isEventEnded(ev)) {
        pastEvents.push(ev);
      } else {
        upcomingEvents.push(ev);
      }
    });

    upcomingEvents.sort((a, b) => {
      const da = a.event_date ? new Date(a.event_date).getTime() : 0;
      const db = b.event_date ? new Date(b.event_date).getTime() : 0;
      return da - db;
    });

    pastEvents.sort((a, b) => {
      const da = a.event_date ? new Date(a.event_date).getTime() : 0;
      const db = b.event_date ? new Date(b.event_date).getTime() : 0;
      return db - da;
    });

    // Update filter tabs with counts
    const tabAll = document.querySelector('[data-filter="all"]');
    const tabUpcoming = document.querySelector('[data-filter="upcoming"]');
    const tabPast = document.querySelector('[data-filter="past"]');

    if (tabAll) tabAll.textContent = `${t.events_filter_all} (${allEvents.length})`;
    if (tabUpcoming) tabUpcoming.textContent = `${t.events_filter_upcoming} (${upcomingEvents.length})`;
    if (tabPast) tabPast.textContent = `${t.events_filter_past} (${pastEvents.length})`;

    // Render Upcoming Events
    if (upcomingContainer) {
      upcomingContainer.innerHTML = '';
      if (upcomingEvents.length === 0) {
        upcomingContainer.innerHTML = `<p class="empty-msg">${escapeHTML(t.no_upcoming_events)}</p>`;
      } else {
        upcomingEvents.forEach(event => {
          upcomingContainer.appendChild(createEventCard(event, currentLang));
        });
      }
    }

    // Render Past Events
    if (pastContainer) {
      pastContainer.innerHTML = '';
      if (pastEvents.length === 0) {
        pastContainer.innerHTML = `<p class="empty-msg">${escapeHTML(t.no_past_events)}</p>`;
      } else {
        pastEvents.forEach(event => {
          pastContainer.appendChild(createEventCard(event, currentLang));
        });
      }
    }

    // Fallback for single container
    if (singleContainer && !upcomingContainer && !pastContainer) {
      singleContainer.innerHTML = '';
      if (allEvents.length === 0) {
        singleContainer.innerHTML = `<p class="empty-msg">${escapeHTML(t.no_upcoming_events)}</p>`;
      } else {
        allEvents.forEach(event => {
          singleContainer.appendChild(createEventCard(event, currentLang));
        });
      }
    }

  } catch (err) {
    console.error('Failed to load events:', err);
    const errHtml = `<p class="error-msg">${escapeHTML(t.failed_load_events)}</p>`;
    if (upcomingContainer) upcomingContainer.innerHTML = errHtml;
    if (singleContainer) singleContainer.innerHTML = errHtml;
  }
}

// ---------------------------------------------------------------------------
// Event Filter Tabs Functionality
// ---------------------------------------------------------------------------
function initEventFilterTabs() {
  const tabButtons = document.querySelectorAll('.event-tab-btn');
  const upcomingWrapper = document.getElementById('upcoming-events-wrapper');
  const pastWrapper = document.getElementById('past-events-wrapper');

  if (!tabButtons || tabButtons.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      if (filter === 'all') {
        if (upcomingWrapper) upcomingWrapper.style.display = 'block';
        if (pastWrapper) pastWrapper.style.display = 'block';
      } else if (filter === 'upcoming') {
        if (upcomingWrapper) upcomingWrapper.style.display = 'block';
        if (pastWrapper) pastWrapper.style.display = 'none';
      } else if (filter === 'past') {
        if (upcomingWrapper) upcomingWrapper.style.display = 'none';
        if (pastWrapper) pastWrapper.style.display = 'block';
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 2. Home Page: Top Members Hall of Fame (Podium & Showcase)
// ---------------------------------------------------------------------------
function renderPodium(profiles, currentLang) {
  const container = document.getElementById('leaderboard-podium');
  if (!container) return;

  const t = translations[currentLang];
  container.innerHTML = '';

  const podiumGrid = document.createElement('div');
  podiumGrid.className = 'podium-grid';

  const rankSlots = [
    { rank: 1, badge: '🥇', slotTitle: t.rank_1_title, cardClass: 'podium-rank-1' },
    { rank: 2, badge: '🥈', slotTitle: t.rank_2_title, cardClass: 'podium-rank-2' },
    { rank: 3, badge: '🥉', slotTitle: t.rank_3_title, cardClass: 'podium-rank-3' }
  ];

  rankSlots.forEach(slot => {
    const profile = profiles[slot.rank - 1];
    if (!profile) return;

    const card = document.createElement('div');
    card.className = `podium-card ${slot.cardClass}`;

    const memberName = profile.full_name?.trim() || (currentLang === 'ar' ? 'عضو النادي' : 'Club Member');
    const xpScore = `${(profile.xp ?? 0).toLocaleString()} XP`;
    const levelNumber = profile.level ? `Lv. ${profile.level}` : '';
    const safeAvatarUrl = sanitizeUrl(profile.avatar_url);

    const nameWords = memberName.split(' ').filter(Boolean);
    const initials = nameWords.length >= 2
      ? (nameWords[0][0] + nameWords[1][0]).toUpperCase()
      : (nameWords[0] ? nameWords[0].slice(0, 2).toUpperCase() : 'DC');

    // Rank Header
    const rankHeader = document.createElement('div');
    rankHeader.className = 'podium-rank-header';
    rankHeader.innerHTML = `
      <span class="rank-medal">${slot.badge}</span>
      <span class="rank-slot-title">${escapeHTML(slot.slotTitle)}</span>
    `;
    card.appendChild(rankHeader);

    // Avatar
    const avatarWrapper = document.createElement('div');
    avatarWrapper.className = 'podium-avatar-wrapper';

    if (slot.rank === 1) {
      const crown = document.createElement('span');
      crown.className = 'crown-icon';
      crown.setAttribute('aria-hidden', 'true');
      crown.textContent = '👑';
      avatarWrapper.appendChild(crown);
    }

    if (safeAvatarUrl) {
      const img = document.createElement('img');
      img.src = safeAvatarUrl;
      img.alt = memberName;
      img.className = 'podium-avatar-img';
      img.loading = 'lazy';

      const fallback = document.createElement('div');
      fallback.className = 'podium-avatar-fallback';
      fallback.style.display = 'none';
      fallback.textContent = initials;

      img.onerror = () => {
        img.style.display = 'none';
        fallback.style.display = 'flex';
      };

      avatarWrapper.appendChild(img);
      avatarWrapper.appendChild(fallback);
    } else {
      const fallback = document.createElement('div');
      fallback.className = 'podium-avatar-fallback';
      fallback.textContent = initials;
      avatarWrapper.appendChild(fallback);
    }

    if (levelNumber) {
      const lvl = document.createElement('span');
      lvl.className = 'podium-level-badge';
      lvl.textContent = levelNumber;
      avatarWrapper.appendChild(lvl);
    }

    card.appendChild(avatarWrapper);

    // Info
    const info = document.createElement('div');
    info.className = 'podium-member-info';

    const h3 = document.createElement('h3');
    h3.className = 'podium-member-name';
    h3.textContent = memberName;
    info.appendChild(h3);

    const xpPill = document.createElement('div');
    xpPill.className = 'podium-xp-pill';
    xpPill.innerHTML = `<span class="xp-val">${escapeHTML(xpScore)}</span>`;
    info.appendChild(xpPill);

    card.appendChild(info);
    podiumGrid.appendChild(card);
  });

  container.appendChild(podiumGrid);

  // Runners-Up (Ranks 4 and 5)
  if (profiles.length > 3) {
    const runnersUp = profiles.slice(3);
    const runnersWrapper = document.createElement('div');
    runnersWrapper.className = 'runners-up-card';

    runnersUp.forEach((profile, idx) => {
      const rankNum = idx + 4;
      const memberName = profile.full_name?.trim() || (currentLang === 'ar' ? 'عضو' : 'Member');
      const xpScore = `${(profile.xp ?? 0).toLocaleString()} XP`;
      const levelNumber = profile.level ? `Lv. ${profile.level}` : '';

      const row = document.createElement('div');
      row.className = 'runner-row';
      row.innerHTML = `
        <span class="runner-rank">#${rankNum}</span>
        <div class="runner-info">
          <span class="runner-name">${escapeHTML(memberName)}</span>
        </div>
        ${levelNumber ? `<span class="runner-level">${escapeHTML(levelNumber)}</span>` : ''}
        <span class="runner-xp">${escapeHTML(xpScore)}</span>
      `;
      runnersWrapper.appendChild(row);
    });

    container.appendChild(runnersWrapper);
  }
}

async function loadLeaderboard() {
  const container = document.getElementById('leaderboard-podium');
  if (!container) return;

  const currentLang = getCurrentLang();
  const t = translations[currentLang];

  if (!supabaseClient) {
    container.innerHTML = `<p class="error-msg">${escapeHTML(t.failed_load_ranks)}</p>`;
    return;
  }

  try {
    const { data: profiles, error } = await supabaseClient
      .from('profiles')
      .select('full_name, member_id, xp, level, avatar_url')
      .order('xp', { ascending: false })
      .limit(5);

    if (error) throw error;

    if (!profiles || profiles.length === 0) {
      container.innerHTML = `<p class="empty-msg">${escapeHTML(t.no_ranks)}</p>`;
      return;
    }

    renderPodium(profiles, currentLang);

  } catch (err) {
    console.error('Failed to load leaderboard:', err);
    container.innerHTML = `<p class="error-msg">${escapeHTML(t.failed_load_ranks)}</p>`;
  }
}

// ---------------------------------------------------------------------------
// 3. Home Page: Membership Join Form (Google Sheets & OTP with Cooldown)
// ---------------------------------------------------------------------------
let otpCooldownTimer = null;

function startOtpCooldown(sendOtpBtn, t) {
  let seconds = 60;
  sendOtpBtn.disabled = true;
  sendOtpBtn.innerText = `${t.btn_resend_code} (${seconds}s)`;

  if (otpCooldownTimer) clearInterval(otpCooldownTimer);

  otpCooldownTimer = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      sendOtpBtn.innerText = `${t.btn_resend_code} (${seconds}s)`;
    } else {
      clearInterval(otpCooldownTimer);
      otpCooldownTimer = null;
      sendOtpBtn.disabled = false;
      sendOtpBtn.innerText = t.btn_resend_code;
    }
  }, 1000);
}

function initJoinForm() {
  const form = document.getElementById('join-club-form') || document.getElementById('registration-form');
  const deptSelect = document.getElementById('department');
  if (!form || !deptSelect) return;

  const smGroup = document.getElementById('sm-subfield-group');
  const smSelect = document.getElementById('social_sub');
  const otherGroup = document.getElementById('other-dept-group');
  const otherInput = document.getElementById('other_dept_spec');

  const sendOtpBtn = document.getElementById('send-otp-btn');
  const otpGroup = document.getElementById('otp-group');
  const otpInput = document.getElementById('otp');
  const submitBtn = document.getElementById('submit-btn');

  deptSelect.addEventListener('change', () => {
    const val = deptSelect.value;
    if (val === 'Social Media') {
      smGroup.style.display = 'block';
      smSelect.required = true;
    } else {
      smGroup.style.display = 'none';
      smSelect.required = false;
      smSelect.value = '';
    }

    if (val === 'Others') {
      otherGroup.style.display = 'block';
      otherInput.required = true;
    } else {
      otherGroup.style.display = 'none';
      otherInput.required = false;
      otherInput.value = '';
    }
  });

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
      const t = translations[getCurrentLang()];
      const emailInput = document.getElementById('email');
      const email = emailInput?.value.trim();

      if (!email || !emailInput.checkValidity()) {
        alert(t.alert_enter_email);
        emailInput?.focus();
        return;
      }

      sendOtpBtn.innerText = t.btn_sending_code;
      sendOtpBtn.disabled = true;

      try {
        const response = await fetch(JOIN_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify({
            action: 'send_otp',
            email: email
          })
        });

        const res = await response.json();
        alert(res.message || 'Code sent');

        if (res.status === 'otp_sent') {
          otpGroup.style.display = 'block';
          otpInput.required = true;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
          }
          startOtpCooldown(sendOtpBtn, t);
          otpInput.focus();
        } else {
          sendOtpBtn.disabled = false;
          sendOtpBtn.innerText = t.btn_send_code;
        }
      } catch (err) {
        console.error('OTP request error:', err);
        alert(t.alert_conn_error);
        sendOtpBtn.disabled = false;
        sendOtpBtn.innerText = t.btn_send_code;
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const t = translations[getCurrentLang()];

    if (!otpInput.value.trim()) {
      alert(t.alert_enter_otp);
      otpInput.focus();
      return;
    }

    const dept = deptSelect.value;
    if (!dept) {
      alert(t.alert_select_dept);
      deptSelect.focus();
      return;
    }

    if (dept === 'Social Media' && !smSelect.value) {
      alert(t.alert_select_sm_role);
      smSelect.focus();
      return;
    }

    if (dept === 'Others' && !otherInput.value.trim()) {
      alert(t.alert_specify_other);
      otherInput.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.innerText = t.btn_submitting_app;
      submitBtn.disabled = true;
    }

    const payload = {
      action: 'register',
      fullname: document.getElementById('fullname')?.value.trim() || '',
      fullname_ar: document.getElementById('fullname_ar')?.value.trim() || '',
      student_id: document.getElementById('student_id')?.value.trim() || '',
      email: document.getElementById('email')?.value.trim() || '',
      phone: document.getElementById('phone')?.value.trim() || '',
      major: document.getElementById('major')?.value.trim() || '',
      year: document.getElementById('year')?.value || '',
      department: dept,
      social_role: (dept === 'Social Media') ? smSelect.value : '',
      other_department: (dept === 'Others') ? otherInput.value.trim() : '',
      whyJoin: document.getElementById('whyJoin')?.value.trim() || '',
      clubExp: document.getElementById('clubExp')?.value.trim() || '',
      portfolio: document.getElementById('portfolio')?.value.trim() || '',
      otp: otpInput.value.trim()
    };

    try {
      const response = await fetch(JOIN_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const res = await response.json();
      alert(res.message || 'Submitted successfully');

      if (res.status === 'success') {
        form.reset();
        smGroup.style.display = 'none';
        otherGroup.style.display = 'none';
        otpGroup.style.display = 'none';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.5';
          submitBtn.innerText = t.btn_submit_app;
        }
        if (sendOtpBtn) {
          if (otpCooldownTimer) clearInterval(otpCooldownTimer);
          sendOtpBtn.disabled = false;
          sendOtpBtn.innerText = t.btn_send_code;
        }
      } else {
        if (submitBtn) {
          submitBtn.innerText = t.btn_submit_app;
          submitBtn.disabled = false;
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert(t.alert_conn_error);
      if (submitBtn) {
        submitBtn.innerText = t.btn_submit_app;
        submitBtn.disabled = false;
      }
    }
  });
}

// ---------------------------------------------------------------------------
// 4. Event Registration Page (form.html): Dynamic Fields & Supabase
// ---------------------------------------------------------------------------
let dynamicCustomFields = [];

function renderDynamicFields() {
  const dynamicContainer = document.getElementById('dynamic-fields-container');
  if (!dynamicContainer || dynamicCustomFields.length === 0) return;

  const currentLang = getCurrentLang();
  const t = translations[currentLang];
  dynamicContainer.innerHTML = '';

  dynamicCustomFields.forEach(field => {
    const wrapper = document.createElement('div');

    const label = document.createElement('label');
    label.setAttribute('for', `custom_${field.id}`);

    const fieldTitle = field.name || 'Question';
    label.textContent = fieldTitle;

    if (field.is_required) {
      const reqSpan = document.createElement('span');
      reqSpan.style.color = '#e61e4d';
      reqSpan.textContent = ' *';
      label.appendChild(reqSpan);
    } else {
      const optSpan = document.createElement('span');
      optSpan.className = 'optional-tag';
      optSpan.textContent = ` ${t.tag_optional}`;
      label.appendChild(optSpan);
    }

    let inputElement;
    if (field.field_type === 'textarea' || field.field_type === 'long_text') {
      inputElement = document.createElement('textarea');
      inputElement.rows = 3;
    } else {
      inputElement = document.createElement('input');
      inputElement.type = (field.field_type === 'number') ? 'number' : 'text';
    }

    inputElement.id = `custom_${field.id}`;
    inputElement.placeholder = `${currentLang === 'ar' ? 'أدخل ' : 'Enter '}${fieldTitle}`;
    if (field.is_required) inputElement.required = true;

    wrapper.appendChild(label);
    wrapper.appendChild(inputElement);
    dynamicContainer.appendChild(wrapper);
  });
}

async function initEventRegistrationPage() {
  const dynamicContainer = document.getElementById('dynamic-fields-container');
  if (!dynamicContainer) return; // Not on form.html

  const form = document.getElementById('event-registration-form') || document.getElementById('registration-form');
  if (!form) return;

  const currentLang = getCurrentLang();
  const t = translations[currentLang];

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('event_id');
  const eventTitle = urlParams.get('title');

  if (eventTitle) {
    activeCustomEventTitle = decodeURIComponent(eventTitle);
    const titleEl = document.getElementById('event-title');
    if (titleEl) titleEl.textContent = activeCustomEventTitle;
  }

  if (!eventId) {
    dynamicContainer.innerHTML = `<p class="error-msg">${escapeHTML(t.no_event_selected)}</p>`;
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  if (!supabaseClient) {
    dynamicContainer.innerHTML = `<p class="error-msg">${escapeHTML(t.failed_load_events)}</p>`;
    return;
  }

  try {
    const { data: eventData, error: eventErr } = await supabaseClient
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (!eventErr && eventData) {
      const isEnded = isEventEnded(eventData);
      const isPrivate = isPrivateEvent(eventData);
      const submitBtn = document.getElementById('submit-btn');
      const noticeBox = document.getElementById('form-status-notice');

      if (isEnded) {
        if (noticeBox) {
          noticeBox.style.display = 'block';
          noticeBox.className = 'form-banner-notice';
          noticeBox.textContent = t.event_ended_notice;
        }
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = t.btn_event_completed;
        }
      } else if (!isPrivate) {
        if (noticeBox) {
          noticeBox.style.display = 'block';
          noticeBox.className = 'form-banner-notice public-notice';
          noticeBox.textContent = t.public_reg_optional;
        }
      }
    }
  } catch (err) {
    console.error('Error fetching event details:', err);
  }

  try {
    const { data: fields, error } = await supabaseClient
      .from('event_registration_fields')
      .select('*')
      .eq('event_id', eventId)
      .order('display_order', { ascending: true });

    if (error) throw error;

    dynamicCustomFields = fields || [];
    if (dynamicCustomFields.length === 0) {
      dynamicContainer.innerHTML = '';
    } else {
      renderDynamicFields();
    }
  } catch (error) {
    console.error('Error fetching event fields:', error);
    dynamicContainer.innerHTML = `<p class="error-msg">${escapeHTML(t.failed_load_events)}</p>`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.innerText = t.btn_registering_event;
      submitBtn.disabled = true;
    }

    const emailVal = document.getElementById('email')?.value.trim() || '';

    const guestPayload = {
      event_id: eventId,
      full_name: document.getElementById('fullname')?.value.trim() || '',
      email: emailVal,
      normalized_email: emailVal.toLowerCase(),
      phone_number: document.getElementById('phone')?.value.trim() || null,
      faculty: document.getElementById('faculty')?.value.trim() || '',
      why_interested: document.getElementById('why_interested')?.value.trim() || null,
      status: 'registered'
    };

    try {
      const { data: guestData, error: guestError } = await supabaseClient
        .from('event_guest_registrations')
        .insert([guestPayload])
        .select('id')
        .single();

      if (guestError) throw guestError;

      if (dynamicCustomFields.length > 0 && guestData?.id) {
        const answersPayload = dynamicCustomFields.map(field => {
          const input = document.getElementById(`custom_${field.id}`);
          return {
            field_id: field.id,
            registration_event_id: eventId,
            guest_registration_id: guestData.id,
            answer_value: input ? input.value.trim() : ''
          };
        });

        const { error: answersError } = await supabaseClient
          .from('event_registration_answers')
          .insert(answersPayload);

        if (answersError) throw answersError;
      }

      alert(t.alert_reg_success);
      window.location.href = 'index.html';
    } catch (err) {
      console.error('Event registration error:', err);
      alert(t.alert_reg_fail);
      if (submitBtn) {
        submitBtn.innerText = t.btn_confirm_event_reg;
        submitBtn.disabled = false;
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Application Lifecycle
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitch();
  initMobileNav();
  initBackToTop();
  initImageLightbox();
  initEventFilterTabs();
  loadEvents();
  loadLeaderboard();
  initJoinForm();
  initEventRegistrationPage();
});
