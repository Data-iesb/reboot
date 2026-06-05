class ContentLoader {
    async load() {
        const res = await fetch(`./content.json?v=${Date.now()}`, { cache: 'no-cache' });
        const data = await res.json();
        this.render(data);
    }

    render(c) {
        this.renderHero(c.hero);
        this.renderAbout(c.about);
        this.renderSchedule(c.schedule);
        this.renderWorkshops(c.workshops);
        this.renderPartners(c.partners);
        this.renderRegistration(c.registration);
        this.renderCoordination(c.coordination);
        document.getElementById('footer-text').innerHTML = c.footer.text;
    }

    renderHero(h) {
        document.getElementById('hero-title').innerHTML = h.title;
        document.getElementById('hero-subtitle').innerHTML = h.subtitle;
        document.getElementById('hero-date').innerHTML = h.date;
        document.getElementById('hero-location').innerHTML = h.location;
        this.startCountdown(h.countdownTarget);
    }

    startCountdown(target) {
        const t = new Date(target).getTime();
        const update = () => {
            const diff = t - Date.now();
            if (diff <= 0) { document.getElementById('countdown').innerHTML = '<p style="color:var(--accent);font-weight:700">O evento começou!</p>'; return; }
            document.getElementById('cd-days').textContent = Math.floor(diff / 86400000);
            document.getElementById('cd-hours').textContent = Math.floor((diff % 86400000) / 3600000);
            document.getElementById('cd-minutes').textContent = Math.floor((diff % 3600000) / 60000);
            document.getElementById('cd-seconds').textContent = Math.floor((diff % 60000) / 1000);
        };
        update();
        setInterval(update, 1000);
    }

    renderAbout(a) {
        document.getElementById('about-title').innerHTML = a.title;
        document.getElementById('about-description').innerHTML = a.description;
    }

    renderSchedule(s) {
        document.getElementById('schedule-title').innerHTML = s.title;
        document.getElementById('schedule-banner').src = s.banner;
        const container = document.getElementById('schedule-cards');
        container.innerHTML = s.days.map(day => `
            <div class="card">
                <h3>${day.label}</h3>
                <div class="time">📍 ${s.location} — ${day.date}</div>
                ${day.sessions.map(sess => sess.speaker ? `
                    <div class="coord-card" style="margin-top:0.8rem">
                        <img src="${sess.speaker.photo}" alt="${sess.speaker.name}">
                        <div class="coord-info">
                            <h4>${sess.time} – ${sess.title}</h4>
                            <div class="coord-role">${sess.speaker.name}</div>
                            <div class="coord-links">
                                ${sess.speaker.lattes ? `<a href="${sess.speaker.lattes}" target="_blank">Lattes</a>` : ''}
                                ${sess.speaker.linkedin ? `<a href="${sess.speaker.linkedin}" target="_blank">LinkedIn</a>` : ''}
                            </div>
                        </div>
                    </div>
                ` : `<div class="time">${sess.time} – ${sess.title}</div>`).join('')}
            </div>
        `).join('');
    }

    renderWorkshops(w) {
        document.getElementById('workshops-title').innerHTML = w.title;
        document.getElementById('workshops-banner').src = w.banner;
        const container = document.getElementById('workshops-cards');
        container.innerHTML = w.items.map(item => `
            <div class="card">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="time" style="margin-top:0.5rem">📍 ${w.location} — ${item.date}</div>
                ${item.speaker ? `
                <div class="coord-card" style="margin-top:0.8rem">
                    <img src="${item.speaker.photo}" alt="${item.speaker.name}">
                    <div class="coord-info">
                        <h4>${item.speaker.name}</h4>
                        <div class="coord-links">
                            ${item.speaker.lattes ? `<a href="${item.speaker.lattes}" target="_blank">Lattes</a>` : ''}
                            ${item.speaker.linkedin ? `<a href="${item.speaker.linkedin}" target="_blank">LinkedIn</a>` : ''}
                        </div>
                    </div>
                </div>` : ''}
            </div>
        `).join('');
    }

    renderPartners(p) {
        document.getElementById('partners-title').innerHTML = p.title;
        const grid = document.getElementById('partners-grid');
        grid.innerHTML = p.items.map(item => `
            <a href="${item.url || '#'}" target="_blank" class="partner-card" style="text-decoration:none">
                <img src="${item.logo}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </a>
        `).join('');
    }

    renderRegistration(r) {
        document.getElementById('registration-title').innerHTML = r.title;
        document.getElementById('registration-description').innerHTML = r.description;
        const btn = document.getElementById('registration-btn');
        btn.innerHTML = r.buttonText;
        btn.href = r.buttonUrl;
    }

    renderCoordination(c) {
        document.getElementById('coordination-title').innerHTML = c.title;
        const container = document.getElementById('coordination-content');
        container.innerHTML = c.sections.map(section => `
            <p class="coord-subtitle">${section.label}</p>
            <div class="coord-grid">
                ${section.members.map(m => `
                    <div class="coord-card">
                        <img src="${m.photo}" alt="${m.name}">
                        <div class="coord-info">
                            <h4>${m.name}</h4>
                            <div class="coord-role">${m.role}</div>
                            <div class="coord-links">
                                ${m.lattes ? `<a href="${m.lattes}" target="_blank">Lattes</a>` : ''}
                                ${m.linkedin ? `<a href="${m.linkedin}" target="_blank">LinkedIn</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => new ContentLoader().load());
