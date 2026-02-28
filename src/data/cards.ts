export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  category: 'Super Premium' | 'Premium' | 'Cashback' | 'Travel' | 'Rewards' | 'Fuel' | 'Lifestyle' | 'Utilities' | 'Beginner';
  benefits: string[];
  pros: string[];
  cons: string[];
  limits: string;
  image: string;
  annualFee: number;
  joiningFee: number;
  waiveCondition?: string;
  bestFor: string;
  rating: number;
}

export const CREDIT_CARDS: CreditCard[] = [
  {
    id: 'hdfc-infinia',
    name: 'Infinia Metal Edition',
    bank: 'HDFC Bank',
    category: 'Super Premium',
    benefits: [
      '3.3% Reward Rate on all spends',
      'Unlimited Lounge Access Globally (Primary & Add-on)',
      '1:1 Reward Transfer to Miles/Hotels',
    ],
    pros: ['Industry-best rewards on SmartBuy (up to 33%)', 'Metal form factor', 'Luxury ITC stay benefits'],
    cons: ['Invite-only', 'High entry barrier', 'Monthly reward capping on SmartBuy'],
    limits: 'SmartBuy accelerated rewards capped at 15,000 points per month.',
    image: 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/22cd7962-d26b-4395-9781-f2f62a421685',
    annualFee: 12500,
    joiningFee: 12500,
    waiveCondition: 'Waived on ₹10 Lakh annual spend',
    bestFor: 'Ultimate Luxury & Travel',
    rating: 4.9
  },
  {
    id: 'sbi-cashback',
    name: 'SBI Cashback Card',
    bank: 'SBI Card',
    category: 'Cashback',
    benefits: [
      '5% Cashback on all online spends',
      '1% Cashback on offline spends',
      'Direct statement credit',
    ],
    pros: ['Simple cashback structure', 'No merchant restrictions for online 5%', 'Wide acceptance'],
    cons: ['Excludes Utilities, Rent, Fuel, and Insurance', 'No lounge access', 'Recent devaluation on fee waiver spend'],
    limits: 'Monthly online cashback capped at ₹5,000.',
    image: 'https://www.sbicard.com/sbi-card-en/assets/media/images/personal/cards/cashback-sbi-card/cashback-sbi-card-front.png',
    annualFee: 999,
    joiningFee: 999,
    waiveCondition: 'Waived on ₹2 Lakh annual spend',
    bestFor: 'Universal Online Shopping',
    rating: 4.8
  },
  {
    id: 'axis-atlas',
    name: 'Axis Atlas',
    bank: 'Axis Bank',
    category: 'Travel',
    benefits: [
      'Tiered Edge Miles system',
      'Up to 5 EM per ₹100 on Travel',
      '1:2 Transfer ratio to major airlines',
    ],
    pros: ['Excellent for frequent flyers', 'Milestone benefits are high value', 'Direct miles redemption'],
    cons: ['Recent devaluations in transfer partners', 'High fee for mid-tier card', 'Complex tiering system'],
    limits: 'Transfer to individual partners capped annually.',
    image: 'https://www.axisbank.com/assets/images/atlas-card.png',
    annualFee: 5000,
    joiningFee: 5000,
    waiveCondition: 'Waived on ₹15 Lakh for Gold / ₹30 Lakh for Platinum',
    bestFor: 'Travel & Airline Transfers',
    rating: 4.7
  },
  {
    id: 'airtel-axis',
    name: 'Airtel Axis Bank',
    bank: 'Axis Bank',
    category: 'Utilities',
    benefits: [
      '25% Cashback on Airtel Bills',
      '10% Cashback on Utility Bills (Axis Pay)',
      '10% Cashback on Zomato/Swiggy/BigBasket',
    ],
    pros: ['High percentage cashback', 'Great for small monthly bills', 'Covers food delivery too'],
    cons: ['Tight monthly capping', 'Requires Airtel Thanks app for max benefit', 'Recent devaluation on food caps'],
    limits: '₹300 cap on Airtel bills, ₹300 on Utilities, ₹500 on Food/Grocery per month.',
    image: 'https://www.axisbank.com/assets/images/airtel-axis-bank-credit-card.png',
    annualFee: 500,
    joiningFee: 500,
    waiveCondition: 'Waived on ₹2 Lakh annual spend',
    bestFor: 'Household Bills & Food Delivery',
    rating: 4.6
  },
  {
    id: 'amazon-pay-icici',
    name: 'Amazon Pay ICICI Card',
    bank: 'ICICI Bank',
    category: 'Beginner',
    benefits: [
      '5% Cashback for Prime Members on Amazon',
      '2% Cashback on Bills & Partners',
      'Lifetime Free (LTF)',
    ],
    pros: ['Zero maintenance cost', 'Unlimited cashback on Amazon', 'Simple redemption as APay balance'],
    cons: ['Cashback tied to Amazon ecosystem', 'Limited offline benefits', 'No lounge access'],
    limits: 'No upper limit on 5% Amazon cashback.',
    image: 'https://www.icicibank.com/content/dam/icicibank/india/managed-assets/images/personal-banking/cards/credit-card/amazon-pay/amazon-pay-card.png',
    annualFee: 0,
    joiningFee: 0,
    bestFor: 'Amazon Shoppers & Beginners',
    rating: 4.5
  },
  {
    id: 'tata-neu-infinity',
    name: 'Tata Neu Infinity HDFC',
    bank: 'HDFC Bank',
    category: 'Utilities',
    benefits: [
      '5% NeuCoins on Tata Brands',
      '1.5% NeuCoins on UPI Spends',
      '8 Complimentary Domestic Lounge visits',
    ],
    pros: ['Versatile for Tata ecosystem (BigBasket, 1mg, Croma)', 'Best for RuPay UPI rewards', 'Good lounge access'],
    cons: ['NeuCoins expire', 'Restricted to Tata ecosystem redemption', 'UPI rewards capped'],
    limits: 'UPI rewards capped at 500 NeuCoins per month.',
    image: 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/tata-neu-infinity.png',
    annualFee: 1499,
    joiningFee: 1499,
    waiveCondition: 'Waived on ₹3 Lakh annual spend',
    bestFor: 'UPI & Tata Shoppers',
    rating: 4.7
  },
  {
    id: 'amex-platinum-travel',
    name: 'Amex Platinum Travel',
    bank: 'American Express',
    category: 'Travel',
    benefits: [
      'Taj Stay Vouchers on ₹4L Milestone',
      '40,000 Bonus MR Points annually',
      '8 Domestic Lounge visits',
    ],
    pros: ['Elite milestone rewards', 'Amex customer service', 'Taj vouchers provide high value'],
    cons: ['Low reward rate for non-milestone spends', 'Acceptance issues offline', 'High renewal fee'],
    limits: 'Strict milestone-based benefit structure.',
    image: 'https://www.americanexpress.com/content/dam/amex/in/benefits/platinum-travel-credit-card.png',
    annualFee: 3500,
    joiningFee: 3500,
    waiveCondition: 'Fee usually offset by points/vouchers',
    bestFor: 'Milestone Travel Rewards',
    rating: 4.8
  },
  {
    id: 'hsbc-liveplus',
    name: 'HSBC Live+',
    bank: 'HSBC India',
    category: 'Lifestyle',
    benefits: [
      '10% Cashback on Dining & Groceries',
      '1.5% Unlimited Cashback on others',
      'BOGO on Movie Tickets',
    ],
    pros: ['Best for high dining/grocery spenders', 'Replaced the popular Cashback card', 'International acceptance'],
    cons: ['Monthly capping on 10% category', 'Manual cashback redemption'],
    limits: '10% Cashback capped at ₹1,000 per month.',
    image: 'https://www.hsbc.co.in/content/dam/hsbc/in/images/credit-cards/hsbc-liveplus-card.png',
    annualFee: 999,
    joiningFee: 999,
    waiveCondition: 'Waived on ₹2 Lakh annual spend',
    bestFor: 'Dining out & Groceries',
    rating: 4.6
  },
  {
    id: 'sbi-bpcl-octane',
    name: 'SBI BPCL Octane',
    bank: 'SBI Card',
    category: 'Fuel',
    benefits: [
      '7.25% Value back on BPCL Fuel',
      '4 Domestic Lounge visits',
      'Points for Cinema & Groceries',
    ],
    pros: ['Highest value back for fuel', 'Covers surcharge waiver', 'Domestic lounge access'],
    cons: ['Restricted to BPCL outlets only', 'High fee for a niche card'],
    limits: 'Fuel rewards capped at ₹10,000 spend per month.',
    image: 'https://www.sbicard.com/sbi-card-en/assets/media/images/personal/cards/bpcl-sbi-card-octane/bpcl-sbi-card-octane-front.png',
    annualFee: 1499,
    joiningFee: 1499,
    waiveCondition: 'Waived on ₹2 Lakh annual spend',
    bestFor: 'Heavy Fuel Users',
    rating: 4.7
  },
  {
    id: 'au-zenith-plus',
    name: 'AU Zenith+',
    bank: 'AU Small Finance Bank',
    category: 'Premium',
    benefits: [
      '16 Domestic & 16 International Lounge visits',
      '0.99% Forex Markup',
      'Luxury Brand Vouchers on Joining',
    ],
    pros: ['Very low forex for premium card', 'Generous lounge access policy', 'Metal card perks'],
    cons: ['Niche bank network', 'Specific category reward caps'],
    limits: 'Rewards capped on specific categories per cycle.',
    image: 'https://www.aubank.in/assets/images/zenith-plus-card.png',
    annualFee: 4999,
    joiningFee: 4999,
    waiveCondition: 'Waived on ₹8 Lakh annual spend',
    bestFor: 'International Travel & Forex',
    rating: 4.8
  },
  {
    id: 'hdfc-dcb-metal',
    name: 'Diners Club Black Metal',
    bank: 'HDFC Bank',
    category: 'Super Premium',
    benefits: [
      '5% Reward Rate (1 RP = ₹1)',
      'Unlimited Global Lounge Access',
      'Annual Memberships (Amazon Prime, MMT Black)',
    ],
    pros: ['High rewards via SmartBuy', 'Quarterly milestone points', 'Metal form factor'],
    cons: ['Diners network acceptance lower than Visa/MC', 'High spend requirement for waiver'],
    limits: 'Quarterly milestone bonus points capped.',
    image: 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/dcb-metal.png',
    annualFee: 10000,
    joiningFee: 10000,
    waiveCondition: 'Waived on ₹8 Lakh annual spend',
    bestFor: 'High Reward Earners',
    rating: 4.8
  },
  {
    id: 'axis-ace',
    name: 'Axis Bank ACE',
    bank: 'Axis Bank',
    category: 'Cashback',
    benefits: [
      '5% Cashback on Bill Payments (GPay)',
      '2% Cashback on all offline spends',
      '4 Domestic Lounge visits',
    ],
    pros: ['Best for offline spending', 'High utility bill rewards', 'Simple cashback'],
    cons: ['Recent devaluations on capping', 'GPay ecosystem dependency for 5%'],
    limits: 'Utility cashback capped at ₹500 per month.',
    image: 'https://www.axisbank.com/assets/images/axis-bank-ace-credit-card.png',
    annualFee: 499,
    joiningFee: 499,
    waiveCondition: 'Waived on ₹2 Lakh annual spend',
    bestFor: 'Offline & Utility Spends',
    rating: 4.6
  },
  {
    id: 'icici-emerald-private',
    name: 'Emerald Private Metal',
    bank: 'ICICI Bank',
    category: 'Super Premium',
    benefits: [
      'Unlimited Lounge Access Globally',
      'Low 1.99% Forex Markup',
      '6x Rewards on Travel & Dining',
    ],
    pros: ['No joining/annual fee for private banking', 'Metal card aesthetic', 'Flexible reward redemption'],
    cons: ['Difficult for general public to get', 'Rewards points value lower than Infinia'],
    limits: 'Monthly reward points accumulation limits.',
    image: 'https://www.icicibank.com/content/dam/icicibank/india/managed-assets/images/personal-banking/cards/credit-card/emerald/emerald-metal.png',
    annualFee: 12500,
    joiningFee: 12500,
    waiveCondition: 'Waived for Private Banking clients',
    bestFor: 'Lounge & Lifestyle Perks',
    rating: 4.7
  },
  {
    id: 'idfc-wealth',
    name: 'IDFC First Wealth',
    bank: 'IDFC FIRST Bank',
    category: 'Premium',
    benefits: [
      'Lifetime Free (LTF)',
      'Interest-free Cash Withdrawal',
      '10x Rewards on spends above ₹30k',
    ],
    pros: ['No fees ever', 'Great rewards on high spending', 'Luxury golf & lounge benefits'],
    cons: ['Reward points value is low (1 RP = ₹0.25)', 'Eligibility criteria for "Wealth" is high'],
    limits: '10x rewards only kick in after ₹30,000 monthly spend.',
    image: 'https://www.idfcfirstbank.com/content/dam/idfcfirstbank/images/cards/wealth-card.png',
    annualFee: 0,
    joiningFee: 0,
    bestFor: 'High spenders wanting LTF',
    rating: 4.7
  },
  {
    id: 'yes-marquee',
    name: 'YES Bank Marquee',
    bank: 'YES Bank',
    category: 'Super Premium',
    benefits: [
      '4.5% Reward Rate for online',
      'Unlimited International Lounge Access',
      'Low 1.75% Forex Markup',
    ],
    pros: ['Very high online reward rate', 'Low forex for a premium card', 'Good lounge access policy'],
    cons: ['YES Bank ecosystem stability concerns', 'Subscription fee model'],
    limits: 'Max reward points per month capped.',
    image: 'https://www.yesbank.in/assets/images/marquee-card.png',
    annualFee: 4999,
    joiningFee: 4999,
    waiveCondition: 'Waived on ₹10 Lakh annual spend',
    bestFor: 'High Online Rewards',
    rating: 4.7
  },
  {
    id: 'sc-ultimate',
    name: 'Standard Chartered Ultimate',
    bank: 'Standard Chartered',
    category: 'Super Premium',
    benefits: [
      '3.3% Reward Rate (5 RP per ₹150)',
      '1 RP = ₹1 Value',
      'Premium Dining & Golf benefits',
    ],
    pros: ['High flat reward rate', 'Excellent points-to-INR value', 'International brand prestige'],
    cons: ['Limited transfer partners', 'Higher reward redemption fees', 'Niche customer base'],
    limits: 'Points accumulation capped on certain categories.',
    image: 'https://av.sc.com/in/content/images/in-ultimate-card-new.png',
    annualFee: 5000,
    joiningFee: 5000,
    bestFor: 'Flat Cashback Lovers',
    rating: 4.8
  },
  {
    id: 'amex-mrcc',
    name: 'Amex Membership Rewards (MRCC)',
    bank: 'American Express',
    category: 'Rewards',
    benefits: [
      '1,000 Bonus Points on 4x trans of ₹1,500',
      '1,000 Bonus Points on ₹20k monthly spend',
      'Zero Lost Card Liability',
    ],
    pros: ['Easy to hit bonus points', 'Good for mid-level spenders', 'Flexible redemption (Gold Collection)'],
    cons: ['Offline acceptance', 'Low base reward rate', 'Annual fee structure'],
    limits: 'Bonus points capped per month.',
    image: 'https://www.americanexpress.com/content/dam/amex/in/benefits/mrcc-card.png',
    annualFee: 1500,
    joiningFee: 1500,
    waiveCondition: 'Waived on ₹1.5 Lakh annual spend',
    bestFor: 'Consistent Small Spenders',
    rating: 4.6
  },
  {
    id: 'flipkart-axis',
    name: 'Flipkart Axis Bank',
    bank: 'Axis Bank',
    category: 'Cashback',
    benefits: [
      '5% Cashback on Flipkart',
      '4% Cashback on Preferred Partners',
      '4 Domestic Lounge visits',
    ],
    pros: ['Best for Flipkart loyalists', 'Direct cashback in statement', 'Good partner list (Cleartrip, etc)'],
    cons: ['Requires Flipkart usage for max value', 'Recent devaluations on lounge access rules'],
    limits: 'Recent spend requirements for lounge access.',
    image: 'https://www.axisbank.com/assets/images/flipkart-axis-bank-credit-card.png',
    annualFee: 500,
    joiningFee: 500,
    waiveCondition: 'Waived on ₹2 Lakh annual spend',
    bestFor: 'Flipkart Shopping',
    rating: 4.5
  }
];

export const LAST_UPDATED = 'March 01, 2026';
