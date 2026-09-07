// DevPantry Chaos & Edge-Case Generation Engine
// Curated, battle-tested dirty data pools sourced from real-world production bugs.

// ═══════════════════════════════════════════════════════════════════════════════
// NAUGHTY STRINGS — Big List of Naughty Strings (BLNS) Extended Edition
// ═══════════════════════════════════════════════════════════════════════════════

export const NAUGHTY_STRINGS = [
  // ── Zero-Width & Invisible Characters ──
  "   ",
  "\u200B\u200C\u200D\uFEFF",
  "   Leading and trailing whitespace   ",
  "Tabs\t\tand\nnewlines\r\nmixed",
  "\u00A0\u00A0Non-breaking spaces\u00A0\u00A0",
  "\u2003\u2003Em-width spaces\u2003\u2003",
  "\u200ELeft-to-right mark\u200F",
  "\uFEFFByte order mark prefix",
  "Line\u2028separator\u2029paragraph",
  "Soft\u00ADhyphen\u00ADwrapped\u00ADwords",

  // ── RTL Override & Directionality Attacks ──
  "\u202Ereversed_text_payload\u202C",
  "مرحبا بالعالم (Arabic RTL)",
  "שלום עולם (Hebrew RTL)",
  "\u202ERight to Left Override Attack\u202C normal text",
  "user\u202E\u202Dfdp.exe",  // File extension spoofing via RLO
  "Price: \u202E999$\u202C",  // Number spoofing via RLO

  // ── Diacritics / Zalgo Stacking ──
  "T̷h̷e̷ ̷C̷h̷a̷o̷s̷ ̷B̷e̷g̷i̷n̷s̷",
  "Z̴a̷l̶g̸o̶ ̷t̴e̵x̵t̸ ̶s̶t̸r̴e̶s̵s̶",
  "Åge Müller-Großmann",
  "Hélène Çağdaş",
  "Ñoño año español",
  "Ÿüñíçödé ëvérÿwhéré",
  "Ǩ̵̡̛̺̩̫̹̲̤̱̤̟̞̖̫̱̜̪̖̟̠̣̙̩̥̪̺̟̩̲͕̹̮̰̝̟̳̪̠̯̺̬̹̭̦̠̘̥̪̬̲̮̹̺̦̲̥̫̟̬̲̞̥̟̤̝̥̦̩̤̮̥̤̤̥̝̤̦̟̤̤̤̥̤̦̤̤̤̥̤̤̤̦̤̤̤̥̝̤̤̤̤̤̤̤̤",

  // ── Multi-Byte & Emoji Edge Cases ──
  "👨‍👩‍👧‍👦 (ZWJ Family)",
  "🏳️‍🌈 (Emoji sequence)",
  "🂡 🂢 🂣 🂤 🂥 🂦 🂧",
  "👾".repeat(45),
  "𝓤𝓷𝓲𝓬𝓸𝓭𝓮 𝓜𝓪𝓽𝓱 𝓢𝔂𝓶𝓫𝓸𝓵𝓼",
  "🧑‍💻🧑🏻‍💻🧑🏼‍💻🧑🏽‍💻🧑🏾‍💻🧑🏿‍💻",  // Skin tone modifier sequence
  "🏴󠁧󠁢󠁳󠁣󠁴󠁿",  // Regional indicator sequence (Scotland flag)
  "👩‍❤️‍💋‍👩",  // Complex ZWJ chain
  "1️⃣2️⃣3️⃣",  // Keycap sequences
  "©®™℠",  // Legal symbols that can break fonts
  "☠️☢️☣️⚠️",  // Hazard symbols

  // ── Script Mixing ──
  "Русский / 汉语 / 日本語 / English / العربية",
  "東京 / 東京都千代田区1-1",
  "Москва Moscow مسکو Moskau モスクワ",
  "München / ミュンヘン / Мюнхен / 뮌헨",
  "हिन्दी Hindi হিন্দি",
  "조선글 / 한국어 Korean",
  "ᚠᚢᚦᚨᚱᚲ Runic text",
  "𒀀𒀁𒀂 Cuneiform glyphs",

  // ── Boundary String Lengths ──
  "",
  "A",
  "AB",
  "X".repeat(255),
  "Y".repeat(256),
  "Z".repeat(1024),
  "Supercalifragilisticexpialidocious".repeat(8),
  "W".repeat(65536),

  // ── Injection Patterns (inert mock text) ──
  "<script>alert(1)</script>",
  "<img src=x onerror=alert('XSS')>",
  "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/'/+/onmouseover=1/>",
  "'; DROP TABLE users; --",
  "1' OR '1'='1",
  "1; UPDATE users SET admin=1 WHERE 1=1--",
  "' UNION SELECT * FROM information_schema.tables--",
  "{{7*7}}",
  "${7*7}",
  "#{7*7}",
  "<%= 7*7 %>",
  "{{constructor.constructor('return this')()}}",
  "${__import__('os').popen('id').read()}",
  "\"\"\"\"''''````",
  "&amp;&lt;&gt;&quot;&#39;",
  "../../../etc/passwd",
  "..\\..\\..\\windows\\system32\\config\\sam",
  "file:///etc/hosts",
  "data:text/html,<h1>injected</h1>",

  // ── Null, Falsy & Special Representations ──
  "null",
  "undefined",
  "NaN",
  "Infinity",
  "-Infinity",
  "[object Object]",
  "None",
  "nil",
  "NIL",
  "true",
  "false",
  "0x00",
  "-0",
  "1e+308",
  "Number.MIN_SAFE_INTEGER",
  "9007199254740993",  // Number.MAX_SAFE_INTEGER + 2
  "0.0",
  "-0.0",
  "0e0",
  "0/0",

  // ── Format-Breaking Characters ──
  'He said "hello" and \'goodbye\'',
  "Line1\nLine2\nLine3",
  "Column1\tColumn2\tColumn3",
  "Comma, separated, values, inside, a, field",
  'Quote"Inside"Field',
  "Back\\slash\\path\\separator",
  "Pipe|Delimited|Values",
  "Semi;colon;separated",
  "Carriage\rReturn\rOnly",

  // ── Homoglyph Confusable Attacks ──
  "раypal.com",  // Cyrillic 'а' in 'paypal'
  "аррlе.com",  // Cyrillic 'а' and 'р' in 'apple'
  "gооgle.com",  // Cyrillic 'о' in 'google'
  "microsоft.com"  // Cyrillic 'о' in 'microsoft'
];

