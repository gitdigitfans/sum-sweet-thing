const seedData = {
  nextId: 5,
  methods: [
    {
      id: 1,
      name: 'التحويل البنكي - CIB',
      type: 'bank_transfer',
      is_active: 1,
      sort_order: 1,
      settings: {
        bank_name: 'CIB مصر',
        account_holder_ar: 'كيرينزا للمستلزمات الطبية أحمد كمال أحمد معوض',
        account_holder_en: 'CURENZA AHMED KAMAL AHMED MOUAWAD',
        accounts: [
          {
            currency: 'EGP',
            currency_label: 'الجنيه المصري',
            account_number: '100074553774',
            iban: 'EG740010006700000100074553774',
            note: 'يفضل استخدام حساب CIB بالجنيه المصري لتجار الجملة داخل مصر.'
          },
          {
            currency: 'USD',
            currency_label: 'الدولار الأمريكي',
            account_number: '100074553731',
            iban: 'EG710010006700000100074553731',
            note: 'حساب الدولار الأمريكي مخصص للمدفوعات القادمة من خارج جمهورية مصر العربية.'
          }
        ],
        swift_code: 'CIBEEGCX141',
        instructions: 'بعد التحويل يرجى إرسال إثبات الدفع لإتمام مراجعة الطلب.'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'بطاقة ائتمان / مدى',
      type: 'card',
      is_active: 1,
      sort_order: 2,
      settings: { description: 'يمكنك الدفع عبر بطاقات الائتمان أو بطاقة مدى.' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'فودافون كاش',
      type: 'wallet',
      is_active: 1,
      sort_order: 3,
      settings: {
        provider: 'Vodafone Cash',
        phone_number: '01012345678',
        account_holder_ar: 'أحمد كمال أحمد معوض',
        instructions: 'حوّل المبلغ على رقم المحفظة أعلاه ثم ابعت صورة إثبات التحويل على واتساب لتفعيل اشتراكك.'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'انستا باي - InstaPay',
      type: 'instapay',
      is_active: 1,
      sort_order: 4,
      settings: {
        instapay_handle: 'ahmedkamal@instapay',
        phone_number: '01012345678',
        account_holder_ar: 'أحمد كمال أحمد معوض',
        instructions: 'حوّل المبلغ عن طريق تطبيق InstaPay على المُعرّف أعلاه ثم ابعت لقطة شاشة للتحويل على واتساب.'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

const state = {
  data: null
};

function getDb() {
  if (!state.data) {
    state.data = JSON.parse(JSON.stringify(seedData));
    state.data.methods.forEach(m => {
      m.created_at = new Date().toISOString();
      m.updated_at = new Date().toISOString();
    });
  }
  return state.data;
}

function saveDb(data) {
  state.data = data;
}

module.exports = { getDb, saveDb };
