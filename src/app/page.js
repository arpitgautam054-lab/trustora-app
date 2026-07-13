"use client";
import React, { useState } from 'react';
import { 
  Link2, MessageSquare, Mail, PhoneCall, CreditCard, ShieldCheck, 
  Bell, Moon, ChevronDown, Map, Users, Bot, AlertTriangle, Play, ShieldAlert, BadgeAlert 
} from 'lucide-react';
// 📦 UPDATED CLERK IMPORTS (For Version 7+)
import { SignInButton, Show, UserButton } from '@clerk/nextjs';

export default function TrustoraDashboard() {
  const [activeTab, setActiveTab] = useState('link');
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const tabs = [
    { id: 'link', label: 'Link / URL', icon: <Link2 className="w-4 h-4" /> },
    { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'phone', label: 'Phone Number', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'upi', label: 'UPI ID', icon: <CreditCard className="w-4 h-4" /> }
  ];

  const handleAnalyze = async () => {
    if (!inputData.trim()) { alert("Please enter some data to analyze."); return; }
    setLoading(true); setResult(null);
    try {
      const response = await fetch('/api/check-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputData, type: activeTab })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-20">
      
      {/* 1. TOP NAVBAR WITH CLERK v7 AUTH */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0a2540] text-white rounded-xl flex items-center justify-center font-black text-2xl shadow-md">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#0a2540]">Trustora</span>
        </div>
        
        <div className="hidden lg:flex space-x-8 text-sm font-semibold text-slate-600">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Home</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Scan History</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Learn</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Community</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center space-x-5">
          <button className="text-slate-400 hover:text-slate-700 transition"><Moon className="w-5 h-5" /></button>
          <button className="text-slate-400 hover:text-slate-700 transition"><Bell className="w-5 h-5" /></button>
          
          {/* 🔐 NEW CLERK LOGIC (Using <Show>) */}
          <div className="flex items-center space-x-2 border-l pl-5 ml-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all">
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-slate-200" } }}
              />
            </Show>
          </div>
        </div>
      </nav>

      {/* 2. MAIN LAYOUT GRID */}
      <main className="max-w-[1440px] mx-auto mt-8 px-4 lg:px-8 flex flex-col xl:flex-row gap-8">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="flex-1 space-y-8">
          
          {/* Hero & Scanner Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
            <div className="max-w-2xl relative z-10 mb-8">
              <h1 className="text-5xl font-black text-[#0a2540] leading-tight mb-4">
                Stay Safe. <br/>Verify Before You <span className="text-emerald-500">Trust.</span>
              </h1>
              <p className="text-slate-500 text-lg">Detect scams, fake links, unsafe websites, suspicious emails and protect yourself & your family.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm relative z-10">
              <div className="flex overflow-x-auto border-b bg-slate-50/50 rounded-t-2xl px-2 pt-2 scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setResult(null); }}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                      activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-t-xl'
                    }`}
                  >
                    {tab.icon}<span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 md:p-6 flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder={
                    activeTab === 'link' ? "Paste link here (e.g. https://example.com)..." :
                    activeTab === 'sms' ? "Paste SMS content here..." :
                    activeTab === 'email' ? "Enter email address or paste content..." :
                    activeTab === 'phone' ? "Enter phone number (e.g. 9876543210)..." :
                    "Enter UPI ID to check..."
                  }
                />
                <button onClick={handleAnalyze} disabled={loading} className="bg-[#0a2540] hover:bg-[#0f3459] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-70 whitespace-nowrap shadow-md">
                  {loading ? "Scanning Engine..." : "Analyze Now →"}
                </button>
              </div>
              <div className="px-6 pb-4 text-xs font-semibold text-emerald-600 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5" /> We never store your data. 100% Secure & Private.
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none bg-gradient-to-l from-blue-100 to-transparent"></div>
          </div>

          {/* DYNAMIC SCAN RESULT */}
          {result && (
            <div className={`p-6 rounded-2xl shadow-sm border animate-fade-in border-l-4 ${result.isScam ? 'bg-white border-l-rose-500' : 'bg-white border-l-emerald-500'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center text-[#0a2540]">Scan Result <span className={`ml-3 px-3 py-1 rounded-full text-xs text-white ${result.isScam ? 'bg-rose-500' : 'bg-emerald-500'}`}>{result.statusString}</span></h2>
              <p className="text-slate-600 font-medium mb-3">Trust Score: <strong className={result.isScam ? 'text-rose-500 text-lg' : 'text-emerald-500 text-lg'}>{result.score}/100</strong></p>
              <div className={`p-4 rounded-xl border text-sm font-medium leading-relaxed ${result.isScam ? 'bg-rose-50 text-rose-800 border-rose-100' : 'bg-emerald-50 text-emerald-800 border-emerald-100'}`}>
                {result.deepResearch}
              </div>
            </div>
          )}

          {/* TRENDING SCAMS */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center text-[#0a2540]"><Play className="w-5 h-5 mr-2 text-rose-500 fill-rose-500" /> Trending Scams Today</h3>
              <a href="#" className="text-blue-600 text-sm font-semibold hover:underline">View All →</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><ShieldAlert /></div>
                <div><h4 className="font-bold text-slate-800 text-sm">Fake SBI Loan</h4><div className="flex space-x-2 text-xs mt-1"><span className="text-rose-500 font-bold">High Risk</span><span className="text-slate-400">1522 Reports</span></div></div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600"><BadgeAlert /></div>
                <div><h4 className="font-bold text-slate-800 text-sm">Fake Flipkart Offers</h4><div className="flex space-x-2 text-xs mt-1"><span className="text-rose-500 font-bold">High Risk</span><span className="text-slate-400">998 Reports</span></div></div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600"><MessageSquare /></div>
                <div><h4 className="font-bold text-slate-800 text-sm">Fake WhatsApp Job</h4><div className="flex space-x-2 text-xs mt-1"><span className="text-rose-500 font-bold">High Risk</span><span className="text-slate-400">874 Reports</span></div></div>
              </div>
            </div>
          </div>

          {/* AI ADVISOR & QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center mb-2 text-[#0a2540]">AI Safety Advisor <span className="ml-2 bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</span></h3>
                <p className="text-slate-500 text-sm mb-6">Ask our AI anything about scams, links, emails or safety.</p>
              </div>
              <div>
                <input type="text" placeholder="Ask anything..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-blue-500" />
                <button className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold flex items-center justify-center text-sm shadow-md hover:bg-blue-700 transition"><Bot className="w-5 h-5 mr-2" /> Chat with AI</button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-[#0a2540]">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition shadow-sm"><AlertTriangle className="text-rose-500 w-6 h-6 mb-2" /><span className="text-xs font-semibold">Report Scam</span></button>
                <button className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition shadow-sm"><PhoneCall className="text-blue-500 w-6 h-6 mb-2" /><span className="text-xs font-semibold">Check Number</span></button>
                <button className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition shadow-sm"><Link2 className="text-indigo-500 w-6 h-6 mb-2" /><span className="text-xs font-semibold">Check URL</span></button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="w-full xl:w-[400px] space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-2 flex items-center text-[#0a2540]">Email Safety Check <span className="ml-2 bg-purple-100 text-purple-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">New</span></h3>
            <p className="text-sm text-slate-500 mb-4">Check if an email is fake, phishing or contains a scam link.</p>
            <div className="relative mb-4">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input type="text" placeholder="Enter email address" className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>
            <button className="w-full bg-[#7c5ce5] hover:bg-[#6a4ac9] text-white rounded-xl py-3.5 font-bold text-sm shadow-md transition-all">Check Email Safety</button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#0a2540]">Scam Heatmap (India)</h3>
              <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase flex items-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span>Live</span>
            </div>
            <div className="w-full h-48 bg-slate-50 rounded-xl mb-4 flex flex-col items-center justify-center border border-slate-200 relative overflow-hidden">
                <Map className="w-8 h-8 text-slate-300 mb-2" />
                <div className="text-slate-400 text-sm font-bold">Map API Integration Pending</div>
                <div className="absolute top-1/4 left-1/3 bg-white px-2 py-1 rounded-md shadow-md text-[10px] font-bold border"><span className="text-rose-500">Delhi</span> High</div>
                <div className="absolute top-1/2 left-1/4 bg-white px-2 py-1 rounded-md shadow-md text-[10px] font-bold border"><span className="text-rose-600">Mumbai</span> Very High</div>
            </div>
            <p className="text-sm text-slate-600 mb-3">See what scams are trending in your city right now.</p>
            <a href="#" className="text-blue-600 text-sm font-semibold hover:underline">View Full Heatmap →</a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center text-[#0a2540]">Family Protection <span className="ml-2 bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">New</span></h3>
            <p className="text-sm text-slate-500 mb-4">Protect your loved ones from scams in real-time.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-full"><Users className="w-5 h-5 text-slate-400"/></div>
                  <div><p className="font-bold text-sm text-[#0a2540]">Mom</p><p className="text-xs text-slate-500">+91 98765 43210</p></div>
                </div>
                <span className="text-emerald-500 text-xs font-bold">Protected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 flex justify-center items-center rounded-full font-bold">A</div>
                  <div><p className="font-bold text-sm text-[#0a2540]">You</p><p className="text-xs text-slate-500">Admin</p></div>
                </div>
                <span className="text-blue-600 text-xs font-bold">Active</span>
              </div>
            </div>
            <button className="text-blue-600 text-sm font-semibold mt-4 hover:underline">Manage Family →</button>
          </div>

        </div>
      </main>
    </div>
  );
}