// ═══════════════════════════════════════════════════════════════════════════════
// DIRTY NAMES — International, Edge-Case, and Adversarial Person Names
// ═══════════════════════════════════════════════════════════════════════════════

export const DIRTY_NAMES = [
  // ── Formatting Traps ──
  "Dr. O'Connor-Smith, Jr.",
  "Maria-José González-López",
  "J",
  "AB",
  "   Untrimmed User   ",
  "John   MiddleName   Doe",
  "A. B. C. D. E. F. G. Henderson",
  "Jane Doe, Ph.D, Esq.",
  "Mr./Mrs. Pat Smith-Jones (née Williams)",

  // ── Extreme Lengths ──
  "Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr.",
  "Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin John Kenneth Lloyd Martin Nero Oliver Paul Quincy Randolph Sherman Thomas Uncas Victor William Xerxes Yancy Zeus Wolfeschlegelsteinhausenbergerdorff",
  "X",
  "Al",

  // ── Cultural Diversity ──
  "佐々木 健太",
  "田中 太郎",
  "Nguyễn Tấn Dũng",
  "Åke Lindström",
  "Hélène Çağdaş",
  "Björk Guðmundsdóttir",
  "José María Aznar López",
  "Σωκράτης (Socrates)",
  "محمد بن سلمان",
  "Владимир Путин",
  "김정은",
  "Māori Tūhoe Ngāi",
  "Ñoño Muñoz",
  "Þór Oddsson",  // Icelandic thorn
  "Łukasz Świerczewski",  // Polish
  "Ünsal Çelik",  // Turkish
  "François Müller-Böhm",

  // ── Adversarial & Edge Cases ──
  "Null",
  "null",
  "undefined",
  "True",
  "None",
  "Robert'); DROP TABLE Students;--",
  "99999",
  "--------------------",
  "user@example.com",
  "<script>alert('xss')</script>",
  "Prince 👑 The First",
  "Ek Naam 🇮🇳",
  "Test\tTabbed\tName",
  "New\nLine\nName",
  "",
  " ",
  "   ",
  "ALLCAPSNAME",
  "nocapsname"
];

