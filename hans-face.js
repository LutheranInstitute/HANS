/* <hans-face> · HANS robotface de #OSW ante la IOA (en honor a Hans Nielsen Hauge)
 * Una sola cara, cualquier tamaño. Read-only DEMO: muestra, no mueve ningún robot.
 * Human stays root · Evidence ≠ Authority.
 *
 *   <script src="hans-face.js"></script>
 *   <hans-face mood="ready"></hans-face>          ← se adapta a su caja
 *
 * Tiers por tamaño (lado corto de la caja):
 *   < 40 px   glyph   → la cara se pliega en la ligadura æ (ojos = a + e)
 *   40–159 px avatar  → orbe + ojos + boca, parpadeo
 *   ≥ 160 px  full    → además sigue el dedo/cursor y muestra moods
 * Formato: caja vertical (9:16) pone el rótulo debajo; horizontal (16:9) al lado.
 * Atributos: mood = ready|happy|think|surprise|sleep|love · label="off" oculta el rótulo
 * API: el.mood = "happy"; el.say("texto")  · evento "hans:tier" al cambiar de tier
 * Sin assets externos. Respeta prefers-reduced-motion.
 */
(() => {
  if (customElements.get("hans-face")) return;
  const MOODS = ["ready", "happy", "think", "surprise", "sleep", "love"];
  const css = `
  :host{display:block;position:relative;contain:layout;min-width:12px;min-height:12px;
    --g:#22ff4a;--g2:#9fffb1;--deep:#06240b;--love:#ff5aaa;color:var(--g2);
    font:600 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace}
  .w{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:4%}
  .w.v{flex-direction:column}
  svg{display:block;flex:none;overflow:visible}
  .lab{display:none;text-align:center;letter-spacing:.08em}
  .lab b{display:block;color:var(--g);letter-spacing:.18em}
  .lab i{font-style:normal;opacity:.75;font-weight:500}
  .w.full .lab{display:block}.w.nolab .lab{display:none}
  .w.h .lab{text-align:left}
  .say{fill:var(--g2);font:600 6px ui-monospace,monospace;text-anchor:middle}
  .eye,.mouth{transition:transform .3s cubic-bezier(.33,1,.68,1);transform-box:fill-box;transform-origin:center}
  .gaze{transition:transform .18s cubic-bezier(.33,1,.68,1)}
  .blink .eye{transform:scaleY(.1)!important;transition-duration:70ms}
  .m-happy .eye{transform:scaleY(.55) translateY(-1px)} .m-happy .mouth{transform:scale(1.35,1.1)}
  .m-think .eye.l{transform:scale(.85)} .m-think .eye.r{transform:scale(1.1) rotate(-8deg)} .m-think .mouth{transform:scaleX(.6) translateX(3px)}
  .m-surprise .eye{transform:scale(1.25)} .m-surprise .mouth{transform:scale(1.3,1.6)}
  .m-sleep .eye{transform:scaleY(.08)} .m-sleep .mouth{transform:scale(.7);opacity:.6} .m-sleep .orb{filter:brightness(.5) saturate(.7)}
  .m-love .eye,.m-love .mouth{fill:#ffd1ec}
  .orb{animation:br 4.5s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes br{50%{transform:scale(1.025)}}
  @media (prefers-reduced-motion:reduce){.orb{animation:none}.eye,.mouth,.gaze{transition:opacity .2s}}`;

  let uid = 0;
  class HansFace extends HTMLElement {
    static get observedAttributes() { return ["mood", "label"]; }
    constructor() {
      super();
      this.id_ = "hf" + (++uid);
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${css}</style><div class="w" part="wrap" role="img"></div>`;
      this.$w = r.querySelector(".w");
      this.tier = null;
      this._move = this._move.bind(this);
    }
    get mood() { return this.getAttribute("mood") || "ready"; }
    set mood(v) { this.setAttribute("mood", v); }
    connectedCallback() {
      this.ro = new ResizeObserver(() => this._layout());
      this.ro.observe(this);
      this._layout();
      this._blinkLoop();
    }
    disconnectedCallback() {
      this.ro && this.ro.disconnect();
      clearTimeout(this.bt);
      window.removeEventListener("pointermove", this._move);
    }
    attributeChangedCallback() { this._apply(); }

    _svg(tier) {
      const id = this.id_;
      if (tier === "glyph") {
        // la cara plegada: orbe + ligadura æ (a = ojo izquierdo, e = ojo derecho)
        return `<svg viewBox="0 0 32 32"><defs><radialGradient id="${id}o" cx=".5" cy=".55" r=".55">
          <stop offset="0" stop-color="#0e5a1d"/><stop offset=".7" stop-color="#06240b"/><stop offset="1" stop-color="#22ff4a"/></radialGradient></defs>
          <circle cx="16" cy="16" r="15" fill="url(#${id}o)"/>
          <text x="16" y="22.2" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="19" font-weight="700" fill="#9fffb1">æ</text></svg>`;
      }
      return `<svg viewBox="0 0 100 100"><defs>
        <radialGradient id="${id}o" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#0d3a14"/><stop offset=".55" stop-color="#06240b"/><stop offset=".85" stop-color="#0e5a1d"/><stop offset="1" stop-color="#22ff4a"/></radialGradient>
        <radialGradient id="${id}b" cx=".5" cy=".8" r=".45"><stop offset="0" stop-color="#78ff8c" stop-opacity=".7"/><stop offset="1" stop-color="#22ff4a" stop-opacity="0"/></radialGradient>
        <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <filter id="${id}g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <g class="orb"><circle cx="50" cy="50" r="48" fill="url(#${id}o)"/><circle cx="50" cy="50" r="48" fill="url(#${id}b)"/>
          <ellipse cx="38" cy="16" rx="21" ry="9" fill="url(#${id}s)"/></g>
        <g class="face" filter="url(#${id}g)"><g class="gaze">
          <rect class="eye l" x="30" y="34" width="12" height="16" rx="3" fill="#22ff4a"/>
          <rect class="eye r" x="58" y="34" width="12" height="16" rx="3" fill="#22ff4a"/>
          <rect class="mouth" x="40" y="60" width="20" height="5" rx="2" fill="#22ff4a"/>
          <text class="say" x="50" y="80"></text></g></g></svg>`;
    }

    _layout() {
      const w = this.clientWidth, h = this.clientHeight || w;
      const s = Math.min(w, h);
      const tier = s < 40 ? "glyph" : s < 160 ? "avatar" : "full";
      const ratio = w / h;
      const shape = ratio < 0.8 ? "v" : ratio > 1.25 ? "h" : "sq";
      if (tier !== this.tier) {
        this.tier = tier;
        this.$w.innerHTML = this._svg(tier) +
          `<div class="lab" part="label"><b>HANS</b><i>robotface de #OSW ante la IOA</i><br><i>en honor a Hans Nielsen Hauge</i></div>`;
        this.$svg = this.$w.querySelector("svg");
        this.$f = this.$w.querySelector(".face");
        this.$gz = this.$w.querySelector(".gaze");
        this.$say = this.$w.querySelector(".say");
        window.removeEventListener("pointermove", this._move);
        if (tier === "full") window.addEventListener("pointermove", this._move, { passive: true });
        this.dispatchEvent(new CustomEvent("hans:tier", { detail: { tier }, bubbles: true }));
        this._apply();
      }
      // tamaño del orbe y del rótulo según formato
      const showLab = tier === "full" && shape !== "sq" && this.getAttribute("label") !== "off";
      const orb = showLab ? (shape === "v" ? Math.min(w * 0.82, h * 0.62) : Math.min(h * 0.82, w * 0.55)) : s * 0.96;
      this.$svg.style.width = this.$svg.style.height = orb + "px";
      this.$w.className = "w " + (shape === "v" ? "v " : shape === "h" ? "h " : "") + tier + (showLab ? "" : " nolab");
      const lab = this.$w.querySelector(".lab");
      lab.style.fontSize = Math.max(11, orb * 0.065) + "px";
      this.$w.setAttribute("aria-label", "HANS, robotface de #OSW ante la IOA, ánimo " + this.mood);
    }

    _apply() {
      if (!this.$f) return;
      const m = MOODS.includes(this.mood) ? this.mood : "ready";
      this.$f.setAttribute("class", "face m-" + m);
      this.$w.querySelector(".orb")?.setAttribute("class", "orb m-" + m);
      this.$w.classList.toggle("m-sleep", m === "sleep");
      if (this.tier) this.$w.setAttribute("aria-label", "HANS, robotface de #OSW ante la IOA, ánimo " + m);
    }

    _move(e) {
      if (!this.$gz || this.mood === "sleep") return;
      const r = this.$svg.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1);
      const dy = (e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 1);
      const k = 7, cl = v => Math.max(-1, Math.min(1, v));
      this.$gz.style.transform = `translate(${cl(dx) * k}px,${cl(dy) * k * 0.7}px)`;
    }

    _blinkLoop() {
      const go = () => {
        this.bt = setTimeout(() => {
          if (this.$f && this.tier !== "glyph" && this.mood !== "sleep" &&
              !matchMedia("(prefers-reduced-motion: reduce)").matches) {
            this.$f.classList.add("blink");
            setTimeout(() => this.$f && this.$f.classList.remove("blink"), 120);
          }
          go();
        }, 2600 + Math.random() * 3400);
      };
      go();
    }

    say(text = "", ms = 2600) {
      if (!this.$say) return;
      this.$say.textContent = String(text).slice(0, 28);
      this.$f.querySelector(".mouth").style.transform = "scale(1.1,.65)";
      clearTimeout(this.st);
      this.st = setTimeout(() => {
        this.$say.textContent = "";
        this.$f.querySelector(".mouth").style.transform = "";
      }, ms);
    }
  }
  customElements.define("hans-face", HansFace);
})();
