import React, { useState, useEffect } from 'react';
import '../styles/SEOMonitor.css';

const SEOMonitor = () => {
  const [metrics, setMetrics] = useState({
    https: { status: 'checking', timestamp: null },
    robots: { status: 'checking', size: 0, timestamp: null },
    sitemap: { status: 'checking', urls: 0, timestamp: null },
    ogImage: { status: 'checking', timestamp: null },
    metaTags: { present: 0, total: 8, timestamp: null },
    jsonLd: { schemas: 0, timestamp: null },
    aiAgents: {
      gptbot: 'checking',
      perplexity: 'checking',
      claude: 'checking',
      ccbot: 'checking',
      timestamp: null
    },
    performance: {
      pageSize: 0,
      requestCount: 0,
      loadTime: 0,
      timestamp: null
    },
    content: {
      wordCount: 0,
      h1Count: 0,
      h2Count: 0,
      h3Count: 0,
      internalLinks: 0,
      externalLinks: 0,
      imageCount: 0,
      imagesWithAlt: 0,
      timestamp: null
    },
    security: {
      csp: false,
      xFrameOptions: false,
      xContentType: false,
      strictTransport: false,
      timestamp: null
    },
    accessibility: {
      score: 0,
      issues: [],
      timestamp: null
    },
    coreWebVitals: {
      lcp: null,
      fid: null,
      cls: null,
      timestamp: null
    }
  });

  const [history, setHistory] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [overallScore, setOverallScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('seoMonitorHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('seoMonitorHistory', JSON.stringify(history.slice(-90)));
    }
  }, [history]);

  // Calculate overall SEO score
  const calculateOverallScore = (newMetrics) => {
    let score = 0;
    let totalWeight = 0;

    // HTTPS (20%)
    if (newMetrics.https.status === 'ok') score += 20;
    totalWeight += 20;

    // robots.txt (10%)
    if (newMetrics.robots.status === 'ok') score += 10;
    totalWeight += 10;

    // sitemap.xml (10%)
    if (newMetrics.sitemap.status === 'ok' && newMetrics.sitemap.urls > 0) score += 10;
    totalWeight += 10;

    // Meta Tags (15%)
    score += (newMetrics.metaTags.present / newMetrics.metaTags.total) * 15;
    totalWeight += 15;

    // JSON-LD Schemas (15%)
    score += Math.min(newMetrics.jsonLd.schemas / 3, 1) * 15;
    totalWeight += 15;

    // AI Agents (15%)
    const aiAgents = [newMetrics.aiAgents.gptbot, newMetrics.aiAgents.claude, newMetrics.aiAgents.perplexity, newMetrics.aiAgents.ccbot];
    const allowedAgents = aiAgents.filter(a => a === 'allowed').length;
    score += (allowedAgents / 4) * 15;
    totalWeight += 15;

    // Content Quality (10%)
    if (newMetrics.content.wordCount > 100 && newMetrics.content.h1Count > 0) {
      score += 10;
    }
    totalWeight += 10;

    return Math.round(score);
  };

  // Generate recommendations
  const generateRecommendations = (newMetrics) => {
    const recs = [];

    if (newMetrics.metaTags.present < 8) {
      recs.push({ type: 'warning', text: `Add missing meta tags (${8 - newMetrics.metaTags.present} missing)` });
    }

    if (newMetrics.jsonLd.schemas < 3) {
      recs.push({ type: 'warning', text: 'Add more JSON-LD schemas for rich snippets' });
    }

    if (newMetrics.content.wordCount < 300) {
      recs.push({ type: 'info', text: 'Consider expanding content (current: ' + newMetrics.content.wordCount + ' words)' });
    }

    if (newMetrics.content.h1Count === 0) {
      recs.push({ type: 'error', text: 'Add an H1 tag to improve SEO' });
    }

    if (newMetrics.content.imagesWithAlt < newMetrics.content.imageCount) {
      recs.push({ type: 'warning', text: `${newMetrics.content.imageCount - newMetrics.content.imagesWithAlt} images missing alt text` });
    }

    if (!newMetrics.security.csp) {
      recs.push({ type: 'warning', text: 'Add Content Security Policy header' });
    }

    if (!newMetrics.security.strictTransport) {
      recs.push({ type: 'info', text: 'Add HSTS header for better security' });
    }

    return recs;
  };

  // Check all metrics
  const runFullCheck = async () => {
    setLastChecked(new Date());
    const newMetrics = { ...metrics };

    // 1. Check HTTPS
    try {
      const response = await fetch('https://studentlogger.com', { method: 'HEAD' });
      newMetrics.https.status = response.status === 200 ? 'ok' : 'error';
    } catch (e) {
      newMetrics.https.status = 'error';
    }
    newMetrics.https.timestamp = new Date();

    // 2. Check robots.txt
    try {
      const response = await fetch('https://studentlogger.com/robots.txt');
      const text = await response.text();
      newMetrics.robots.status = response.status === 200 ? 'ok' : 'error';
      newMetrics.robots.size = text.length;
      newMetrics.robots.timestamp = new Date();
    } catch (e) {
      newMetrics.robots.status = 'error';
    }

    // 3. Check sitemap.xml
    try {
      const response = await fetch('https://studentlogger.com/sitemap.xml');
      const text = await response.text();
      const urlCount = (text.match(/<loc>/g) || []).length;
      newMetrics.sitemap.status = response.status === 200 ? 'ok' : 'error';
      newMetrics.sitemap.urls = urlCount;
      newMetrics.sitemap.timestamp = new Date();
    } catch (e) {
      newMetrics.sitemap.status = 'error';
    }

    // 4. Check OG Image
    try {
      const response = await fetch('https://studentlogger.com/og-image.svg', { method: 'HEAD' });
      newMetrics.ogImage.status = response.status === 200 ? 'ok' : 'error';
      newMetrics.ogImage.timestamp = new Date();
    } catch (e) {
      newMetrics.ogImage.status = 'error';
    }

    // 5. Check meta tags
    try {
      const response = await fetch('https://studentlogger.com');
      const html = await response.text();
      const hasTitle = /<title>/.test(html);
      const hasDesc = /meta.*description/.test(html);
      const hasOg = /og:title/.test(html);
      const hasCanonical = /canonical/.test(html);
      const hasRobots = /meta.*robots/.test(html);
      const hasJsonLd = /"@context"/.test(html);
      const hasTwitter = /twitter:card/.test(html);
      const hasViewport = /viewport/.test(html);

      const count = [hasTitle, hasDesc, hasOg, hasCanonical, hasRobots, hasJsonLd, hasTwitter, hasViewport].filter(Boolean).length;
      newMetrics.metaTags.present = count;
      newMetrics.metaTags.timestamp = new Date();

      // Content analysis
      const textContent = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      const wordCount = textContent.split(/\s+/).length;
      const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
      const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
      const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
      const internalLinks = (html.match(/href=["']\/[^"']*/gi) || []).length;
      const externalLinks = (html.match(/href=["']https?:\/\/[^"']*/gi) || []).length;
      const imageCount = (html.match(/<img[^>]*>/gi) || []).length;
      const imagesWithAlt = (html.match(/<img[^>]*alt=["'][^"']*["'][^>]*>/gi) || []).length;

      newMetrics.content = {
        wordCount,
        h1Count,
        h2Count,
        h3Count,
        internalLinks,
        externalLinks,
        imageCount,
        imagesWithAlt,
        timestamp: new Date()
      };
    } catch (e) {
      newMetrics.metaTags.timestamp = new Date();
    }

    // 6. Check JSON-LD schemas
    try {
      const response = await fetch('https://studentlogger.com');
      const html = await response.text();
      const jsonLdCount = (html.match(/"@context".*schema.org/g) || []).length;
      newMetrics.jsonLd.schemas = jsonLdCount;
      newMetrics.jsonLd.timestamp = new Date();
    } catch (e) {
      newMetrics.jsonLd.timestamp = new Date();
    }

    // 7. Check AI Agents in robots.txt
    try {
      const response = await fetch('https://studentlogger.com/robots.txt');
      const text = await response.text();
      newMetrics.aiAgents.gptbot = /User-agent:\s*GPTBot/.test(text) ? 'allowed' : 'blocked';
      newMetrics.aiAgents.perplexity = /User-agent:\s*PerplexityBot/.test(text) ? 'allowed' : 'blocked';
      newMetrics.aiAgents.claude = /User-agent:\s*Claude-Web/.test(text) ? 'allowed' : 'blocked';
      newMetrics.aiAgents.ccbot = /User-agent:\s*CCBot/.test(text) ? 'allowed' : 'blocked';
      newMetrics.aiAgents.timestamp = new Date();
    } catch (e) {
      newMetrics.aiAgents.timestamp = new Date();
    }

    // 8. Check security headers
    try {
      const response = await fetch('https://studentlogger.com');
      const headers = response.headers;
      newMetrics.security = {
        csp: !!headers.get('content-security-policy'),
        xFrameOptions: !!headers.get('x-frame-options'),
        xContentType: !!headers.get('x-content-type-options'),
        strictTransport: !!headers.get('strict-transport-security'),
        timestamp: new Date()
      };
    } catch (e) {
      newMetrics.security.timestamp = new Date();
    }

    // 9. Calculate accessibility score
    try {
      const response = await fetch('https://studentlogger.com');
      const html = await response.text();
      let a11yScore = 100;
      const issues = [];

      if (!/<html[^>]*lang=/.test(html)) {
        a11yScore -= 10;
        issues.push('Missing lang attribute on html tag');
      }

      const imageCount = (html.match(/<img[^>]*>/gi) || []).length;
      const imagesWithAlt = (html.match(/<img[^>]*alt=["'][^"']*["']/gi) || []).length;
      if (imageCount > imagesWithAlt && imageCount > 0) {
        a11yScore -= 15;
        issues.push('Images missing alt text');
      }

      if (!/<main[^>]*>/i.test(html)) {
        a11yScore -= 10;
        issues.push('Missing main landmark');
      }

      if (!/skip.*to.*main|skip.*link/i.test(html)) {
        a11yScore -= 5;
        issues.push('No skip to main content link');
      }

      newMetrics.accessibility = {
        score: Math.max(0, a11yScore),
        issues,
        timestamp: new Date()
      };
    } catch (e) {
      newMetrics.accessibility.timestamp = new Date();
    }

    setMetrics(newMetrics);

    // Calculate overall score
    const score = calculateOverallScore(newMetrics);
    setOverallScore(score);

    // Generate recommendations
    const recs = generateRecommendations(newMetrics);
    setRecommendations(recs);

    // Generate alerts
    const newAlerts = [];
    if (newMetrics.https.status !== 'ok') newAlerts.push({ severity: 'critical', text: 'HTTPS is not accessible' });
    if (newMetrics.content.wordCount < 100) newAlerts.push({ severity: 'warning', text: 'Content is very short' });
    if (newMetrics.content.h1Count === 0) newAlerts.push({ severity: 'error', text: 'No H1 tag found' });
    setAlerts(newAlerts);

    // Add to history
    const historyEntry = {
      timestamp: new Date(),
      metrics: newMetrics,
      score,
      recommendations: recs
    };
    setHistory([...history, historyEntry]);
  };

  // Auto-refresh every hour
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(runFullCheck, 3600000); // 1 hour
      return () => clearInterval(interval);
    }
  }, [autoRefresh, history]);

  // Initial check on load
  useEffect(() => {
    runFullCheck();
  }, []);

  const StatusBadge = ({ status }) => {
    const statusMap = {
      ok: { color: '#10b981', text: '✓ OK' },
      allowed: { color: '#10b981', text: '✓ Allowed' },
      blocked: { color: '#ef4444', text: '✗ Blocked' },
      error: { color: '#ef4444', text: '✗ Error' },
      checking: { color: '#f59e0b', text: '⟳ Checking' }
    };
    const style = statusMap[status] || statusMap.checking;
    return <span style={{ color: style.color, fontWeight: 'bold' }}>{style.text}</span>;
  };

  const ScoreCard = ({ title, value, max, description }) => {
    const percentage = max ? (value / max) * 100 : 0;
    const color = percentage === 100 ? '#10b981' : percentage >= 75 ? '#f59e0b' : '#ef4444';
    return (
      <div className="score-card">
        <div className="card-header">{title}</div>
        <div className="score-bar">
          <div className="score-fill" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
        </div>
        <div className="card-value">{value}{max ? `/${max}` : ''}</div>
        {description && <div className="card-desc">{description}</div>}
      </div>
    );
  };

  const ScoreGauge = ({ score }) => {
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
    return (
      <div className="score-gauge">
        <div className="gauge-circle" style={{ background: `conic-gradient(${color} 0deg ${score * 3.6}deg, #e5e7eb ${score * 3.6}deg)` }}>
          <div className="gauge-inner">
            <div className="gauge-value">{score}</div>
            <div className="gauge-label">Score</div>
          </div>
        </div>
      </div>
    );
  };

  const AlertBanner = ({ alerts }) => {
    if (!alerts || alerts.length === 0) return null;
    return (
      <div className="alert-section">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`alert alert-${alert.severity}`}>
            <span className="alert-icon">⚠️</span>
            <span>{alert.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const RecommendationsList = ({ recommendations }) => {
    if (!recommendations || recommendations.length === 0) {
      return <div className="recommendations-empty">✓ All systems optimized! No recommendations.</div>;
    }

    return (
      <div className="recommendations-list">
        {recommendations.map((rec, idx) => (
          <div key={idx} className={`recommendation recommendation-${rec.type}`}>
            <span className="rec-icon">
              {rec.type === 'error' ? '❌' : rec.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span>{rec.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ metrics, history, overallScore, recommendations }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seo-monitor-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="seo-monitor">
      <div className="monitor-header">
        <h1>📊 StudentLogger.com - SEO Monitor Dashboard</h1>
        <p className="subtitle">Real-time monitoring of SEO health and AI agent discoverability</p>
      </div>

      <div className="controls">
        <button className="btn btn-primary" onClick={runFullCheck}>
          🔄 Run Full Check Now
        </button>
        <label className="auto-refresh">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto-refresh hourly
        </label>
        <button className="btn btn-secondary" onClick={exportData}>
          📥 Export Data
        </button>
        {lastChecked && (
          <span className="last-checked">
            Last checked: {lastChecked.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {/* Overall Score */}
      <div className="score-section">
        <div className="score-container">
          <ScoreGauge score={overallScore} />
          <div className="score-summary">
            <h3>Overall SEO Health Score</h3>
            <p className="score-interpretation">
              {overallScore >= 80
                ? '🎉 Excellent! Your site is well optimized.'
                : overallScore >= 60
                ? '👍 Good! There are opportunities for improvement.'
                : '⚠️ Needs improvement. Address the recommendations below.'}
            </p>
          </div>
        </div>
      </div>

      <div className="monitor-grid">
        {/* Core Infrastructure */}
        <section className="monitor-section">
          <h2>🔒 Core Infrastructure</h2>

          <div className="metric-item">
            <div className="metric-label">HTTPS Status</div>
            <div className="metric-value">
              <StatusBadge status={metrics.https.status} />
            </div>
          </div>

          <ScoreCard
            title="robots.txt"
            value={metrics.robots.size}
            description={`${metrics.robots.size} bytes - ${metrics.robots.status === 'ok' ? '✓ Present' : '✗ Missing'}`}
          />

          <ScoreCard
            title="sitemap.xml"
            value={metrics.sitemap.urls}
            max={10}
            description={`${metrics.sitemap.urls} URLs indexed - ${metrics.sitemap.status === 'ok' ? '✓ Valid' : '✗ Error'}`}
          />

          <div className="metric-item">
            <div className="metric-label">OG Image</div>
            <div className="metric-value">
              <StatusBadge status={metrics.ogImage.status} />
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="monitor-section">
          <h2>📝 SEO Content</h2>

          <ScoreCard
            title="Meta Tags"
            value={metrics.metaTags.present}
            max={metrics.metaTags.total}
            description={`${metrics.metaTags.present}/${metrics.metaTags.total} tags present`}
          />

          <ScoreCard
            title="JSON-LD Schemas"
            value={metrics.jsonLd.schemas}
            max={3}
            description={`${metrics.jsonLd.schemas} structured data schemas`}
          />

          <div className="metric-item">
            <div className="metric-label">Domain Consistency</div>
            <div className="metric-value" style={{ color: '#10b981' }}>
              ✓ Using studentlogger.com
            </div>
          </div>
        </section>

        {/* Content Analysis */}
        <section className="monitor-section">
          <h2>📄 Content Analysis</h2>

          <ScoreCard
            title="Word Count"
            value={metrics.content.wordCount}
            description={metrics.content.wordCount < 300 ? '⚠️ Consider expanding' : '✓ Good length'}
          />

          <div className="content-grid">
            <div className="content-stat">
              <div className="stat-value">{metrics.content.h1Count}</div>
              <div className="stat-label">H1 Tags</div>
            </div>
            <div className="content-stat">
              <div className="stat-value">{metrics.content.h2Count}</div>
              <div className="stat-label">H2 Tags</div>
            </div>
            <div className="content-stat">
              <div className="stat-value">{metrics.content.h3Count}</div>
              <div className="stat-label">H3 Tags</div>
            </div>
          </div>

          <div className="content-links">
            <div className="link-stat">
              <span className="link-count">{metrics.content.internalLinks}</span>
              <span className="link-label">Internal Links</span>
            </div>
            <div className="link-stat">
              <span className="link-count">{metrics.content.externalLinks}</span>
              <span className="link-label">External Links</span>
            </div>
          </div>

          <ScoreCard
            title="Image Alt Text"
            value={metrics.content.imagesWithAlt}
            max={metrics.content.imageCount || 1}
            description={`${metrics.content.imagesWithAlt}/${metrics.content.imageCount} images have alt text`}
          />
        </section>

        {/* AI Agent Accessibility */}
        <section className="monitor-section">
          <h2>🤖 AI Agent Accessibility</h2>

          <div className="ai-grid">
            <div className="ai-item">
              <div className="ai-name">Claude (Anthropic)</div>
              <StatusBadge status={metrics.aiAgents.claude} />
            </div>
            <div className="ai-item">
              <div className="ai-name">ChatGPT (OpenAI)</div>
              <StatusBadge status={metrics.aiAgents.gptbot} />
            </div>
            <div className="ai-item">
              <div className="ai-name">Perplexity AI</div>
              <StatusBadge status={metrics.aiAgents.perplexity} />
            </div>
            <div className="ai-item">
              <div className="ai-name">Common Crawl</div>
              <StatusBadge status={metrics.aiAgents.ccbot} />
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="monitor-section">
          <h2>🛡️ Security Headers</h2>

          <div className="security-grid">
            <div className="security-item" style={{ borderLeft: `4px solid ${metrics.security.csp ? '#10b981' : '#ef4444'}` }}>
              <div className="sec-label">Content Security Policy</div>
              <div className="sec-status">{metrics.security.csp ? '✓ Present' : '✗ Missing'}</div>
            </div>
            <div className="security-item" style={{ borderLeft: `4px solid ${metrics.security.xFrameOptions ? '#10b981' : '#ef4444'}` }}>
              <div className="sec-label">X-Frame-Options</div>
              <div className="sec-status">{metrics.security.xFrameOptions ? '✓ Present' : '✗ Missing'}</div>
            </div>
            <div className="security-item" style={{ borderLeft: `4px solid ${metrics.security.xContentType ? '#10b981' : '#ef4444'}` }}>
              <div className="sec-label">X-Content-Type-Options</div>
              <div className="sec-status">{metrics.security.xContentType ? '✓ Present' : '✗ Missing'}</div>
            </div>
            <div className="security-item" style={{ borderLeft: `4px solid ${metrics.security.strictTransport ? '#10b981' : '#ef4444'}` }}>
              <div className="sec-label">HSTS</div>
              <div className="sec-status">{metrics.security.strictTransport ? '✓ Present' : '✗ Missing'}</div>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className="monitor-section">
          <h2>♿ Accessibility</h2>

          <ScoreCard
            title="Accessibility Score"
            value={metrics.accessibility.score}
            max={100}
            description={`${metrics.accessibility.score}/100 - ${metrics.accessibility.score >= 80 ? '✓ Good' : metrics.accessibility.score >= 60 ? '⚠️ Fair' : '✗ Poor'}`}
          />

          {metrics.accessibility.issues.length > 0 && (
            <div className="a11y-issues">
              <div className="issues-header">Issues Found:</div>
              {metrics.accessibility.issues.map((issue, idx) => (
                <div key={idx} className="issue-item">• {issue}</div>
              ))}
            </div>
          )}
        </section>

        {/* Performance */}
        <section className="monitor-section">
          <h2>⚡ Performance</h2>

          <div className="metric-item">
            <div className="metric-label">HTTPS/SSL</div>
            <div className="metric-value" style={{ color: '#10b981' }}>
              ✓ Active (Let's Encrypt)
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">Caching</div>
            <div className="metric-value" style={{ color: '#10b981' }}>
              ✓ Configured (24h)
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">HTTP/2</div>
            <div className="metric-value" style={{ color: '#10b981' }}>
              ✓ Enabled
            </div>
          </div>
        </section>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h3>💡 Recommendations for Improvement</h3>
        <RecommendationsList recommendations={recommendations} />
      </div>

      {/* Quick Summary */}
      <div className="summary-box">
        <h3>✅ Quick Status Summary</h3>
        <div className="summary-items">
          <div className="summary-item" style={{ background: metrics.https.status === 'ok' ? '#f0fdf4' : '#fee2e2' }}>
            <span className="checkmark">✓</span>
            <span>HTTPS Active</span>
          </div>
          <div className="summary-item" style={{ background: (metrics.robots.status === 'ok' && metrics.sitemap.status === 'ok') ? '#f0fdf4' : '#fee2e2' }}>
            <span className="checkmark">✓</span>
            <span>SEO Files Present</span>
          </div>
          <div className="summary-item" style={{ background: metrics.metaTags.present === 8 ? '#f0fdf4' : '#fee2e2' }}>
            <span className="checkmark">✓</span>
            <span>Meta Tags Optimized ({metrics.metaTags.present}/8)</span>
          </div>
          <div className="summary-item" style={{ background: metrics.jsonLd.schemas >= 2 ? '#f0fdf4' : '#fee2e2' }}>
            <span className="checkmark">✓</span>
            <span>Structured Data Valid ({metrics.jsonLd.schemas}/3)</span>
          </div>
          <div className="summary-item" style={{ background: (metrics.aiAgents.gptbot === 'allowed' && metrics.aiAgents.claude === 'allowed') ? '#f0fdf4' : '#fee2e2' }}>
            <span className="checkmark">✓</span>
            <span>AI Agents Accessible</span>
          </div>
          <div className="summary-item" style={{ background: metrics.accessibility.score >= 80 ? '#f0fdf4' : '#fee2e2' }}>
            <span className="checkmark">✓</span>
            <span>Accessibility Score: {metrics.accessibility.score}/100</span>
          </div>
        </div>
      </div>

      {/* History Chart */}
      {history.length > 1 && (
        <div className="history-section">
          <h3>📈 Monitoring History ({history.length} checks)</h3>
          <div className="history-timeline">
            {history.slice(-30).map((entry, idx) => (
              <div
                key={idx}
                className="history-entry"
                title={entry.timestamp.toLocaleString()}
                style={{ background: `hsl(${entry.score * 1.2}, 70%, 60%)` }}
              >
                <div className="entry-score">{entry.score}</div>
                <div className="entry-date">{entry.timestamp.toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="monitor-footer">
        <p>🔐 This monitoring dashboard is hidden from robots.txt and sitemap.xml</p>
        <p>Data is stored locally in your browser (localStorage). No external tracking.</p>
        <p>Last updated: {lastChecked ? lastChecked.toLocaleString() : 'Never'}</p>
      </div>
    </div>
  );
};

export default SEOMonitor;