// ═══════════════════════════════════════════════════════════════════════════════
// DIRTY EMAILS — RFC 5321 Edge Cases, Internationalized, & Adversarial
// ═══════════════════════════════════════════════════════════════════════════════

export const DIRTY_EMAILS = [
  // ── Valid but Unusual RFC Compliant ──
  "user+tag+nested@company.subdomain.co.uk",
  "very.common@example.com",
  "disposable.style.email.with+symbol@example.com",
  "other.email-with-dash@example.com",
  "x@example.com",
  "a@b.co",
  "\"much.more unusual\"@example.com",
  "\"very.unusual.@.unusual.com\"@example.com",
  "#!$%&'*+/=?^`{}|~@example.org",
  "\" \"@example.org",
  "user.name+tag+sorting@example.com",

  // ── Internationalized Email (EAI / RFC 6531) ──
  "pelé@example.com",
  "用户@例子.广告",
  "квіток@пошта.укр",
  "χρήστης@παράδειγμα.ελ",
  "Dörte@Sörensen.example.com",
  "θσερ@εχαμπλε.ψομ",
  "dōmain@iana.org",

  // ── Edge-Case Lengths & Domains ──
  "admin@mailserver1",
  "user@localserver",
  "trailing-dot@example.com.",
  "a".repeat(64) + "@long-local-part.com",
  "user@" + "a".repeat(60) + ".example.com",
  "user@123.123.123.123",
  "user@[IPv6:2001:db8::1]",

  // ── Adversarial & Injection Patterns ──
  "null@null.void",
  "test@test",
  "@missing-local.com",
  "missing-domain@",
  "two@@ats.com",
  ".starts.with.dot@example.com",
  "ends.with.dot.@example.com",
  "user@-starts-with-dash.com",
  "user@ends-with-dash-.com",
  "user@exam..ple.com",
  "\"<script>\"@example.com",
  "admin'--@sqli.com",
  "user@example.com\nBcc: evil@hacker.com",  // Header injection
  "user+tag@example.com; rm -rf /",  // Command injection fragment
  "",  // Empty string
  " ",  // Space only
  "definitely_not_an_email"
];

// ═══════════════════════════════════════════════════════════════════════════════
// DIRTY ADDRESSES — International, Multiline, and Adversarial Mailing Addresses
// ═══════════════════════════════════════════════════════════════════════════════

export const DIRTY_ADDRESSES = [
  // ── US Formats & Quirks ──
  "Apt 4B, 221B Baker St.\nAttn: Sherlock Holmes\nKnock 3 Times",
  "123-45 67th St, Fl 8, Ste 800-B",
  "Rural Route 2, Box 99A (Behind the red barn)",
  "P.O. Box #404 (Do not deliver on weekends)",
  "1600 Pennsylvania Avenue NW\nWashington, D.C. 20500",
  "1 Infinite Loop\nCupertino, CA 95014",
  "Highway 101 KM 42.5, Sector North",
  "Corner of 5th Ave & 42nd St",

  // ── International Formats ──
  "100-0001 東京都千代田区千代田1-1",
  "Palacio de La Moneda, Santiago, Chile",
  "Postfach 12 34 56, 10115 Berlin, Germany",
  "Somewhere over the rainbow, 00000",
  "5ème étage, 27 Rue de Fleurus, 75006 Paris, France",
  "Кремль, Москва, Россия, 103073",
  "서울특별시 중구 세종대로 110",
  "Av. Paulista, 1578 - Bela Vista\nSão Paulo - SP, 01310-200",
  "No. 1 Zhongshan East Road\n中山東路1號\nTaipei 100, Taiwan",
  "Victoria Pk Rd & Hing Fat St\nCauseway Bay, Hong Kong",

  // ── Postal Code Edge Cases ──
  "12345",
  "12345-6789",
  "00000",
  "99999-9999",
  "SW1A 1AA",  // UK format
  "H0H 0H0",  // Canadian Santa Claus
  "110 001",  // Indian 6-digit with space

  // ── Adversarial ──
  "No street number, Island of Tristan da Cunha",
  "<script>alert('xss')</script>",
  "123 Main St; DROP TABLE addresses;--",
  "",
  " ",
  "N/A",
  "Unknown",
  "REDACTED",
  "123 Fake Street\n\n\n\nMultiple blank lines above",
  "Emoji House 🏠, Rainbow Road 🌈, Cloud City ☁️"
];

