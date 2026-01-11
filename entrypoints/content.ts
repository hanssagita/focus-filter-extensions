import { isUrlBlocked } from '../lib/blocking';
import { getIsBlockingEnabled, getBlockedSites } from '../lib/storage';

export default defineContentScript({
    matches: ['<all_urls>'],
    runAt: 'document_start',

    async main() {
        try {
            // Get current blocking state
            const isEnabled = await getIsBlockingEnabled();
            const blockedSites = await getBlockedSites();
            const currentUrl = window.location.href;

            // Check if this URL should be blocked
            if (isUrlBlocked(currentUrl, blockedSites, isEnabled)) {
                // Stop the page from loading
                window.stop();

                // Replace the page content with a warning
                const blockedKeyword = blockedSites.find((site) =>
                    currentUrl.toLowerCase().includes(site.toLowerCase())
                );

                document.documentElement.innerHTML = `
          <!DOCTYPE html>
          <html lang="en" class="dark">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Site Blocked - Focus</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
                background: linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%);
                color: #E8E8E8;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 20px;
              }
              
              .container {
                max-width: 600px;
                text-align: center;
                animation: fadeIn 0.5s ease-out;
              }
              
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              .icon {
                width: 120px;
                height: 120px;
                margin: 0 auto 32px;
                background: linear-gradient(135deg, #8AB4F8 0%, #669DF6 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 64px;
                box-shadow: 0 10px 40px rgba(138, 180, 248, 0.3);
              }
              
              h1 {
                font-size: 48px;
                font-weight: 700;
                margin-bottom: 16px;
                background: linear-gradient(135deg, #8AB4F8 0%, #669DF6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              
              .message {
                font-size: 20px;
                color: #9AA0A6;
                margin-bottom: 32px;
                line-height: 1.6;
              }
              
              .blocked-url {
                background: #2A2A2A;
                border: 1px solid #3C4043;
                border-radius: 12px;
                padding: 20px;
                margin: 24px 0;
                word-break: break-all;
                font-family: 'Monaco', 'Courier New', monospace;
                font-size: 14px;
                color: #F28B82;
              }
              
              .keyword {
                background: #3C4043;
                color: #8AB4F8;
                padding: 4px 12px;
                border-radius: 6px;
                font-weight: 600;
                display: inline-block;
                margin-top: 8px;
              }
              
              .info {
                font-size: 14px;
                color: #9AA0A6;
                margin-top: 32px;
                padding: 16px;
                background: rgba(138, 180, 248, 0.1);
                border-radius: 8px;
                border: 1px solid rgba(138, 180, 248, 0.2);
              }
              
              .info strong {
                color: #8AB4F8;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">🔒</div>
              <h1>Site Blocked</h1>
              <p class="message">
                This website has been blocked by Focus to help you stay focused and productive.
              </p>
              <div class="blocked-url">
                ${currentUrl}
                ${blockedKeyword ? `<div class="keyword">Matched keyword: "${blockedKeyword}"</div>` : ''}
              </div>
              <div class="info">
                <strong>To access this site:</strong> Open the Focus extension and either remove the blocked keyword or turn off blocking temporarily.
              </div>
            </div>
          </body>
          </html>
        `;
            }
        } catch (error) {
            console.error('[Focus] Error in content script:', error);
        }
    },
});
