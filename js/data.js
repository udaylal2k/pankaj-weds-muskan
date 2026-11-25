/* All wedding content, taken from the current site (pankaj.intratechno.com). */
window.WEDDING = {
  iso: "2027-01-23T14:00:00+05:30",
  hero: {
    tagline: "Together with their families, joyfully invite you to the wedding celebrations",
    closing: "As we begin our forever"
  },
  shloka: ["वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।", "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥"],
  parents: {
    groom: { name: "Pankaj", line: "Son of Mrs. Richa & Mr. Nitesh Lal" },
    bride: { name: "Muskan", line: "Daughter of Mrs. Kiran & Mr. Rajesh Raj" }
  },
  venues: {
    residence: {
      name: "Groom's Residence",
      address: "A 53 D, BDA Colony, Teela Jamalpura, Bhopal 462001",
      google: "https://maps.app.goo.gl/6UJ8oXXEKtmpPcca9",
      apple: "https://maps.apple.com/?ll=23.277375,77.393889&q=Residence%20%C2%B7%20BDA%20Colony%2C%20Teela%20Jamalpura"
    },
    brideResidence: {
      name: "Bride's Residence",
      address: "H 90, Pink Avenue Annex, Harda Road, Fefartal, Narmadapuram 461001",
      google: "https://maps.app.goo.gl/QDX5FNppwdpBdMwb6",
      apple: "https://maps.apple.com/?ll=22.7339524,77.7125525&q=Pink%20Avenue%20Annex%2C%20Narmadapuram"
    },
    resort: {
      name: "Dhruva Club & Resort",
      address: "Indore – Bhopal Road, Khajoori Sadak, Bhopal, Madhya Pradesh 462030",
      google: "https://maps.app.goo.gl/bhRWUMtVq6xUDRfB8",
      apple: "https://maps.apple.com/?ll=23.24713,77.244417&q=Dhruva%20Resort%2C%20Khajoori%20Sadak"
    }
  },
  /* theme: which painted scene the event gets */
  sharedEvents: [
    {
      theme: "haldi", title: "Haldi", date: "Friday, 22 January 2027", venue: "resort",
      sessions: [{ label: "Haldi", time: "12:00 PM" }],
      blurb: "Request your presence for a day of vibrant celebrations—from golden morning hues of Haldi to an evening of music, dinner, and joy.",
      cal: { title: "Haldi & Reception", start: "20270122T120000", end: "20270122T235900", details: "Haldi 12:00 PM · Reception 9:00 PM" }
    },
    {
      theme: "reception", title: "Reception", date: "Friday, 22 January 2027", venue: "resort",
      sessions: [{ label: "Reception", time: "9:00 PM" }],
      blurb: "An evening of music, dinner, and joy.",
      cal: { title: "Haldi & Reception", start: "20270122T120000", end: "20270122T235900", details: "Haldi 12:00 PM · Reception 9:00 PM" }
    },
    {
      theme: "baraat", title: "Baraat", date: "Saturday, 23 January 2027", venue: "resort",
      sessions: [{ label: "Baraat", time: "11:00 AM", note: "The royal procession arrives" }],
      blurb: "Request your gracious presence as we dance in celebration with the royal Baraat and witness the couple unite in sacred matrimony.",
      cal: { title: "Baraat & Wedding", start: "20270123T110000", end: "20270123T200000", details: "Baraat 11:00 AM · Wedding 2:00 PM" }
    },
    {
      theme: "wedding", title: "Wedding", date: "Saturday, 23 January 2027", venue: "resort",
      sessions: [{ label: "Wedding", time: "2:00 PM", note: "Sacred matrimony · Shubh Lagn" }],
      blurb: "",
      cal: { title: "Baraat & Wedding", start: "20270123T110000", end: "20270123T200000", details: "Baraat 11:00 AM · Wedding 2:00 PM" }
    }
  ],
  sides: {
    groom: {
      first: "Pankaj", second: "Muskan", family: "The Lal Family", hashtag: "#PankajWedsMuskan",
      favicon: "favicon-groom.svg", phone: "917000977422",
      dateShort: "21 – 23 January 2027", place: "Bhopal",
      eventsSubtitle: "Three days of rituals and joy in Bhopal · 21–23 January 2027",
      firstEvents: [{
        theme: "bairana", title: "Bairana Sahib", date: "Thursday, 21 January 2027", venue: "residence",
        sessions: [{ label: "Bairana Sahib", time: "10:00 AM" }],
        blurb: "Request your gracious presence as we invoke the divine blessings of Jhulelal Sain to mark the beginning of this auspicious union.",
        cal: { title: "Bairana Sahib", start: "20270121T100000", end: "20270121T150000", details: "Bairana Sahib 10:00 AM" }
      }],
      travelNote: "All celebrations are in Bhopal — at the residence on 21 January and Dhruva Club & Resort on 22–23 January.",
      pins: ["residence", "resort"],
      departure: null,
      faqTip: { label: "Two venues", text: "21 January is at the residence in Teela Jamalpura. 22 & 23 January are at Dhruva Club & Resort on the Indore – Bhopal Road, about 21 km (40 min) away — please plan your travel accordingly." },
      faqSubtitle: "Venues, arrival times, and getting around Bhopal",
      faq: [
        ["What time should I arrive?", "Please arrive 15–30 minutes early. Bairana Sahib (21 January) starts at 10:00 AM. On 22 January, Haldi is from 12:00 PM and Reception from 9:00 PM. On 23 January, Baraat begins at 11:00 AM, with the Wedding from 2:00 PM."],
        ["Where are the celebrations?", "21 January: Groom’s Residence — A 53 D, BDA Colony, Teela Jamalpura, Bhopal 462001. 22 & 23 January: Dhruva Club & Resort, Indore – Bhopal Road, Khajoori Sadak, Bhopal 462030. Pinned maps are in the Travel section."],
        ["How far is the residence from Dhruva Club & Resort?", "About 21 km — roughly 35–45 minutes by car depending on city traffic."],
        "wear",
        ["Is there parking?", "Dhruva Club & Resort has parking for guests. Parking near the residence is limited street parking, so sharing a cab or car is a good idea on 21 January."],
        "kids", "lost"
      ]
    },
    bride: {
      first: "Muskan", second: "Pankaj", family: "The Raj Family", hashtag: "#MuskanWedsPankaj",
      favicon: "favicon-bride.svg", phone: "918827428074",
      dateShort: "20 – 23 January 2027", place: "Narmadapuram & Bhopal",
      eventsSubtitle: "Three days of rituals and joy · Narmadapuram & Bhopal · 20–23 January 2027",
      firstEvents: [{
        theme: "mehndi", title: "Mehndi", amp: "& Mata Chowki", date: "Wednesday, 20 January 2027", venue: "brideResidence",
        sessions: [{ label: "Mehndi", time: "2:00 PM" }, { label: "Mata Chowki", time: "7:00 PM" }],
        blurb: "",
        cal: { title: "Mehndi & Mata Chowki", start: "20270120T140000", end: "20270120T230000", details: "Mehndi 2:00 PM · Mata Chowki 7:00 PM" }
      }],
      travelNote: "20 January is at the residence in Narmadapuram. 22 & 23 January are at Dhruva Club & Resort, Bhopal.",
      pins: ["brideResidence", "resort"],
      departure: {
        label: "Departure · 22 January, 9:00 AM",
        from: "Bride’s Residence, Pink Avenue Annex, Narmadapuram",
        to: "Dhruva Club & Resort, Khajoori Sadak, Bhopal",
        distance: "~95 km · about 2 h 15 min by road",
        route: "Narmadapuram → Budhni → Obaidullaganj (NH46) → Bhopal → Indore – Bhopal Road → Dhruva Club & Resort",
        text: "We leave the residence together at 9:00 AM on 22 January so everyone reaches Dhruva Club & Resort in time for Haldi at 12:00 PM."
      },
      faqTip: { label: "Departure · 22 January", text: "We leave the residence in Narmadapuram at 9:00 AM on 22 January for Dhruva Club & Resort, Bhopal — about 95 km (2 h 15 min) via Obaidullaganj and Bhopal. Haldi begins at 12:00 PM." },
      faqSubtitle: "Venues, arrival times, and travelling between Narmadapuram and Bhopal",
      faq: [
        ["What time should I arrive?", "Please arrive 15–30 minutes early. On 20 January, Mehndi starts at 2:00 PM and Mata Chowki at 7:00 PM at the residence. On 22 January, Haldi is from 12:00 PM and Reception from 9:00 PM. On 23 January, Baraat begins at 11:00 AM, with the Wedding from 2:00 PM."],
        ["Where are the celebrations?", "20 January: Bride’s Residence — H 90, Pink Avenue Annex, Harda Road, Fefartal, Narmadapuram 461001. 22 & 23 January: Dhruva Club & Resort, Indore – Bhopal Road, Khajoori Sadak, Bhopal 462030. Pinned maps are in the Travel section."],
        ["When do we leave for Bhopal?", "On 22 January at 9:00 AM from the residence in Narmadapuram. The drive to Dhruva Club & Resort is about 95 km (2 h 15 min) via Budhni, Obaidullaganj and Bhopal."],
        "wear",
        ["Is there parking?", "Dhruva Club & Resort has parking for guests. Parking near the residence in Narmadapuram is limited, so sharing a car is a good idea on 20 January."],
        "kids", "lost"
      ]
    }
  },
  faqCommon: {
    wear: ["What should I wear?", "Traditional Indian attire is encouraged — bright yellows and festive colours for Haldi, elegant ethnic or formal wear for the Reception and the Wedding."],
    kids: ["Are kids welcome?", "Absolutely — little ones are part of the celebration. For the late-evening reception, an early exit is completely fine."],
    lost: ["Who do I call if I’m lost?", "Reach out to the family member who invited you. The Travel section has pinned maps for each venue."]
  },
  families: {
    groom: {
      heading: "Pankaj’s family",
      photo: "gallery/groom-grandparents.webp",
      blessing: "With the blessings of Mrs Usha Lal & Late Mr. J.P Lal, you are invited to the wedding of their grandson.",
      groups: [
        ["Awaiting to welcome you", ["Mrs. Karishma & Mr. Shubash Lal", "Mrs. Varsha & Mr. Pooran Menghwani", "Mrs. Muskan & Mr. Ajay Lal"]],
        ["Joyously awaiting", ["Garima, Uday, Jay, Tanvi"]],
        ["Groom's Nanihal", ["Jaswani Family"]],
        ["In loving memory", ["Late Shri. Parasram Chabra"]],
        ["Establishment", ["Paresh Traders", "Uday Enterprises", "UD Infra Developers Pvt. Ltd", "Intra Techno Solutions Pvt. Ltd."]]
      ],
      address: "A 53 D, BDA Colony, Teela Jamalpura, Bhopal 462001"
    },
    bride: {
      heading: "Muskan’s family",
      photo: "gallery/bride-grandparents.webp",
      blessing: "With the blessings of Mrs Lajwanti Raj & Late Prof. Moolchand Raj, you are invited to the wedding of their granddaughter.",
      groups: [
        ["Awaiting to welcome you", ["Mrs. Gyanwanti Raj", "Mrs. Zarna & Dr. Dinesh Raj", "Mrs. Mukta & Mr. Deepak Raj", "Mrs. Simran & Mr. Lokesh Ahuja"]],
        ["Joyously awaiting", ["Rutvika, Kanishka, Aayush and Dr Amulya Raj"]],
        ["In loving memory", ["Late Dr Ghyanshyam Das Raj & Late Dr Kavita Raj"]],
        ["Establishment", ["Raj Scooters & Auto Parts", "Raj Traders", "Kalpnk AI Studio"]]
      ],
      address: "H 90, Pink Avenue Annex, Harda Road, Fefartal, Narmadapuram 461001"
    }
  },
  story: {
    title: "Our Story", subtitle: "A story meant to bloom",
    paragraphs: [
      "It all started with “Hey Muskan”. Two numbers exchanged by our parents, one connection made on Jeevansathi, and a story neither of us expected.",
      "We weren’t quite ready for forever, until we started talking and somehow, couldn’t stop. On 1 June 2026 we had our first conversation. On 12 June, Pankaj travelled from Pune to Hyderabad for our first meeting — and that very day, we knew our yes.",
      "On 12 July 2026 we made it official with our Roka. A little unexpected, a little magical, and now, a lifetime to go."
    ],
    milestones: [["1 June 2026", "Our first conversation"], ["12 June 2026", "First meeting in Hyderabad"], ["12 July 2026", "Roka ceremony"], ["January 2027", "Our wedding"]],
    ours: ["This is no ordinary card — we made it just for you.", "Your presence will complete our happiness."]
  },
  moments: [
    { title: "How it all started", sub: "1 June 2026 · The first hello", src: "gallery/how-it-all-started-v2.webp", alt: "The first WhatsApp conversation — “Hey Muskan”" },
    { title: "1st meet", sub: "12 June 2026 · Hyderabad", src: "gallery/1st-meet.webp", alt: "Muskan and Pankaj on their first meet" },
    { title: "Roka", sub: "12 July 2026 · Families come together", src: "gallery/roka.webp", alt: "Muskan and Pankaj at their Roka" }
  ],
  gallery: [
    ["gallery/our-story-1.webp", "Our story — moment one"], ["gallery/our-story-2.webp", "Our story — moment two"],
    ["gallery/our-story-3.webp", "Our story — moment three"], ["gallery/our-story-4.webp", "Our story — moment four"],
    ["gallery/gallery-1.webp", "A moment we cherish"], ["gallery/gallery-2.webp", "A moment we cherish"],
    ["gallery/gallery-3.webp", "A moment we cherish"], ["gallery/gallery-4.webp", "A moment we cherish"]
  ],
  blessingsSeed: [
    { name: "Family", message: "May your life together be filled with laughter, health, and endless chai." },
    { name: "A friend", message: "From friendship to forever — so happy for you both." }
  ],
  secret: "If you found this — thank you for being part of our story. It began as a friendship and became a bond we cherish. See you at the mandap."
};