// ═══════════════════════════════════════════════════════════════════════════════
// DIRTY PHONE NUMBERS — International Formats, Extensions, & Boundary Cases
// ═══════════════════════════════════════════════════════════════════════════════

export const DIRTY_PHONES = [
  // ── Valid International Formats ──
  "+1 (555) 019-2834",
  "+44 20 7946 0958",
  "+49 30 123456-0",
  "+81 3-1234-5678",
  "+86 10 1234 5678",
  "+91 98765 43210",
  "+7 495 123-45-67",
  "+33 1 23 45 67 89",
  "+55 11 91234-5678",
  "+82 2-123-4567",
  "+972 2-123-4567",

  // ── Extensions & Formatting Edge Cases ──
  "+1 (555) 019-2834 ext 999999999999",
  "555.019.2834",
  "5550192834",
  "(555) 019-2834",
  "555-019-2834",
  "+1-555-019-2834",
  "1-800-FLOWERS",  // Vanity number
  "011-44-20-7946-0958",  // US international dialing

  // ── Adversarial & Invalid ──
  "000-000-0000",
  "+0 000 000 0000",
  "911",
  "112",
  "",
  " ",
  "null",
  "NaN",
  "+1",
  "+".repeat(30),
  "phone",
  "((((((",
  "+1 555 0192834#24*99",
  "📱 Call Me Maybe",
  "+99 999 999 9999 9999 9999",  // Way too long
  "123"
];

// ═══════════════════════════════════════════════════════════════════════════════
// DIRTY URLS — Valid, Internationalized, Injection, & Boundary URLs
// ═══════════════════════════════════════════════════════════════════════════════

export const DIRTY_URLS = [
  // ── Valid but Tricky ──
  "https://example.com",
  "http://example.com:8080/path?query=value&other=123#fragment",
  "https://user:password@example.com:443/path",
  "https://subdomain.sub.example.co.uk/deeply/nested/path",
  "ftp://files.example.com/pub/",
  "https://example.com/path%20with%20spaces",
  "https://example.com/path?q=hello+world&lang=en",

  // ── Internationalized (IDN / Punycode) ──
  "https://xn--e1afmkfd.xn--p1ai",  // пример.рф
  "https://例え.jp/テスト",
  "https://münchen.de/ünîcödé",
  "https://🏠.ws",  // Emoji domain

  // ── Localhost & Internal ──
  "http://localhost",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  "http://0.0.0.0",
  "http://[::1]:3000",
  "http://169.254.169.254/latest/meta-data/",  // AWS IMDS
  "http://metadata.google.internal/",

  // ── Adversarial & Injection ──
  "javascript:alert('XSS')",
  "data:text/html,<h1>injected</h1>",
  "https://evil.com/redirect?url=https://bank.com",
  "https://example.com/<script>alert(1)</script>",
  "https://example.com/path?q='; DROP TABLE users;--",
  "//protocol-relative.example.com",
  "https://example.com/path#<img onerror=alert(1) src=x>",

  // ── Boundary ──
  "",
  " ",
  "not_a_url",
  "http://",
  "://missing-protocol.com",
  "https://" + "a".repeat(2048) + ".com",  // Extremely long URL
  "file:///etc/passwd",
  "\\\\network-share\\folder"
];

