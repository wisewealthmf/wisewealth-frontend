<div className="hero-right">
        <div className="coin">
          {/* ROTATING OUTER RING */}

          <div className="outer-ring">
            <div className="outer-ring">
              <svg className="ring-text" viewBox="0 0 620 620">
                <defs>
                  <path id="topCurve" d="M 300 135 A 170 170 0 0 1 480 310" />

                  <path id="rightCurve" d="M 490 320 A 170 170 0 0 1 310 480" />

                  <path
                    id="bottomCurve"
                    d="M 310 485 A 170 170 0 0 1 140 310"
                  />

                  <path id="leftCurve" d="M 135 310 A 170 170 0 0 1 310 135" />
                </defs>

                {/* TOP */}

                <text
                  className={`curve-text ${active === "Smart Investing" ? "active" : ""}`}
                  onClick={() => setActive("Smart Investing")}
                >
                  <textPath
                    href="#topCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    SMART INVESTING
                  </textPath>
                </text>

                {/* RIGHT */}

                <text
                  className={`curve-text ${active === "Goal Planning" ? "active" : ""}`}
                  onClick={() => setActive("Goal Planning")}
                >
                  <textPath
                    href="#rightCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    GOAL PLANNING
                  </textPath>
                </text>

                {/* BOTTOM */}

                <text
                  className={`curve-text ${active === "Wealth Tracking" ? "active" : ""}`}
                  onClick={() => setActive("Wealth Tracking")}
                >
                  <textPath
                    href="#bottomCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    WEALTH TRACKING
                  </textPath>
                </text>

                {/* LEFT */}

                <text
                  className={`curve-text ${active === "Expert Guidance" ? "active" : ""}`}
                  onClick={() => setActive("Expert Guidance")}
                >
                  <textPath
                    href="#leftCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    EXPERT GUIDANCE
                  </textPath>
                </text>
              </svg>

              <div className="line line-top"></div>
              <div className="line line-right"></div>
              <div className="line line-bottom"></div>
              <div className="line line-left"></div>
            </div>
            <div className="line line-top"></div>
            <div className="line line-right"></div>
            <div className="line line-bottom"></div>
            <div className="line line-left"></div>
          </div>

          {/* INNER CIRCLE */}

          <div className="coin-inner">
            {active && (
              <div className="inner-content">
                <h2>{data[active].title}</h2>

                <p>{data[active].text}</p>
              </div>
            )}
          </div>
        </div>
      </div>





{/* <div class="rec-block" id="recBlock"></div>


el('recBlock').innerHTML = `
    <div class="rec-tag">Recommended Investment Approach — Comparing All Options</div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:6px">
      ${rows.map(r => {
        const m = statusMeta[r.status];
        return `
        <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:16px 18px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap">
            <span style="font-size:16px;color:${m.color};font-weight:700">${m.icon}</span>
            <span style="font-family:var(--font-display);font-size:18px;font-weight:600">${r.label}</span>
            <span style="font-size:10.5px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${m.color};border:1px solid ${m.color};border-radius:20px;padding:2px 10px;margin-left:auto">${m.tag}</span>
          </div>
          <div style="font-size:13px;line-height:1.6;opacity:0.9">${r.reason}</div>
        </div>`;
      }).join('')}
    </div>
  `; */}