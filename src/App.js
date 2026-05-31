
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/* ── Animated counter hook ── */
function useCounter(target, duration, start) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start]); // eslint-disable-line
  return count;
}

/* ── Stat Card ── */
const StatCard = ({ stat, start }) => {
  const count = useCounter(stat.value, 2000, start);
  return (
    <div className="stat-card">
      <div className="stat-value">{count}{stat.suffix}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
};

/* ── Contact Form ── */
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <form className="contact-form fade-up" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label><i className="fa-solid fa-user"></i> Full Name</label>
          <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label><i className="fa-solid fa-envelope"></i> Email</label>
          <input type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label><i className="fa-solid fa-phone"></i> Phone</label>
          <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label><i className="fa-solid fa-list"></i> Service</label>
          <select name="service" value={form.service} onChange={handleChange} required>
            <option value="">Select condition / service</option>
            <option>Paralysis Rehabilitation</option>
            <option>Cervical Pain</option>
            <option>Frozen Shoulder</option>
            <option>Sciatica Pain</option>
            <option>Back Pain</option>
            <option>Knee Pain</option>
            <option>Chiropractor Therapy</option>
            <option>Hijama / Dry Cupping</option>
            <option>Soft Laser Therapy</option>
            <option>Taping / IASTM</option>
            <option>Other Body Pain</option>
          </select>
        </div>
      </div>
      <div className="form-group full">
        <label><i className="fa-solid fa-comment"></i> Message</label>
        <textarea name="message" rows="4" placeholder="Tell us about your condition..." value={form.message} onChange={handleChange}></textarea>
      </div>
      <button type="submit" className={`btn-submit ${submitted ? 'submitted' : ''}`}>
        {submitted
          ? <><i className="fa-solid fa-circle-check"></i> Request Sent!</>
          : <><i className="fa-solid fa-paper-plane"></i> Book Appointment</>}
      </button>
    </form>
  );
};

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
function App() {
  const [scrolled, setScrolled]     = useState(false);
  const [activeSection, setActive]  = useState('home');
  const [menuOpen, setMenuOpen]     = useState(false);
  const [statsVisible, setStats]    = useState(false);
  const statsRef = useRef(null);

  /* scroll: navbar + active section */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const ids = ['home', 'services', 'about', 'testimonials', 'contact'];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= 120 && bottom >= 120) { setActive(id); break; }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* stats counter trigger */
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStats(true); }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  /* fade-up on scroll */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  /* ── Data ── */
  const navLinks   = ['Home', 'Services', 'About', 'Testimonials', 'Contact'];

  const services = [
    { icon: 'fa-person-walking-with-cane', title: 'Paralysis Rehabilitation', desc: 'Specialised neuro-physiotherapy to restore motor function, strength and independence for paralysis patients.',  color: '#e74c3c' },
    { icon: 'fa-bone',                    title: 'Cervical & Back Pain',      desc: 'Targeted treatment for cervical spondylosis, disc problems, and chronic back pain using modern techniques.',      color: '#3498db' },
    { icon: 'fa-person-running',          title: 'Frozen Shoulder',           desc: 'Effective mobilisation and manual therapy protocols to restore full shoulder range of motion and eliminate pain.',  color: '#27ae60' },
    { icon: 'fa-person-walking',          title: 'Sciatica Pain',             desc: 'Advanced nerve-release techniques and targeted exercises to relieve sciatica and radiating leg pain rapidly.',    color: '#9b59b6' },
    { icon: 'fa-joint',                   title: 'Knee Pain',                 desc: 'Comprehensive knee rehabilitation — from ligament injuries to arthritis — restoring mobility and strength.',      color: '#f39c12' },
    { icon: 'fa-hand-holding-medical',    title: 'All Body Pain',             desc: 'Holistic pain management for any musculoskeletal condition using evidence-based, patient-centred therapy.',      color: '#1abc9c' },
  ];

  const steps = [
    { num: '01', img: './img/chiro.jpg',  title: 'Chiropractor Therapy', desc: 'Precise spinal and joint adjustments to correct misalignments, relieve nerve pressure and restore natural movement.' },
    { num: '02', img: './img/hijama.jpg', title: 'Hijama / Dry Cupping', desc: 'Traditional cupping therapy to improve circulation, reduce inflammation and accelerate natural healing of deep tissue.' },
    { num: '03', img: './img/lager.jpg',  title: 'Soft Laser Therapy',   desc: 'Low-level laser stimulation that promotes cellular repair, reduces swelling and relieves deep-seated chronic pain.' },
    { num: '04', img: './img/taing.jpg',  title: 'Taping & IASTM',       desc: 'Kinesiology taping and Instrument Assisted Soft Tissue Mobilisation to restore function and prevent re-injury.' },
  ];

  const testimonials = [
    { name: 'Ramesh Sharma',   role: 'Nallasopara',      text: 'Dr. Jai Prakash cured my chronic sciatica in just 6 sessions. The treatment was very effective and I am now completely pain-free. Highly recommended!',                rating: 5, initials: 'RS' },
    { name: 'Sunita Patil',   role: 'Vasai',             text: 'My frozen shoulder was so painful I could not lift my arm. After 2 weeks of treatment at SV Physiotherapy, I have regained full movement. Thank you Doctor!',           rating: 5, initials: 'SP' },
    { name: 'Anil Dubey',     role: 'Virar',             text: 'My father had a paralysis attack. Dr. Jai Prakash\u2019s dedicated physiotherapy helped him walk again. We are forever grateful for the care and attention.', rating: 5, initials: 'AD' },
  ];

  const stats = [
    { value: 5,    suffix: '+', label: 'Years Experience'  },
    { value: 5000, suffix: '+', label: 'Patients Treated'  },
    { value: 97,   suffix: '%', label: 'Success Rate'      },
    { value: 5,    suffix: '',  label: 'Therapies Offered' },
  ];

  const contactItems = [
    { icon: 'fa-location-dot', title: 'Visit Us',       info: 'Gala No. 6, Square One Chawl, Avadhoot Ashram Road, Nr. Green Hills Resort, Nallasopara East — 401209' },
    { icon: 'fa-phone',        title: 'Call / WhatsApp', info: '+91 88585 02455'                                },
    { icon: 'fa-envelope',     title: 'Email Us',       info: 'jaiprakashyadav485@gmail.com'                  },
    { icon: 'fa-clock',        title: 'Working Hours',  info: 'Mon – Sat: 8:00 AM – 8:00 PM'                  },
  ];

  /* ── Render ── */
  return (
    <div className="physio-site">

      {/* ════ NAVBAR ════ */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-wrap">
          <div className="logo" onClick={() => scrollTo('home')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && scrollTo('home')}>
            <i className="fa-solid fa-stethoscope"></i>
            <span>PhysioElite</span>
          </div>
          <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <li className="nav-close-li">
              <button className="nav-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </li>
            {navLinks.map(link => (
              <li key={link}>
                <button
                  className={activeSection === link.toLowerCase() ? 'active' : ''}
                  onClick={() => scrollTo(link.toLowerCase())}
                >{link}</button>
              </li>
            ))}
          </ul>
          <button className="nav-book" onClick={() => scrollTo('contact')}>Book Now</button>
          <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section id="home" className="hero">
        <div className="hero-bg-icons" aria-hidden="true">
          {['fa-heart-pulse','fa-dumbbell','fa-person-running','fa-bone','fa-hand-holding-medical','fa-stethoscope'].map((ic, i) => (
            <span key={i} className={`bg-icon bg-icon-${i + 1}`}><i className={`fa-solid ${ic}`}></i></span>
          ))}
        </div>

        {/* Doctor image — left side with bottom fade */}
        <div className="hero-dr-left" aria-hidden="true">
          <img src="./img/drjpyadav.png" alt="Dr. Jai Prakash Yadav" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-hospital"></i> SV Physiotherapy &amp; Advance Pain Management Hub
          </div>
          <h1>
            Relieve <span>Pain</span>,<br />
            Restore <span>Life</span>
          </h1>
          <div className="hero-dr-block">
            <img src="./img/dr2.png" alt="Dr. Jai Prakash Yadav" className="hero-dr-img" />
            <div>
              <strong>Dr. Jai Prakash Yadav (PT)</strong>
              <span>Specialising in Paralysis · Cervical · Sciatica · Frozen Shoulder · Knee &amp; All Body Pain</span>
            </div>
          </div>
          <div className="hero-address">
            <i className="fa-solid fa-building"></i>
            Nallasopara East, Gala No. 6, Square One Chawl, Avadhoot Ashram Road, Nr. Green Hills Resort — 401209 &nbsp;|&nbsp; +91 88585 02455
          </div>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => scrollTo('contact')}>
              <i className="fa-solid fa-calendar-plus"></i> Book Free Consultation
            </button>
            <button className="btn-ghost" onClick={() => scrollTo('services')}>
              <i className="fa-solid fa-circle-play"></i> Our Services
            </button>
          </div>
          <div className="hero-trust">
            <div className="hero-stars">
              {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
              <span>4.8 / 5 Rating</span>
            </div>
            <span className="trust-sep">|</span>
            <div className="trust-text"><i className="fa-solid fa-users"></i> 5,000+ Happy Patients</div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="hero-card-icon"><i className="fa-solid fa-heart-pulse"></i></div>
          </div>
          <div className="float-badge badge-1"><i className="fa-solid fa-circle-check"></i><span>Pain Relieved!</span></div>
          <div className="float-badge badge-2"><i className="fa-solid fa-phone"></i><span>+91 88585 02455</span></div>
          <div className="float-badge badge-3"><i className="fa-solid fa-star"></i><span>Top Rated Clinic</span></div>
        </div>

        <a className="scroll-down" href="#services" onClick={e => { e.preventDefault(); scrollTo('services'); }} aria-label="Scroll down">
          <div className="scroll-wheel"></div>
        </a>
      </section>

      {/* ════ SERVICES ════ */}
      <section id="services" className="section services-section">
        <div className="container">
          <div className="section-head fade-up">
            <span className="tag"><i className="fa-solid fa-stethoscope"></i> Specialist In</span>
            <h2>Conditions We <span>Treat</span></h2>
            <p>SV Physiotherapy &amp; Advance Pain Management Hub provides expert treatment for a wide range of pain and mobility conditions.</p>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="service-card fade-up" style={{ '--delay': `${i * 0.1}s`, '--clr': s.color }}>
                <div className="svc-icon"><i className={`fa-solid ${s.icon}`}></i></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="svc-link">Learn More <i className="fa-solid fa-arrow-right"></i></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ABOUT ════ */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual-col fade-up">
              <div className="about-img-wrap">
                <div className="about-img-bg"></div>
                <div className="about-img-main">
                  <img src="./img/dr3.png" alt="Dr. Jai Prakash Yadav" className="about-dr-img" />
                </div>
                <div className="exp-badge">
                  <strong>5+</strong>
                  <span>Years of Excellence</span>
                </div>
              </div>
            </div>
            <div className="about-text-col fade-up" style={{ '--delay': '0.15s' }}>
              <span className="tag"><i className="fa-solid fa-circle-info"></i> About Us</span>
              <h2>Meet <span>Dr. Jai Prakash Yadav</span></h2>
              <p>Dr. Jai Prakash Yadav (PT) is a dedicated physiotherapist and pain management specialist with years of hands-on clinical experience helping patients recover from paralysis, chronic pain, and complex musculoskeletal conditions.</p>
              <p>At SV Physiotherapy &amp; Advance Pain Management Hub, Nallasopara East, we combine modern therapeutic techniques with compassionate, patient-centred care to deliver lasting pain relief and restored mobility.</p>
              <ul className="about-feats">
                {['Certified Physiotherapist (PT)', 'Advanced Pain Management', 'Personalised Treatment Plans', 'Modern Therapy Equipment'].map((f, i) => (
                  <li key={i}><i className="fa-solid fa-circle-check"></i> {f}</li>
                ))}
              </ul>
              <button className="btn-primary" onClick={() => scrollTo('contact')}>
                <i className="fa-solid fa-envelope"></i> Get In Touch
              </button>
            </div>
          </div>
          <div className="stats-grid" ref={statsRef}>
            {stats.map((s, i) => <StatCard key={i} stat={s} start={statsVisible} />)}
          </div>
        </div>
      </section>

      {/* ════ HOW IT WORKS ════ */}
      <section className="section how-section">
        <div className="container">
          <div className="section-head fade-up">
            <span className="tag"><i className="fa-solid fa-route"></i> Advanced Therapies</span>
            <h2>Advance Pain Relief <span>Facility</span></h2>
            <p>We offer a range of cutting-edge, non-invasive therapies for rapid and lasting pain relief.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card fade-up" style={{ '--delay': `${i * 0.12}s` }}>
                <div className="step-img-wrap">
                  <img src={step.img} alt={step.title} className="step-img" />
                  <span className="step-num-badge">{step.num}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section id="testimonials" className="section testi-section">
        <div className="container">
          <div className="section-head fade-up">
            <span className="tag"><i className="fa-solid fa-comments"></i> Patient Stories</span>
            <h2>What Our Patients <span>Say</span></h2>
            <p>Real stories from real people whose lives have been transformed through our care.</p>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card fade-up" style={{ '--delay': `${i * 0.1}s` }}>
                <div className="quote-icon"><i className="fa-solid fa-quote-left"></i></div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-stars">
                  {[...Array(t.rating)].map((_, j) => <i key={j} className="fa-solid fa-star"></i>)}
                </div>
                <div className="testi-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div className="author-info">
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA BANNER ════ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner fade-up">
            <div className="cta-icon-pulse"><i className="fa-solid fa-heart-pulse"></i></div>
            <h2>Ready to Start Your Recovery?</h2>
            <p>Take the first step today. Your pain-free life is one appointment away.</p>
            <button className="btn-white" onClick={() => scrollTo('contact')}>
              <i className="fa-solid fa-calendar-plus"></i> Book Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* ════ CONTACT ════ */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="section-head fade-up">
            <span className="tag"><i className="fa-solid fa-phone"></i> Get In Touch</span>
            <h2>Book Your <span>Appointment</span></h2>
            <p>We're here to help. Reach out and start your journey to better health today.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-info fade-up">
              <h3>Contact Information</h3>
              {contactItems.map((item, i) => (
                <div key={i} className="info-row">
                  <div className="info-icon"><i className={`fa-solid ${item.icon}`}></i></div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.info}</span>
                  </div>
                </div>
              ))}
              <div className="contact-socials">
                {['fa-facebook','fa-twitter','fa-instagram','fa-linkedin'].map((s, i) => (
                  <a key={i} href="#!" className="social-btn" onClick={e => e.preventDefault()} aria-label={s.replace('fa-','')}>
                    <i className={`fa-brands ${s}`}></i>
                  </a>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="logo white">
                <i className="fa-solid fa-stethoscope"></i>
                <span>PhysioElite</span>
              </div>
              <p>SV Physiotherapy &amp; Advance Pain Management Hub — Expert care by Dr. Jai Prakash Yadav (PT), Nallasopara East.</p>
              <div className="footer-socials">
                {['fa-facebook','fa-twitter','fa-instagram','fa-linkedin'].map((s, i) => (
                  <a key={i} href="#!" onClick={e => e.preventDefault()} aria-label={s.replace('fa-','')}>
                    <i className={`fa-brands ${s}`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                {navLinks.map(l => (
                  <li key={l}><button onClick={() => scrollTo(l.toLowerCase())}>{l}</button></li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Therapies</h4>
              <ul>
                {['Chiropractor Therapy','Hijama / Cupping','Soft Laser Therapy','Taping Therapy','IASTM'].map(l => (
                  <li key={l}><button>{l}</button></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 SV Physiotherapy &amp; Advance Pain Management Hub. All rights reserved.</p>
            <p>Made with <i className="fa-solid fa-heart"></i> for better health</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;