// ═══════════════════════════════════════════════════════════════════════════════
// CHAOS PRESETS — Curated Domain-Specific Edge-Case Generators
// ═══════════════════════════════════════════════════════════════════════════════

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const CHAOS_PRESETS = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Orders',
    description: 'Orders with high-entropy items, zero-amount promotions, extreme quantities, and multi-currency edge cases.',
    generate: (count: number, entropy: number) => {
      const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded_partially', 'disputed', 'chargeback_fraud_hold', 'backordered', 'lost_in_transit'];
      const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'VND', 'BTC', 'ETH', 'KWD', 'BHD', 'OMR', 'CLF', 'XXX'];
      const paymentMethods = ['visa_4242', 'mastercard_5555', 'amex_3782', 'paypal', 'apple_pay', 'crypto_wallet', 'bank_transfer', 'cash_on_delivery', 'buy_now_pay_later', 'gift_card_partial'];

      return Array.from({ length: count }, (_, i) => {
        const isDirty = Math.random() < (entropy / 100);
        const qty = isDirty ? (Math.random() > 0.5 ? 999999 : (Math.random() > 0.5 ? 0 : -1)) : Math.floor(Math.random() * 5) + 1;
        const price = isDirty 
          ? (Math.random() > 0.6 ? 0.00000001 : (Math.random() > 0.3 ? -15.50 : (Math.random() > 0.5 ? 9999999.99 : 0.1 + 0.2)))
          : parseFloat((Math.random() * 200 + 5).toFixed(2));
        const discountPct = isDirty ? (Math.random() > 0.5 ? 150 : (Math.random() > 0.5 ? -10 : 0)) : Math.floor(Math.random() * 30);
        
        return {
          order_id: isDirty ? `ORD-${Math.random().toString(36).substring(2, 7)}-${i}-🚨` : `ORD-2026-${1000 + i}`,
          customer_name: isDirty ? pickRandom(DIRTY_NAMES) : `Customer ${i + 1}`,
          customer_email: isDirty ? pickRandom(DIRTY_EMAILS) : `user${i+1}@store.io`,
          shipping_address: isDirty ? pickRandom(DIRTY_ADDRESSES) : `${100 + i} Main St, Suite ${i}`,
          shipping_phone: isDirty ? pickRandom(DIRTY_PHONES) : `+1-202-555-01${i < 10 ? '0' + i : i}`,
          items_count: qty,
          currency: pickRandom(currencies),
          unit_price: price,
          discount_percent: discountPct,
          tax_rate: isDirty ? (Math.random() > 0.5 ? 0.0 : 0.2857142857) : 0.08,
          total_amount: parseFloat((qty * price * (1 - discountPct / 100)).toFixed(6)),
          payment_method: pickRandom(paymentMethods),
          order_status: pickRandom(statuses),
          special_instructions: isDirty ? pickRandom(NAUGHTY_STRINGS) : "Leave at front desk.",
          referral_url: isDirty ? pickRandom(DIRTY_URLS) : `https://store.io/product/${i + 1}`,
          created_at: isDirty ? (Math.random() > 0.5 ? "1970-01-01T00:00:00.000Z" : (Math.random() > 0.5 ? "2038-01-19T03:14:07.000Z" : "0000-00-00T00:00:00Z")) : new Date(Date.now() - i * 86400000).toISOString()
        };
      });
    }
  },
  {
    id: 'users',
    name: 'B2B Users & Identities',
    description: 'Profiles with complex multi-script names, exotic domains, edge-case phones, and role permissions.',
    generate: (count: number, entropy: number) => {
      const roles = ['member', 'admin', 'billing_owner', 'auditor', 'suspended', 'invited_pending', 'bot_service_account', 'super_admin', 'read_only_viewer', 'external_contractor'];
      const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata', 'Pacific/Auckland', 'UTC', 'Etc/GMT+12', 'US/Samoa'];
      const locales = ['en-US', 'ja-JP', 'zh-CN', 'ar-SA', 'he-IL', 'de-DE', 'pt-BR', 'ko-KR', 'hi-IN', 'ru-RU'];

      return Array.from({ length: count }, (_, i) => {
        const isDirty = Math.random() < (entropy / 100);
        return {
          user_id: isDirty ? `usr_${Math.random() > 0.5 ? 'null' : '00000000-0000-0000-0000-000000000000'}` : `usr_live_${1000 + i}`,
          display_name: isDirty ? pickRandom(DIRTY_NAMES) : `Developer ${i + 1}`,
          work_email: isDirty ? pickRandom(DIRTY_EMAILS) : `dev.${i+1}@enterprise.tech`,
          phone: isDirty ? pickRandom(DIRTY_PHONES) : `+1-202-555-01${i < 10 ? '0' + i : i}`,
          bio_headline: isDirty ? pickRandom(NAUGHTY_STRINGS) : "Full-stack engineer building resilient web services.",
          avatar_url: isDirty ? pickRandom(DIRTY_URLS) : `https://images.unsplash.com/photo-1534528741775?w=150`,
          role: pickRandom(roles),
          is_mfa_enabled: isDirty ? (Math.random() > 0.5 ? null : false) : true,
          last_login_ip: isDirty ? (Math.random() > 0.5 ? "::1" : (Math.random() > 0.5 ? "256.0.0.1" : "0.0.0.0")) : `192.168.1.${10 + i}`,
          api_rate_limit: isDirty ? (Math.random() > 0.5 ? 0 : (Math.random() > 0.5 ? 999999999 : -1)) : 5000,
          preferred_locale: pickRandom(locales),
          timezone: pickRandom(timezones),
          verified: isDirty ? (Math.random() > 0.7 ? null : false) : true,
          signup_referrer: isDirty ? pickRandom(DIRTY_URLS) : "https://enterprise.tech/signup",
          last_login_at: isDirty ? (Math.random() > 0.5 ? "1970-01-01T00:00:00.000Z" : null) : new Date(Date.now() - i * 3600000).toISOString()
        };
      });
    }
  },
  {
    id: 'financial',
    name: 'Invoices & Billing Transactions',
    description: 'Financial transactions with floating-point anomalies, negative fees, high-decimal crypto rates, and chargebacks.',
    generate: (count: number, entropy: number) => {
      const types = ['subscription', 'usage_metered', 'credit_adjustment', 'refund_chargeback', 'proration_credit', 'one_time_setup', 'overage_charge', 'tax_adjustment', 'wire_transfer_fee'];
      const paymentStatuses = ['authorized', 'captured', 'settled', 'failed', 'declined', 'refunded', 'partially_refunded', 'disputed', 'void', 'pending_3ds'];

      return Array.from({ length: count }, (_, i) => {
        const isDirty = Math.random() < (entropy / 100);
        const subtotal = isDirty ? (Math.random() > 0.5 ? 0.1 + 0.2 : (Math.random() > 0.5 ? -45.00 : 0)) : parseFloat((Math.random() * 1500 + 20).toFixed(2));
        return {
          invoice_number: isDirty ? `INV-${i}-#%&*` : `INV-2026-${5000 + i}`,
          billing_type: pickRandom(types),
          customer_name: isDirty ? pickRandom(DIRTY_NAMES) : `Client Corp ${i + 1}`,
          customer_email: isDirty ? pickRandom(DIRTY_EMAILS) : `billing${i+1}@client.co`,
          subtotal: subtotal,
          discount_amount: isDirty ? (Math.random() > 0.5 ? subtotal * 1.5 : (Math.random() > 0.5 ? -20 : 0.0)) : 10.00,
          processing_fee: isDirty ? (Math.random() > 0.5 ? 0.0000000000000001 : -0.50) : 2.50,
          tax_amount: isDirty ? (Math.random() > 0.5 ? NaN : -8.25) : parseFloat((subtotal * 0.08).toFixed(2)),
          currency_code: isDirty ? (Math.random() > 0.5 ? "SAT" : (Math.random() > 0.5 ? "XXX" : "")) : "USD",
          exchange_rate: isDirty ? (Math.random() > 0.5 ? 0.0000123456789 : Infinity) : 1.0,
          payment_status: pickRandom(paymentStatuses),
          payment_method_last4: isDirty ? (Math.random() > 0.5 ? "0000" : "****") : `${1000 + (i % 9000)}`,
          memo_notes: isDirty ? pickRandom(NAUGHTY_STRINGS) : "Monthly cloud platform usage invoice.",
          is_delinquent: isDirty ? true : false,
          due_date: isDirty ? (Math.random() > 0.5 ? "0000-00-00" : "9999-12-31") : new Date(Date.now() + (30 - i) * 86400000).toISOString().split('T')[0]
        };
      });
    }
  },
  {
    id: 'naughty',
    name: 'BLNS Naughty Strings Suite',
    description: 'Direct injection of the Big List of Naughty Strings covering Unicode, SQL injection strings, XSS fragments, and RTL overrides.',
    generate: (count: number, _entropy: number) => {
      return Array.from({ length: count }, (_, i) => {
        const stringVal = NAUGHTY_STRINGS[i % NAUGHTY_STRINGS.length];
        return {
          index: i + 1,
          category: categorizeNaughtyString(i),
          raw_payload: stringVal,
          character_length: stringVal.length,
          utf16_code_units: stringVal.length,
          byte_length: new TextEncoder().encode(stringVal).length,
          contains_newlines: stringVal.includes('\n') || stringVal.includes('\r'),
          contains_zero_width: /[\u200B\u200C\u200D\uFEFF]/.test(stringVal),
          contains_rtl: /[\u202E\u202D\u200F\u200E]/.test(stringVal),
          is_injection_risk: /<script|DROP TABLE|UNION SELECT|javascript:|onerror=|onload=/.test(stringVal),
          is_empty_or_whitespace: stringVal.trim() === ''
        };
      });
    }
  }
];

