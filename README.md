# GP Studio PH — deploy
1. Copy your existing files into this folder: styles.css, app.js, assets/ (logo, QR codes), vendor/ (flatpickr + jspdf), icons/icon.svg, icons/apple-touch-icon.png.
2. Push to GitHub, import in Vercel (Framework: Other).
3. Vercel dashboard > Storage > Create Blob store (Public) > connect to the project. This adds BLOB_READ_WRITE_TOKEN.
4. Settings > Environment Variables: ADMIN_PASSWORD = your secret. Redeploy.
5. Open /admin.html, enter password, pick an event, upload photos.
