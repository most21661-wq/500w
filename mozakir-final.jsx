import { useState, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const START = new Date("2026-09-27"); // يوم 1: اليوم اللي بدأت فيه

// مواعيد المراجعة: بعد 1 يوم، 3 أيام، 7 أيام، 14 يوم، 30 يوم
const REVIEW_GAPS = [1, 3, 7, 14, 30];

const REVIEW_LABELS = {
  1:  { label:"مراجعة يوم 1",  color:"#059669", bg:"#ECFDF5" },
  3:  { label:"مراجعة يوم 3",  color:"#0891B2", bg:"#ECFEFF" },
  7:  { label:"مراجعة يوم 7",  color:"#7C3AED", bg:"#F5F3FF" },
  14: { label:"مراجعة يوم 14", color:"#D97706", bg:"#FFFBEB" },
  30: { label:"مراجعة يوم 30", color:"#DC2626", bg:"#FFF1F2" },
};

const AR_DAYS   = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ALL_WORDS = [
  {id:1,en:"Information",ar:"معلومات",abbr:""},{id:2,en:"System",ar:"نظام",abbr:""},{id:3,en:"Business",ar:"عمل / تجارة",abbr:""},{id:4,en:"Data",ar:"بيانات",abbr:""},{id:5,en:"Management",ar:"إدارة",abbr:""},
  {id:6,en:"Database",ar:"قاعدة بيانات",abbr:""},{id:7,en:"Database Management System",ar:"نظام إدارة قواعد البيانات",abbr:"DBMS"},{id:8,en:"Software",ar:"برنامج",abbr:""},{id:9,en:"Hardware",ar:"جهاز / عتاد",abbr:""},{id:10,en:"Network",ar:"شبكة",abbr:""},
  {id:11,en:"Internet",ar:"إنترنت",abbr:""},{id:12,en:"User",ar:"مستخدم",abbr:""},{id:13,en:"Input",ar:"إدخال",abbr:""},{id:14,en:"Output",ar:"إخراج",abbr:""},{id:15,en:"Process",ar:"عملية / معالجة",abbr:""},
  {id:16,en:"Algorithm",ar:"خوارزمية",abbr:""},{id:17,en:"Program",ar:"برنامج",abbr:""},{id:18,en:"Application",ar:"تطبيق",abbr:""},{id:19,en:"Server",ar:"خادم",abbr:""},{id:20,en:"Client",ar:"عميل",abbr:""},
  {id:21,en:"Cloud",ar:"سحابة",abbr:""},{id:22,en:"Cloud Computing",ar:"الحوسبة السحابية",abbr:""},{id:23,en:"Security",ar:"أمن",abbr:""},{id:24,en:"Cybersecurity",ar:"أمن سيبراني",abbr:""},{id:25,en:"Encryption",ar:"تشفير",abbr:""},
  {id:26,en:"Firewall",ar:"جدار ناري",abbr:""},{id:27,en:"Backup",ar:"نسخة احتياطية",abbr:""},{id:28,en:"Recovery",ar:"استعادة",abbr:""},{id:29,en:"Analysis",ar:"تحليل",abbr:""},{id:30,en:"Analytics",ar:"تحليلات",abbr:""},
  {id:31,en:"Decision",ar:"قرار",abbr:""},{id:32,en:"Decision Support System",ar:"نظام دعم القرار",abbr:"DSS"},{id:33,en:"Enterprise Resource Planning",ar:"نظام تخطيط موارد المؤسسة",abbr:"ERP"},{id:34,en:"Customer Relationship Management",ar:"نظام إدارة علاقات العملاء",abbr:"CRM"},{id:35,en:"Management Information System",ar:"نظام معلومات الإدارة",abbr:"MIS"},
  {id:36,en:"Transaction",ar:"عملية / معاملة",abbr:""},{id:37,en:"Transaction Processing System",ar:"نظام معالجة المعاملات",abbr:"TPS"},{id:38,en:"Workflow",ar:"سير العمل",abbr:""},{id:39,en:"Automation",ar:"أتمتة",abbr:""},{id:40,en:"Digital",ar:"رقمي",abbr:""},
  {id:41,en:"Electronic",ar:"إلكتروني",abbr:""},{id:42,en:"E-commerce",ar:"تجارة إلكترونية",abbr:""},{id:43,en:"Platform",ar:"منصة",abbr:""},{id:44,en:"Interface",ar:"واجهة",abbr:""},{id:45,en:"User Interface",ar:"واجهة المستخدم",abbr:"UI"},
  {id:46,en:"Graphical User Interface",ar:"واجهة مستخدم رسومية",abbr:"GUI"},{id:47,en:"Application Programming Interface",ar:"واجهة برمجة التطبيقات",abbr:"API"},{id:48,en:"Integration",ar:"تكامل",abbr:""},{id:49,en:"Architecture",ar:"بنية / معمارية",abbr:""},{id:50,en:"System Analysis",ar:"تحليل النظم",abbr:""},
  {id:51,en:"Requirement",ar:"متطلب",abbr:""},{id:52,en:"Requirement Analysis",ar:"تحليل المتطلبات",abbr:""},{id:53,en:"Documentation",ar:"توثيق",abbr:""},{id:54,en:"Report",ar:"تقرير",abbr:""},{id:55,en:"Model",ar:"نموذج",abbr:""},
  {id:56,en:"Prototype",ar:"نموذج أولي",abbr:""},{id:57,en:"Testing",ar:"اختبار",abbr:""},{id:58,en:"Deployment",ar:"نشر / تشغيل",abbr:""},{id:59,en:"Maintenance",ar:"صيانة",abbr:""},{id:60,en:"Performance",ar:"أداء",abbr:""},
  {id:61,en:"Scalability",ar:"قابلية التوسع",abbr:""},{id:62,en:"Reliability",ar:"موثوقية",abbr:""},{id:63,en:"Availability",ar:"إتاحة",abbr:""},{id:64,en:"Accessibility",ar:"إمكانية الوصول",abbr:""},{id:65,en:"Database Query",ar:"استعلام قاعدة بيانات",abbr:""},
  {id:66,en:"Table",ar:"جدول",abbr:""},{id:67,en:"Record",ar:"سجل",abbr:""},{id:68,en:"Field",ar:"حقل",abbr:""},{id:69,en:"Primary Key",ar:"مفتاح أساسي",abbr:""},{id:70,en:"Foreign Key",ar:"مفتاح أجنبي",abbr:""},
  {id:71,en:"Relationship",ar:"علاقة",abbr:""},{id:72,en:"Normalization",ar:"تطبيع",abbr:""},{id:73,en:"Query",ar:"استعلام",abbr:""},{id:74,en:"Form",ar:"نموذج",abbr:""},{id:75,en:"Dashboard",ar:"لوحة تحكم",abbr:""},
  {id:76,en:"Report Generation",ar:"إنشاء التقارير",abbr:""},{id:77,en:"Decision Making",ar:"اتخاذ القرار",abbr:""},{id:78,en:"Business Intelligence",ar:"ذكاء الأعمال",abbr:"BI"},{id:79,en:"Data Warehouse",ar:"مستودع بيانات",abbr:""},{id:80,en:"Data Mining",ar:"تنقيب البيانات",abbr:""},
  {id:81,en:"Big Data",ar:"البيانات الضخمة",abbr:""},{id:82,en:"Machine Learning",ar:"تعلم الآلة",abbr:""},{id:83,en:"Artificial Intelligence",ar:"الذكاء الاصطناعي",abbr:""},{id:84,en:"Project",ar:"مشروع",abbr:""},{id:85,en:"Task",ar:"مهمة",abbr:""},
  {id:86,en:"Goal",ar:"هدف",abbr:""},{id:87,en:"Strategy",ar:"استراتيجية",abbr:""},{id:88,en:"Planning",ar:"تخطيط",abbr:""},{id:89,en:"Control",ar:"رقابة",abbr:""},{id:90,en:"Efficiency",ar:"كفاءة",abbr:""},
  {id:91,en:"Effectiveness",ar:"فاعلية",abbr:""},{id:92,en:"Productivity",ar:"إنتاجية",abbr:""},{id:93,en:"Cost",ar:"تكلفة",abbr:""},{id:94,en:"Benefit",ar:"منفعة / فائدة",abbr:""},{id:95,en:"Revenue",ar:"إيراد",abbr:""},
  {id:96,en:"Profit",ar:"ربح",abbr:""},{id:97,en:"Loss",ar:"خسارة",abbr:""},{id:98,en:"Supply Chain",ar:"سلسلة الإمداد",abbr:""},{id:99,en:"Inventory",ar:"مخزون",abbr:""},{id:100,en:"Vendor",ar:"مورد",abbr:""},
  {id:101,en:"Customer",ar:"عميل",abbr:""},{id:102,en:"Stakeholder",ar:"صاحب مصلحة",abbr:""},{id:103,en:"Communication",ar:"اتصال",abbr:""},{id:104,en:"Collaboration",ar:"تعاون",abbr:""},{id:105,en:"Teamwork",ar:"عمل جماعي",abbr:""},
  {id:106,en:"Presentation",ar:"عرض تقديمي",abbr:""},{id:107,en:"Spreadsheet",ar:"جدول بيانات",abbr:""},{id:108,en:"Word Processor",ar:"معالج نصوص",abbr:""},{id:109,en:"Operating System",ar:"نظام تشغيل",abbr:""},{id:110,en:"Mobile App",ar:"تطبيق جوال",abbr:""},
  {id:111,en:"Web App",ar:"تطبيق ويب",abbr:""},{id:112,en:"Desktop Application",ar:"تطبيق سطح مكتب",abbr:""},{id:113,en:"Menu",ar:"قائمة",abbr:""},{id:114,en:"Button",ar:"زر",abbr:""},{id:115,en:"Icon",ar:"أيقونة",abbr:""},
  {id:116,en:"Window",ar:"نافذة",abbr:""},{id:117,en:"Screen",ar:"شاشة",abbr:""},{id:118,en:"Monitor",ar:"شاشة عرض",abbr:""},{id:119,en:"Keyboard",ar:"لوحة مفاتيح",abbr:""},{id:120,en:"Mouse",ar:"فأرة",abbr:""},
  {id:121,en:"Printer",ar:"طابعة",abbr:""},{id:122,en:"Scanner",ar:"ماسح ضوئي",abbr:""},{id:123,en:"Cable",ar:"كابل",abbr:""},{id:124,en:"Wi-Fi",ar:"واي فاي",abbr:""},{id:125,en:"Bluetooth",ar:"بلوتوث",abbr:""},
  {id:126,en:"Login",ar:"تسجيل دخول",abbr:""},{id:127,en:"Logout",ar:"تسجيل خروج",abbr:""},{id:128,en:"Username",ar:"اسم المستخدم",abbr:""},{id:129,en:"Password",ar:"كلمة المرور",abbr:""},{id:130,en:"Access",ar:"وصول",abbr:""},
  {id:131,en:"Permission",ar:"إذن",abbr:""},{id:132,en:"Authorization",ar:"تفويض",abbr:""},{id:133,en:"Authentication",ar:"مصادقة",abbr:""},{id:134,en:"Account",ar:"حساب",abbr:""},{id:135,en:"Profile",ar:"ملف شخصي",abbr:""},
  {id:136,en:"Settings",ar:"إعدادات",abbr:""},{id:137,en:"Preference",ar:"تفضيل",abbr:""},{id:138,en:"Notification",ar:"إشعار",abbr:""},{id:139,en:"Message",ar:"رسالة",abbr:""},{id:140,en:"Email",ar:"بريد إلكتروني",abbr:""},
  {id:141,en:"Attachment",ar:"مرفق",abbr:""},{id:142,en:"Upload",ar:"رفع",abbr:""},{id:143,en:"Download",ar:"تنزيل",abbr:""},{id:144,en:"Save",ar:"حفظ",abbr:""},{id:145,en:"Edit",ar:"تعديل",abbr:""},
  {id:146,en:"Delete",ar:"حذف",abbr:""},{id:147,en:"Copy",ar:"نسخ",abbr:""},{id:148,en:"Paste",ar:"لصق",abbr:""},{id:149,en:"Cut",ar:"قص",abbr:""},{id:150,en:"Search",ar:"بحث",abbr:""},
  {id:151,en:"Filter",ar:"تصفية",abbr:""},{id:152,en:"Sort",ar:"فرز",abbr:""},{id:153,en:"Select",ar:"تحديد",abbr:""},{id:154,en:"Submit",ar:"إرسال",abbr:""},{id:155,en:"Approve",ar:"موافقة",abbr:""},
  {id:156,en:"Reject",ar:"رفض",abbr:""},{id:157,en:"Process",ar:"معالجة",abbr:""},{id:158,en:"Execute",ar:"تنفيذ",abbr:""},{id:159,en:"Monitor",ar:"مراقبة",abbr:""},{id:160,en:"Update",ar:"تحديث",abbr:""},
  {id:161,en:"Upgrade",ar:"ترقية",abbr:""},{id:162,en:"Downgrade",ar:"خفض النسخة",abbr:""},{id:163,en:"Version",ar:"إصدار",abbr:""},{id:164,en:"Release",ar:"إصدار",abbr:""},{id:165,en:"Bug",ar:"خطأ برمجي",abbr:""},
  {id:166,en:"Error",ar:"خطأ",abbr:""},{id:167,en:"Fix",ar:"إصلاح",abbr:""},{id:168,en:"Patch",ar:"تصحيح",abbr:""},{id:169,en:"Crash",ar:"تعطل",abbr:""},{id:170,en:"Response",ar:"استجابة",abbr:""},
  {id:171,en:"Request",ar:"طلب",abbr:""},{id:172,en:"Latency",ar:"زمن التأخير",abbr:""},{id:173,en:"Bandwidth",ar:"عرض النطاق",abbr:""},{id:174,en:"Throughput",ar:"معدل الإنتاجية",abbr:""},{id:175,en:"Capacity",ar:"سعة",abbr:""},
  {id:176,en:"Storage",ar:"تخزين",abbr:""},{id:177,en:"Memory",ar:"ذاكرة",abbr:""},{id:178,en:"Processor",ar:"معالج",abbr:""},{id:179,en:"CPU",ar:"وحدة المعالجة المركزية",abbr:"CPU"},{id:180,en:"Device",ar:"جهاز",abbr:""},
  {id:181,en:"Portable",ar:"محمول",abbr:""},{id:182,en:"Tablet",ar:"جهاز لوحي",abbr:""},{id:183,en:"Laptop",ar:"حاسوب محمول",abbr:""},{id:184,en:"Desktop",ar:"حاسوب مكتبي",abbr:""},{id:185,en:"Virtual",ar:"افتراضي",abbr:""},
  {id:186,en:"Virtualization",ar:"افتراضية",abbr:""},{id:187,en:"Database Server",ar:"خادم قاعدة بيانات",abbr:""},{id:188,en:"Web Server",ar:"خادم ويب",abbr:""},{id:189,en:"Application Server",ar:"خادم تطبيقات",abbr:""},{id:190,en:"Client-Server",ar:"عميل-خادم",abbr:""},
  {id:191,en:"Local Area Network",ar:"شبكة محلية",abbr:"LAN"},{id:192,en:"Wide Area Network",ar:"شبكة واسعة",abbr:"WAN"},{id:193,en:"Router",ar:"موجه",abbr:""},{id:194,en:"Switch",ar:"مبدل",abbr:""},{id:195,en:"Modem",ar:"مودم",abbr:""},
  {id:196,en:"Protocol",ar:"بروتوكول",abbr:""},{id:197,en:"HTTP",ar:"بروتوكول نقل النص التشعبي",abbr:"HTTP"},{id:198,en:"HTTPS",ar:"بروتوكول آمن",abbr:"HTTPS"},{id:199,en:"TCP/IP",ar:"بروتوكول التحكم بالنقل / الإنترنت",abbr:"TCP/IP"},{id:200,en:"IP Address",ar:"عنوان IP",abbr:""},
  {id:201,en:"URL",ar:"عنوان الرابط",abbr:"URL"},{id:202,en:"Website",ar:"موقع إلكتروني",abbr:""},{id:203,en:"Homepage",ar:"الصفحة الرئيسية",abbr:""},{id:204,en:"Browser",ar:"متصفح",abbr:""},{id:205,en:"Tab",ar:"علامة تبويب",abbr:""},
  {id:206,en:"Bookmark",ar:"إشارة مرجعية",abbr:""},{id:207,en:"Link",ar:"رابط",abbr:""},{id:208,en:"Click",ar:"نقر",abbr:""},{id:209,en:"Scroll",ar:"تمرير",abbr:""},{id:210,en:"Refresh",ar:"تحديث الصفحة",abbr:""},
  {id:211,en:"Navigation",ar:"تنقل",abbr:""},{id:212,en:"Menu Bar",ar:"شريط القائمة",abbr:""},{id:213,en:"Toolbar",ar:"شريط الأدوات",abbr:""},{id:214,en:"Sidebar",ar:"شريط جانبي",abbr:""},{id:215,en:"Footer",ar:"تذييل",abbr:""},
  {id:216,en:"Header",ar:"ترويسة",abbr:""},{id:217,en:"Content",ar:"محتوى",abbr:""},{id:218,en:"Layout",ar:"تنسيق الصفحة",abbr:""},{id:219,en:"Template",ar:"قالب",abbr:""},{id:220,en:"Theme",ar:"سمة / مظهر",abbr:""},
  {id:221,en:"Design",ar:"تصميم",abbr:""},{id:222,en:"Interface Design",ar:"تصميم الواجهة",abbr:""},{id:223,en:"Usability",ar:"سهولة الاستخدام",abbr:""},{id:224,en:"Accessibility",ar:"إمكانية الوصول",abbr:""},{id:225,en:"User Experience",ar:"تجربة المستخدم",abbr:"UX"},
  {id:226,en:"User Interface Design",ar:"تصميم واجهة المستخدم",abbr:"UID"},{id:227,en:"Interaction",ar:"تفاعل",abbr:""},{id:228,en:"Feedback",ar:"تغذية راجعة",abbr:""},{id:229,en:"Survey",ar:"استبيان",abbr:""},{id:230,en:"Questionnaire",ar:"استبيان",abbr:""},
  {id:231,en:"Interview",ar:"مقابلة",abbr:""},{id:232,en:"Observation",ar:"ملاحظة",abbr:""},{id:233,en:"Sample",ar:"عينة",abbr:""},{id:234,en:"Population",ar:"مجتمع",abbr:""},{id:235,en:"Statistics",ar:"إحصاء",abbr:""},
  {id:236,en:"Data Analysis",ar:"تحليل البيانات",abbr:""},{id:237,en:"Data Visualization",ar:"تصوير البيانات",abbr:""},{id:238,en:"Chart",ar:"رسم بياني",abbr:""},{id:239,en:"Graph",ar:"مخطط",abbr:""},{id:240,en:"Tableau",ar:"لوحة بيانات",abbr:""},
  {id:241,en:"Report",ar:"تقرير",abbr:""},{id:242,en:"Summary",ar:"ملخص",abbr:""},{id:243,en:"Dashboard",ar:"لوحة تحكم",abbr:""},{id:244,en:"Key Performance Indicator",ar:"مؤشر أداء رئيسي",abbr:"KPI"},{id:245,en:"Metric",ar:"مقياس",abbr:""},
  {id:246,en:"Benchmark",ar:"معيار مقارنة",abbr:""},{id:247,en:"Objective",ar:"هدف",abbr:""},{id:248,en:"Requirement",ar:"متطلب",abbr:""},{id:249,en:"Specification",ar:"مواصفات",abbr:""},{id:250,en:"Constraint",ar:"قيد",abbr:""},
  {id:251,en:"Risk",ar:"مخاطرة",abbr:""},{id:252,en:"Issue",ar:"مشكلة",abbr:""},{id:253,en:"Problem",ar:"مشكلة",abbr:""},{id:254,en:"Solution",ar:"حل",abbr:""},{id:255,en:"Alternative",ar:"بديل",abbr:""},
  {id:256,en:"Option",ar:"خيار",abbr:""},{id:257,en:"Plan",ar:"خطة",abbr:""},{id:258,en:"Schedule",ar:"جدول زمني",abbr:""},{id:259,en:"Deadline",ar:"موعد نهائي",abbr:""},{id:260,en:"Milestone",ar:"مرحلة رئيسية",abbr:""},
  {id:261,en:"Workflow",ar:"سير عمل",abbr:""},{id:262,en:"Process Flow",ar:"تدفق العمليات",abbr:""},{id:263,en:"Procedure",ar:"إجراء",abbr:""},{id:264,en:"Policy",ar:"سياسة",abbr:""},{id:265,en:"Rule",ar:"قاعدة",abbr:""},
  {id:266,en:"Compliance",ar:"امتثال",abbr:""},{id:267,en:"Governance",ar:"حوكمة",abbr:""},{id:268,en:"Audit",ar:"تدقيق",abbr:""},{id:269,en:"Control",ar:"رقابة",abbr:""},{id:270,en:"Supervision",ar:"إشراف",abbr:""},
  {id:271,en:"Resource",ar:"مورد",abbr:""},{id:272,en:"Human Resource",ar:"موارد بشرية",abbr:"HR"},{id:273,en:"Employee",ar:"موظف",abbr:""},{id:274,en:"Manager",ar:"مدير",abbr:""},{id:275,en:"Supervisor",ar:"مشرف",abbr:""},
  {id:276,en:"Department",ar:"قسم",abbr:""},{id:277,en:"Organization",ar:"منظمة",abbr:""},{id:278,en:"Company",ar:"شركة",abbr:""},{id:279,en:"Firm",ar:"مؤسسة / شركة",abbr:""},{id:280,en:"Enterprise",ar:"مؤسسة كبيرة",abbr:""},
  {id:281,en:"Product",ar:"منتج",abbr:""},{id:282,en:"Service",ar:"خدمة",abbr:""},{id:283,en:"Market",ar:"سوق",abbr:""},{id:284,en:"Customer Relationship",ar:"علاقة العملاء",abbr:""},{id:285,en:"Sales",ar:"مبيعات",abbr:""},
  {id:286,en:"Marketing",ar:"تسويق",abbr:""},{id:287,en:"Promotion",ar:"ترويج",abbr:""},{id:288,en:"Advertising",ar:"إعلان",abbr:""},{id:289,en:"Brand",ar:"علامة تجارية",abbr:""},{id:290,en:"Competition",ar:"منافسة",abbr:""},
  {id:291,en:"Competitor",ar:"منافس",abbr:""},{id:292,en:"Demand",ar:"طلب",abbr:""},{id:293,en:"Supply",ar:"عرض / إمداد",abbr:""},{id:294,en:"Price",ar:"سعر",abbr:""},{id:295,en:"Costing",ar:"تسعير التكاليف",abbr:""},
  {id:296,en:"Budget",ar:"ميزانية",abbr:""},{id:297,en:"Expense",ar:"مصروف",abbr:""},{id:298,en:"Invoice",ar:"فاتورة",abbr:""},{id:299,en:"Payment",ar:"دفع",abbr:""},{id:300,en:"Receipt",ar:"إيصال",abbr:""},
  {id:301,en:"Purchase",ar:"شراء",abbr:""},{id:302,en:"Procurement",ar:"مشتريات",abbr:""},{id:303,en:"Supplier",ar:"مورد",abbr:""},{id:304,en:"Warehouse",ar:"مستودع",abbr:""},{id:305,en:"Inventory",ar:"مخزون",abbr:""},
  {id:306,en:"Stock",ar:"رصيد مخزون",abbr:""},{id:307,en:"Order",ar:"طلب / أمر",abbr:""},{id:308,en:"Order Processing",ar:"معالجة الطلبات",abbr:""},{id:309,en:"Delivery",ar:"تسليم",abbr:""},{id:310,en:"Shipment",ar:"شحنة",abbr:""},
  {id:311,en:"Transport",ar:"نقل",abbr:""},{id:312,en:"Logistics",ar:"لوجستيات",abbr:""},{id:313,en:"Distribution",ar:"توزيع",abbr:""},{id:314,en:"Chain",ar:"سلسلة",abbr:""},{id:315,en:"Supply Chain",ar:"سلسلة الإمداد",abbr:""},
  {id:316,en:"Operations",ar:"عمليات",abbr:""},{id:317,en:"Operation Management",ar:"إدارة العمليات",abbr:""},{id:318,en:"Quality",ar:"جودة",abbr:""},{id:319,en:"Quality Assurance",ar:"ضمان الجودة",abbr:""},{id:320,en:"Quality Control",ar:"رقابة الجودة",abbr:""},
  {id:321,en:"Standard",ar:"معيار",abbr:""},{id:322,en:"Improvement",ar:"تحسين",abbr:""},{id:323,en:"Optimization",ar:"تحسين أمثل",abbr:""},{id:324,en:"Efficiency",ar:"كفاءة",abbr:""},{id:325,en:"Effectiveness",ar:"فاعلية",abbr:""},
  {id:326,en:"Productivity",ar:"إنتاجية",abbr:""},{id:327,en:"Performance",ar:"أداء",abbr:""},{id:328,en:"Measurement",ar:"قياس",abbr:""},{id:329,en:"Evaluation",ar:"تقييم",abbr:""},{id:330,en:"Assessment",ar:"تقدير",abbr:""},
  {id:331,en:"Feedback",ar:"ملاحظات راجعة",abbr:""},{id:332,en:"Revision",ar:"مراجعة",abbr:""},{id:333,en:"Update",ar:"تحديث",abbr:""},{id:334,en:"Version Control",ar:"التحكم في الإصدارات",abbr:""},{id:335,en:"Repository",ar:"مستودع برمجي",abbr:""},
  {id:336,en:"Source Code",ar:"كود المصدر",abbr:""},{id:337,en:"Programming",ar:"برمجة",abbr:""},{id:338,en:"Developer",ar:"مطور",abbr:""},{id:339,en:"Coder",ar:"مبرمج",abbr:""},{id:340,en:"Script",ar:"سكريبت / نص برمجي",abbr:""},
  {id:341,en:"Compiler",ar:"مترجم برمجي",abbr:""},{id:342,en:"Interpreter",ar:"مفسر",abbr:""},{id:343,en:"Debugging",ar:"تنقيح الأخطاء",abbr:""},{id:344,en:"Debug",ar:"تنقيح",abbr:""},{id:345,en:"Source",ar:"مصدر",abbr:""},
  {id:346,en:"Open Source",ar:"مفتوح المصدر",abbr:""},{id:347,en:"License",ar:"رخصة",abbr:""},{id:348,en:"Copyright",ar:"حقوق نشر",abbr:""},{id:349,en:"Patent",ar:"براءة اختراع",abbr:""},{id:350,en:"Trademark",ar:"علامة تجارية",abbr:""},
  {id:351,en:"Encryption Key",ar:"مفتاح التشفير",abbr:""},{id:352,en:"Public Key",ar:"مفتاح عام",abbr:""},{id:353,en:"Private Key",ar:"مفتاح خاص",abbr:""},{id:354,en:"Certificate",ar:"شهادة",abbr:""},{id:355,en:"Hash",ar:"تجزئة",abbr:""},
  {id:356,en:"Authentication Code",ar:"رمز مصادقة",abbr:""},{id:357,en:"Malware",ar:"برمجيات خبيثة",abbr:""},{id:358,en:"Virus",ar:"فيروس",abbr:""},{id:359,en:"Worm",ar:"دودة",abbr:""},{id:360,en:"Spyware",ar:"برامج تجسس",abbr:""},
  {id:361,en:"Ransomware",ar:"برمجيات الفدية",abbr:""},{id:362,en:"Threat",ar:"تهديد",abbr:""},{id:363,en:"Vulnerability",ar:"ثغرة",abbr:""},{id:364,en:"Attack",ar:"هجوم",abbr:""},{id:365,en:"Defense",ar:"دفاع",abbr:""},
  {id:366,en:"Protection",ar:"حماية",abbr:""},{id:367,en:"Backup System",ar:"نظام نسخ احتياطي",abbr:""},{id:368,en:"Disaster Recovery",ar:"استعادة من الكوارث",abbr:""},{id:369,en:"Contingency Plan",ar:"خطة طوارئ",abbr:""},{id:370,en:"Incident",ar:"حادث",abbr:""},
  {id:371,en:"Incident Response",ar:"الاستجابة للحوادث",abbr:""},{id:372,en:"Network Security",ar:"أمن الشبكات",abbr:""},{id:373,en:"Data Security",ar:"أمن البيانات",abbr:""},{id:374,en:"Information Security",ar:"أمن المعلومات",abbr:""},{id:375,en:"Privacy",ar:"خصوصية",abbr:""},
  {id:376,en:"Confidentiality",ar:"سرية",abbr:""},{id:377,en:"Integrity",ar:"سلامة / تكامل",abbr:""},{id:378,en:"Availability",ar:"توافر",abbr:""},{id:379,en:"Authentication",ar:"تحقق الهوية",abbr:""},{id:380,en:"Authorization",ar:"تفويض",abbr:""},
  {id:381,en:"Access Control",ar:"التحكم في الوصول",abbr:""},{id:382,en:"Role",ar:"دور",abbr:""},{id:383,en:"Privilege",ar:"امتياز",abbr:""},{id:384,en:"Policy Enforcement",ar:"تطبيق السياسة",abbr:""},{id:385,en:"Cloud Service",ar:"خدمة سحابية",abbr:""},
  {id:386,en:"Software as a Service",ar:"برمجيات كخدمة",abbr:"SaaS"},{id:387,en:"Platform as a Service",ar:"منصة كخدمة",abbr:"PaaS"},{id:388,en:"Infrastructure as a Service",ar:"بنية تحتية كخدمة",abbr:"IaaS"},{id:389,en:"Virtual Machine",ar:"آلة افتراضية",abbr:""},{id:390,en:"Data Center",ar:"مركز بيانات",abbr:""},
  {id:391,en:"Hosting",ar:"استضافة",abbr:""},{id:392,en:"Migration",ar:"ترحيل",abbr:""},{id:393,en:"Integration",ar:"تكامل",abbr:""},{id:394,en:"API Gateway",ar:"بوابة واجهات برمجة التطبيقات",abbr:""},{id:395,en:"Middleware",ar:"برمجيات وسيطة",abbr:""},
  {id:396,en:"Synchronization",ar:"مزامنة",abbr:""},{id:397,en:"Real Time",ar:"وقت حقيقي",abbr:""},{id:398,en:"Offline",ar:"دون اتصال",abbr:""},{id:399,en:"Online",ar:"متصل",abbr:""},{id:400,en:"Automation Tool",ar:"أداة أتمتة",abbr:""},
  {id:401,en:"Automation Script",ar:"نص أتمتة",abbr:""},{id:402,en:"Task Automation",ar:"أتمتة المهام",abbr:""},{id:403,en:"Process Automation",ar:"أتمتة العمليات",abbr:""},{id:404,en:"Digital Transformation",ar:"التحول الرقمي",abbr:""},{id:405,en:"Innovation",ar:"ابتكار",abbr:""},
  {id:406,en:"Change Management",ar:"إدارة التغيير",abbr:""},{id:407,en:"Adoption",ar:"تبني",abbr:""},{id:408,en:"Implementation",ar:"تنفيذ",abbr:""},{id:409,en:"Launch",ar:"إطلاق",abbr:""},{id:410,en:"Rollout",ar:"طرح / إطلاق تدريجي",abbr:""},
  {id:411,en:"Training",ar:"تدريب",abbr:""},{id:412,en:"Support",ar:"دعم",abbr:""},{id:413,en:"Help Desk",ar:"مكتب المساعدة",abbr:""},{id:414,en:"Ticket",ar:"تذكرة دعم",abbr:""},{id:415,en:"Customer Support",ar:"دعم العملاء",abbr:""},
  {id:416,en:"Service Desk",ar:"مكتب الخدمة",abbr:""},{id:417,en:"Escalation",ar:"تصعيد",abbr:""},{id:418,en:"Resolution",ar:"حل",abbr:""},{id:419,en:"Issue Tracking",ar:"تتبع المشكلات",abbr:""},{id:420,en:"Case",ar:"حالة",abbr:""},
  {id:421,en:"Maintenance Window",ar:"نافذة صيانة",abbr:""},{id:422,en:"Downtime",ar:"توقف الخدمة",abbr:""},{id:423,en:"Uptime",ar:"زمن التشغيل",abbr:""},{id:424,en:"Availability",ar:"الإتاحة",abbr:""},{id:425,en:"Backup Plan",ar:"خطة نسخ احتياطي",abbr:""},
  {id:426,en:"Restore",ar:"استعادة",abbr:""},{id:427,en:"Archive",ar:"أرشفة",abbr:""},{id:428,en:"Retention",ar:"احتفاظ",abbr:""},{id:429,en:"Deletion",ar:"حذف",abbr:""},{id:430,en:"Migration Plan",ar:"خطة ترحيل",abbr:""},
  {id:431,en:"Data Migration",ar:"ترحيل البيانات",abbr:""},{id:432,en:"Conversion",ar:"تحويل",abbr:""},{id:433,en:"Data Cleansing",ar:"تنظيف البيانات",abbr:""},{id:434,en:"Validation",ar:"تحقق",abbr:""},{id:435,en:"Verification",ar:"تأكيد / تحقق",abbr:""},
  {id:436,en:"Accuracy",ar:"دقة",abbr:""},{id:437,en:"Completeness",ar:"اكتمال",abbr:""},{id:438,en:"Consistency",ar:"اتساق",abbr:""},{id:439,en:"Timeliness",ar:"حداثة / توقيت مناسب",abbr:""},{id:440,en:"Relevance",ar:"ملاءمة",abbr:""},
  {id:441,en:"Quality of Data",ar:"جودة البيانات",abbr:""},{id:442,en:"Master Data",ar:"البيانات الرئيسية",abbr:""},{id:443,en:"Metadata",ar:"بيانات وصفية",abbr:""},{id:444,en:"Data Governance",ar:"حوكمة البيانات",abbr:""},{id:445,en:"Data Steward",ar:"أمين البيانات",abbr:""},
  {id:446,en:"Data Owner",ar:"مالك البيانات",abbr:""},{id:447,en:"Data Analyst",ar:"محلل بيانات",abbr:""},{id:448,en:"Business Analyst",ar:"محلل أعمال",abbr:""},{id:449,en:"System Analyst",ar:"محلل نظم",abbr:""},{id:450,en:"Database Administrator",ar:"مدير قاعدة البيانات",abbr:"DBA"},
  {id:451,en:"Network Administrator",ar:"مدير الشبكة",abbr:""},{id:452,en:"IT Manager",ar:"مدير تقنية المعلومات",abbr:""},{id:453,en:"Project Manager",ar:"مدير مشروع",abbr:""},{id:454,en:"Executive",ar:"تنفيذي",abbr:""},{id:455,en:"Board",ar:"مجلس",abbr:""},
  {id:456,en:"Hierarchy",ar:"هيكل هرمي",abbr:""},{id:457,en:"Departmentalization",ar:"تقسيم إداري",abbr:""},{id:458,en:"Workflow Automation",ar:"أتمتة سير العمل",abbr:""},{id:459,en:"Enterprise System",ar:"نظام مؤسسي",abbr:""},{id:460,en:"Information System",ar:"نظام معلومات",abbr:""},
  {id:461,en:"Management Information Systems",ar:"نظم معلومات إدارية",abbr:"MIS"},{id:462,en:"Business Information System",ar:"نظم معلومات الأعمال",abbr:"BIS"},{id:463,en:"Decision Support",ar:"دعم القرار",abbr:""},{id:464,en:"Operational Data",ar:"بيانات تشغيلية",abbr:""},{id:465,en:"Tactical Data",ar:"بيانات تكتيكية",abbr:""},
  {id:466,en:"Strategic Data",ar:"بيانات استراتيجية",abbr:""},{id:467,en:"KPI Dashboard",ar:"لوحة مؤشرات الأداء",abbr:""},{id:468,en:"Reporting Tool",ar:"أداة تقارير",abbr:""},{id:469,en:"Analytics Platform",ar:"منصة تحليلات",abbr:""},{id:470,en:"Data Platform",ar:"منصة بيانات",abbr:""},
  {id:471,en:"Workflow System",ar:"نظام سير عمل",abbr:""},{id:472,en:"Content Management System",ar:"نظام إدارة المحتوى",abbr:"CMS"},{id:473,en:"Enterprise Resource Planning",ar:"تخطيط موارد المؤسسة",abbr:"ERP"},{id:474,en:"Customer Relationship Management",ar:"إدارة علاقات العملاء",abbr:"CRM"},{id:475,en:"Supplier Relationship Management",ar:"إدارة علاقات الموردين",abbr:"SRM"},
  {id:476,en:"Human Capital",ar:"رأس المال البشري",abbr:""},{id:477,en:"Knowledge",ar:"معرفة",abbr:""},{id:478,en:"Knowledge Management",ar:"إدارة المعرفة",abbr:""},{id:479,en:"Information Sharing",ar:"مشاركة المعلومات",abbr:""},{id:480,en:"Collaboration Platform",ar:"منصة تعاون",abbr:""},
  {id:481,en:"Remote Work",ar:"العمل عن بعد",abbr:""},{id:482,en:"Hybrid Work",ar:"العمل الهجين",abbr:""},{id:483,en:"Telecommuting",ar:"العمل عن بعد",abbr:""},{id:484,en:"Digital Tools",ar:"أدوات رقمية",abbr:""},{id:485,en:"Productivity Tools",ar:"أدوات إنتاجية",abbr:""},
  {id:486,en:"Office Suite",ar:"حزمة أوفيس",abbr:""},{id:487,en:"Presentation Software",ar:"برنامج عروض تقديمية",abbr:""},{id:488,en:"PDF Editor",ar:"محرر PDF",abbr:""},{id:489,en:"Document Management",ar:"إدارة المستندات",abbr:""},{id:490,en:"File Management",ar:"إدارة الملفات",abbr:""},
  {id:491,en:"Versioning",ar:"إصدارات",abbr:""},{id:492,en:"Sharing",ar:"مشاركة",abbr:""},{id:493,en:"Permission Management",ar:"إدارة الأذونات",abbr:""},{id:494,en:"Workflow Approval",ar:"اعتماد سير العمل",abbr:""},{id:495,en:"Digital Record",ar:"سجل رقمي",abbr:""},
  {id:496,en:"Electronic Record",ar:"سجل إلكتروني",abbr:""},{id:497,en:"Data Entry",ar:"إدخال البيانات",abbr:""},{id:498,en:"Data Processing",ar:"معالجة البيانات",abbr:""},{id:499,en:"Output Report",ar:"تقرير مخرجات",abbr:""},{id:500,en:"Final Report",ar:"التقرير النهائي",abbr:""},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function daysBetween(a, b) {
  const ms = 24*60*60*1000;
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((db - da) / ms);
}
function todayDate() { return new Date(); }
function todayDayN() { return Math.max(0, daysBetween(START, todayDate())); }
function dateForDay(n) {
  const d = new Date(START); d.setDate(d.getDate() + n); return d;
}
function formatAr(d) {
  return `${AR_DAYS[d.getDay()]} ${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function wordsForDay(n) {
  if (n < 0 || n >= 100) return [];
  const s = n * 5;
  return ALL_WORDS.slice(s, s + 5);
}

function speak(text) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = 0.85;
  const vs = window.speechSynthesis.getVoices();
  const v = vs.find(x => x.lang.startsWith("en") && (x.name.includes("Google")||x.name.includes("Samantha")||x.name.includes("Natural")))
           || vs.find(x => x.lang.startsWith("en-US")) || vs.find(x => x.lang.startsWith("en"));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

function loadData() {
  try { return JSON.parse(localStorage.getItem("vt3") || "{}"); } catch { return {}; }
}
function saveData(d) { try { localStorage.setItem("vt3", JSON.stringify(d)); } catch {} }

const TABS = ["📅 اليوم", "🃏 بطاقات", "🧠 اختبار", "📋 الكل"];

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]         = useState(0);
  const [data, setData]       = useState(loadData);

  const toggle = useCallback((id) => {
    setData(prev => {
      const next = { ...prev, learned: { ...prev.learned } };
      if (next.learned[id]) delete next.learned[id];
      else next.learned[id] = Date.now();
      saveData(next);
      return next;
    });
  }, []);

  const learned   = data.learned || {};
  const dayN      = todayDayN();
  const todayWords = wordsForDay(dayN); // كل الأيام مفتوحة حتى يوم 100 (500 كلمة / 5)

  // Compute today's reviews
  const reviews = REVIEW_GAPS.flatMap(gap => {
    const srcDay = dayN - gap;
    if (srcDay < 0) return [];
    return wordsForDay(srcDay).map(w => ({ ...w, _gap: gap, _srcDay: srcDay }));
  }).filter(w => w.id <= ALL_WORDS.length);

  const allTodayWords = [...todayWords, ...reviews];
  const learnedCount  = Object.keys(learned).length;

  return (
    <div style={{minHeight:"100vh",background:"#F4F6FB",fontFamily:"'Segoe UI',system-ui,sans-serif",direction:"rtl",color:"#1a1a2e"}}>
      {/* ── HEADER ── */}
      <div style={{background:"linear-gradient(135deg,#312E81 0%,#4F46E5 60%,#7C3AED 100%)",color:"#fff",padding:"18px 16px 0",boxShadow:"0 4px 20px #312E8140"}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          {/* top bar */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <span style={{fontSize:26}}>📚</span>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:700}}>مذاكر المصطلحات</div>
              <div style={{fontSize:11,opacity:.75}}>{formatAr(todayDate())}</div>
            </div>
            <div style={{display:"flex",gap:14,textAlign:"center"}}>
              <div>
                <div style={{fontSize:20,fontWeight:800}}>{learnedCount}</div>
                <div style={{fontSize:10,opacity:.7}}>محفوظ</div>
              </div>
              <div>
                <div style={{fontSize:20,fontWeight:800}}>يوم {dayN+1}</div>
                <div style={{fontSize:10,opacity:.7}}>من الرحلة</div>
              </div>
            </div>
          </div>
          {/* progress bar */}
          <div style={{background:"rgba(255,255,255,.2)",borderRadius:99,height:5,marginBottom:4}}>
            <div style={{background:"#A5F3FC",borderRadius:99,height:5,width:`${(learnedCount/500)*100}%`,transition:"width .6s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,opacity:.65,marginBottom:10}}>
            <span>{Math.round((learnedCount/500)*100)}% مكتمل</span>
            <span>{500-learnedCount} كلمة باقية</span>
          </div>
          {/* tabs */}
          <div style={{display:"flex",gap:3}}>
            {TABS.map((t,i)=>(
              <button key={i} onClick={()=>setTab(i)} style={{
                flex:1,padding:"9px 2px",border:"none",borderRadius:"8px 8px 0 0",cursor:"pointer",fontSize:11,fontWeight:tab===i?700:500,
                background:tab===i?"#F4F6FB":"transparent",color:tab===i?"#4F46E5":"rgba(255,255,255,.85)",transition:"all .18s"
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{maxWidth:680,margin:"0 auto",padding:"18px 12px 40px"}}>
        {tab===0 && <DayTab todayWords={todayWords} reviews={reviews} learned={learned} toggle={toggle} dayN={dayN}/>}
        {tab===1 && <FlashTab words={allTodayWords.length?allTodayWords:ALL_WORDS.slice(0,5)} learned={learned} toggle={toggle}/>}
        {tab===2 && <QuizTab words={allTodayWords.length?allTodayWords:ALL_WORDS.slice(0,5)}/>}
        {tab===3 && <AllTab  learned={learned} toggle={toggle} dayN={dayN}/>}
      </div>
    </div>
  );
}

// ─── SHARED: WORD CARD ────────────────────────────────────────────────────────
function WordCard({ word, num, learned, toggle, badge, badgeColor, badgeBg }) {
  const [sp, setSp] = useState(false);
  const doSpeak = () => { setSp(true); speak(word.en); setTimeout(()=>setSp(false),2000); };
  return (
    <div style={{
      background:learned?"linear-gradient(135deg,#F0FDF4,#DCFCE7)":"#fff",
      border:`1.5px solid ${learned?"#86EFAC":"#E2E8F0"}`,
      borderRadius:13,padding:"13px 14px",marginBottom:10,transition:"all .2s",
      boxShadow:"0 1px 6px #0000000a"
    }}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{
          width:28,height:28,borderRadius:7,background:"#EEF2FF",color:"#4F46E5",
          display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0
        }}>{num}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:15,fontWeight:700,color:"#1e1b4b"}}>{word.en}</span>
            {word.abbr && <span style={{background:"#EEF2FF",color:"#4F46E5",borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:700}}>{word.abbr}</span>}
            {badge && <span style={{background:badgeBg||"#F3F4F6",color:badgeColor||"#6B7280",borderRadius:5,padding:"1px 7px",fontSize:10,fontWeight:600}}>{badge}</span>}
          </div>
          <div style={{fontSize:13,color:"#374151",marginTop:2}}>{word.ar}</div>
        </div>
        <button onClick={doSpeak} style={{
          width:36,height:36,borderRadius:9,border:"none",cursor:"pointer",flexShrink:0,fontSize:16,transition:"all .18s",
          background:sp?"#0891B2":"#EFF6FF",color:sp?"#fff":"#0891B2"
        }}>🔊</button>
        <button onClick={()=>toggle(word.id)} style={{
          width:36,height:36,borderRadius:9,border:"none",cursor:"pointer",flexShrink:0,fontSize:17,transition:"all .18s",
          background:learned?"#DCFCE7":"#F8FAFC",color:learned?"#16A34A":"#CBD5E1"
        }}>{learned?"✅":"○"}</button>
      </div>
    </div>
  );
}

// ─── TAB 1: TODAY ─────────────────────────────────────────────────────────────
function DayTab({ todayWords, reviews, learned, toggle, dayN }) {
  const todayDate_ = dateForDay(dayN);
  const newDone    = todayWords.filter(w=>learned[w.id]).length;
  const revDone    = reviews.filter(w=>learned[w.id]).length;

  return (
    <div>
      {/* Date hero */}
      <div style={{
        background:"linear-gradient(135deg,#312E81,#4F46E5)",
        borderRadius:16,padding:"16px 18px",marginBottom:16,color:"#fff",
        display:"flex",alignItems:"center",gap:14
      }}>
        <div style={{
          background:"rgba(255,255,255,.15)",borderRadius:12,
          padding:"10px 14px",textAlign:"center",flexShrink:0
        }}>
          <div style={{fontSize:26,fontWeight:800,lineHeight:1}}>{todayDate_.getDate()}</div>
          <div style={{fontSize:11,opacity:.8}}>{AR_MONTHS[todayDate_.getMonth()]}</div>
          <div style={{fontSize:10,opacity:.65}}>{todayDate_.getFullYear()}</div>
        </div>
        <div>
          <div style={{fontSize:11,opacity:.75}}>{AR_DAYS[todayDate_.getDay()]}</div>
          <div style={{fontSize:17,fontWeight:700}}>يوم {dayN+1} من رحلتك</div>
          <div style={{fontSize:12,opacity:.8,marginTop:3}}>
            {newDone}/{todayWords.length} جديدة ✦ {revDone}/{reviews.length} مراجعة
          </div>
        </div>
      </div>

      {/* Tip strip */}
      <div style={{
        background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:12,
        padding:"10px 14px",marginBottom:16,fontSize:12,color:"#92400E"
      }}>
        💡 <b>طريقة اليوم:</b> اقرأ الكلمة، استمع لنطقها مرتين، كرر بصوت عالٍ، وعلّمها ✅ لما تحفظها
      </div>

      {/* NEW words */}
      <SectionHeader
        icon="🆕" title="كلمات جديدة اليوم"
        subtitle={todayWords.length ? `كلمات ${todayWords[0].id}–${todayWords[4].id} من أصل 500` : "لا توجد كلمات"}
        done={newDone} total={todayWords.length} color="#4F46E5"
      />
      {todayWords.map((w,i)=>(
        <WordCard key={w.id} word={w} num={w.id} learned={!!learned[w.id]} toggle={toggle}/>
      ))}

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <>
          <SectionHeader
            icon="🔄" title="مراجعة مقررة اليوم"
            subtitle="كلمات حفظتها قبل كده — وقت تثبيتها!"
            done={revDone} total={reviews.length} color="#7C3AED"
          />
          {REVIEW_GAPS.map(gap => {
            const group = reviews.filter(w=>w._gap===gap);
            if (!group.length) return null;
            const srcDay  = group[0]._srcDay;
            const srcDate = dateForDay(srcDay);
            const rl      = REVIEW_LABELS[gap];
            return (
              <div key={gap}>
                <div style={{
                  display:"flex",alignItems:"center",gap:8,
                  margin:"12px 0 8px",padding:"6px 10px",
                  background:rl.bg,borderRadius:9,border:`1px solid ${rl.color}30`
                }}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:rl.color,display:"inline-block",flexShrink:0}}/>
                  <span style={{fontSize:12,fontWeight:700,color:rl.color}}>{rl.label}</span>
                  <span style={{fontSize:11,color:"#64748B",marginRight:"auto"}}>
                    حفظتها {formatAr(srcDate)} — كلمات {group[0].id}–{group[group.length-1].id}
                  </span>
                </div>
                {group.map(w=>(
                  <WordCard key={w.id} word={w} num={w.id} learned={!!learned[w.id]} toggle={toggle}
                    badge={rl.label} badgeColor={rl.color} badgeBg={rl.bg}/>
                ))}
              </div>
            );
          })}
        </>
      )}

      {reviews.length === 0 && dayN === 0 && (
        <div style={{
          background:"#EFF6FF",borderRadius:13,padding:"16px",textAlign:"center",
          color:"#3B82F6",fontSize:13,marginTop:8,border:"1px solid #BFDBFE"
        }}>
          🎉 أول يوم في رحلتك! لا توجد مراجعات بعد.<br/>
          <span style={{fontSize:12,opacity:.8}}>بكرة هتراجع كلمات النهارده 🔄</span>
        </div>
      )}

      {/* upcoming reviews preview */}
      <UpcomingPreview dayN={dayN}/>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, done, total, color }) {
  return (
    <div style={{
      display:"flex",alignItems:"center",gap:10,
      margin:"0 0 10px",padding:"10px 12px",
      background:"#fff",borderRadius:11,border:"1.5px solid #E2E8F0",
      boxShadow:"0 1px 4px #0000000a"
    }}>
      <span style={{fontSize:20}}>{icon}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:700,color:"#1e1b4b"}}>{title}</div>
        <div style={{fontSize:11,color:"#64748B"}}>{subtitle}</div>
      </div>
      <div style={{
        background:color+"18",color,fontWeight:700,
        borderRadius:8,padding:"3px 10px",fontSize:12
      }}>{done}/{total}</div>
    </div>
  );
}

function UpcomingPreview({ dayN }) {
  const upcoming = REVIEW_GAPS
    .map(gap => ({ gap, day: dayN + gap, date: dateForDay(dayN + gap) }))
    .filter(x => wordsForDay(x.day).length > 0);
  if (!upcoming.length) return null;
  return (
    <div style={{marginTop:20}}>
      <div style={{fontSize:12,fontWeight:700,color:"#64748B",marginBottom:8}}>📆 جدول مراجعاتك القادمة</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {upcoming.map(({ gap, date }) => {
          const rl = REVIEW_LABELS[gap];
          return (
            <div key={gap} style={{
              display:"flex",alignItems:"center",gap:10,
              background:"#fff",borderRadius:10,padding:"9px 12px",
              border:"1px solid #E2E8F0"
            }}>
              <span style={{width:8,height:8,borderRadius:"50%",background:rl.color,flexShrink:0}}/>
              <div style={{flex:1}}>
                <span style={{fontSize:12,fontWeight:600,color:rl.color}}>{rl.label} لكلمات اليوم</span>
              </div>
              <span style={{fontSize:11,color:"#64748B"}}>{formatAr(date)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TAB 2: FLASHCARDS ────────────────────────────────────────────────────────
function FlashTab({ words, learned, toggle }) {
  const [idx, setIdx]       = useState(0);
  const [flipped, setFlip]  = useState(false);
  const [mode, setMode]     = useState("en");
  const w = words[idx % words.length];
  const go = dir => { setFlip(false); setTimeout(()=>setIdx(i=>(i+dir+words.length)%words.length),120); };

  return (
    <div>
      <div style={{display:"flex",gap:7,marginBottom:12}}>
        {[["en","إنجليزي → عربي"],["ar","عربي → إنجليزي"]].map(([m,l])=>(
          <button key={m} onClick={()=>{setMode(m);setFlip(false);}} style={{
            flex:1,padding:9,border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600,
            background:mode===m?"#4F46E5":"#E8E8F5",color:mode===m?"#fff":"#4F46E5"
          }}>{l}</button>
        ))}
      </div>
      <div style={{textAlign:"center",fontSize:11,color:"#94A3B8",marginBottom:8}}>{idx+1} / {words.length}</div>

      <div onClick={()=>setFlip(f=>!f)} style={{
        minHeight:180,borderRadius:18,cursor:"pointer",marginBottom:12,
        background:flipped?"linear-gradient(135deg,#312E81,#6D28D9)":"linear-gradient(135deg,#EEF2FF,#F5F3FF)",
        border:"2px solid #C7D2FE",display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",padding:"24px 18px",
        boxShadow:"0 6px 20px #4F46E515",transition:"background .25s"
      }}>
        <div style={{fontSize:11,marginBottom:8,fontWeight:600,color:flipped?"#C4B5FD":"#6366F1"}}>
          {flipped?"الإجابة ✓":(mode==="en"?"اضغط لترى المعنى":"اضغط للترجمة")}
        </div>
        <div style={{fontSize:22,fontWeight:800,color:flipped?"#fff":"#1e1b4b",textAlign:"center"}}>
          {flipped?(mode==="en"?w.ar:w.en):(mode==="en"?w.en:w.ar)}
        </div>
        {w.abbr && !flipped && mode==="en" && (
          <span style={{marginTop:8,background:"#4F46E518",color:"#4F46E5",borderRadius:7,padding:"2px 9px",fontSize:11,fontWeight:700}}>{w.abbr}</span>
        )}
      </div>

      <div style={{display:"flex",gap:9,marginBottom:9}}>
        <button onClick={()=>go(-1)} style={{flex:1,padding:11,border:"none",borderRadius:11,background:"#E8E8F5",color:"#4F46E5",fontWeight:700,cursor:"pointer",fontSize:17}}>→</button>
        <button onClick={()=>speak(w.en)} style={{flex:2,padding:11,border:"none",borderRadius:11,background:"linear-gradient(135deg,#0891B2,#0284C7)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>🔊 استمع للنطق</button>
        <button onClick={()=>go(1)} style={{flex:1,padding:11,border:"none",borderRadius:11,background:"#E8E8F5",color:"#4F46E5",fontWeight:700,cursor:"pointer",fontSize:17}}>←</button>
      </div>
      <button onClick={()=>toggle(w.id)} style={{
        width:"100%",padding:12,border:"none",borderRadius:11,cursor:"pointer",fontSize:13,fontWeight:700,transition:"all .2s",
        background:learned[w.id]?"linear-gradient(135deg,#22C55E,#16A34A)":"#F1F5F9",
        color:learned[w.id]?"#fff":"#64748B"
      }}>{learned[w.id]?"✅ محفوظة — اضغط لإلغاء":"○ علّم كمحفوظة"}</button>
    </div>
  );
}

// ─── TAB 3: QUIZ ──────────────────────────────────────────────────────────────
function QuizTab({ words }) {
  const [mode, setMode]   = useState(null);
  const [qIdx, setQIdx]   = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [done, setDone]   = useState(false);
  const [qWords]          = useState(()=>[...words].sort(()=>Math.random()-.5).slice(0,Math.min(words.length,10)));

  const opts = q => {
    const pool = ALL_WORDS.filter(w=>w.id!==q.id).sort(()=>Math.random()-.5).slice(0,3);
    return [...pool,q].sort(()=>Math.random()-.5);
  };
  const restart = () => { setQIdx(0); setScore(0); setChosen(null); setDone(false); };

  if (!mode) return (
    <div>
      <div style={{background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)",borderRadius:14,padding:"16px 18px",marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:38,marginBottom:6}}>🧠</div>
        <div style={{fontSize:16,fontWeight:700,color:"#1e1b4b"}}>اختبر نفسك</div>
        <div style={{fontSize:11,color:"#64748B"}}>من كلمات اليوم + المراجعات ({qWords.length} سؤال)</div>
      </div>
      {[
        {m:"en-ar",l:"إنجليزي → اختر المعنى",i:"🇸🇦",d:"شاهد الكلمة إنجليزي واختر معناها عربي"},
        {m:"ar-en",l:"عربي → اختر الترجمة",i:"🇬🇧",d:"شاهد الكلمة عربي واختر ترجمتها إنجليزي"},
        {m:"listen",l:"استمع واختر",i:"🎧",d:"استمع للصوت واختر الكلمة الصحيحة"},
      ].map(({m,l,i,d})=>(
        <button key={m} onClick={()=>setMode(m)} style={{
          width:"100%",padding:"13px 14px",border:"1.5px solid #E0E7FF",borderRadius:12,
          background:"#fff",cursor:"pointer",textAlign:"right",display:"flex",alignItems:"center",gap:12,marginBottom:8
        }}>
          <span style={{fontSize:24}}>{i}</span>
          <div><div style={{fontSize:13,fontWeight:700,color:"#1e1b4b"}}>{l}</div><div style={{fontSize:11,color:"#64748B"}}>{d}</div></div>
        </button>
      ))}
    </div>
  );

  if (done) {
    const pct = Math.round((score/qWords.length)*100);
    return (
      <div style={{textAlign:"center",padding:"24px 8px"}}>
        <div style={{fontSize:52,marginBottom:10}}>{pct===100?"🏆":pct>=70?"🎯":"📖"}</div>
        <div style={{fontSize:20,fontWeight:800,color:"#1e1b4b",marginBottom:8}}>{score} / {qWords.length} صحيح</div>
        <div style={{fontSize:13,marginBottom:20,borderRadius:12,padding:"10px",
          background:pct>=80?"#F0FDF4":pct>=60?"#FFFBEB":"#FFF1F2",
          color:pct>=80?"#166534":pct>=60?"#92400E":"#991B1B"
        }}>
          {pct===100?"ممتاز! أتقنت كل الكلمات 🎉":pct>=80?"رائع! 💪":pct>=60?"جيد! راجع تاني 📚":"تحتاج مذاكرة أكثر 🔄"}
        </div>
        <div style={{display:"flex",gap:9}}>
          <button onClick={restart} style={{flex:1,padding:12,border:"none",borderRadius:11,background:"linear-gradient(135deg,#312E81,#6D28D9)",color:"#fff",fontWeight:700,cursor:"pointer"}}>إعادة</button>
          <button onClick={()=>{setMode(null);restart();}} style={{flex:1,padding:12,border:"1.5px solid #E0E7FF",borderRadius:11,background:"#fff",color:"#4F46E5",fontWeight:700,cursor:"pointer"}}>نوع آخر</button>
        </div>
      </div>
    );
  }

  const q       = qWords[qIdx];
  const options = opts(q);
  const isOk  = o => mode==="en-ar"?o.ar===q.ar:o.en===q.en;
  const isBad = o => chosen&&chosen.id===o.id&&!isOk(o);
  const pick  = o => {
    if (chosen) return;
    setChosen(o);
    if (isOk(o)) setScore(s=>s+1);
    setTimeout(()=>{ if (qIdx+1>=qWords.length) setDone(true); else { setQIdx(i=>i+1); setChosen(null); } }, 950);
  };

  return (
    <div>
      <div style={{display:"flex",gap:4,marginBottom:12}}>
        {qWords.map((_,i)=>(
          <div key={i} style={{flex:1,height:5,borderRadius:99,background:i<qIdx?"#4F46E5":i===qIdx?"#A5B4FC":"#E2E8F0"}}/>
        ))}
      </div>
      <div style={{background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)",borderRadius:14,padding:"18px",marginBottom:12,textAlign:"center",border:"2px solid #C7D2FE"}}>
        <div style={{fontSize:11,color:"#6366F1",marginBottom:7,fontWeight:600}}>
          {mode==="en-ar"?"ما معنى هذه الكلمة؟":mode==="ar-en"?"ما ترجمة هذه الكلمة؟":"أي كلمة سمعت؟"}
        </div>
        {mode==="listen"?(
          <button onClick={()=>speak(q.en)} style={{padding:"12px 24px",border:"none",borderRadius:11,background:"linear-gradient(135deg,#312E81,#6D28D9)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:16}}>🔊 استمع</button>
        ):(
          <div>
            <div style={{fontSize:22,fontWeight:800,color:"#1e1b4b"}}>{mode==="en-ar"?q.en:q.ar}</div>
            {mode==="en-ar"&&<button onClick={()=>speak(q.en)} style={{marginTop:7,padding:"5px 13px",border:"none",borderRadius:7,background:"#EEF2FF",color:"#4F46E5",cursor:"pointer",fontSize:11}}>🔈 استمع</button>}
          </div>
        )}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {options.map((o,i)=>(
          <button key={i} onClick={()=>pick(o)} style={{
            padding:"12px 14px",border:"2px solid",borderRadius:11,cursor:"pointer",
            textAlign:"right",fontSize:13,fontWeight:500,transition:"all .15s",
            borderColor:chosen?(isOk(o)?"#22C55E":isBad(o)?"#EF4444":"#E2E8F0"):"#E2E8F0",
            background:chosen?(isOk(o)?"#F0FDF4":isBad(o)?"#FFF1F2":"#fff"):"#fff",
            color:chosen?(isOk(o)?"#16A34A":isBad(o)?"#DC2626":"#374151"):"#374151",
          }}>{mode==="en-ar"?o.ar:o.en}</button>
        ))}
      </div>
    </div>
  );
}

// ─── TAB 4: ALL WORDS ─────────────────────────────────────────────────────────
function AllTab({ learned, toggle, dayN }) {
  const [q, setQ]   = useState("");
  const [f, setF]   = useState("all");
  const lCount      = Object.keys(learned).length;

  const filtered = ALL_WORDS.filter(w => {
    const sq = q.toLowerCase();
    const match = !sq||w.en.toLowerCase().includes(sq)||w.ar.includes(sq)||(w.abbr&&w.abbr.toLowerCase().includes(sq));
    if (!match) return false;
    if (f==="learned")   return !!learned[w.id];
    if (f==="unlearned") return !learned[w.id];
    if (f==="today") {
      const wDay = Math.floor((w.id-1)/5);
      return wDay === dayN;
    }
    if (f==="available") return Math.floor((w.id-1)/5) <= dayN;
    return true;
  });

  return (
    <div>
      <input value={q} onChange={e=>setQ(e.target.value)}
        placeholder="🔍 ابحث بالإنجليزي أو العربي أو الاختصار..."
        style={{width:"100%",padding:"11px 13px",borderRadius:10,border:"1.5px solid #E2E8F0",fontSize:13,marginBottom:10,boxSizing:"border-box",outline:"none",background:"#fff",fontFamily:"inherit"}}
      />
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
        {[
          ["all","الكل",ALL_WORDS.length,"#4F46E5"],
          ["today","اليوم",5,"#059669"],
          ["available","متاحة",Math.min((dayN+1)*5,500),"#0891B2"],
          ["learned","محفوظ",lCount,"#16A34A"],
          ["unlearned","غير محفوظ",500-lCount,"#DC2626"],
        ].map(([v,l,c,col])=>(
          <button key={v} onClick={()=>setF(v)} style={{
            padding:"6px 11px",border:"none",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:600,
            background:f===v?col:"#E8E8F5",color:f===v?"#fff":col
          }}>{l} ({c})</button>
        ))}
      </div>
      <div style={{fontSize:11,color:"#94A3B8",marginBottom:10}}>{filtered.length} نتيجة</div>
      {filtered.map(w=>{
        const wDay    = Math.floor((w.id-1)/5);
        const isTdy   = wDay===dayN;
        const isFuture= wDay>dayN;
        return (
          <WordCard key={w.id} word={w} num={w.id} learned={!!learned[w.id]} toggle={toggle}
            badge={isTdy?"اليوم":isFuture?"قادمة":null}
            badgeColor={isTdy?"#4F46E5":isFuture?"#94A3B8":null}
            badgeBg={isTdy?"#EEF2FF":isFuture?"#F1F5F9":null}
          />
        );
      })}
    </div>
  );
}