function categorizeNaughtyString(index: number): string {
  if (index < 10) return "Zero-Width & Invisible";
  if (index < 16) return "RTL / Directionality";
  if (index < 23) return "Diacritics & Zalgo";
  if (index < 34) return "Emoji & Multi-Byte";
  if (index < 42) return "Script Mixing";
  if (index < 50) return "Boundary Lengths";
  if (index < 68) return "Injection Patterns";
  if (index < 88) return "Null & Falsy Values";
  if (index < 97) return "Format-Breaking Characters";
  return "Homoglyph Confusables";
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ENGINE — Multi-Format Data Exporters
// ═══════════════════════════════════════════════════════════════════════════════

export function exportData(data: any[], format: 'json' | 'csv' | 'typescript' | 'zod'): string {
  if (!data || data.length === 0) return '';

  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);

    case 'csv': {
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',')
      ];
      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header];
          if (val === null || val === undefined) return '""';
          const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return `"${stringVal.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      return csvRows.join('\n');
    }

    case 'typescript': {
      const sample = data[0];
      const inferType = (val: any): string => {
        if (val === null) return 'string | null';
        if (typeof val === 'number') return 'number';
        if (typeof val === 'boolean') return 'boolean';
        if (Array.isArray(val)) return 'any[]';
        if (typeof val === 'object') return 'Record<string, any>';
        return 'string';
      };

      const fields = Object.entries(sample)
        .map(([key, val]) => `  ${key}: ${inferType(val)};`)
        .join('\n');

      return `export interface GeneratedMockItem {\n${fields}\n}\n\nexport const MOCK_DATA: GeneratedMockItem[] = ${JSON.stringify(data, null, 2)};`;
    }

    case 'zod': {
      const sample = data[0];
      const inferZod = (val: any): string => {
        if (val === null) return 'z.string().nullable()';
        if (typeof val === 'number') return 'z.number()';
        if (typeof val === 'boolean') return 'z.boolean()';
        if (Array.isArray(val)) return 'z.array(z.any())';
        if (typeof val === 'object') return 'z.record(z.any())';
        return 'z.string()';
      };

      const fields = Object.entries(sample)
        .map(([key, val]) => `  ${key}: ${inferZod(val)},`)
        .join('\n');

      return `import { z } from 'zod';\n\nexport const MockItemSchema = z.object({\n${fields}\n});\n\nexport type MockItem = z.infer<typeof MockItemSchema>;`;
    }

    default:
      return JSON.stringify(data, null, 2);
  }
}
