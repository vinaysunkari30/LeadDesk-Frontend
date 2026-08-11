import Navbar from "../Navbar";
import LeadForm from "../LeadForm";
import { ToastContainer, useToast } from "../Toast";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// STAT CARD
const StatCard = ({ value, label, icon }) => (
  <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
    <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
    <div className="text-xl sm:text-2xl font-syne font-bold text-white">{value}</div>
    <div className="text-xs sm:text-sm text-slate-400 font-inter mt-0.5">{label}</div>
  </div>
);

// FEATURE ITEM
const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3 group">
    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-white font-inter font-semibold text-sm">{title}</p>
      <p className="text-slate-500 font-inter text-xs mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

// FOOTER
const Footer = () => (
  <footer className="border-t border-white/5 py-6 px-5 md:px-10">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span className="text-slate-400 font-inter text-sm">
          © 2024 LeadDesk. All rights reserved.
        </span>
      </div>
      <a
        href="https://digitalheroesco.com"
        target="_blank"
        rel="noopener noreferrer"
        id="footer-credit-link"
        className="text-blue-400 hover:text-blue-300 font-inter text-sm transition-colors flex items-center gap-1.5 group"
      >
        <span>Built for Digital Heroes Training Task</span>
        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  </footer>
);

// HOME PAGE
const Home = () => {
  const { toasts, addToast, removeToast } = useToast();

  const token = Cookies.get("token")
  token ? <Navigate to="/admin" /> : <Navigate to='/login' />

  return (
    <div className="min-h-screen bg-[#0a0f2c] grid-bg flex flex-col">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-5%] w-[350px] h-[350px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[300px] rounded-full bg-blue-500/6 blur-[120px]" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero + Form Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-5 md:px-6 py-8 md:py-13 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-5 lg:gap-18 items-center">

          {/* LEFT — Hero Content */}
          <div className="order-2 md:order-1">

            {/* Badge */}
            <div className="anim-fade-up inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-inter font-medium tracking-wide uppercase">
                Smart Lead Capture Platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="anim-fade-up-delay-1 font-syne font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-white leading-[1.12] mb-4">
              Turn Visitors into{" "}
              <span className="gradient-text">Qualified Leads</span>
            </h1>

            {/* Subheading */}
            <p className="anim-fade-up-delay-2 text-slate-400 font-inter text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Share your project details and budget. Our team will review your inquiry
              and get back to you within 24 hours with a tailored plan.
            </p>

            {/* Stats */}
            <div className="anim-fade-up-delay-3 grid grid-cols-3 gap-3 mb-8">
              <StatCard value="500+" label="Leads Captured" icon="🚀" />
              <StatCard value="24h" label="Response Time" icon="⚡" />
              <StatCard value="98%" label="Satisfaction" icon="⭐" />
            </div>

            {/* Features */}
            <div className="anim-fade-up-delay-4 flex flex-col gap-3">
              <FeatureItem
                icon={<svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                title="Secure & Encrypted"
                desc="Your data is protected with enterprise-grade security."
              />
              <FeatureItem
                icon={<svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                title="Instant Confirmation"
                desc="Receive immediate acknowledgement upon submission."
              />
              <FeatureItem
                icon={<svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                title="Dedicated Account Manager"
                desc="Every lead gets a personal point of contact."
              />
            </div>
          </div>

          {/* RIGHT — Lead Form */}
          <div className="order-1 md:order-2 anim-fade-up-delay-2 sm:flex sm:justify-center">
            <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:w-[85%] md:w-full shadow-2xl border border-white/10 hover:border-blue-500/20 transition-colors duration-500">
              {/* Form Header */}
              <div className="mb-6">
                <h2 className="font-syne font-bold text-xl sm:text-2xl text-white mb-1">
                  Start Your Project
                </h2>
                <p className="text-slate-400 font-inter text-sm">
                  Fill in the details below — takes less than 2 minutes.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

              {/* Form Component */}
              <LeadForm
                onSuccess={(msg) => addToast(msg, "success")}
                onError={(msg) => addToast(msg, "error")}
              />

              {/* Trust note */}
              <p className="text-center text-slate-600 font-inter text-xs mt-5 flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your information is secure and never shared.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom section - How it works */}
        <section className="mt-20 md:mt-28">
          <div className="text-center mb-10">
            <span className="text-blue-400 font-inter text-xs font-semibold uppercase tracking-widest">Process</span>
            <h2 className="font-syne font-bold text-2xl sm:text-3xl text-white mt-2">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative">
            {/* Connector line – hidden on mobile */}
            <div className="hidden sm:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-blue-500/30" />

            {[
              { step: "01", title: "Submit Your Inquiry", desc: "Fill out the form with your project details and budget range.", icon: "📝" },
              { step: "02", title: "We Review & Assign", desc: "Our team reviews your lead and assigns a dedicated account manager.", icon: "🔍" },
              { step: "03", title: "Get a Custom Plan", desc: "Receive a personalized proposal within 24 hours.", icon: "📋" },
            ].map((item) => (
              <div key={item.step} className="glass rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 relative z-10">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-xs font-syne font-bold text-blue-400 mb-1 tracking-widest">{item.step}</div>
                <h3 className="font-syne font-bold text-white text-base mb-2">{item.title}</h3>
                <p className="text-slate-400 font-inter text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Home;
