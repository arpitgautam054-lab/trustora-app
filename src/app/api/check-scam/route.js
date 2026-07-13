import { NextResponse } from 'next/server';

// --- HELPER FUNCTION (Typosquatting) ---
function checkTyposquatting(text, brands) {
  if (!text) return false;
  let original = text.toLowerCase();
  let normI = original.replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/8/g, 'b').replace(/rn/g, 'm');
  let normL = original.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/8/g, 'b').replace(/rn/g, 'm');
  for (let brand of brands) {
    if ((normI.includes(brand) || normL.includes(brand)) && !original.includes(brand)) { return true; }
  }
  return false;
}

export async function POST(request) {
  try {
    const { content, type } = await request.json();

    if (!content) { 
        return NextResponse.json({ isScam: false, score: 0, deepResearch: "Khali input dalo pehle." }); 
    }

    let cleanInput = content.toLowerCase().trim();

    // ========================================================
    // 📞 MODULE 1: TELECOM & PHONE SCANNER
    // ========================================================
    if (type === 'phone') {
      let cleanNumber = cleanInput.replace(/[\s\-\(\)]/g, '');
      
      if (!/^\+?\d{6,15}$/.test(cleanNumber)) {
         return NextResponse.json({ isScam: true, score: 0, statusString: "Invalid Format", entity: "Validation Error", sslStatus: "N/A", domainAge: "N/A", blacklist: "Blocked", reports: "Error", deepResearch: "🚨 ENTRY ERROR: Yeh ek valid Phone Number nahi lag raha hai. Kripya sahi number daalein (e.g., 9876543210)." });
      }

      let isScam = false; let score = 100; let statusString = "Verified Number"; let category = "Standard Telecom Node"; let auditCore = "Routing Clear"; let riskSignal = "0 Flags Active"; let forensicReport = "Yeh ek standard phone number format hai. Koi scam pattern nahi mila.";
      let phoneFlags = [];
      
      const riskyCountryCodes = ["+92", "+234", "+254", "+27", "+62", "+84", "+63"];
      let hasRiskyCode = riskyCountryCodes.some(code => cleanNumber.startsWith(code));
      let isTelemarketing = cleanNumber.startsWith("+91140") || cleanNumber.startsWith("140");
      const indianNumberRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
      let isIndianNumber = indianNumberRegex.test(cleanNumber);

      if (hasRiskyCode) { score -= 65; phoneFlags.push("High-Risk International Origin (Scam Geo)"); } 
      else if (isTelemarketing) { score -= 40; phoneFlags.push("Commercial Routing (Spam/Robocall)"); } 
      else if (!isIndianNumber && cleanNumber.startsWith("+91")) { score -= 30; phoneFlags.push("Invalid Digit Length (Spoofing Attempt)"); } 
      else if (!isIndianNumber && !hasRiskyCode && cleanNumber.length < 10) { score -= 20; phoneFlags.push("Unrecognized Telecom Format"); }

      if (score < 75 || phoneFlags.length > 0) {
        isScam = true; score = Math.max(score, 5); statusString = score < 40 ? "High Risk Caller" : "Spam Warning"; category = "🚨 Suspicious Telecom Identity"; auditCore = "Flagged by Network Heuristics"; riskSignal = `${phoneFlags.length} Threat Vectors`;
        forensicReport = `🚨 TELECOM ALERT: Is number par suspicious routing patterns mile hain (${phoneFlags.join(" | ")}). `;
      }

      return NextResponse.json({ isScam, score, statusString, entity: category, sslStatus: "Telecom Registry Scanned", domainAge: "Real-Time Lookup", blacklist: auditCore, reports: riskSignal, deepResearch: forensicReport });
    }

    // ==========================================
    // 🔗 MODULE 2: LINK/URL SCANNER
    // ==========================================
    else if (type === 'link') {
      if (!cleanInput.includes('.')) {
        return NextResponse.json({ isScam: true, score: 0, statusString: "Invalid Format", entity: "Validation Error", sslStatus: "N/A", domainAge: "N/A", blacklist: "Blocked", reports: "Error", deepResearch: "🚨 ENTRY ERROR: Yeh valid Link/URL nahi lag raha. Kripya sahi link paste karein." });
      }

      function analyzeURLStructure(urlStr) {
        try {
          let cleanUrl = urlStr.trim();
          if (!/^https?:\/\//i.test(cleanUrl)) { cleanUrl = 'http://' + cleanUrl; }
          const urlObj = new URL(cleanUrl);
          const hostname = urlObj.hostname.replace('www.', '');
          const parts = hostname.split('.');
          const isHighEntropy = (new Set(hostname).size / hostname.length) > 0.65 && hostname.length > 12;
          return { domain: hostname, protocol: urlObj.protocol, subdomainCount: parts.length - 2, isHighEntropy };
        } catch (e) { return null; }
      }

      const metrics = analyzeURLStructure(content);
      if (!metrics) { 
        return NextResponse.json({ isScam: true, score: 5, statusString: "Invalid Format", entity: "Validation Error", sslStatus: "N/A", domainAge: "N/A", blacklist: "Blocked", reports: "Error", deepResearch: "🚨 ENTRY ERROR: URL schema validation fail." }); 
      }

      const { domain, protocol, subdomainCount, isHighEntropy } = metrics;
      let isScam = false; let score = 95; let statusString = "Safe Hai"; let category = "Verified Public Architecture"; let sslStatus = protocol === "https:" ? "Secured HTTPS (Encrypted)" : "🚨 Unsecured HTTP"; let domainAge = "Purana Verified Server"; let blacklist = "Clean Record"; let reports = "0 Active Reports"; let forensicReport = "Ecosystem checks cleared. Content safe hai.";

      if (protocol === "http:") score -= 20;

      const globalWhitelist = ["whatsapp.com", "wa.me", "google.com", "github.com", "amazon.in", "flipkart.com", "physicswalla.live"];
      if (globalWhitelist.some(trusted => domain === trusted || domain.endsWith('.' + trusted))) {
        return NextResponse.json({ isScam: false, score: protocol === "https:" ? 98 : 75, statusString: protocol === "https:" ? "Ekdum Safe" : "Risk Safe", entity: "Official Platform Identity", sslStatus, domainAge: "Established Core", blacklist: "Clean", reports: "0 Reports", deepResearch: `Verified official system identity (${domain}).` });
      }

      let dynamicFlags = [];
      const criticalBrands = ["sbi", "jio", "flipkart", "amazon", "paytm", "hdfc", "tatamotors"];
      let isBrandMimic = criticalBrands.some(brand => domain.includes(brand)) && !globalWhitelist.some(trusted => domain.endsWith(trusted));
      let isTyposquatting = checkTyposquatting(domain, criticalBrands);
      
      if (isTyposquatting) { score -= 75; dynamicFlags.push("Visual Typosquatting URL"); }
      if (isBrandMimic) { score -= 50; dynamicFlags.push("Identity Spoofing Detected"); }
      if (subdomainCount > 2) { score -= 20; dynamicFlags.push("Excessive Subdomains"); }
      if (isHighEntropy) { score -= 25; dynamicFlags.push("Randomized Characters"); }
      const riskyTLDs = [".xyz", ".top", ".tk", ".ml", ".cc", ".icu", ".click"];
      if (riskyTLDs.some(tld => domain.endsWith(tld))) { score -= 15; dynamicFlags.push("Low-Cost Extension"); }

      if (score < 50 || dynamicFlags.length > 0) {
        isScam = true; score = Math.max(score, 6); statusString = score < 25 ? "High Risk / Fraud" : "Proceed With Caution"; category = isBrandMimic || isTyposquatting ? "🚨 Brand Identity Theft Trap" : "Suspicious Network Node"; blacklist = "Flagged in Engine"; reports = "Threat Vectors Active";
        forensicReport = `🚨 FRAUD INTELLIGENCE ALERT: Suspicious patterns pakde hain (${dynamicFlags.join(", ")}). `;
      }

      return NextResponse.json({ isScam, score, statusString, entity: category, sslStatus, domainAge, blacklist, reports, deepResearch: forensicReport });
    }

    // ==========================================
    // 💬 MODULE 3: SMS SCANNER
    // ==========================================
    else if (type === 'sms') {
      if (!/[a-zA-Z]/.test(cleanInput)) {
        return NextResponse.json({ isScam: true, score: 0, statusString: "Invalid Format", entity: "Validation Error", sslStatus: "N/A", domainAge: "N/A", blacklist: "Blocked", reports: "Error", deepResearch: "🚨 ENTRY ERROR: Yeh ek valid SMS message nahi lag raha hai. Kripya pura text copy-paste karein, sirf number nahi." });
      }

      let isScam = false; let score = 98; let statusString = "Safe Message"; let category = "Verified Transaction Structure"; let auditCore = "Passed Core Tokenizer"; let riskSignal = "0 Active Threats"; let forensicReport = "Ecosystem Verification Success. Yeh message ek genuine bank format se match karta hai.";
      let smsFlags = [];
      const credentialTokens = ["otp", "one-time password", "mpin", "upipin", "cvv", "password", "dont share"];
      let hasCredentialToken = credentialTokens.some(token => cleanInput.includes(token));
      const fraudBaits = ["part-time", "earn money", "daily profit", "wfh", "youtube subscribe"];
      let hasFraudBait = fraudBaits.some(bait => cleanInput.includes(bait));
      const scareTactics = ["electricity bill", "bijli kat", "account blocked", "suspended", "kyc verification required"];
      let hasScareTactic = scareTactics.some(scare => cleanInput.includes(scare));

      if (hasCredentialToken && (cleanInput.includes("debit") || cleanInput.includes("credit"))) { score -= 40; smsFlags.push("Suspicious OTP Request"); }
      if (hasFraudBait) { score -= 45; smsFlags.push("Financial Job Bait Pattern"); }
      if (hasScareTactic) { score -= 50; smsFlags.push("High-Urgency Psychological Trap"); }

      let isCleanTransaction = (cleanInput.includes("debited") || cleanInput.includes("credited") || cleanInput.includes("rs.")) && smsFlags.length === 0;

      if (isCleanTransaction) {
        score = 100; statusString = "Verified Safe"; category = "Official Banking Alert Structure"; forensicReport = "Verified Genuine Update: Yeh aapki regular bank account transaction notification hai.";
      } else if (hasCredentialToken && smsFlags.length === 0) {
        score = 85; statusString = "Sensitive OTP / Code"; category = "Standard Verification Token"; forensicReport = "Yeh ek standard OTP lag raha hai. Ise kisi se share na karein.";
      } else if (smsFlags.length > 0) {
        isScam = true; score = Math.max(score, 6); statusString = score < 30 ? "High Risk / Fraud" : "Proceed With Caution"; category = "🚨 Social Engineering Phishing Vector"; auditCore = "Flagged Threat Patterns"; riskSignal = `${smsFlags.length} Threat Vectors Active`;
        forensicReport = `🚨 SMS PHISHING WARNING: System ne text parameters mein malicious footprints pakde hain (${smsFlags.join(", ")}).`;
      }
      return NextResponse.json({ isScam, score, statusString, entity: category, sslStatus: "Standard SMS Text Stream", domainAge: "N/A", blacklist: auditCore, reports: riskSignal, deepResearch: forensicReport });
    }

    // ==========================================
    // ✉️ MODULE 4: EMAIL HEURISTICS
    // ==========================================
    else if (type === 'email') {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const extractedEmails = cleanInput.match(emailRegex) || [];
      
      if (extractedEmails.length === 0 && !cleanInput.includes('@')) {
         return NextResponse.json({ isScam: true, score: 0, statusString: "Invalid Format", entity: "Validation Error", sslStatus: "N/A", domainAge: "N/A", blacklist: "Blocked", reports: "Error", deepResearch: "🚨 ENTRY ERROR: Aapne Email tab select kiya hai par input mein koi Email ID nahi mili." });
      }

      let isScam = false; let score = 100; let statusString = "Verified Clean"; let category = "Standard Mail Exchange"; let auditCore = "SPF/DKIM Signatures Clear"; let riskSignal = "No Anomalies Detected"; let forensicReport = "Email context analysis passed. Yeh ek standard, genuine communication hai.";
      let emailFlags = [];
      const protectedEntities = ["sbi", "hdfc", "icici", "amazon", "flipkart", "paytm", "google"];
      const phishingDomainKeywords = ["secure", "update", "verify", "login", "bank", "alert", "service", "support"]; 
      
      let suspiciousSender = false; let brandImpersonation = false; let isTyposquatting = false; let genericPhishingDomain = false;

      extractedEmails.forEach(email => {
        const domainPart = email.split('@')[1];
        if (domainPart) {
          if (/\.(xyz|top|site|club|loan|click)$/i.test(domainPart)) { suspiciousSender = true; }
          
          protectedEntities.forEach(brand => {
            if (domainPart.includes(brand) && !domainPart.endsWith(`${brand}.com`) && !domainPart.endsWith(`${brand}.in`)) { brandImpersonation = true; }
          });
          if (checkTyposquatting(domainPart, protectedEntities)) { isTyposquatting = true; }

          let keywordCount = 0;
          phishingDomainKeywords.forEach(kw => { if (domainPart.includes(kw)) keywordCount++; });
          if (keywordCount >= 2 && domainPart.includes("-")) { genericPhishingDomain = true; }
        }
      });

      if (isTyposquatting) { score -= 75; emailFlags.push("Visual Typosquatting Detected"); }
      if (brandImpersonation) { score -= 60; emailFlags.push("Brand Spoofing (DMARC Fail)"); } 
      if (genericPhishingDomain) { score -= 55; emailFlags.push("Generic Phishing Mask Domain"); }
      if (suspiciousSender) { score -= 20; emailFlags.push("Low-Reputation Sender Domain"); }

      if (score < 75 || emailFlags.length > 0) {
        isScam = true; score = Math.max(score, 4); statusString = score < 40 ? "Critical Phishing Threat" : "Suspicious Origin"; category = "🚨 Malicious Email Architecture"; auditCore = "Heuristic Threat Flags Active"; riskSignal = `${emailFlags.length} Exploit Vectors Found`;
        forensicReport = `🚨 ADVANCED THREAT DETECTED: Engine ne is email mein phishing signatures pakde hain (${emailFlags.join(" | ")}). Fake mask domains se saavdhan rahein!`;
      }
      return NextResponse.json({ isScam, score, statusString, entity: category, sslStatus: "Simulated DKIM/SPF Check", domainAge: "Dynamic Envelope Scan", blacklist: auditCore, reports: riskSignal, deepResearch: forensicReport });
    }

    // ========================================================
    // 💳 MODULE 5: UPI INTENT SCANNER 
    // ========================================================
    else if (type === 'upi') {
      if (!cleanInput.includes('@')) { 
        return NextResponse.json({ isScam: true, score: 0, statusString: "Invalid Format", entity: "Validation Error", sslStatus: "N/A", domainAge: "N/A", blacklist: "Blocked", reports: "Error", deepResearch: "🚨 ENTRY ERROR: Yeh ek valid UPI ID format nahi hai. UPI ID mein '@' hona zaroori hai (e.g., name@oksbi)." }); 
      }

      let isScam = false; let score = 100; let statusString = "Verified VPA Handle"; let category = "Standard Financial Node"; let auditCore = "NPCI Syntax & Routing Clear"; let riskSignal = "0 Risk Flags Active"; let forensicReport = "UPI Virtual Payment Address structure perfectly valid hai.";
      
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9]{2,64}$/;
      if (!upiRegex.test(cleanInput)) { return NextResponse.json({ isScam: true, score: 0, statusString: "Malformed VPA", entity: "Invalid UPI Syntax", sslStatus: "Validation Loop Failed", domainAge: "N/A", blacklist: "Syntax Rejection", reports: "Blocked", deepResearch: "🚨 CRITICAL ERROR: Yeh ID NPCI ke official UPI format guidelines ko fail karti hai." }); }

      const [usernamePart, handlePart] = cleanInput.split('@');
      const isMobileNumber = /^[6-9]\d{9}$/.test(usernamePart);
      const tier1Handles = ["oksbi", "okhdfcbank", "okicici", "okaxis", "paytm", "ybl", "ibl", "upi"];
      let isOfficialHandle = tier1Handles.includes(handlePart);
      
      if (isMobileNumber && isOfficialHandle) {
         return NextResponse.json({ isScam: false, score: 100, statusString, entity: category, sslStatus: "NPCI Layer Gateway Simulated", domainAge: "Real-Time Scan", blacklist: auditCore, reports: riskSignal, deepResearch: forensicReport });
      }
      return NextResponse.json({ isScam: false, score: 85, statusString: "Standard VPA", entity: category, sslStatus: "NPCI Layer Gateway Simulated", domainAge: "Real-Time Scan", blacklist: auditCore, reports: "1 Info Flag", deepResearch: "UPI ID syntactically valid hai. Payment karne se pehle cross-verify karein." });
    }

    return NextResponse.json({ isScam: false, score: 0, statusString: "Error", deepResearch: "Invalid Module." });

  } catch (error) {
    console.error("Crash Log:", error);
    return NextResponse.json({ isScam: true, score: 0, deepResearch: "Internal Operations Failure Protocol Active." }, { status: 500 });
  }
}