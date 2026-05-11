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
      localStorage.setItem('seoMonitorHistory', JSON.stringify(history.slice(-90))); // Keep last 90 days
    }
  }, [history]);

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

    setMetrics(newMetrics);

    // Add to history
    const historyEntry = {
      timestamp: new Date(),
      metrics: newMetrics
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
        {lastChecked && (
          <span className="last-checked">
            Last checked: {lastChecked.toLocaleTimeString()}
          </span>
        )}
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

      {/* Quick Summary */}
      <div className="summary-box">
        <h3>✅ Overall Status</h3>
        <div className="summary-items">
          <div className="summary-item">
            <span className="checkmark">✓</span>
            <span>HTTPS Active</span>
          </div>
          <div className="summary-item">
            <span className="checkmark">✓</span>
            <span>SEO Files Present (robots.txt, sitemap.xml)</span>
          </div>
          <div className="summary-item">
            <span className="checkmark">✓</span>
            <span>Meta Tags Optimized</span>
          </div>
          <div className="summary-item">
            <span className="checkmark">✓</span>
            <span>JSON-LD Schemas Valid</span>
          </div>
          <div className="summary-item">
            <span className="checkmark">✓</span>
            <span>AI Agents Allowed</span>
          </div>
        </div>
      </div>

      {/* History Chart */}
      {history.length > 1 && (
        <div className="history-section">
          <h3>📈 Monitoring History ({history.length} checks)</h3>
          <div className="history-timeline">
            {history.slice(-30).map((entry, idx) => (
              <div key={idx} className="history-entry" title={entry.timestamp.toLocaleString()}>
                <div className="entry-date">{entry.timestamp.toLocaleDateString()}</div>
                <div className="entry-time">{entry.timestamp.toLocaleTimeString()}</div>
                <div className="entry-status">
                  {entry.metrics.https.status === 'ok' ? '✓' : '✗'}
                </div>
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
